# Provas anteriores da OAB: lê os PDFs oficiais da FGV (caderno Tipo 1 + gabaritos definitivo e preliminar)
# e gera provas/oab-<n>.js (as 80 questões de cada prova) e provas/indice.js (a lista que o app mostra).
#
# uso:  python3 -I tools/provas/gerar.py            todas as provas de tools/provas/fontes.json
#       python3 -I tools/provas/gerar.py 48         só a 48ª (depois de pôr a 48ª em fontes.json)
#       --pdfs PASTA   onde ficam/baixam os PDFs (padrão: /tmp/facul-lab-provas)
# precisa de: pip install pdfplumber
#
# Como a FGV monta o caderno: duas colunas por página; o número da questão vem sozinho numa linha, em negrito;
# as alternativas começam com "(A)" ou "A)". Os quatro tipos de caderno só embaralham as questões dentro de cada
# matéria, então a tabela de correspondência do gabarito confirma a divisão das matérias (DIST, igual à do app).
# Alguns cadernos (Acrobat Distiller) vêm sem o mapa de letras da fonte: o texto sai como (cid:N), o número do glifo
# da Calibri. tools/provas/calibri.json traz esse mapa, montado a partir dos cadernos que têm o mapa.
import sys, os, re, json, subprocess, urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(AQUI))
DIST = [["etica", 8], ["filo", 2], ["const", 6], ["dh", 2], ["eleit", 2], ["inter", 2], ["fin", 2], ["trib", 5], ["adm", 5], ["amb", 2],
        ["civil", 6], ["eca", 2], ["cdc", 2], ["emp", 4], ["pc", 6], ["penal", 6], ["pp", 6], ["prev", 2], ["trab", 5], ["pt", 5]]
GLIFOS = json.load(open(os.path.join(AQUI, "calibri.json"), encoding="utf-8"))

def args():
    a = sys.argv[1:]; pdfs = "/tmp/facul-lab-provas"; ex = []
    while a:
        x = a.pop(0)
        if x == "--pdfs": pdfs = a.pop(0)
        else: ex.append(int(x))
    return pdfs, ex

def baixar(url, destino):
    if os.path.exists(destino) and os.path.getsize(destino) > 1000: return
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Facul Lab)"})
        with urllib.request.urlopen(req, timeout=120) as r, open(destino, "wb") as f: f.write(r.read())
    except Exception:
        subprocess.run(["curl", "-fsSL", "--retry", "3", "-o", destino, url], check=True)
    with open(destino, "rb") as f:
        if f.read(5) != b"%PDF-": raise SystemExit(f"não é PDF: {url}")

# ---------- gabaritos ----------
def texto(pdf_path):
    import pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        return "\n".join((p.extract_text() or "") for p in pdf.pages)

def ler_grade(seg):
    g = {}; nums = None
    for l in (x.strip() for x in seg.split("\n")):
        toks = l.split()
        if toks and all(x.isdigit() for x in toks): nums = [int(x) for x in toks]; continue
        if nums and toks and len(toks) == len(nums) and all(re.fullmatch(r"[A-D*X]|ANULADA", x, re.I) for x in toks):
            for n, x in zip(nums, toks): g[n] = "*" if x in ("*", "X") or x.upper() == "ANULADA" else x.upper()
            nums = None
    return g

def gabarito_tipo1(t):
    """respostas do Tipo 1: {1:'A', ..., 47:'*'}; a seção se chama 'TIPO 1' ou 'PROVA 1', conforme o exame"""
    for padrao in (r"TIPO\s*1\b(.*?)(?:PROVA\s+)?TIPO\s*2\b", r"PROVA\s*1\b(.*?)PROVA\s*2\b"):
        for m in re.finditer(padrao, t, re.S | re.I):
            g = ler_grade(m.group(1))
            if len(g) == 80: return g
    return {}

def correspondencia(t):
    i = t.find("CORRESPOND")
    if i < 0: return {}
    c = {}
    for l in t[i:].split("\n"):
        toks = l.split()
        if len(toks) in (4, 8) and all(x.isdigit() for x in toks):
            for k in range(0, len(toks), 4): c[int(toks[k])] = [int(x) for x in toks[k + 1:k + 4]]
    return c

def blocos_ok(corr):
    """cada tipo embaralha só dentro da matéria: o bloco de cada matéria vai para ele mesmo nos outros tipos.
    Basta que dois dos três tipos confirmem (no 42º, a tabela do Tipo 4 troca uma questão de Empresarial com Processo Civil)."""
    if not corr: return None
    falhas = []
    for t in range(3):
        n = 1
        for k, c in DIST:
            a = set(range(n, n + c))
            if {corr.get(x, [0, 0, 0])[t] for x in a} != a: falhas.append(f"o bloco de {k} ({n}-{n + c - 1}) não bate no Tipo {t + 2}"); break
            n += c
    return True if len(falhas) <= 1 else "; ".join(falhas)

# ---------- caderno ----------
RUIDO = re.compile(r"^(\d+\s*[oº°]?\s*EXAME DE ORDEM UNIFICADO|EXAME DE ORDEM UNIFICADO.*|Tipo\s+\w+|–\s*Página\s*\d+|Página\s*\d+|[A-Z]+ EXAME DE ORDEM UNIFICADO.*|Realização|Ordem dos Advogados do Brasil)$", re.I)
SEM_MAPA = {}

def decifrar(pg):
    for ch in pg.chars:
        m = re.fullmatch(r"\(cid:(\d+)\)", ch["text"])
        if not m: continue
        fonte = ch["fontname"].split("+")[-1]
        u = (GLIFOS.get(fonte) or {}).get(m.group(1)) or GLIFOS["Calibri"].get(m.group(1))
        if u is None and fonte == "SymbolMT" and m.group(1) == "120": u = "•"
        if u is None:
            SEM_MAPA[(fonte, m.group(1))] = SEM_MAPA.get((fonte, m.group(1)), 0) + 1; u = "�"
        ch["text"] = u

def com_negrito(l):
    cs = [ch for ch in l["chars"] if ch["text"].strip()]
    s = ""; em = False; k = 0
    for c in l["text"]:
        if not c.strip(): s += c; continue
        b = False
        if k < len(cs): b = "Bold" in cs[k]["fontname"]; k += 1
        if b and not em: s += "**"; em = True
        if not b and em: s += "**"; em = False
        s += c
    return s + ("**" if em else "")

def linhas_do_caderno(pdf_path):
    import pdfplumber
    out = []
    with pdfplumber.open(pdf_path) as pdf:
        for pi, pg in enumerate(pdf.pages):
            decifrar(pg)
            W, H = pg.width, pg.height
            for ci, (x0, x1) in enumerate(((0, W / 2), (W / 2, W))):
                # x_tolerance 1,5: com o padrão (3), palavras de cadernos do Distiller grudavam ("deprisão")
                for l in pg.crop((x0, 0, x1, H)).extract_text_lines(strip=True, return_chars=True, x_tolerance=1.5):
                    if not l["text"] or l["top"] < 60 or l["top"] > H - 55: continue  # cabeçalho e rodapé
                    cs = [ch for ch in l["chars"] if ch["text"].strip()]
                    out.append({"p": pi, "c": ci, "x0": l["x0"] - x0, "x1": l["x1"] - x0, "t": l["text"], "tb": com_negrito(l),
                                "negrito": bool(cs) and all("Bold" in ch["fontname"] for ch in cs)})
    return out

def juntar(partes):
    s = ""
    for p in partes:
        if not s: s = p
        elif re.search(r"[A-Za-zÀ-ú]-$", s) and re.match(r"[a-zà-ú]", p): s += p  # ex-marido, inscrever-se: o hífen fica
        else: s += " " + p
    return s

def limpa(s):
    s = s.replace("**", "")  # a FGV quase não usa negrito no enunciado; o app mostra texto simples
    return re.sub(r"[ \t]+", " ", s).strip()

def bordas(linhas):
    """a borda direita típica de cada coluna: o texto é justificado, então quase toda linha termina no mesmo x"""
    from collections import Counter
    b = {}
    for c in (0, 1):
        xs = [l["x1"] for l in linhas if l["c"] == c]
        if not xs: continue
        moda = Counter(round(x * 2) / 2 for x in xs).most_common(1)[0][0]
        b[c] = max(x for x in xs if abs(x - moda) <= 1)
    return b

def paragrafos(L, borda_col):
    """junta as linhas do enunciado em parágrafos. Texto justificado: linha que termina antes da borda fecha o parágrafo.
    Citações vêm recuadas dos dois lados (a borda delas é a do próprio trecho); autor da citação vem alinhado à direita."""
    mesma = lambda a, b: b is not None and a["p"] == b["p"] and a["c"] == b["c"]
    borda = {}; i = 0
    while i < len(L):
        j = i
        while j + 1 < len(L) and mesma(L[j], L[j + 1]) and abs(L[j + 1]["x0"] - L[i]["x0"]) < 1.5: j += 1
        for k in range(i, j + 1): borda[k] = max(L[x]["x1"] for x in range(i, j + 1)) if j > i else borda_col[L[i]["c"]]
        i = j + 1
    out, par = [], []
    for k, l in enumerate(L):
        par.append(l["tb"])
        prox = L[k + 1] if k + 1 < len(L) else None
        curta = l["x1"] < borda[k] - 2
        curta_pontuada = l["x1"] < borda_col[l["c"]] - 2 and re.search(r"[.:;!?\"”)]\**$", l["t"])
        recua = mesma(l, prox) and prox["x0"] < l["x0"] - 1.5   # sai de citação ou de linha alinhada à direita
        if curta or curta_pontuada or recua: out.append(juntar(par)); par = []
    if par: out.append(juntar(par))
    return out

def questoes(linhas):
    qs = []; atual = None; esperado = 1
    borda_col = bordas(linhas)
    for l in linhas:
        t = l["t"]
        if re.match(r"(?i)question[aá]rio de percep", t): break
        if esperado > 80 and re.search(r"(?i)question[aá]rio|percep[cç][aã]o sobre", t): break
        if RUIDO.match(t): continue
        if re.fullmatch(r"\d{1,2}", t) and l["negrito"] and int(t) == esperado:
            atual = {"n": esperado, "linhas": []}; qs.append(atual); esperado += 1; continue
        if atual is not None: atual["linhas"].append(l)
    res = []
    for q in qs:
        enun, alts = [], []
        for l in q["linhas"]:
            m = re.match(r"^\**\(?([A-D])\)\**\s*(.*)$", l["tb"])
            if m and len(alts) < 4 and m.group(1) == "ABCD"[len(alts)]: alts.append([m.group(2)]); continue
            if alts: alts[-1].append(l["tb"])
            else: enun.append(l)
        res.append({"n": q["n"], "q": "\n".join(limpa(x) for x in paragrafos(enun, borda_col) if limpa(x)), "o": [limpa(juntar(a)) for a in alts]})
    return res

def materias():
    m = {}; n = 1
    for k, c in DIST:
        for _ in range(c): m[n] = k; n += 1
    return m

def ler_prova(pasta, exame):
    dfin, dpre = texto(f"{pasta}/definitivo.pdf"), texto(f"{pasta}/preliminar.pdf")
    if "DEFINITIV" not in dfin.upper(): raise SystemExit(f"{exame}º: o gabarito definitivo não diz DEFINITIVO")
    g, gp = gabarito_tipo1(dfin), gabarito_tipo1(dpre)
    corr = correspondencia(dfin) or correspondencia(dpre)
    data = re.search(r"PROVAS? DO DIA (\d{1,2})/(\d{1,2})/(\d{4})", dfin, re.I)
    SEM_MAPA.clear()
    Q = questoes(linhas_do_caderno(f"{pasta}/caderno.pdf"))
    M = materias()
    erros = []
    if len(Q) != 80 or [q["n"] for q in Q] != list(range(1, 81)): erros.append(f"{len(Q)} questões lidas")
    if len(g) != 80: erros.append(f"gabarito definitivo com {len(g)} respostas")
    b = blocos_ok(corr)
    if b not in (True, None): erros.append(b)
    for q in Q:
        if len(q["o"]) != 4 or not all(q["o"]): erros.append(f"questão {q['n']}: {len(q['o'])} alternativas")
        if len(q["q"]) < 40: erros.append(f"questão {q['n']}: enunciado curto")
        if "�" in q["q"] + "".join(q["o"]): erros.append(f"questão {q['n']}: letra que não deu para ler")
    if SEM_MAPA: erros.append(f"glifos sem mapa: {SEM_MAPA}")
    if not data: erros.append("sem a data da prova")
    if erros: raise SystemExit(f"{exame}º Exame: " + "; ".join(erros[:8]))
    anul = {}
    for n, x in g.items():
        if x == "*": anul[n] = gp.get(n) if gp.get(n) in ("A", "B", "C", "D") else ""
    return {"n": exame, "data": f"{data.group(3)}-{data.group(2).zfill(2)}-{data.group(1).zfill(2)}",
            "anul": anul, "blocos": b is True, "q": [[M[q["n"]], q["q"], q["o"], g[q["n"]]] for q in Q]}

def js(s): return json.dumps(s, ensure_ascii=False)

def escrever(P, fonte):
    linhas = ",\n".join("[" + ",".join([js(m), js(q), "[" + ",".join(js(o) for o in os_) + "]", js(g)]) + "]" for m, q, os_, g in P["q"])
    d = P["data"].split("-")
    cab = (f"/* {P['n']}º Exame de Ordem Unificado (FGV) · prova objetiva de {d[2]}/{d[1]}/{d[0]} · caderno Tipo 1 e gabarito definitivo.\n"
           f"   Fonte: {fonte['pagina']} (caderno, gabaritos preliminar e definitivo).\n"
           "   Gerado por tools/provas/gerar.py a partir dos PDFs oficiais: não edite à mão. Cada questão: [matéria, enunciado, [A, B, C, D], gabarito];\n"
           "   gabarito \"*\" = anulada; anul traz a resposta do gabarito preliminar das anuladas. */\n")
    corpo = f"provaFGV({{n:{P['n']},data:{js(P['data'])},anul:{js({str(k): v for k, v in P['anul'].items()})},q:[\n{linhas}\n]}});\n"
    os.makedirs(os.path.join(RAIZ, "provas"), exist_ok=True)
    open(os.path.join(RAIZ, "provas", f"oab-{P['n']}.js"), "w", encoding="utf-8").write(cab + corpo)

def principal():
    pdfs, so = args()
    fontes = json.load(open(os.path.join(AQUI, "fontes.json"), encoding="utf-8"))
    idx_path = os.path.join(RAIZ, "provas", "indice.js")
    indice = {}
    if os.path.exists(idx_path):
        m = re.search(r"window\.PROVAS_FGV=(\[.*\]);", open(idx_path, encoding="utf-8").read(), re.S)
        if m: indice = {x["n"]: x for x in json.loads(m.group(1))}
    for f in fontes:
        n = f["exame"]
        if so and n not in so: continue
        pasta = os.path.join(pdfs, str(n))
        for k in ("caderno", "definitivo", "preliminar"): baixar(f[k], os.path.join(pasta, k + ".pdf"))
        P = ler_prova(pasta, n)
        escrever(P, f)
        indice[n] = {"n": n, "data": P["data"], "anul": sorted(P["anul"])}
        print(f"{n}º Exame ({P['data']}): 80 questões, {len(P['anul'])} anulada(s) {sorted(P['anul'])}, matérias conferidas: {'sim' if P['blocos'] else 'sem tabela'}")
    lista = sorted(indice.values(), key=lambda x: -x["n"])
    open(idx_path, "w", encoding="utf-8").write(
        "/* Provas anteriores da OAB (FGV): a lista que o app mostra. Gerado por tools/provas/gerar.py: não edite à mão.\n"
        "   As questões de cada prova ficam em provas/oab-<n>.js e só carregam quando a prova é aberta. */\n"
        "window.PROVAS_FGV=" + json.dumps(lista, ensure_ascii=False, separators=(",", ":")) + ";\n")

principal()
