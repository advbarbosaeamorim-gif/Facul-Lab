"""Grava a narração dos temas com o OmniVoice (clonando a voz de referência) e gera, por tema:
audio/<voz>/<materia>-<tema>.mp3 e .json {h: impressão dos trechos, t: início de cada trecho em segundos, v: versão do áudio
(muda quando qualquer pedaço é regravado), r: receita da gravação (voz, ritmo, pausas e falas; diz se o tema já está pronto)}.

A fala de cada trecho vem do roteiro de aula (aulas/<materia>-<tema>.txt, uma linha por trecho, no jeito de quem
explica em sala). Sem roteiro, lê o texto da apostila como está.

Uso: python gravar.py trechos.json <voz f|m> [chaves...]     (vozes e textos de referência em vozes.json)
NARR_CACHE = pasta dos pedaços já gravados; NARR_THREADS = núcleos por processo (para rodar mais de um ao mesmo tempo);
NARR_REFAZ=1 = monta o tema de novo mesmo que já esteja pronto (depois de regravar um pedaço com ouvir.py);
NARR_VOZES = outro arquivo de vozes no lugar de vozes.json (para experimentar uma voz)."""
import sys, os, re, json, subprocess, time, hashlib, numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from fala import fala

SR = 24000
VEL = 1.0             # ritmo natural do modelo (vozes.json pode trocar por voz)
ENTRE_FRASES = 0.30   # pausa entre pedaços do mesmo trecho
ENTRE_TRECHOS = 0.55  # pausa entre um trecho e o seguinte
ANTES_TITULO = 0.70   # respiro antes de mudar de assunto
DEPOIS_TITULO = 0.45
PAUSA_MAX = 0.45      # nenhuma pausa no meio da fala passa disso
HOP = 240             # 10 ms


def pausa(s): return np.zeros(int(SR * s), dtype=np.float32)


def pedacos(t, lim=300):
    """Divide a fala em pedaços de até ~lim letras, sempre em fim de frase e com tamanhos parecidos."""
    fr = [f for f in re.split(r"(?<=[.!?…])\s+", t.strip()) if f]
    total = sum(len(f) for f in fr); n = max(1, -(-total // lim)); alvo = total / n
    out = [""]
    for f in fr:
        cheio = len(out[-1]) + len(f) > lim or (len(out[-1]) >= alvo * 0.85 and len(out) < n)
        if out[-1] and cheio: out.append(f)
        else: out[-1] = (out[-1] + " " + f).strip()
    out = [x for x in out if x]
    if len(out) > 1 and len(out[-1]) < 70 and len(out[-2]) + len(out[-1]) <= 370: out[-2:] = [out[-2] + " " + out[-1]]  # não deixa um restinho sozinho
    return out


def envelope(a):
    n = len(a) // HOP
    return np.sqrt((a[:n * HOP].reshape(n, HOP) ** 2).mean(1) + 1e-12) if n else np.zeros(0)


def apara(a, margem=0.03):
    """Tira o silêncio das pontas (deixa 30 ms)."""
    e = envelope(a)
    if not len(e): return a
    idx = np.where(e > max(e.max() * 0.01, 1e-4))[0]
    if not len(idx): return a
    return a[max(0, idx[0] * HOP - int(margem * SR)):min(len(a), (idx[-1] + 1) * HOP + int(margem * SR))]


def encurta(a, maximo=PAUSA_MAX):
    """Nenhuma pausa interna maior que `maximo`: corta o miolo do silêncio."""
    e = envelope(a)
    if not len(e): return a
    sil = e <= max(e.max() * 0.01, 1e-4); cortes = []; i = 0; n = len(sil)
    while i < n:
        if not sil[i]: i += 1; continue
        j = i
        while j < n and sil[j]: j += 1
        dur = (j - i) * HOP / SR
        if dur > maximo and i > 0 and j < n:
            sobra = int((dur - maximo) * SR); meio = (i + j) * HOP // 2
            cortes.append((meio - sobra // 2, meio + sobra - sobra // 2))
        i = j
    if not cortes: return a
    partes = []; p = 0
    for c0, c1 in cortes: partes.append(a[p:c0]); p = c1
    partes.append(a[p:])
    return np.concatenate(partes)


def roteiro(chave, tema):
    """Lê aulas/<materia>-<tema>.txt: linhas "n| fala", uma por trecho, e "# h=<impressão>" no cabeçalho."""
    arq = os.path.join(AQUI, "aulas", chave.replace(":", "-") + ".txt")
    if not os.path.exists(arq): return None
    h = None; falas = []
    for l in open(arq, encoding="utf-8"):
        l = l.strip()
        if not l: continue
        if l.startswith("#"):
            m = re.match(r"#\s*h=(\S+)", l); h = m[1] if m else h; continue
        m = re.match(r"(\d+)\|\s*(.+)$", l)
        if not m or int(m[1]) != len(falas): sys.exit(f"{arq}: linha fora de ordem: {l[:60]}")
        falas.append(m[2])
    if len(falas) != len(tema["trechos"]): sys.exit(f"{arq}: {len(falas)} falas para {len(tema['trechos'])} trechos")
    if h != tema["h"]: sys.exit(f"{arq}: o texto da apostila mudou depois do roteiro (h={h}, agora {tema['h']}); revise e rode conferir.py")
    return falas


def falas_do_tema(chave, tema):
    r = roteiro(chave, tema)
    if r: return [fala(x) for x in r]
    out = [fala(tr["t"]) for tr in tema["trechos"]]
    out[0] = "Vamos lá! Tema: " + fala(tema["tit"]) + ". " + out[0]
    out[-1] += " E assim fechamos este tema. Agora, faça o Teste-se para fixar."
    return out


def voz_cfg(voz):
    """vozes.json -> (clipe de referência, texto dito nele, marca do clipe, ritmo)."""
    V = json.load(open(os.environ.get("NARR_VOZES") or os.path.join(AQUI, "vozes.json"), encoding="utf-8"))[voz]
    ref = os.path.join(AQUI, V["ref"])
    return ref, V["texto"], hashlib.sha1(open(ref, "rb").read()).hexdigest()[:12], float(V.get("vel", VEL))  # "vel" menor que 1 = mais devagar


def arq_cache(pasta, voz, marca, vel, t):
    """Arquivo do pedaço já gravado: muda se mudar a voz, o clipe de referência, o ritmo ou o texto."""
    return os.path.join(pasta, hashlib.sha1(f"{voz}|{marca}|{vel}|{t}".encode()).hexdigest() + ".npy")


def monta(tema, falas, diz):
    """Junta as falas com pausas curtas e devolve (áudio, início de cada trecho em segundos)."""
    tags = [tr["tag"] in ("h4", "h5") for tr in tema["trechos"]]
    partes = [pausa(0.25)]; T = []; pos = 0.25
    for i, txt in enumerate(falas):
        ps = [encurta(apara(diz(p))) for p in pedacos(txt)]
        a = ps[0]
        for p in ps[1:]: a = np.concatenate([a, pausa(ENTRE_FRASES), p])
        if i == len(falas) - 1: fim = pausa(0.4)
        elif tags[i + 1]: fim = pausa(ANTES_TITULO)
        else: fim = pausa(DEPOIS_TITULO if tags[i] else ENTRE_TRECHOS)
        T.append(round(pos, 2)); partes += [a, fim]; pos += (len(a) + len(fim)) / SR
    return np.concatenate(partes), T


def mp3(wav, dest):
    """Volume igual em todos os temas (ganho único, sem mexer na dinâmica da voz) e MP3 mono 64 kbps."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", wav, "-af", "loudnorm=I=-16:TP=-1.5:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = json.loads(r.stderr[r.stderr.rindex("{"):])
    ganho = min(-16.0 - float(m["input_i"]), -1.5 - float(m["input_tp"]))
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-af", f"volume={ganho:.2f}dB", "-ac", "1", "-ar", "48000", "-b:a", "64k", dest], check=True)


if __name__ == "__main__":
    import torch, soundfile as sf
    from omnivoice import OmniVoice
    arq, voz = sys.argv[1:3]; so = sys.argv[3:]  # sem chaves, grava todos os temas; com chaves, só elas e nessa ordem
    if os.environ.get("NARR_THREADS"): torch.set_num_threads(int(os.environ["NARR_THREADS"]))  # para gravar em mais de um processo ao mesmo tempo
    ref, ref_texto, marca, vel = voz_cfg(voz)
    raiz = os.path.join(AQUI, "..", "..", "audio"); os.makedirs(os.path.join(raiz, voz), exist_ok=True)
    J = json.load(open(arq, encoding="utf-8"))
    m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
    pr = m.create_voice_clone_prompt(ref_audio=ref, ref_text=ref_texto)
    # guarda cada pedaço já gravado (pasta NARR_CACHE, padrão ./cache) para retomar temas longos se a gravação parar
    CACHE = os.environ.get("NARR_CACHE", "cache"); os.makedirs(CACHE, exist_ok=True)

    def diz(t):
        c = arq_cache(CACHE, voz, marca, vel, t)
        if os.path.exists(c): return np.load(c)
        a = m.generate(text=t, language="pt", speed=vel, voice_clone_prompt=pr)[0].astype(np.float32)
        tmp = f"{c}.{os.getpid()}.tmp.npy"; np.save(tmp, a); os.replace(tmp, c)
        return a

    for k in so or list(J):
        tema = J[k]
        nome = k.replace(":", "-"); dest = os.path.join(raiz, voz, nome)
        falas = falas_do_tema(k, tema)
        feito = hashlib.sha1(json.dumps([voz, marca, vel, ENTRE_FRASES, ENTRE_TRECHOS, ANTES_TITULO, DEPOIS_TITULO, PAUSA_MAX, tema["h"], falas], ensure_ascii=False).encode()).hexdigest()[:10]
        j = json.load(open(dest + ".json")) if os.path.exists(dest + ".json") else {}
        if j.get("r", j.get("v")) == feito and not os.environ.get("NARR_REFAZ"): print("pula", k, flush=True); continue
        t0 = time.time(); audio, T = monta(tema, falas, diz)
        sf.write(dest + ".wav", audio, SR); mp3(dest + ".wav", dest + ".mp3"); os.remove(dest + ".wav")
        json.dump({"h": tema["h"], "t": T, "v": hashlib.sha1(audio.tobytes()).hexdigest()[:10], "r": feito}, open(dest + ".json", "w"))
        idx_p = os.path.join(raiz, "indice.json"); idx = json.load(open(idx_p)) if os.path.exists(idx_p) else {}
        idx[k] = sorted(set(idx.get(k, []) + [voz])); json.dump(idx, open(idx_p, "w"), sort_keys=True)
        print(k, voz, "ok", round(len(audio) / SR / 60, 1), "min de áudio em", round((time.time() - t0) / 60, 1), "min", flush=True)
