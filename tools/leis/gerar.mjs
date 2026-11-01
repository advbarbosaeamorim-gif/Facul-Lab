#!/usr/bin/env node
/* Gera os textos de lei que o app abre quando o aluno toca numa citação ("art. 112 da LEP").

   Fonte: a compilação atualizada (texto em vigor) da Câmara dos Deputados e do Senado Federal publicada em
   normas.leg.br (LexML, licença CC BY 4.0). Código de Ética e Disciplina e Regulamento Geral da OAB: os PDFs
   oficiais do site da OAB (precisa do pdfplumber no Python para ler).

   Saída:
     leis/indice.js   catálogo que o app usa para achar as citações (nomes, siglas, de quando é o texto)
     leis/<id>.js     um arquivo por lei, com os artigos que o app cita (e a lei inteira, se ela for curta)

   Uso:
     node tools/leis/gerar.mjs            usa o que já foi baixado (pasta $LEIS_CACHE ou /tmp/facul-lab-leis)
     node tools/leis/gerar.mjs --baixar   baixa tudo de novo (faça isso quando sair lei nova)
     node tools/leis/gerar.mjs --relatorio   também lista as citações que não deu para abrir

   As citações são achadas com leis/achar.js, o mesmo código que o app usa (js/21-artigos.js), com as mesmas regras:
     - com a lei escrita ("art. 5º da CF", "art. 28 da mesma lei"), vale a lei escrita;
     - sem ela, vale a lei do título do tema, do fundamento da questão ou mencionada na mesma frase e, depois, a lei
       padrão da matéria (CP no Penal, CPC no Processo Civil...), a primeira em que o artigo e o § citado existem;
     - lei só mencionada na frase e lei padrão com o mesmo artigo: fica sem link (pode ser qualquer uma).
   Rode de novo sempre que entrar conteúdo novo (questões, apostilas): o artigo novo citado passa a vir junto.
   Com --relatorio, confira também conferir.json: citações com a lei escrita cujo §/inciso não existe mais no texto
   atual (sinal de conteúdo desatualizado, como um "parágrafo único" que virou §1º).

   tools/leis/correcoes.json: ajustes à mão, cada um com a fonte. {lei, art, nova: {lei, data, linhas}} mostra uma
   redação já publicada que ainda não vale ou que a compilação não trouxe; {lei, art, depois_de|troca, linhas} mexe
   no texto. As alterações publicadas depois da data da compilação são buscadas sozinhas no Senado (seção 3b). */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import vm from "node:vm";
import os from "node:os";

const RAIZ = new URL("../../", import.meta.url).pathname;
const CACHE = process.env.LEIS_CACHE || os.tmpdir() + "/facul-lab-leis";
const BAIXAR = process.argv.includes("--baixar");
const RELATORIO = process.argv.includes("--relatorio");
const CATALOGO = JSON.parse(readFileSync(RAIZ + "tools/leis/catalogo.json", "utf8"));
const LEI_CURTA = 45000;            // leis com menos que isso (em caracteres) vão inteiras
mkdirSync(CACHE, { recursive: true });

/* ---------- 1. baixar ---------- */
async function baixar(url, arq, binario) {
  if (!BAIXAR && existsSync(arq)) return readFileSync(arq, binario ? undefined : "utf8");
  for (let t = 0; t < 4; t++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "facul-lab (gerador de leis)" } });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const b = Buffer.from(await r.arrayBuffer());
      writeFileSync(arq, b);
      return binario ? b : b.toString("utf8");
    } catch (e) { if (t === 3) throw new Error(url + ": " + e.message); await new Promise(r => setTimeout(r, 2000 * (t + 1))) }
  }
}
async function fonteNormas(L) {
  const meta = JSON.parse(await baixar(`https://normas.leg.br/api/public/normas?urn=${L.urn}&&tipo_documento=maior-detalhe`, `${CACHE}/${L.id}.meta.json`));
  const enc = [].concat(meta.encoding || []);
  const c = enc.filter(e => e.version === "Current" && /html/.test(e.encodingFormat || "") && !/Traduzida/.test((e.additionalType || "") + (e.name || "")))
    .sort((a, b) => (/na CD|NaCD/.test(b.name + b.additionalType) ? 1 : 0) - (/na CD|NaCD/.test(a.name + a.additionalType) ? 1 : 0));
  if (!c.length) return null;
  const url = c[0].contentUrl.replace("/api/binario/", "/api/public/binario/");
  const html = await baixar(url, `${CACHE}/${L.id}.html`);
  const salvo = (/<o:LastSaved>([^<]+)/.exec(html) || [])[1] || meta.dateModified || "";
  return { html, data: salvo.slice(0, 10), nome: c[0].name, quem: /na CD|NaCD/.test(c[0].name + c[0].additionalType) ? "Câmara dos Deputados" : "Senado Federal" };
}
async function fonteOab(L) {
  const pdf = `${CACHE}/${L.id}.pdf`, txt = `${CACHE}/${L.id}.txt`;
  await baixar(L.url, pdf, true);
  if (BAIXAR || !existsSync(txt)) {
    try { execFileSync("python3", [RAIZ + "tools/leis/pdf-texto.py", pdf, txt], { stdio: "inherit" }) }
    catch (e) { console.warn(`! ${L.id}: não deu para ler o PDF (instale o pdfplumber: pip install pdfplumber)`); return null }
  }
  return { txt: readFileSync(txt, "utf8"), quem: "Conselho Federal da OAB" };
}

/* ---------- 2. separar em artigos ---------- */
const ART = /^Art\.?\s*(\d{1,2}(?:\.\d{3})+|\d{1,4})\s*(?:º|°|o(?=[\s.\-–]))?\s*(?:-\s*([A-Z]{1,3})\b)?\s*(?:\.|º|°)?/;
const TITULO = /^(PARTE|LIVRO|TÍTULO|TITULO|CAPÍTULO|CAPITULO|SEÇÃO|SECÇÃO|Seção|Secção|SUBSEÇÃO|Subseção)\b/;
const chaveArt = m => m[1].replace(/\./g, "") + (m[2] ? "-" + m[2] : "");
function paragrafosHtml(html) {
  return [...html.matchAll(/<(?:p|h\d)\b[^>]*>([\s\S]*?)<\/(?:p|h\d)>/g)].map(m => m[1].replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&#160;|&#xa0;/gi, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/\u00a0|\u200b/g, " ").replace(/\s+/g, " ").trim().replace(/^([IVXLC]+) ([IVXLC]+)(\s*[-–])/, "$1$2$3")).filter(Boolean);
}
/* devolve {principal: {arts, ordem, tit}, adct?} */
function separar(linhas, ehCf, inicio) {
  if (inicio) { const i = linhas.findIndex(l => inicio.test(l)); if (i > 0) linhas = linhas.slice(i) }
  const novo = () => ({ arts: {}, ordem: [], tit: [] });
  const out = { principal: novo() };
  let alvo = out.principal, art = null, cab = [], fimDoTexto = false;
  for (let i = 0; i < linhas.length; i++) {
    const t = linhas[i];
    if (ehCf && /^ATO DAS DISPOSIÇÕES CONSTITUCIONAIS TRANSITÓRIAS$/.test(t)) { alvo = out.adct = novo(); art = null; cab = []; continue }
    const m = ART.exec(t);
    if (m && /^Art/.test(t)) {
      fimDoTexto = false;
      const k = chaveArt(m);
      if (alvo.arts[k]) { art = null; continue }      // repetido (texto citado dentro de outro): fica o primeiro
      art = alvo.arts[k] = [t]; alvo.ordem.push(k);
      if (cab.length) { alvo.tit.push([k, cab.join(" › ")]); cab = [] }
      continue;
    }
    if (TITULO.test(t) && t.length < 140) {
      let nome = t;
      const prox = linhas[i + 1] || "";
      if (prox && !ART.test(prox) && !TITULO.test(prox) && prox.length < 160 && prox === prox.toUpperCase()) { nome += " — " + prox; i++ }
      cab.push(nome.replace(/\s*\((?:Redação|Incluíd|Acrescid|Renumerad|Denominação|Nomenclatura)[^)]*\)\s*/g, " ").trim()); art = null; continue;
    }
    if (/^(Brasília|Rio de Janeiro),?\s.*\d{4}/.test(t) || /^ANEXO\b/.test(t)) { art = null; fimDoTexto = true; continue }
    if (art && !fimDoTexto) art.push(t);
  }
  return out;
}
/* PDF da OAB: tira cabeçalho, número de página e notas de rodapé; junta as linhas quebradas */
function linhasOab(txt) {
  const paginas = txt.split("\f").map(p => p.split("\n").map(l => l.trim()).filter(Boolean));
  const conta = {};
  paginas.forEach(p => p.forEach(l => { if (l.length > 12) conta[l] = (conta[l] || 0) + 1 }));
  const cabecalho = new Set(Object.keys(conta).filter(l => conta[l] > paginas.length / 3));
  const notas = {}; let prox = 1;
  const corpo = [];
  for (const p of paginas) {
    const L = p.filter(l => !cabecalho.has(l) && !/^\d{1,3}$/.test(l));
    // rodapé: a partir da linha que começa com o número da próxima nota
    let k = L.length;
    for (let i = 0; i < L.length; i++) { const m = /^(\d{1,3})\s+\S/.exec(L[i]); if (m && +m[1] === prox && i > 0) { k = i; break } }
    const rod = L.slice(k), txtP = L.slice(0, k);
    let atual = null;
    for (const l of rod) { const m = /^(\d{1,3})\s+(.*)$/.exec(l); if (m && +m[1] === prox) { atual = prox++; notas[atual] = m[2] } else if (atual) notas[atual] += " " + l }
    corpo.push(...txtP);
  }
  // junta as linhas em parágrafos
  const inicio = /^(Art\.\s*\d|§\s*\d|Parágrafo único|[IVXLC]+\s*[–-]\s|[a-z]\)\s|(PARTE|LIVRO|TÍTULO|CAPÍTULO|SEÇÃO|Seção|SUBSEÇÃO)\b)/;
  const par = [];
  for (const l of corpo) {
    const ehTit = l === l.toUpperCase() && /[A-ZÀ-Ú]{3}/.test(l) && par.length && TITULO.test(par[par.length - 1]);
    if (!par.length || inicio.test(l) || ehTit) par.push(l);
    else { const a = par[par.length - 1]; par[par.length - 1] = /[a-zà-ú]-$/.test(a) && /^[a-zà-ú]/.test(l) ? a + l : a + " " + l }
  }
  // marcas de nota ("(NR)2", "mercantilização.4") viram a nota entre parênteses no fim do parágrafo
  const usadas = new Set();
  return par.map(t => t.replace(/([A-Za-zÀ-ú.;:,)])(\d{1,3})(?=\s|$)/g, (s, a, n) => {
    if (!notas[n] || usadas.has(n)) return s; usadas.add(n);
    return a + " {{nota " + n + "}}";
  }).replace(/\s*\{\{nota (\d+)\}\}/g, (_, n) => " (" + notas[n].replace(/\.$/, "") + ")"));
}

/* ---------- 3. o conteúdo do app e as citações ---------- */
function carregarApp() {
  const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
  const html = readFileSync(RAIZ + "index.html", "utf8");
  const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(s => !/^(js|leis)\//.test(s));
  for (const s of srcs) vm.runInContext(readFileSync(RAIZ + s, "utf8").replace(/\bwindow\.addQ\b/g, "addQ"), ctx, { filename: s }), ctx.addQ = ctx.addQ || ctx.window.addQ;
  for (let i = 1; i <= 10; i++) if (existsSync(RAIZ + `ap${i}.js`)) vm.runInContext(readFileSync(RAIZ + `ap${i}.js`, "utf8"), ctx);
  vm.runInContext(readFileSync(RAIZ + "leis/achar.js", "utf8"), ctx);
  return ctx.window;
}
// matéria de cada disciplina da apostila (para a lei padrão); as práticas com mais de uma lei possível ficam sem padrão
const DISC_MAT = { civ1: "civil", civ2: "civil", civ3: "civil", civ4: "civil", civ5: "civil", con1: "const", con2: "const", pen1: "penal", pen2: "penal", pen3: "penal", tgp: "pc", pc1: "pc", pc2: "pc", pp1: "pp", pp2: "pp", prt: "trab", prc: null, prp: null, prpub: null, rev: null };
const matDaDisc = d => d in DISC_MAT ? DISC_MAT[d] : d;
// o texto como o aluno vê (sem **, ==, _ da marcação)
const semMarca = t => String(t).replace(/\*\*(.+?)\*\*/g, "$1").replace(/==(.+?)==/g, "$1").replace(/(^|[\s(])_(.+?)_(?=[\s.,;:!?)]|$)/g, "$1$2");
/* blocos de texto do jeito que o app mostra (cada um vira um parágrafo, item, célula ou título na tela):
   cada contêiner tem a matéria (para a lei padrão); títulos têm nível (1 = "# ", 2 = "## ", 3 = "### ") */
function blocosDoApp(W) {
  const C = [];   // [{onde, mat, blocos:[{t, tit}]}]
  for (const q of W.QUESTOES || []) {
    const b = [{ t: q.e || "" }, { t: q.f || "" }];
    (W.EXPL && W.EXPL[q.id] || []).forEach(x => b.push({ t: x }));
    C.push({ onde: "questão " + q.id, mat: q.m, fund: q.f, blocos: b });
  }
  // mesmas regras do md() do app (js/01-base.js): linhas seguidas de texto viram um parágrafo só
  const especial = l => /^(#|::|!! |\?\? |> |\||- |\d+\. |\* )/.test(l);
  const md = (onde, mat, texto) => {
    const b = [], L = String(texto).replace(/\r/g, "").split("\n").map(l => l.trim());
    for (let i = 0; i < L.length;) {
      const l = L[i];
      if (!l) { i++; continue }
      const h = l.match(/^(#{1,3}) /);
      if (h) { b.push({ t: semMarca(l.slice(h[0].length)), tit: h[1].length }); i++; continue }
      if (/^::|^\* /.test(l)) { i++; continue }                                   // esquemas e mapa mental: sem link
      if (/^\?\? /.test(l)) { const k = l.indexOf(" | "); if (k > 0) b.push({ t: semMarca(l.slice(k + 3)), teste: true }); i++; continue }   // só a resposta
      if (/^\|/.test(l)) { if (!/^\|[\s:|-]+\|?$/.test(l)) l.replace(/^\||\|$/g, "").split("|").map(x => x.trim()).filter(Boolean).forEach(x => b.push({ t: semMarca(x) })); i++; continue }
      if (/^(> |!! |- |\d+\. )/.test(l)) { b.push({ t: semMarca(l.replace(/^(> |!! |- |\d+\. )/, "")) }); i++; continue }
      const p = []; while (i < L.length && L[i] && !especial(L[i])) p.push(L[i++]);
      if (p.length) b.push({ t: semMarca(p.join(" ")) }); else i++;
    }
    C.push({ onde, mat, blocos: b });
  };
  const A = W.APOSTILA || {};
  for (const i in A) for (const d in A[i].mat || {}) {
    // cada tema ("# ...") é um contêiner: o contexto não passa de um tema para outro
    String(A[i].mat[d]).split(/\n(?=# )/).forEach((p, k) => md(`apostila ${d} parte ${k}`, matDaDisc(d), p));
  }
  (W.RESUMOS || []).forEach(R => { for (const d in R || {}) { const x = R[d]; if (typeof x === "string") md(`resumo ${d}`, matDaDisc(d), x); else C.push({ onde: `resumo ${d}`, mat: matDaDisc(d), blocos: x.map(t => ({ t: semMarca(t) })) }) } });
  for (const x of W.LEISECA || []) C.push({ onde: "lei seca " + x.id, mat: x.m, fund: x.ref, blocos: [{ t: x.ref }, { t: x.ex || "" }] });
  for (const x of W.MUDANCAS || []) C.push({ onde: "mudança " + x.id, mat: null, blocos: (x.mud || []).concat((x.aa || []).flat(), x.vig || []).map(t => ({ t })) });
  return C;
}

/* ---------- 3b. alterações que a compilação ainda não trouxe ----------
   A compilação de algumas leis fica meses atrás. Para não mostrar texto velho, o gerador procura as normas que
   alteraram a lei depois da data do texto (Senado, Dados Abertos) e as leis da lista "O que mudou na lei",
   baixa o texto publicado de cada uma e separa a redação nova de cada artigo. O app mostra essa redação junto do artigo. */
const fmtNum = n => n.length > 3 ? n.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : n;
const TIPO_SEN = { "lei": "LEI", "lei.complementar": "LCP", "decreto.lei": "DEL", "decreto": "DEC" };
const TIPO_URN = { "Lei": "lei", "Lei Complementar": "lei.complementar", "LC": "lei.complementar", "Decreto-Lei": "decreto.lei" };
async function senadoJson(url, arq) { try { return JSON.parse(await baixar(url, arq)) } catch (e) { return null } }
function docSenado(j) { const d = j && j.DetalheDocumento && j.DetalheDocumento.documentos && j.DetalheDocumento.documentos.documento; return Array.isArray(d) ? d[0] : d }
const brIso = d => { const [a, b, c] = String(d).split("/"); return `${c}-${b}-${a}` };
const chaveDe = m => m[1].replace(/\./g, "") + (m[2] ? "-" + m[2] : "");
async function pendentes(L, dataTexto, textoCompilado, W) {
  const lista = new Map();   // urn -> {nome, data}
  if (TIPO_SEN[L.tipo] && dataTexto) {
    const l = await senadoJson(`https://legis.senado.leg.br/dadosabertos/legislacao/lista.json?tipo=${TIPO_SEN[L.tipo]}&numero=${L.numero}&ano=${L.data.slice(0, 4)}`, `${CACHE}/${L.id}.senado-lista.json`);
    let id = null; const acha = o => { if (!o || typeof o !== "object" || id) return; if (o.id && o.dataassinatura && String(o.numero) === L.numero) { id = o.id; return } Object.values(o).forEach(acha) }; acha(l);
    const d = id && docSenado(await senadoJson(`https://legis.senado.leg.br/dadosabertos/legislacao/${id}.json`, `${CACHE}/${L.id}.senado.json`));
    for (const v of [].concat((d && d.vides && d.vides.vide) || [])) {
      if (v.comentario !== "Declaração de Alteração Permanente" || /Acórdão|Medida Provisória/.test(v.nomeNormaPosterior || "")) continue;
      if (brIso(v.datAssinatura) <= dataTexto) continue;
      const p = docSenado(await senadoJson(`https://legis.senado.leg.br/dadosabertos/legislacao/${v.codnormaposterior}.json`, `${CACHE}/senado-${v.codnormaposterior}.json`));
      const urn = p && /urn=([^&]+)/.exec((p.identificacao && p.identificacao.urlDocumento) || "");
      if (urn) lista.set(urn[1], { nome: v.nomeNormaPosterior, data: brIso(v.datAssinatura) });
    }
  }
  // leis da lista "O que mudou na lei" que alteraram esta e ainda não aparecem no texto compilado
  const refL = new RegExp("(Lei|Lei Complementar|Decreto-Lei)\\s+n[ºo°]\\s*" + fmtNum(L.numero).replace(".", "\\.") + "(?![\\d.])" + (L.nome ? "|\\(" + L.nome.replace(/[()]/g, "") + "\\)" : ""));
  for (const x of W.MUDANCAS || []) {
    const m = /^(Lei Complementar|LC|Lei|Decreto-Lei) ([\d.]+)\/(\d{4})$/.exec(x.n); if (!m || !dataTexto || x.data <= dataTexto) continue;
    if (!refL.test(x.ementa || "")) continue;
    if (new RegExp("(Lei|Lei Complementar)\\s+n[ºo°]\\s*" + m[2].replace(".", "\\.") + "(?![\\d.])").test(textoCompilado)) continue;
    lista.set(`urn:lex:br:federal:${TIPO_URN[m[1]]}:${x.data};${m[2].replace(/\./g, "")}`, { nome: x.n, data: x.data });
  }
  const out = [];
  for (const [urn, v] of lista) {
    try {
      const arq = `${CACHE}/alt-${urn.replace(/[^\w]+/g, "_")}`;
      const meta = JSON.parse(await baixar(`https://normas.leg.br/api/public/normas?urn=${urn}&&tipo_documento=maior-detalhe`, arq + ".meta.json"));
      const o = [].concat(meta.encoding || []).find(e => e.version === "Original" && /html/.test(e.encodingFormat || ""));
      if (!o) { console.warn(`! ${L.id}: sem o texto de ${v.nome}`); continue }
      const html = await baixar(o.contentUrl.replace("/api/binario/", "/api/public/binario/"), arq + ".html");
      const blocos = blocosDeAlteracao(paragrafosHtml(html), L);
      const nome = (/^(Lei Complementar|Lei|Decreto-Lei) nº ([\d.]+)/.exec(v.nome) || []).slice(1, 3).join(" ") + "/" + v.data.slice(0, 4);
      if (Object.keys(blocos).length) out.push({ nome: /^\//.test(nome) ? v.nome : nome, data: v.data, blocos });
      else console.warn(`  ${L.id}: ${v.nome} não mexe em artigo (ou não deu para separar)`);
    } catch (e) { console.warn(`! ${L.id}: ${v.nome}: ${e.message}`) }
  }
  return out.sort((a, b) => a.data.localeCompare(b.data));
}
/* separa, no texto de uma lei que altera outras, a redação nova de cada artigo da lei L */
function blocosDeAlteracao(pars, L) {
  const ref = new RegExp("(Lei|Lei Complementar|Decreto-Lei)\\s+n[ºo°]\\s*" + fmtNum(L.numero).replace(".", "\\.") + "(?![\\d.])" + (L.nome ? "|\\(" + L.nome.replace(/[()]/g, "") + "\\)" : ""));
  const VERBO = /passa(?:m)? a vigorar|acrescid|acrescentad|inclu[ií]d|com a seguinte reda|nova reda/i;
  const ARTQ = /^Art\.\s*(\d{1,2}(?:\.\d{3})+|\d{1,4})\s*(?:º|°|o)?\s*(?:-\s*([A-Z]{1,3}))?/;
  const out = {}; let alvo = false, artIntro = null, dentro = false, cur = null;
  for (let p of pars) {
    if (!dentro && /^[“"]/.test(p)) {
      dentro = true; p = p.replace(/^[“"]\s*/, "");
      if (alvo) { const m = ARTQ.exec(p); const k = m ? chaveDe(m) : artIntro; cur = k ? (out[k] = out[k] || []) : null }
    } else if (dentro && /^[“"]/.test(p)) {
      p = p.replace(/^[“"]\s*/, ""); const m = ARTQ.exec(p);
      if (alvo && m) cur = out[chaveDe(m)] = out[chaveDe(m)] || [];
    } else if (!dentro) {
      alvo = ref.test(p) && VERBO.test(p);
      const a = /\bart\.\s*(\d{1,2}(?:\.\d{3})+|\d{1,4})\s*(?:º|°|o)?\s*(?:-\s*([A-Z]{1,3}))?/i.exec(p);
      artIntro = a ? chaveDe(a) : null;
      // revogações: "Ficam revogados ... o art. 5º da Lei nº ..."
      if (ref.test(p) && /revogad/i.test(p) && !VERBO.test(p)) for (const r of p.matchAll(/arts?\.\s*(\d{1,2}(?:\.\d{3})+|\d{1,4})\s*(?:º|°|o)?\s*(?:-\s*([A-Z]{1,3}))?/gi)) (out[chaveDe(r)] = out[chaveDe(r)] || []).push("(Revogação) " + p);
      cur = null; continue;
    }
    const fecha = /[”"]\s*(?:\(NR\))?\s*[.;]?\s*$/.test(p);
    const t = p.replace(/[”"]\s*(?:\(NR\))?\s*[.;]?\s*$/, "").trim();
    if (cur && t) cur.push(t);
    if (fecha) { dentro = false; cur = null }
  }
  return out;
}
/* junta ao texto: artigo novo entra inteiro; artigo alterado ganha a redação nova (o app mostra em destaque) */
function aplicarPendentes(T, pend) {
  const nov = {};
  const reticencias = l => /^[.…\s]{6,}$/.test(l);
  for (const alt of pend) for (const k in alt.blocos) {
    const bruto = alt.blocos[k], linhas = bruto.filter(l => !reticencias(l));
    if (!linhas.length) continue;
    const completo = /^Art\./.test(linhas[0]) && !/\.{4,}|…/.test(linhas[0]) && !bruto.some(reticencias);
    if (!T.arts[k] && completo) {
      T.arts[k] = linhas.concat([`(Incluído pela ${alt.nome}, de ${alt.data.split("-").reverse().join("/")})`]);
      const n = parseInt(k, 10); let i = T.ordem.findIndex(x => parseInt(x, 10) > n || (parseInt(x, 10) === n && x > k));
      if (i < 0) i = T.ordem.length; T.ordem.splice(i, 0, k);
      continue;
    }
    (nov[k] = nov[k] || []).push({ lei: alt.nome, data: alt.data, linhas: bruto.map(l => reticencias(l) ? "…" : l.replace(/\.{6,}|…{2,}/g, " …").replace(/\s+…/g, " …")) });
  }
  return nov;
}

/* ---------- 4. montar ---------- */
const textos = {}, info = {}, novas = {};
const W = carregarApp();
const INICIO = { clt: /^TÍTULO I\b/, ced: /^TÍTULO I\b/, rgoab: /^TÍTULO I\b/ };
for (const L of CATALOGO) {
  if (L.id === "adct") continue;
  try {
    if (L.fonte === "oab") {
      const f = await fonteOab(L); if (!f) continue;
      const s = separar(linhasOab(f.txt), false, INICIO[L.id]);
      textos[L.id] = s.principal; info[L.id] = { quem: f.quem, data: "", url: L.ver || L.url };
    } else {
      const f = await fonteNormas(L); if (!f) { console.warn("! sem texto atualizado:", L.id); continue }
      const s = separar(paragrafosHtml(f.html), L.id === "cf", INICIO[L.id]);
      textos[L.id] = s.principal; info[L.id] = { quem: f.quem, data: f.data };
      const pend = await pendentes(L, f.data, f.html, W);
      if (pend.length) { novas[L.id] = aplicarPendentes(textos[L.id], pend); info[L.id].pend = pend.map(x => x.nome) }
      if (L.id === "cf") {
        const A = CATALOGO.find(x => x.id === "adct");
        const fa = await fonteNormas(A);
        if (fa) { textos.adct = separar(paragrafosHtml(fa.html), false).principal; info.adct = { quem: fa.quem, data: fa.data } }
      }
    }
  } catch (e) { console.warn("! " + L.id + ": " + e.message) }
}
// correções: dispositivos que a compilação ainda não trouxe (tools/leis/correcoes.json), com a fonte de cada uma
const CORR = existsSync(RAIZ + "tools/leis/correcoes.json") ? JSON.parse(readFileSync(RAIZ + "tools/leis/correcoes.json", "utf8")) : [];
for (const c of CORR) {
  const a = textos[c.lei] && textos[c.lei].arts[c.art]; if (!a) { console.warn("! correção sem artigo:", c.lei, c.art); continue }
  // "nova": redação já publicada que ainda não vale ou que a compilação não trouxe (aparece como "Redação nova")
  if (c.nova) { ((novas[c.lei] = novas[c.lei] || {})[c.art] = novas[c.lei][c.art] || []).push(c.nova); continue }
  if (c.depois_de) { const i = a.findIndex(l => l.startsWith(c.depois_de)); if (i < 0) { console.warn("! correção: não achei", c.depois_de); continue } a.splice(i + 1, 0, ...c.linhas) }
  else if (c.troca) { const i = a.findIndex(l => l.startsWith(c.troca)); if (i < 0) { console.warn("! correção: não achei", c.troca); continue } a.splice(i, 1, ...c.linhas) }
}

// índice para o achador (o mesmo que vai para o app)
const IDX = {};
for (const L of CATALOGO) {
  if (!textos[L.id]) continue;
  IDX[L.id] = { n: L.nome || (L.apelidos || [])[0] || "", s: L.sigla || "", num: L.num, tp: L.tipo, nu: L.numero, an: (L.data || "").slice(0, 4), al: L.apelidos || [], c: L.so_citacao || [], pad: L.padrao || [] };
}
const ACH = W.ARTACHAR;
const padrao = {}; for (const id in IDX) for (const m of IDX[id].pad) padrao[m] = id;
const leiDe = id => textos[id] ? { arts: textos[id].arts, nov: novas[id] } : null;
const citados = {}; const prob = []; const amostra = []; const conferir = [];
const conta = { explicita: 0, titulo: 0, bloco: 0, frase: 0, padrao: 0, outra: 0, bloqueada: 0, sem_lei: 0, ok: 0, falta: 0 };
for (const C of blocosDoApp(W)) {
  const pad = (C.mat && padrao[C.mat]) || null;
  // nas questões, a lei do fundamento vale como um título para o comentário e as explicações
  const T = ACH.titulos(C.fund ? ACH.leiDoFundamento(C.fund, IDX) : null);
  for (const b of C.blocos) {
    const ctx = b.tit ? T.antesDoTitulo(b.tit) : b.teste ? T.tema() : T.texto();
    const r = ACH.varrer(String(b.t || ""), IDX, ctx);
    if (b.tit) T.titulo(b.tit, r.fim, ctx);
    for (const c of r.cits) {
      if (c.como === "outra") { conta.outra++; continue }
      if (c.bloq) { conta.bloqueada++; continue }
      const lei = ACH.escolher(c, pad, leiDe);
      const tipo = c.como === "explicita" ? "explicita" : !lei ? "sem_lei" : lei !== c.lei && lei !== pad ? "frase" : c.de === "texto" && lei === c.lei ? "bloco" : lei === c.lei && c.lei !== pad ? "titulo" : "padrao";
      if (!lei) {
        // sem lei certa: a escrita sem esse artigo, ou nenhuma candidata com o artigo e o §/inciso citado
        conta.falta++;
        const cand = ACH.candidatas(c, pad);
        if (cand.length) prob.push([C.onde, cand.join("|"), c.arts.map(a => a.n + (a.p.length ? " " + a.p.map(x => x.map(y => y.join(" ")).join(" > ")).join(" + ") : "")).join(", "), c.como, String(b.t).slice(Math.max(0, c.i - 50), c.j + 25)]);
        else conta.sem_lei++;
        continue;
      }
      conta[tipo]++; conta.ok++;
      // lei escrita e artigo certo, mas o §/inciso citado não existe no texto atual: conferir o conteúdo do app
      if (tipo === "explicita") for (const a of c.arts) if (a.p.length && !ACH.tem(leiDe(lei), a, true)) conferir.push([C.onde, lei, a.n + " " + a.p.map(x => x.map(y => y.join(" ")).join(" > ")).join(" + "), String(b.t).slice(Math.max(0, c.i - 50), c.j + 25)]);
      for (const a of c.arts) (citados[lei] = citados[lei] || new Set()).add(a.n);
      if (tipo !== "explicita") amostra.push([C.onde, lei, tipo, String(b.t).slice(Math.max(0, c.i - 90), c.j + 25)]);
    }
  }
}

/* ---------- 5. escrever ---------- */
mkdirSync(RAIZ + "leis", { recursive: true });
const hoje = new Date().toISOString().slice(0, 10);
const indice = {};
let total = 0;
for (const id in IDX) {
  const T = textos[id];
  const tam = T.ordem.reduce((s, k) => s + T.arts[k].join(" ").length, 0);
  const inteira = tam <= LEI_CURTA;
  const usar = T.ordem.filter(k => inteira || (citados[id] && citados[id].has(k)));
  if (!usar.length) continue;
  const arts = {}; usar.forEach(k => arts[k] = T.arts[k]);
  const tit = T.tit.filter(([k]) => inteira || usar.includes(k));
  // títulos: só o caminho até cada artigo usado (para mostrar "Onde fica")
  const caminho = {}; let atual = ""; for (const k of T.ordem) { const t = T.tit.find(x => x[0] === k); if (t) atual = t[1]; if (arts[k] && atual) caminho[k] = atual }
  const L = CATALOGO.find(x => x.id === id);
  const nov = {}; for (const k of usar) if (novas[id] && novas[id][k]) nov[k] = novas[id][k];
  const corpo = { id, a: info[id].data, ordem: usar, arts, cam: caminho, inteira };
  if (Object.keys(nov).length) corpo.nov = nov;
  const js = `/* ${L.num}${L.nome ? " (" + L.nome + ")" : ""}: ${inteira ? "texto inteiro" : usar.length + " artigos citados no app"}.\n   Gerado por tools/leis/gerar.mjs em ${hoje}. Não edite à mão: rode o gerador de novo. */\n(window.LEIS_TXT=window.LEIS_TXT||{})[${JSON.stringify(id)}]=${JSON.stringify(corpo)};\n`;
  writeFileSync(RAIZ + `leis/${id}.js`, js);
  total += js.length;
  indice[id] = { ...IDX[id], f: info[id].quem, a: info[id].data, q: usar.length, t: T.ordem.length, urn: L.urn || "", url: info[id].url || (L.urn ? "https://normas.leg.br/?urn=" + L.urn : "") };
  if (info[id].pend) indice[id].pend = info[id].pend;
  delete indice[id].tp; delete indice[id].nu;
  indice[id].tp = IDX[id].tp; indice[id].nu = IDX[id].nu;
}
// arquivos de leis que saíram do catálogo
for (const f of readdirSync(RAIZ + "leis")) { const id = f.replace(/\.js$/, ""); if (/\.js$/.test(f) && !["indice", "achar"].includes(id) && !indice[id]) console.warn("! arquivo sobrando: leis/" + f) }
writeFileSync(RAIZ + "leis/indice.js", `/* Leis que o app sabe abrir quando o aluno toca numa citação. Gerado por tools/leis/gerar.mjs em ${hoje}.\n   n: nome, s: sigla, num: número, al: como aparece no texto, c: só depois de "art. N do/da", pad: matérias em que é a lei padrão,\n   f: quem compilou o texto, a: data do texto, q: artigos no app, t: artigos na lei. */\nwindow.LEIS_IDX=${JSON.stringify(indice)};\n`);
console.log(`${Object.keys(indice).length} leis, ${(total / 1024).toFixed(0)} KB de texto`);
console.log("citações:", JSON.stringify(conta));
if (RELATORIO) {
  writeFileSync(CACHE + "/problemas.json", JSON.stringify(prob, null, 1));
  writeFileSync(CACHE + "/implicitas.json", JSON.stringify(amostra, null, 1));
  writeFileSync(CACHE + "/conferir.json", JSON.stringify(conferir, null, 1));
  console.log(conferir.length + " citações com a lei escrita apontam §/inciso que não existe (" + CACHE + "/conferir.json)");
  console.log("problemas em", CACHE + "/problemas.json; citações sem a lei escrita em", CACHE + "/implicitas.json");
}
