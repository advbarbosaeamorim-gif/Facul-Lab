"""Transforma o texto da apostila em texto para ser falado, sem mudar o conteúdo:
abreviações por extenso (art. -> artigo, § -> parágrafo), números, ordinais, frações, siglas soletradas."""
import re
from num2words import num2words

def card(n, fem=False):
    s = num2words(int(n), lang="pt_BR").replace(",", "")
    if fem:
        s = re.sub(r"\bum\b", "uma", s); s = re.sub(r"\bdois\b", "duas", s)
        s = re.sub(r"(duz|trez|quatroc|quinh|seisc|setec|oitoc|novec)entos\b", lambda m: m.group(0)[:-2] + "as", s)
    return s

def ordn(n, fem=False):
    s = num2words(int(n), lang="pt_BR", to="ordinal")
    return re.sub(r"o\b", "a", s) if fem else s

FRAC = {2: "meio", 3: "terço", 4: "quarto", 5: "quinto", 6: "sexto", 7: "sétimo", 8: "oitavo", 9: "nono", 10: "décimo"}
LETRA = dict(A="á", B="bê", C="cê", D="dê", E="é", F="éfe", G="gê", H="agá", I="i", J="jota", K="cá", L="éle", M="ême",
             N="êne", O="ó", P="pê", Q="quê", R="érre", S="ésse", T="tê", U="u", V="vê", W="dáblio", X="xis", Y="ípsilon", Z="zê")
PALAVRA = {"ONU", "ECA", "FUNAI", "INSS", "PIS", "IPTU", "IPVA", "ICMS", "OIT", "OEA", "UNESCO", "MERCOSUL", "SUS", "FGTS", "IVA", "ANPP"}
LEITURA = {"ANPP": "á êne pê pê", "FGTS": "éfe gê tê ésse", "INSS": "i êne ésse ésse", "SUS": "sus", "ONU": "ônu", "ECA": "éca",
           "OIT": "ó i tê", "OEA": "ó é á", "IPTU": "i pê tê u", "IPVA": "i pê vê á", "ICMS": "i cê ême ésse", "PIS": "pis",
           "FUNAI": "funái", "UNESCO": "unésco", "MERCOSUL": "mercosul", "IVA": "iva", "LEP": "lép", "REsp": "érre é ésse pê",
           "HC": "agá cê", "PEC": "péc", "CNH": "cê êne agá", "ENEM": "enêm"}
ROM = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}

def romano(s):
    if not re.fullmatch(r"M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})", s) or not s: return None
    t = 0
    for i, c in enumerate(s):
        v = ROM[c]; t += -v if i + 1 < len(s) and ROM[s[i + 1]] > v else v
    return t

def sigla(m):
    w = m.group(0)
    if w in LEITURA: return LEITURA[w]
    return " ".join(LETRA.get(c.upper(), c) for c in w)

DIZER = {"sursis": "sursí", "caput": "cáput"}  # palavras que a voz erra: como se fala

def fala(t):
    t = t.replace(" ", " ").replace("–", "-").replace("—", ", ")
    t = re.sub(r"\b(" + "|".join(DIZER) + r")\b", lambda m: DIZER[m[1].lower()], t, flags=re.I)
    t = re.sub(r"(\barts?\.\s*\d+º?(?:, §\s*\d+º?)?), ([IVXLC]{1,7})\b", r"\1, inciso \2", t, flags=re.I)
    t = re.sub(r"\bp\.\s?ú\.", "parágrafo único", t)
    t = re.sub(r"§\s*ú(nico)?\b", "parágrafo único", t)
    t = re.sub(r"§§\s*(\d+)º?", lambda m: "parágrafos " + (ordn(m[1]) if int(m[1]) < 10 else card(m[1])), t)
    t = re.sub(r"§\s*(\d+)º?", lambda m: "parágrafo " + (ordn(m[1]) if int(m[1]) < 10 else card(m[1])), t)
    t = re.sub(r"\bArts?\.\s*", lambda m: "Artigos " if m[0].startswith("Arts") else "Artigo ", t)
    t = re.sub(r"\barts?\.\s*", lambda m: "artigos " if m[0].startswith("arts") else "artigo ", t)
    # artigo 1º a 9º: ordinal; 10 em diante: cardinal
    t = re.sub(r"(artigos? |Artigos? )(\d+)º", lambda m: m[1] + (ordn(m[2]) if int(m[2]) < 10 else card(m[2])), t)
    t = re.sub(r"\binc(isos?)?\.\s*", lambda m: "inciso ", t)
    t = re.sub(r"\bal\.\s*", "alínea ", t)
    t = re.sub(r"\bn[º°]\s*", "número ", t)
    t = re.sub(r"\b[Ee]x\.:\s*", "Por exemplo: ", t)
    t = re.sub(r"\bR\$\s*(\d+(?:\.\d{3})*)(,(\d+))?( (mil|milhão|milhões|bilhão|bilhões)\b)?",
               lambda m: card(m[1].replace(".", "")) + (" " + m[5] + ("" if m[5] == "mil" else " de") if m[5] else "") + " reais" + (" e " + card(m[3]) + " centavos" if m[3] and int(m[3]) else ""), t)
    # leis: Lei 15.159/2025 -> lei quinze mil..., de dois mil e vinte e cinco
    t = re.sub(r"(?<=[Ll]ei )(\d{1,3}(?:\.\d{3})*)/(\d{2,4})\b", lambda m: card(m[1].replace(".", "")) + ", de " + card(m[2]), t)
    t = re.sub(r"(?<=[Ll]eis )(\d{1,3}(?:\.\d{3})*)/(\d{2,4})", lambda m: card(m[1].replace(".", "")) + ", de " + card(m[2]), t)
    t = re.sub(r"(?<=\be )(\d{1,3}\.\d{3})/(\d{2,4})\b", lambda m: card(m[1].replace(".", "")) + ", de " + card(m[2]), t)
    # datas 25/3/2026 -> 25 de março de 2026
    MES = "janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split()
    t = re.sub(r"\b(\d{1,2})/(\d{1,2})/(\d{4})\b", lambda m: ("primeiro" if int(m[1]) == 1 else m[1]) + " de " + MES[int(m[2]) - 1] + " de " + m[3] if 1 <= int(m[2]) <= 12 else m[0], t)
    # frações 1/6, 2/3
    def frac(m):
        a, b = int(m[1]), int(m[2])
        if (a, b) == (1, 2): return "metade"
        if b in FRAC: return card(a) + " " + FRAC[b] + ("s" if a > 1 else "")
        if b in (20, 30, 40, 50, 60, 70, 80, 90, 100): return card(a) + " " + ordn(b) + ("s" if a > 1 else "")  # 1/30: um trigésimo
        return f"{card(a)} {card(b)} avos"
    t = re.sub(r"\b(\d{1,2})/(\d{1,2})\b", frac, t)
    t = re.sub(r"(\d)-([A-Z])\b", lambda m: m[1] + " " + LETRA[m[2]], t)  # art. 91-A: noventa e um á
    # ordinais 1ª 2º
    t = re.sub(r"\b(\d+)ª", lambda m: ordn(m[1], True), t)
    t = re.sub(r"\b(\d+)[º°]", lambda m: ordn(m[1]), t)
    t = re.sub(r"(\d+(?:,\d+)?)\s?%", lambda m: m[1] + " por cento", t)
    # incisos romanos: "art. 64, II" / "inciso IV" / "I a III"
    t = re.sub(r"\b([IVXLC]{1,7})\b", lambda m: card(romano(m[1])) if romano(m[1]) and (m[1] != "I" or True) else m[1], t)
    # siglas
    t = re.sub(r"\b(REsp|[A-Z]{2,5})\b", lambda m: LEITURA[m[0]] if m[0] in LEITURA else m[0] if m[0] in PALAVRA or len(m[0]) > 4 else sigla(m), t)
    # números com ponto de milhar e decimais
    t = re.sub(r"\b(\d{1,3}(?:\.\d{3})+)\b", lambda m: card(m[1].replace(".", "")), t)
    t = re.sub(r"\b(\d+),(\d+)\b", lambda m: card(m[1]) + " vírgula " + card(m[2]), t)
    # "6 a 20 anos": masc; "1 hora", "2 horas": feminino antes de palavras femininas comuns
    FEM = r"(horas?|semanas?|vezes|pessoas?|penas?|fases?|turmas?|súmulas?|testemunhas?|leis?|circunstâncias?|causas?|partes?|vítimas?|condenações?|espécies?|regras?|hipóteses?|tintas?)"
    t = re.sub(r"\b(\d+)(?= (?:a \d+ )?" + FEM + r"\b)", lambda m: card(m[1], True), t)
    t = re.sub(r"\b(\d+)\b", lambda m: card(m[1]), t)
    t = t.replace(" = ", ": ").replace("=", ": ").replace(" + ", " mais ").replace(" x ", " versus ").replace(" → ", ", ").replace("→", ", ").replace("/", " ou ")
    t = re.sub(r"\s+", " ", t).strip()
    return t

if __name__ == "__main__":
    import sys
    for l in sys.stdin: print(fala(l))
