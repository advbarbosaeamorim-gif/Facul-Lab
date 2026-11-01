/* Teste de fumaça do Facul Lab: abre as telas principais nos 4 visuais (Premium e Clássico, claro e escuro)
   num celular de 412 px e falha se aparecer erro de JavaScript, tela em branco ou rolagem para o lado.
   Uso: python3 -m http.server 8811 (na raiz) e, em outro terminal, node tools/teste/telas.mjs
   Prints de cada tela ficam em tools/teste/prints/ (o GitHub guarda como artefato do teste). */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:8811/";
const PRINTS = new URL("./prints/", import.meta.url).pathname;
mkdirSync(PRINTS, { recursive: true });

const VISUAIS = [["premium", "claro"], ["premium", "escuro"], ["classico", "claro"], ["classico", "escuro"]];
const TELAS = [
  { tela: "hoje" }, { tela: "oab" }, { tela: "materias" }, { tela: "materia", m: "penal" }, { tela: "faculdade" },
  { tela: "periodo", p: 2 }, { tela: "disc", d: "pen2" }, { tela: "apost", p: 2 }, { tela: "ler", d: "pen2" },
  { tela: "ler", d: "pen2", pg: 2, pagina: true }, { tela: "config" }, { tela: "progresso" }, { tela: "metas" },
  { tela: "cartoes" }, { tela: "busca" }, { tela: "leiseca" }, { tela: "caderno" }, { tela: "revisao" },
  { tela: "foco" }, { tela: "semanal" }, { tela: "sobre" }, { tela: "quem" }, { tela: "mprova" }, { tela: "backup" }, { tela: "favs" }, { tela: "medida" }, { tela: "mudancas" },
  { tela: "pre", key: "casos:todas" }, { tela: "provas" },
];
/* avisos do navegador que não são defeitos do app */
const IGNORA = /vibrate|fonts\.g|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED|net::ERR/;

const falhas = [];
const browser = await chromium.launch();
async function abre(nome, estilo, tema, rota, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, locale: "pt-BR" });
  const p = await ctx.newPage();
  p.on("pageerror", e => falhas.push(`${nome}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORA.test(m.text())) falhas.push(`${nome} (console): ${m.text()}`) });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto(BASE);
  await p.evaluate(([estilo, tema, rota, extra]) => {
    const cfg = Object.assign({ tour: 1, mig38: 1, mig40: 1, migCorr: 1, per: 2, estilo, tema, paleta: "oceano", cor: "azul" }, extra.cfg || {});
    localStorage.setItem("simuladoOAB.v2", JSON.stringify({ v: 2, hist: [], stats: {}, lidos: {}, cfg }));
    localStorage.setItem("faculLab.lbConvite", "1"); localStorage.setItem("faculLab.motiva", "x");
    localStorage.setItem("faculLab.data", new Date().toISOString().slice(0, 10));
    sessionStorage.setItem("faculLab.tela", JSON.stringify({ t: Date.now(), rota, pilha: [{ tela: "hoje" }], y: 0 }));
  }, [estilo, tema, rota, extra]);
  await p.reload();
  await p.waitForTimeout(1200);
  const info = await p.evaluate(() => ({ texto: (document.querySelector("main")?.innerText || "").trim().length, largura: document.documentElement.scrollWidth, tela: innerWidth }));
  if (info.texto < 20) falhas.push(`${nome}: tela em branco`);
  if (info.largura > info.tela + 1) falhas.push(`${nome}: rolagem para o lado (${info.largura}px numa tela de ${info.tela}px)`);
  return [ctx, p];
}

for (const [estilo, tema] of VISUAIS) {
  for (const rota of TELAS) {
    const nome = `${estilo}-${tema}-${Object.values(rota).join("-")}`.replace(/[^\w.-]/g, "-");
    const [ctx, p] = await abre(nome, estilo, tema, rota);
    if (estilo === "premium" && tema === "claro") await p.screenshot({ path: PRINTS + nome + ".png" });
    await ctx.close();
  }
  /* fluxo de um simulado: configurar, responder uma questão, avançar e ver a folha de questões */
  const nome = `${estilo}-${tema}-simulado`;
  const [ctx, p] = await abre(nome, estilo, tema, { tela: "materia", m: "penal" });
  try {
    await p.locator("[data-key]").first().click();
    await p.getByText("Iniciar simulado").click();
    await p.locator(".alts .alt").nth(1).click();
    await p.waitForTimeout(400);
    if (!(await p.locator(".coment").count())) falhas.push(`${nome}: a correção não apareceu depois de responder`);
    await p.locator('[data-acao="prox"]').first().click();
    await p.waitForTimeout(300);
    await p.locator('[data-acao="folha"]').first().click();
    await p.waitForTimeout(300);
  } catch (e) { falhas.push(`${nome}: ${e.message.split("\n")[0]}`) }
  await ctx.close();
  /* treino sob medida: montar um treino de 10, começar e responder uma questão */
  const nomeT = `${estilo}-${tema}-treino-sob-medida`;
  const [ctxT, pT] = await abre(nomeT, estilo, tema, { tela: "medida" });
  try {
    await pT.locator('[data-sob="n"][data-v="10"]').click();
    await pT.locator('[data-sob="montar"]').click();
    await pT.getByText("Iniciar simulado").click();
    await pT.locator(".alts .alt").nth(1).click();
    await pT.waitForTimeout(400);
    if (!(await pT.locator(".coment").count())) falhas.push(`${nomeT}: a correção não apareceu depois de responder`);
    const n = await pT.evaluate(() => sessao && sessao.qids.length);
    if (n !== 10) falhas.push(`${nomeT}: o treino deveria ter 10 questões e tem ${n}`);
  } catch (e) { falhas.push(`${nomeT}: ${e.message.split("\n")[0]}`) }
  await ctxT.close();
  /* abrir o artigo citado: na apostila, "art. 112, VI, a, e VIII, da LEP" vira link e abre o texto da lei com o trecho destacado */
  const nomeA = `${estilo}-${tema}-artigo-citado`;
  const [ctxA, pA] = await abre(nomeA, estilo, tema, { tela: "ler", d: "pen2", pg: 7, pagina: true });
  try {
    const link = pA.locator(".art-link", { hasText: "da LEP" }).first();
    await link.waitFor({ timeout: 6000 });
    await link.click();
    await pA.locator("#art-camada .al.alvo").first().waitFor({ timeout: 6000 });
    const tit = await pA.locator("#art-tit").innerText();
    if (!/Art\. 112/.test(tit)) falhas.push(`${nomeA}: a folha abriu "${tit}" em vez do art. 112 da LEP`);
    if (estilo === "premium" && tema === "claro") await pA.screenshot({ path: PRINTS + nomeA + ".png" });
    await pA.keyboard.press("Escape");
    await pA.waitForTimeout(400);
    if (await pA.locator("#art-camada").count()) falhas.push(`${nomeA}: a folha não fechou com Esc`);
  } catch (e) { falhas.push(`${nomeA}: ${e.message.split("\n")[0]}`) }
  await ctxA.close();
  /* marca-texto: selecionar um trecho do tema, grifar em verde, achar em Favoritos e grifos, voltar ao trecho e apagar */
  const nomeG = `${estilo}-${tema}-marca-texto`;
  const [ctxG, pG] = await abre(nomeG, estilo, tema, { tela: "ler", d: "pen2", pg: 2, pagina: true });
  try {
    await pG.evaluate(() => {
      const par = document.querySelectorAll("#app article[data-grifo] > p")[1];
      const n = document.createTreeWalker(par, NodeFilter.SHOW_TEXT).nextNode();
      const r = document.createRange(); r.setStart(n, 0); r.setEnd(n, Math.min(20, n.nodeValue.length));
      getSelection().removeAllRanges(); getSelection().addRange(r);
    });
    await pG.locator('#gr-barra [data-gr="cor"][data-c="vd"]').tap({ timeout: 4000 });
    await pG.locator("#app mark.grifo.gr-vd").first().waitFor({ timeout: 3000 });
    await pG.evaluate(() => raiz({ tela: "favs" }));
    await pG.locator(".gr-abrir").first().click({ timeout: 4000 });
    await pG.locator("#app mark.grifo.gr-pisca").first().waitFor({ timeout: 3000 });
    await pG.waitForTimeout(700);
    if (estilo === "premium" && tema === "claro") await pG.screenshot({ path: PRINTS + nomeG + ".png" });
    await pG.locator("#app mark.grifo").first().click();
    await pG.locator('#gr-barra[data-modo="grifo"] [data-gr="apagar"]').tap({ timeout: 3000 });
    if (await pG.locator("#app mark.grifo").count()) falhas.push(`${nomeG}: o grifo não saiu ao apagar`);
  } catch (e) { falhas.push(`${nomeG}: ${e.message.split("\n")[0]}`) }
  await ctxG.close();
  /* provas anteriores da OAB: abrir a 47ª, começar (a contagem pula com um toque), conferir a ordem do caderno, responder,
     ver a anulada (sem certa nem errada), finalizar e ver a nota de 0 a 80 com a anulada contando ponto */
  const nomeP = `${estilo}-${tema}-prova-anterior`;
  const [ctxP, pP] = await abre(nomeP, estilo, tema, { tela: "provas" });
  try {
    await pP.locator('.fg-item[data-key="fgv:47"]').click();
    await pP.locator('[data-acao="comecar"]').click({ timeout: 8000 });
    await pP.locator(".mp-conta").click({ timeout: 2000 }).catch(() => {});
    await pP.locator(".fg-enun").waitFor({ timeout: 5000 });
    const ordem = await pP.evaluate(() => { const q = QMAP["fgv47-01"]; return [...document.querySelectorAll(".alt span:last-child")].map(x => q.o.indexOf(x.textContent)).join() === q.fgv.ord.join() });
    if (!ordem) falhas.push(`${nomeP}: as alternativas não estão na ordem do caderno`);
    await pP.locator(".alts .alt").nth(await pP.evaluate(() => QMAP["fgv47-01"].fgv.ord.indexOf(0))).click();
    await pP.waitForTimeout(300);
    if (!/correta/.test(await pP.locator(".coment h3").innerText())) falhas.push(`${nomeP}: a resposta certa não foi corrigida como certa`);
    await pP.evaluate(() => { idx = 46; render() });
    await pP.locator(".alts .alt").nth(1).click();
    await pP.waitForTimeout(300);
    if (await pP.locator(".alt.certa, .alt.errada").count() || !(await pP.locator(".coment.fg-anulada").count())) falhas.push(`${nomeP}: a questão anulada mostrou certa/errada`);
    if (estilo === "premium" && tema === "claro") await pP.screenshot({ path: PRINTS + nomeP + "-anulada.png" });
    await pP.evaluate(() => finalizar());
    await pP.locator(".fg-placar").waitFor({ timeout: 4000 });
    const nota = await pP.locator(".fg-placar .pct").innerText();
    if (!/^2\s*\/\s*80$/.test(nota.replace(/\n/g, ""))) falhas.push(`${nomeP}: a nota deveria ser 2/80 (1 certa + a anulada) e saiu "${nota}"`);
    if (estilo === "premium" && tema === "claro") { await pP.waitForTimeout(1200); await pP.screenshot({ path: PRINTS + nomeP + "-resultado.png" }) }
  } catch (e) { falhas.push(`${nomeP}: ${e.message.split("\n")[0]}`) }
  await ctxP.close();
}
await browser.close();

if (falhas.length) {
  console.error(`\n${falhas.length} problema(s):\n- ` + falhas.join("\n- "));
  process.exit(1);
}
console.log(`Tudo certo: ${VISUAIS.length * (TELAS.length + 5)} telas e fluxos, sem erros.`);
