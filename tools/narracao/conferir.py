"""Confere os roteiros de aula (aulas/<materia>-<tema>.txt) com os trechos da apostila, para a fala nunca mudar o conteúdo:
- uma fala por trecho, na mesma ordem;
- todo número, artigo, parágrafo, inciso, fração, valor e sigla que está no trecho da apostila tem de estar na fala dele
  (escritos do mesmo jeito: "art. 59", "1/6", "§1º", "Lei 7.210/1984"; a sigla pode vir por extenso);
- a fala não pode trazer número que não exista em nenhum lugar do tema.

Uso: python conferir.py trechos.json [--carimba]     (--carimba grava no roteiro a impressão "h" do texto conferido)"""
import sys, os, re, json

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from fala import romano

EXTENSO = {
    "CP": ["código penal"], "CPP": ["código de processo penal"], "LEP": ["lei de execução penal"], "CF": ["constituição"],
    "STF": ["supremo"], "STJ": ["superior tribunal de justiça"], "MP": ["ministério público"],
    "TJ": ["trânsito em julgado", "transitar em julgado", "transitou em julgado", "transita em julgado", "tribunal de justiça"],
    "PPL": ["privativa de liberdade"], "PRD": ["restritiva de direitos", "restritivas de direitos"], "RD": ["restritiva de direitos", "restritivas de direitos"],
    "AIJ": ["audiência de instrução"], "LCP": ["lei das contravenções", "lei de contravenções"], "CTB": ["código de trânsito"],
    "HC": ["habeas corpus"], "PM": ["polícia militar", "policial militar"], "DF": ["distrito federal"], "ECA": ["estatuto da criança"],
    "PGR": ["procurador-geral da república", "procuradoria-geral da república"], "AGU": ["advogado-geral da união", "advocacia-geral da união"],
    "CNJ": ["conselho nacional de justiça"], "RE": ["recurso extraordinário"], "REsp": ["recurso especial"],
}
NUM = r"\d[\d.]*(?:,\d+)?(?:/\d[\d.]*)?[ºª°%]?"


def fichas(t):
    """Números (como escritos), incisos em romano e siglas de um texto."""
    t = t.replace("°", "º")
    nums = {m.rstrip(".") for m in re.findall(NUM, t)}
    caps = set(re.findall(r"\b(?:REsp|[A-Z]{2,7})\b", t))
    rom = {c for c in caps | set(re.findall(r"\b[IVX]\b", t)) if romano(c)}
    return nums, rom, caps - rom


def le_roteiro(arq):
    cab = []; falas = []
    for l in open(arq, encoding="utf-8"):
        l = l.rstrip("\n")
        if not l.strip(): continue
        if l.startswith("#"): cab.append(l); continue
        m = re.match(r"(\d+)\|\s*(.+)$", l)
        if not m or int(m[1]) != len(falas): raise SystemExit(f"{arq}: linha fora de ordem: {l[:70]}")
        falas.append(m[2])
    return cab, falas


def confere(chave, tema, falas):
    erros = []
    if len(falas) != len(tema["trechos"]): return [f"{len(falas)} falas para {len(tema['trechos'])} trechos"]
    todos_n = set(); todos_r = set()
    for tr in tema["trechos"]:  # "x" = quadros e tabelas que vêm logo depois do trecho: a fala pode explicar o que está neles
        n, r, _ = fichas(" ".join([tr["t"]] + tr.get("x", []))); todos_n |= n; todos_r |= r
    n, r, _ = fichas(tema["tit"]); todos_n |= n; todos_r |= r
    for i, (tr, f) in enumerate(zip(tema["trechos"], falas)):
        n0, r0, s0 = fichas(tr["t"]); n1, r1, _ = fichas(f); baixo = f.lower()
        if '"' in f: erros.append(f"{i}: tire as aspas da fala")
        falta = sorted(n0 - n1) + sorted(r0 - r1) + sorted(s for s in s0 if s.lower() not in baixo and not any(e in baixo for e in EXTENSO.get(s, [])))
        sobra = sorted((n1 - n0) - todos_n) + sorted((r1 - r0) - todos_r)
        if falta: erros.append(f"{i}: falta na fala: {', '.join(falta)}   | apostila: {tr['t'][:90]}")
        if sobra: erros.append(f"{i}: a fala traz o que não está no tema: {', '.join(sobra)}")
    return erros


if __name__ == "__main__":
    J = json.load(open(sys.argv[1], encoding="utf-8")); carimba = "--carimba" in sys.argv; ruim = 0
    for k, tema in J.items():
        arq = os.path.join(AQUI, "aulas", k.replace(":", "-") + ".txt")
        if not os.path.exists(arq): print(f"{k}: sem roteiro (lê a apostila como está)"); continue
        cab, falas = le_roteiro(arq); erros = confere(k, tema, falas)
        letras = sum(len(f) for f in falas); orig = sum(len(tr["t"]) for tr in tema["trechos"])
        if erros:
            ruim += 1; print(f"{k}: {len(erros)} problema(s)")
            for e in erros: print("   ", e)
            continue
        h = next((re.match(r"#\s*h=(\S+)", c)[1] for c in cab if re.match(r"#\s*h=", c)), None)
        if h != tema["h"] and carimba:
            cab = [c for c in cab if not re.match(r"#\s*h=", c)] + [f"# h={tema['h']}"]
            open(arq, "w", encoding="utf-8").write("\n".join(cab + [f"{i}| {f}" for i, f in enumerate(falas)]) + "\n"); h = tema["h"]
        print(f"{k}: ok, {len(falas)} falas, {letras} letras (apostila {orig})" + ("" if h == tema["h"] else "  [falta carimbar: --carimba]"))
    sys.exit(1 if ruim else 0)
