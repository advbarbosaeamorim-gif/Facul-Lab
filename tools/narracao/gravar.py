"""Grava a narração dos temas com o OmniVoice (clonando a voz de referência) e gera, por tema:
audio/<voz>/<materia>-<tema>.mp3 e .json {h: impressão dos trechos, t: início de cada trecho em segundos}.
Uso: python gravar.py trechos.json <voz f|m> ref.wav "texto da referência" [chaves...]"""
import sys, os, re, json, subprocess, time, numpy as np, torch, soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fala import fala
from omnivoice import OmniVoice
SR = 24000
arq, voz, ref, reftxt = sys.argv[1:5]; so = set(sys.argv[5:])
raiz = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio")
os.makedirs(os.path.join(raiz, voz), exist_ok=True)
J = json.load(open(arq, encoding="utf-8"))
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
pr = m.create_voice_clone_prompt(ref_audio=ref, ref_text=reftxt)
def pausa(s): return np.zeros(int(SR * s), dtype=np.float32)
def pedacos(t, lim=320):
    fr = re.split(r"(?<=[.!?;:])\s+", t); out = [""]
    for f in fr:
        if out[-1] and len(out[-1]) + len(f) > lim: out.append(f)
        else: out[-1] = (out[-1] + " " + f).strip()
    return [x for x in out if x]
def diz(t):
    return np.concatenate([np.concatenate([m.generate(text=p, language="pt", speed=0.97, voice_clone_prompt=pr)[0].astype(np.float32), pausa(0.25)]) for p in pedacos(t)])
for k, tema in J.items():
    if so and k not in so: continue
    nome = k.replace(":", "-"); dest = os.path.join(raiz, voz, nome)
    if os.path.exists(dest + ".json") and json.load(open(dest + ".json"))["h"] == tema["h"]: print("pula", k, flush=True); continue
    t0 = time.time(); partes = [pausa(0.3)]; T = []; pos = 0.3
    n = len(tema["trechos"])
    for i, tr in enumerate(tema["trechos"]):
        txt = fala(tr["t"])
        if i == 0: txt = "Vamos lá! Tema: " + fala(tema["tit"]) + ". " + txt
        if i == n - 1: txt = txt + " E assim fechamos este tema. Agora, faça o Teste-se para fixar."
        a = diz(txt); a = np.concatenate([a, pausa(0.55 if tr["tag"] in ("h4", "h5") else 0.35)])
        T.append(round(pos, 2)); partes.append(a); pos += len(a) / SR
    wav = dest + ".wav"; sf.write(wav, np.concatenate(partes), SR)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-af", "loudnorm=I=-16:TP=-1.5", "-ac", "1", "-ar", "24000", "-b:a", "48k", dest + ".mp3"], check=True)
    os.remove(wav)
    json.dump({"h": tema["h"], "t": T}, open(dest + ".json", "w"))
    idx_p = os.path.join(raiz, "indice.json"); idx = json.load(open(idx_p)) if os.path.exists(idx_p) else {}
    idx.setdefault(k, []); idx[k] = sorted(set(idx[k] + [voz])); json.dump(idx, open(idx_p, "w"), sort_keys=True)
    print(k, voz, "ok", round(pos / 60, 1), "min de áudio em", round((time.time() - t0) / 60, 1), "min", flush=True)
