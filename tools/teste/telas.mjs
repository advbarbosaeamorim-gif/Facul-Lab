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
  { tela: "pre", key: "casos:todas" },
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
}
await browser.close();

if (falhas.length) {
  console.error(`\n${falhas.length} problema(s):\n- ` + falhas.join("\n- "));
  process.exit(1);
}
console.log(`Tudo certo: ${VISUAIS.length * (TELAS.length + 3)} telas e fluxos, sem erros.`);
