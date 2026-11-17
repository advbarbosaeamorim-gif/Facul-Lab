/* Extrai, do app de verdade, os trechos que o "Ouvir este tema" lê em cada tema (mesma função ouvirTrechos),
   para gerar a narração na mesma ordem. Uso: node tools/narracao/trechos.mjs pen2 [pen1 ...] > saida.json
   BASE padrão: http://localhost:8765/ (rode "python3 -m http.server 8765" na raiz). */
import { createRequire } from "module";
const { chromium } = createRequire(import.meta.url)("playwright");
const BASE = process.env.BASE || "http://localhost:8765/";
const discs = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, locale: "pt-BR" });
const p = await ctx.newPage();
await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
await p.goto(BASE);
const out = {};
for (const d of discs) {
  for (let k = 1; ; k++) {
    await p.evaluate(([d, k]) => {
      localStorage.setItem("simuladoOAB.v2", JSON.stringify({ v: 2, hist: [], stats: {}, lidos: {}, cfg: { tour: 1, mig38: 1, mig40: 1, migCorr: 1, per: 2 } }));
      localStorage.setItem("faculLab.lbConvite", "1"); localStorage.setItem("faculLab.motiva", "x");
      localStorage.setItem("faculLab.data", new Date().toISOString().slice(0, 10));
      sessionStorage.setItem("faculLab.tela", JSON.stringify({ t: Date.now(), rota: { tela: "ler", d, pg: k }, pilha: [{ tela: "hoje" }], y: 0 }));
    }, [d, k]);
    await p.reload();
    await p.waitForTimeout(900);
    const r = await p.evaluate(k => {
      const b = document.querySelector("[data-ouvir-k]");
      if (!b || b.dataset.ouvirK.split(":")[1] != String(k)) return null;
      const els = ouvirTrechos(b);
      /* quadros, tabelas e figuras que o leitor pula (não dá para ler em linha): vão em "x" no trecho anterior,
         para o roteiro da aula poder explicar o que está neles. Simuladores ficam de fora. */
      const limpa = s => s.replace(/\s+/g, " ").trim();
      const extras = els.map(() => []);
      [...b.nextElementSibling.querySelectorAll("figure.fig, .tab")].filter(f => !f.matches(".calc") && !f.closest("details")).forEach(f => {
        let i = -1; els.forEach((e, n) => { if (e.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING) i = n; });
        const linhas = [...f.querySelectorAll("tr")].map(tr => [...tr.children].map(c => limpa(c.innerText)).join(" | "));
        const t = linhas.length ? linhas.join(" // ") : f.innerText.split("\n").map(limpa).filter(Boolean).join(" | ");
        extras[Math.max(i, 0)].push((f.matches(".ilus") ? "ilustração: " : f.matches(".tab") ? "tabela: " : "quadro: ") + t);
      });
      return { k: b.dataset.ouvirK, tit: document.querySelector(".tema-ban h3")?.innerText || "", h: ouvirImpressao(els),
        trechos: els.map((e, n) => Object.assign({ tag: e.tagName.toLowerCase(), t: ouvirTexto(e) }, extras[n].length ? { x: extras[n] } : {})) };
    }, k);
    if (!r) break;
    out[r.k] = r;
    console.error(r.k, r.tit, r.trechos.length);
  }
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
