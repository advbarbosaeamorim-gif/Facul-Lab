"""Gera os ícones do Facul Lab, um por tema (paletas do Premium e cores do Clássico).

Uso (na raiz do repositório):
  python3 tools/icones/gerar.py && node tools/icones/render.cjs
Saída em icones/: <tema>-192.png, <tema>-512.png, <tema>-mask-512.png, manifest-<tema>.json,
além de icon-192.png/icon-512.png (padrão Oceano) e lembretes/selo.png (selo branco das notificações).
"""
import json, math, os

OPCAO = "B"  # desenho escolhido: A (selo de ouro), B (estúdio), C (laboratório)
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, "..", ".."))
BAL = open(os.path.join(AQUI, "balanca.svg.inc")).read()

# mesmas cores de PALETAS e CORES do index.html
TEMAS = {
    "violeta": ("#7c3aed", "#db2777"), "oceano": ("#2563eb", "#06b6d4"), "floresta": ("#059669", "#0891b2"),
    "sol": ("#ea580c", "#e11d48"), "noite": ("#4f46e5", "#0ea5e9"), "grafite": ("#334155", "#6366f1"),
    "c-azul": ("#1d4f91", "#3a78c9"), "c-vinho": ("#7a1f33", "#b23a52"), "c-verde": ("#174d3e", "#2a8064"),
    "c-roxo": ("#553088", "#8350c4"), "c-petroleo": ("#0f5e66", "#1f9aa5"), "c-grafite": ("#33363d", "#5d636f"),
    "rosa": ("#db2777", "#fb7185"), "mel": ("#a16207", "#d9a406"), "lima": ("#4d7c0f", "#84cc16"), "carvao": ("#27272a", "#8b8b94"),
    "c-telha": ("#b2471c", "#e0703f"), "c-ouro": ("#8a6500", "#c79a1c"), "c-oliva": ("#556b16", "#86a32c"), "c-rosa": ("#a3266a", "#d65497"),
}
# cor Dinâmica: o ícone instalado tem as cores de todas as matérias; a aba do navegador mostra o da matéria aberta
ARCO = ["#b91c1c", "#c2410c", "#d4a017", "#00733a", "#0e7490", "#1d4ed8", "#5b21b6", "#a21caf"]
TEMAS["dinamica"] = TEMAS["c-dinamica"] = ("#1d4ed8", "#a21caf")
# mesmas cores de DIN no index.html (principal, segunda)
DIN = {
    "ied": ("#1e3a8a", "#b45309"), "tge": ("#6b21a8", "#d97706"), "soc": ("#047857", "#f59e0b"), "psc": ("#9d174d", "#fb923c"),
    "filo": ("#312e81", "#f59e0b"), "crim": ("#3f3f46", "#dc2626"), "civil": ("#0f766e", "#2dd4bf"), "const": ("#00733a", "#f2c500"),
    "penal": ("#b91c1c", "#f43f5e"), "pc": ("#5b21b6", "#c084fc"), "dh": ("#0369a1", "#e11d48"), "adm": ("#1e40af", "#0ea5e9"),
    "emp": ("#1e293b", "#ca8a04"), "pp": ("#881337", "#e11d48"), "trab": ("#975c00", "#facc15"), "cdc": ("#a21caf", "#f472b6"),
    "inter": ("#0e7490", "#10b981"), "pt": ("#854d0e", "#d97706"), "trib": ("#c2410c", "#f59e0b"), "eca": ("#1d4ed8", "#facc15"),
    "amb": ("#2e7d32", "#84cc16"), "fin": ("#3f6212", "#d4a017"), "prev": ("#075985", "#38bdf8"), "eleit": ("#334155", "#16a34a"),
    "etica": ("#8a5a1f", "#d4a017"), "masc": ("#155e75", "#84cc16"), "prc": ("#115e59", "#14b8a6"), "prp": ("#991b1b", "#f97316"),
    "prt": ("#92400e", "#fbbf24"), "prpub": ("#173a7a", "#00733a"), "rev": ("#9a3412", "#f59e0b"),
}

def h2r(h): return [int(h[i:i + 2], 16) for i in (1, 3, 5)]
def mix(h, k, t): return "#" + "".join(f"{round(x + (y - x) * t):02x}" for x, y in zip(h2r(h), h2r(k)))
def dark(h, t): return mix(h, "#000000", t)

AU = '<linearGradient id="au" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#fff2c4"/><stop offset=".38" stop-color="#f0c75e"/><stop offset=".72" stop-color="#c89434"/><stop offset="1" stop-color="#8f5f17"/></linearGradient>'
SOMBRA = '<filter id="ds" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="{dy}" stdDeviation="{sd}" flood-color="{c}" flood-opacity="{o}"/></filter>'
LIVRO = '''<path d="M256 352 C220 332 168 330 126 340 V408 C168 398 220 400 256 420 Z" fill="{f}"/>
<path d="M256 352 C292 332 344 330 386 340 V408 C344 398 292 400 256 420 Z" fill="{f}"/>'''
LINHAS = '<path d="M150 360 C185 354 222 358 244 368 M150 378 C185 372 222 376 244 386 M368 360 C333 354 296 358 268 368 M368 378 C333 372 296 376 268 386" stroke="{c}" stroke-width="3" fill="none" stroke-linecap="round"/>'
PRATOS = ("M104 270 H196 A46 34 0 0 1 104 270 Z", "M316 270 H408 A46 34 0 0 1 316 270 Z")

def hexa(r): return " ".join(f"{256 + r * math.cos(math.radians(a - 90)):.1f},{262 + r * math.sin(math.radians(a - 90)):.1f}" for a in range(0, 360, 60))

def desenho(p1, p2, arco=False):
    """Devolve (defs, fundo, frente) do desenho escolhido. arco=True: fundo com as cores de todas as matérias (Dinâmica)."""
    if OPCAO == "A":
        defs = f'''<radialGradient id="bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="{dark(p1, .45)}"/><stop offset=".55" stop-color="{dark(p1, .72)}"/><stop offset="1" stop-color="{dark(p2, .88)}"/></radialGradient>{AU}
<radialGradient id="sh" cx="50%" cy="0%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>''' + SOMBRA.format(dy=6, sd=7, c="#000", o=.45)
        fundo = '<rect width="512" height="512" fill="url(#bg)"/><rect width="512" height="512" fill="url(#sh)"/>'
        frente = f'''<circle cx="256" cy="262" r="196" fill="none" stroke="url(#au)" stroke-width="5"/>
<circle cx="256" cy="262" r="183" fill="none" stroke="url(#au)" stroke-width="1.5" opacity=".6"/>
<g filter="url(#ds)" transform="translate(256 268) scale(.84) translate(-256 -262)">{BAL.replace("FILL", "url(#au)")}</g>
<g fill="#f0c75e"><circle cx="256" cy="66" r="4"/><circle cx="256" cy="458" r="4"/><circle cx="60" cy="262" r="4"/><circle cx="452" cy="262" r="4"/></g>'''
    elif OPCAO == "B":
        bal = BAL.replace('fill="FILL"', 'fill="#fff"').replace('stroke="FILL"', 'stroke="#fff"')
        for d in PRATOS: bal = bal.replace(f'<path d="{d}" fill="#fff"/>', f'<path d="{d}" fill="url(#ou)"/>')
        ln = mix(p1, "#ffffff", .55)
        defs = f'''<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{dark(p1, .25)}"/><stop offset=".5" stop-color="{p1}"/><stop offset="1" stop-color="{p2}"/></linearGradient>
<linearGradient id="ou" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#f59e0b"/></linearGradient>
<linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="{mix(p1, '#ffffff', .85)}"/></linearGradient>''' + SOMBRA.format(dy=10, sd=10, c=dark(p1, .7), o=.45)
        if arco:
            n = len(ARCO) - 1
            defs = defs.replace(defs.split("</linearGradient>")[0] + "</linearGradient>", '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">' + "".join(f'<stop offset="{i / n:.3f}" stop-color="{c}"/>' for i, c in enumerate(ARCO)) + "</linearGradient>", 1)
        fundo = '<rect width="512" height="512" fill="url(#bg)"/><circle cx="430" cy="80" r="120" fill="#fff" opacity=".08"/><circle cx="70" cy="470" r="150" fill="#fff" opacity=".07"/>'
        frente = f'''<path d="M392 112 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z" fill="#fff" opacity=".85"/><circle cx="118" cy="128" r="6" fill="#fff" opacity=".6"/>
<g filter="url(#ds)"><g transform="translate(256 240) scale(.78) translate(-256 -262)">{bal}</g>
{LIVRO.format(f="url(#pg)")}<path d="M256 352 V420" stroke="{ln}" stroke-width="3"/>{LINHAS.format(c=ln)}</g>'''
    else:
        defs = f'''<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{dark(p1, .55)}"/><stop offset="1" stop-color="{dark(p2, .88)}"/></linearGradient>{AU}
<radialGradient id="gl" cx="50%" cy="48%" r="42%"><stop offset="0" stop-color="{mix(p2, '#ffffff', .3)}" stop-opacity=".3"/><stop offset="1" stop-color="{p2}" stop-opacity="0"/></radialGradient>''' + SOMBRA.format(dy=6, sd=8, c="#000", o=.5)
        fundo = '<rect width="512" height="512" fill="url(#bg)"/><rect width="512" height="512" fill="url(#gl)"/>'
        balc = BAL.split('<path d="M226 360')[0].replace("FILL", "url(#au)")
        frente = f'''<polygon points="{hexa(196)}" fill="none" stroke="url(#au)" stroke-width="6" stroke-linejoin="round"/>
<polygon points="{hexa(182)}" fill="#fff" fill-opacity=".03" stroke="url(#au)" stroke-width="1.5" opacity=".6" stroke-linejoin="round"/>
<g filter="url(#ds)"><g transform="translate(256 236) scale(.7) translate(-256 -262)">{balc}</g>
<path d="M256 330 C222 312 180 310 146 318 V372 C180 364 222 366 256 384 Z" fill="url(#au)"/>
<path d="M256 330 C290 312 332 310 366 318 V372 C332 364 290 366 256 384 Z" fill="url(#au)"/>
<path d="M256 330 V384" stroke="{dark(p1, .6)}" stroke-width="3"/>
<path d="M168 336 C196 330 226 334 244 342 M168 352 C196 346 226 350 244 358 M344 336 C316 330 286 334 268 342 M344 352 C316 346 286 350 268 358" stroke="#7a5414" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/></g>'''
    return defs, fundo, frente

def svg(p1, p2, escala=1.0, arco=False):
    """escala < 1 encolhe só a frente: versão maskable, com folga para o recorte redondo do Android."""
    defs, fundo, frente = desenho(p1, p2, arco)
    if escala != 1: frente = f'<g transform="translate(256 256) scale({escala}) translate(-256 -256)">{frente}</g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs>{defs}</defs>{fundo}{frente}</svg>'

# selo das notificações (badge): silhueta branca em fundo transparente; o Android usa só a transparência
BADGE = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g transform="translate(256 250) scale(1.15) translate(-256 -290)">
<g transform="translate(256 240) scale(.78) translate(-256 -262)">{BAL.replace("FILL", "#fff").replace('stroke-width="4"', 'stroke-width="9"')}</g>
<g transform="translate(-7 0)">{LIVRO.split("/>")[0]}/></g><g transform="translate(7 0)">{LIVRO.split("/>")[1]}/></g></g></svg>'''.replace("{f}", "#fff")

def manifesto(tema, cor):
    return {
        "name": "Facul Lab", "short_name": "Facul Lab",
        "description": "Simulados e questões atualizados para o Exame da OAB",
        "id": "../", "start_url": "../", "scope": "../",
        "display": "standalone", "background_color": "#12161d", "theme_color": cor, "orientation": "portrait",
        "icons": [
            {"src": f"{tema}-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": f"{tema}-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": f"{tema}-mask-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }

if __name__ == "__main__":
    tmp = os.path.join(AQUI, "_svg"); os.makedirs(tmp, exist_ok=True)
    saida = os.path.join(RAIZ, "icones"); os.makedirs(saida, exist_ok=True)
    jobs = []
    def job(nome, conteudo, destino, tam):
        p = os.path.join(tmp, nome + ".svg"); open(p, "w").write(conteudo); jobs.append([p, destino, tam])
    for tema, (p1, p2) in TEMAS.items():
        a = tema.endswith("dinamica")
        job(tema, svg(p1, p2, arco=a), os.path.join(saida, f"{tema}-512.png"), 512)
        job(tema, svg(p1, p2, arco=a), os.path.join(saida, f"{tema}-192.png"), 192)
        job(tema + "-mask", svg(p1, p2, .82, arco=a), os.path.join(saida, f"{tema}-mask-512.png"), 512)
        with open(os.path.join(saida, f"manifest-{tema}.json"), "w") as f:
            json.dump(manifesto(tema, p1), f, ensure_ascii=False, indent=2); f.write("\n")
    for k, (p1, p2) in DIN.items():
        job("d-" + k, svg(p1, p2), os.path.join(saida, f"d-{k}-192.png"), 192)
    p1, p2 = TEMAS["oceano"]
    job("padrao", svg(p1, p2), os.path.join(RAIZ, "icon-512.png"), 512)
    job("padrao", svg(p1, p2), os.path.join(RAIZ, "icon-192.png"), 192)
    job("padrao-mask", svg(p1, p2, .82), os.path.join(RAIZ, "icon-mask-512.png"), 512)
    job("badge", BADGE, os.path.join(RAIZ, "lembretes", "selo.png"), 96)
    open(os.path.join(tmp, "jobs.json"), "w").write(json.dumps(jobs))
