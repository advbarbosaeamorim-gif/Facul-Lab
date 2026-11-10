"""Ouve o que foi gravado e confere com o roteiro, pedaço por pedaço, números incluídos.

Transcreve cada pedaço guardado no cache com o whisper (large-v3-turbo), passa a transcrição pela mesma fala.py
(art. 83 -> artigo oitenta e três) e mostra só os pedaços em que o que se ouve difere do que devia ser dito.
A lista sai curta e é para ler com calma. Costuma ser engano do reconhecedor, não da voz: nome em latim, palavra
rara ("cominada" vira "combinada") e palavras que se emendam na fala ("ela apaga" = "ela paga"). Palavra que sumiu,
número trocado ou trecho embolado é defeito: regrave o pedaço.

Uso:  python ouvir.py trechos.json <voz> chave [chave...]                confere os temas
      python ouvir.py trechos.json <voz> --regrava <hash> [<hash>...]    grava de novo esses pedaços (começo do hash)
Depois de regravar, monte o tema outra vez:  NARR_REFAZ=1 python gravar.py trechos.json <voz> <chave>

Precisa de faster-whisper e librosa. NARR_CACHE, NARR_THREADS e NARR_VOZES valem como no gravar.py."""
import sys, os, re, json, difflib, time, unicodedata, numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import gravar as G
from fala import fala, LETRA

TENTATIVAS = 3  # ao regravar, quantas vezes tenta até o pedaço conferir
LEVE = set("e de a o do da as os em no na que se".split())  # palavrinhas que o reconhecedor troca à toa
TROCA = {"uma": "um", "duas": "dois", "duzentas": "duzentos", "trezentas": "trezentos", "primeira": "primeiro", "segunda": "segundo",
         "terceira": "terceiro", "pro": "para o", "pros": "para os", "pra": "para", "pras": "para as", "ta": "esta"}
NOME = {"be": "b", "ce": "c", "de": "d", "efe": "f", "ge": "g", "aga": "h", "jota": "j", "ca": "k", "ele": "l", "eme": "m", "ene": "n",
        "pe": "p", "que": "q", "erre": "r", "esse": "s", "te": "t", "ve": "v", "xis": "x", "ze": "z"}


def norm(t):
    """Palavras para comparar: minúsculas, sem acento nem pontuação, e sem diferenças só de escrita."""
    t = "".join(c for c in unicodedata.normalize("NFD", t.lower()) if unicodedata.category(c) != "Mn")
    t = re.sub(r"[^\w\s]", " ", t); t = re.sub(r"\ba linha\b", "alinea", t); out = []
    for w in t.split(): out += TROCA.get(w, w).split()
    for i in range(1, len(out)):
        if out[i - 1] == "alinea" and out[i] in NOME: out[i] = NOME[out[i]]  # alínea cê = alínea c
    return out


def difs(dito, ouvido):
    """O que difere entre o texto que devia ser dito e o que o reconhecedor ouviu (lista de "roteiro => ouvido")."""
    # letra solta na transcrição é nome de letra ("C de corrente"), a não ser depois de "inciso" (aí é número romano)
    ouvido = re.sub(r"(?<![Ii]nciso )(?<![Ii]ncisos )\b([B-DF-HJ-NP-TV-Z])\b(?![ºª°])", lambda m: LETRA[m[1]], ouvido)
    ref = norm(dito); hyp = norm(fala(ouvido)); out = []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, ref, hyp, autojunk=False).get_opcodes():
        if op == "equal" or all(w in LEVE for w in ref[i1:i2] + hyp[j1:j2]): continue
        if "".join(ref[i1:i2]) == "".join(hyp[j1:j2]): continue  # só mudou onde a palavra foi separada
        out.append(f"{' '.join(ref[max(0, i1 - 2):i2 + 2])} => {' '.join(hyp[max(0, j1 - 2):j2 + 2])}")
    return out


class Ouvido:
    def __init__(self):
        from faster_whisper import WhisperModel
        self.m = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8", cpu_threads=int(os.environ.get("NARR_THREADS", 2)))

    def ouve(self, a):
        """Transcreve um pedaço (áudio a 24 kHz, como o gravar.py guarda)."""
        import librosa
        s, _ = self.m.transcribe(librosa.resample(a, orig_sr=G.SR, target_sr=16000), language="pt", condition_on_previous_text=False, beam_size=5)
        return " ".join(x.text.strip() for x in s)


def pedacos_do_tema(k, tema):
    """(trecho, pedaço, texto) de cada pedaço que o gravar.py grava para o tema."""
    for i, f in enumerate(G.falas_do_tema(k, tema)):
        for j, p in enumerate(G.pedacos(f)): yield i, j, p


def confere(J, voz, chaves, cache):
    _, _, marca, vel = G.voz_cfg(voz); o = Ouvido()
    for k in chaves:
        t0 = time.time(); n = ruins = falta = 0; rel = []
        for i, j, p in pedacos_do_tema(k, J[k]):
            c = G.arq_cache(cache, voz, marca, vel, p)
            if not os.path.exists(c): falta += 1; continue
            a = np.load(c); n += 1; ouvido = o.ouve(a); d = difs(p, ouvido)
            if not d: continue
            ruins += 1; h = os.path.basename(c)[:10]
            rel.append({"trecho": i, "pedaco": j, "hash": h, "difs": d, "roteiro": p, "ouvido": ouvido, "segundos": round(len(a) / G.SR, 1)})
            print(f"   [{i}.{j}] {h} {' | '.join(d)[:300]}", flush=True)
        print(f"{voz}/{k}: {n} pedaços ouvidos, {ruins} com diferença, {falta} ainda sem gravar ({time.time() - t0:.0f} s)", flush=True)
        os.makedirs(os.path.join(cache, "ouvir"), exist_ok=True)  # relatório completo (roteiro e o que se ouviu) de cada pedaço apontado
        json.dump(rel, open(os.path.join(cache, "ouvir", f"{voz}-{k.replace(':', '-')}.json"), "w"), ensure_ascii=False, indent=1)


def regrava(J, voz, hashes, cache):
    import torch
    from omnivoice import OmniVoice
    ref, ref_texto, marca, vel = G.voz_cfg(voz)
    onde = {}  # arquivo do pedaço -> (texto, temas em que aparece)
    for k in J:
        for i, j, p in pedacos_do_tema(k, J[k]): onde.setdefault(G.arq_cache(cache, voz, marca, vel, p), (p, []))[1].append(k)
    alvos = []
    for h in hashes:
        achou = [c for c in onde if os.path.basename(c).startswith(h)]
        if len(achou) != 1: sys.exit(f"{h}: {len(achou)} pedaços com esse começo de hash")
        alvos.append(achou[0])
    if os.environ.get("NARR_THREADS"): torch.set_num_threads(int(os.environ["NARR_THREADS"]))
    m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
    pr = m.create_voice_clone_prompt(ref_audio=ref, ref_text=ref_texto); o = Ouvido()
    os.makedirs(os.path.join(cache, "trocados"), exist_ok=True)
    for c in alvos:
        p, temas = onde[c]; melhor = None
        for n in range(TENTATIVAS):
            a = m.generate(text=p, language="pt", speed=vel, voice_clone_prompt=pr)[0].astype(np.float32); d = difs(p, o.ouve(a))
            if melhor is None or len(d) < len(melhor[1]): melhor = (a, d)
            if not d: break
        a, d = melhor; h = os.path.basename(c)
        if os.path.exists(c): os.replace(c, os.path.join(cache, "trocados", h))  # o antigo fica guardado
        tmp = f"{c}.{os.getpid()}.tmp.npy"; np.save(tmp, a); os.replace(tmp, c)
        print(f"{h[:10]} regravado em {n + 1} tentativa(s), temas {' '.join(sorted(set(temas)))}: {'confere' if not d else ' | '.join(d)[:300]}", flush=True)


if __name__ == "__main__":
    arq, voz = sys.argv[1:3]; resto = sys.argv[3:]
    J = json.load(open(arq, encoding="utf-8")); cache = os.environ.get("NARR_CACHE", "cache")
    if resto and resto[0] == "--regrava": regrava(J, voz, resto[1:], cache)
    else: confere(J, voz, resto or list(J), cache)
