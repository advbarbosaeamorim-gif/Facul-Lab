"use strict";
/* ---------- abrir o artigo citado ----------
   Nas explicações, nos comentários, na apostila e nos resumos, "art. 112 da LEP" vira um link. Tocar abre o texto
   oficial do artigo numa folha, com a parte citada (§, inciso, alínea) destacada, o caminho na lei ("Onde fica") e a
   redação nova quando a compilação oficial ainda não trouxe a lei que mudou o artigo.
   Os textos ficam em leis/ e são gerados por tools/leis/gerar.mjs (Câmara dos Deputados, Senado Federal e Conselho
   Federal da OAB). Nada disso baixa ao abrir o app: o achador (leis/achar.js) e o índice (leis/indice.js) vêm na
   primeira tela que tiver citação, e cada lei só quando aparece; depois ficam guardados para usar sem internet.
   Citação sem a lei escrita ("(art. 59)") só vira link se o artigo e o § citado existirem na lei do contexto (título
   do tema, fundamento da questão ou a lei padrão da matéria): na dúvida, fica sem link. A regra é a mesma do gerador. */
P.copiar='<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h2"/>';
P.externo='<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>';

const ART_DIR="leis/";
const ART_BLOCOS="p,li,td,th,h3,h4,h5,dd";
const ART_FORA="summary,button,a,label,textarea,select,svg,figure,.diag,.mapa,.ls-texto,.porque-t,nav,.art-link,[data-sem-leis]";
const artJs={};
/* carrega um script uma vez; se falhar (sem internet), tenta de novo na próxima tela */
function artScript(src){
  if(!artJs[src])artJs[src]=new Promise(ok=>{const s=document.createElement("script");s.src=src;s.async=true;
    s.onload=()=>ok(true);s.onerror=()=>{delete artJs[src];s.remove();ok(false)};document.head.appendChild(s)});
  return artJs[src]}
const artBase=()=>Promise.all([artScript(ART_DIR+"achar.js"),artScript(ART_DIR+"indice.js")]).then(r=>r.every(Boolean)&&!!window.ARTACHAR&&!!window.LEIS_IDX);
const artTxt=id=>(window.LEIS_TXT||{})[id]||null;
const artLei=id=>artTxt(id)?Promise.resolve(artTxt(id)):window.LEIS_IDX&&LEIS_IDX[id]?artScript(ART_DIR+id+".js").then(()=>artTxt(id)):Promise.resolve(null);
/* lei padrão da matéria (ou da disciplina da apostila): só quando a matéria aponta para uma lei só */
function artPadrao(m){if(!m||!window.LEIS_IDX)return null;const D=DISC[m];const mats=D?(D.base?[D.base]:D.m||[]):[m];
  const ids=new Set();for(const x of mats)for(const id in LEIS_IDX)if((LEIS_IDX[id].pad||[]).includes(x))ids.add(id);
  return ids.size===1?[...ids][0]:null}
const artNome=id=>{const L=window.LEIS_IDX&&LEIS_IDX[id];return L?(L.s&&L.s.length<=6?L.s:L.n||L.num):""};

/* ---------- achar e ligar as citações ---------- */
let artFila=null;
function artAgendar(){if(artFila)return;artFila=setTimeout(()=>{artFila=null;artVarrer()},60)}
function artTextos(b){const nos=[];const w=document.createTreeWalker(b,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement&&n.parentElement.closest(ART_FORA)&&b.contains(n.parentElement.closest(ART_FORA))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  let n;while((n=w.nextNode()))nos.push(n);return nos}
async function artVarrer(){
  const cs=[...document.querySelectorAll("#app [data-leis]:not([data-leis-ok])")];if(!cs.length)return;
  cs.forEach(c=>c.setAttribute("data-leis-ok",""));
  if(!(await artBase())){cs.forEach(c=>c.removeAttribute("data-leis-ok"));return}
  const A=ARTACHAR,IDX=LEIS_IDX,tarefas=[],precisa=new Set();
  for(const c of cs){
    const pad=artPadrao(c.dataset.leis);
    const T=A.titulos(c.dataset.leisFund?A.leiDoFundamento(c.dataset.leisFund,IDX):null);
    if(c.dataset.leisTit){const antes=T.antesDoTitulo(1);T.titulo(1,A.varrer(c.dataset.leisTit,IDX,antes).fim,antes)}
    for(const b of c.querySelectorAll(ART_BLOCOS)){
      if(b.closest(ART_FORA))continue;
      const pai=b.parentElement&&b.parentElement.closest(ART_BLOCOS);if(pai&&c.contains(pai))continue;
      const nivel=/^H[345]$/.test(b.tagName)?+b.tagName[1]-2:0;
      const nos=artTextos(b),texto=nos.map(n=>n.nodeValue).join("");
      if(!nivel&&!/art/i.test(texto))continue;
      const ctx=nivel?T.antesDoTitulo(nivel):b.closest(".teste")?T.tema():T.texto();
      const r=A.varrer(texto,IDX,ctx);
      if(nivel)T.titulo(nivel,r.fim,ctx);
      const cits=r.cits.filter(x=>x.como!=="outra"&&!x.bloq);if(!cits.length)continue;
      // com a lei escrita, o link já vale (o texto baixa ao tocar); sem ela, baixa antes as leis candidatas para conferir
      cits.forEach(x=>{if(x.como!=="explicita")A.candidatas(x,pad).forEach(id=>precisa.add(id))});
      tarefas.push({b,nos,texto,cits,pad});
    }
  }
  if(!tarefas.length)return;
  await Promise.all([...precisa].map(artLei));
  for(const t of tarefas){
    if(!t.b.isConnected||t.nos.some(n=>!t.b.contains(n))||t.nos.map(n=>n.nodeValue).join("")!==t.texto)continue;
    for(const x of t.cits.slice().reverse()){const lei=x.como==="explicita"?(IDX[x.lei]?x.lei:null):A.escolher(x,t.pad,artTxt);if(lei)artLigar(t.nos,x,lei)}
  }
}
/* troca o trecho da citação por um botão (só dentro de um pedaço de texto; se a citação atravessa um negrito, liga o começo) */
function artLigar(nos,x,lei){let ini=0;
  for(const n of nos){const fim=ini+n.nodeValue.length;
    if(x.i>=ini&&x.i<fim){const a=x.i-ini,b=Math.min(x.j,fim)-ini;if(b<=a)return;
      const meio=n.splitText(a);meio.splitText(b-a);
      const bt=document.createElement("button");bt.type="button";bt.className="art-link";
      bt.dataset.lei=lei;bt.dataset.arts=JSON.stringify(x.arts);bt.setAttribute("aria-haspopup","dialog");
      const L=LEIS_IDX[lei];bt.setAttribute("aria-label",`${meio.nodeValue.trim()}${x.como==="explicita"?"":" ("+(L.n||L.num)+")"}: abrir o texto da lei`);
      meio.parentNode.replaceChild(bt,meio);bt.appendChild(meio);return}
    ini=fim}}
try{new MutationObserver(artAgendar).observe($("#app"),{childList:true,subtree:true})}catch(e){}
addEventListener("load",artAgendar);

/* ---------- a folha com o artigo ---------- */
let artAberto=null;   // {lei, arts, volta: elemento que abriu}
const artNotaRe=/\s*\(((?:Parágrafo|Inciso|Alínea|Alinea|Artigo|Item|Pena|“Caput”|"Caput"|Caput|Primitivo|Nome jurídico|Expressão|Revogad[oa]s?|revogad[oa]s?|VETAD[OA]|Vetad[oa]|Vide|Ver|Alterad[oa]|Inserid[oa]|Incluíd[oa]|Retificad[oa]|Prazo prorrogado|NR|DEOAB|Declarad[oa]|Redação|Acrescid[oa]|Renumerad[oa]|Transformad[oa])\b[^()]*(?:\([^()]*\)[^()]*)*)\)\s*\.?\s*$/;
function artSepara(l){const notas=[];let m;while((m=l.match(artNotaRe))&&m.index>0){notas.unshift(m[1]);l=l.slice(0,m.index)}return [l,notas]}
function artTipo(l){return /^Art\.\s/.test(l)?"art":/^(§|Parágrafo único)/i.test(l)?"par":/^[IVXLC]+(?:-[A-Z])?\s*[-–—.]/.test(l)?"inc":/^[a-z]\)/.test(l)?"ali":/^\d+\s*[.,)–-]/.test(l)?"item":/^…$/.test(l)?"elide":"txt"}
/* linhas do alvo citado (mesma lógica de leis/achar.js, devolvendo onde fica): [início, fim) */
function artFaixa(linhas,caminho){let ini=0,fim=linhas.length,achou=false;
  for(const [tipo,v] of caminho){const esc0=linhas.slice(ini,fim);let i=-1,j;
    if(tipo==="caput"){j=esc0.findIndex((l,k)=>k>0&&/^(§|Parágrafo único)/i.test(l));fim=ini+(j<0?esc0.length:j);achou=true;continue}
    if(tipo==="item")continue;
    if(tipo==="par"){const re=v==="unico"?/^Parágrafo único/i:new RegExp("^§\\s*"+v.replace(/-.*/,"")+"\\s*(?:º|°|o)?"+(v.includes("-")?"\\s*-\\s*"+v.split("-")[1]:"(?![\\d-])"));
      i=esc0.findIndex(l=>re.test(l));if(i<0)return null;j=i+1;while(j<esc0.length&&!/^(§|Parágrafo único)/i.test(esc0[j]))j++}
    else if(tipo==="inc"){const re=new RegExp("^"+v+"\\s*[-–—.]");i=esc0.findIndex(l=>re.test(l));if(i<0)return null;j=i+1;while(j<esc0.length&&/^[a-z]\)|^\d+\s*[.,)]/.test(esc0[j]))j++}
    else if(tipo==="ali"){const re=new RegExp("^"+v+"\\)");i=esc0.findIndex(l=>re.test(l));if(i<0)return null;j=i+1;while(j<esc0.length&&/^\d+\s*[.,)]/.test(esc0[j]))j++}
    else continue;
    fim=ini+j;ini=ini+i;achou=true}
  return achou?[ini,fim]:null}
const artData=d=>{const m=String(d||"").match(/^(\d{4})-(\d\d)-(\d\d)/);return m?`${m[3]}/${m[2]}/${m[1]}`:""};
const artNum=n=>{const [b,s]=String(n).split("-");const v=+b;return (v<10?b+"º":v>=1000?b.replace(/\B(?=(\d{3})+$)/g,"."):b)+(s?"-"+s:"")};
function artLinhasHtml(linhas,marcas,nova){
  return linhas.map((l,k)=>{const [corpo,notas]=artSepara(l);const tp=artTipo(corpo);
    const cab=tp==="art"?corpo.match(/^Art\.\s*[\d.]+\s*(?:-\s*[A-Z]+)?\s*[º°o]?\.?/):tp==="par"?corpo.match(/^(?:§\s*\d+\s*[º°o]?(?:\s*-\s*[A-Z])?\.?|Parágrafo único\.?)/i):tp==="inc"?corpo.match(/^[IVXLC]+(?:-[A-Z])?\s*[-–—.]/):tp==="ali"?corpo.match(/^[a-z]\)/):null;
    const resto=cab?corpo.slice(cab[0].length):corpo;const morto=/^\s*\((?:VETAD|Vetad|Revogad|REVOGAD)/.test(resto);
    return `<p class="al al-${tp}${marcas[k]?" alvo":""}${morto?" morto":""}"${marcas[k]===1?' data-primeiro=""':""}>${cab?`<b>${esc(cab[0])}</b>`:""}${esc(resto)}${notas.map(n=>` <small class="al-nota">(${esc(n)})</small>`).join("")}</p>`}).join("")}
function artMarcas(linhas,arts){const m=new Array(linhas.length).fill(0);let prim=true;
  for(const c of arts)for(const p of c){const f=artFaixa(linhas,p);if(f)for(let k=f[0];k<f[1];k++){if(!m[k])m[k]=prim?1:2;prim=false}}
  return m}
function artCorpo(lei,a,varios){const T=artTxt(lei);const linhas=T&&T.arts[a.n];if(!linhas)return "";
  const marcas=artMarcas(linhas,[a.p]);const algum=marcas.some(Boolean);
  const nov=(T.nov&&T.nov[a.n])||[];
  return `<section class="art-um">${varios?`<h3 class="art-n">Art. ${esc(artNum(a.n))}</h3>`:""}
   ${T.cam&&T.cam[a.n]?`<p class="art-onde">${ic("livro")}<span><small>Onde fica</small>${esc(T.cam[a.n])}</span></p>`:""}
   <div class="art-texto">${artLinhasHtml(linhas,marcas)}</div>
   ${nov.map(x=>{const mk=algum?new Array(x.linhas.length).fill(0):artMarcas(x.linhas,[a.p]);
     return `<div class="art-nova"><p class="art-nova-t">${ic("leinova")}<span><b>Redação nova</b> da ${esc(x.lei)}${x.data?`, de ${artData(x.data)}`:""}, que o texto compilado ainda não trouxe:</span></p><div class="art-texto">${artLinhasHtml(x.linhas,mk)}</div></div>`}).join("")}
  </section>`}
function artFolha(lei,arts){const L=LEIS_IDX[lei];const nome=L.n||L.num;
  const ns=arts.map(a=>a.n),seguidos=ns.length>2&&ns.every((n,k)=>!k||+n===+ns[k-1]+1);
  const titulo=ns.length===1?`Art. ${artNum(ns[0])}`:seguidos?`Arts. ${artNum(ns[0])} a ${artNum(ns[ns.length-1])}`:`Arts. ${ns.slice(0,-1).map(artNum).join(", ")} e ${artNum(ns[ns.length-1])}`;
  const temAlvo=arts.some(a=>a.p.length);
  const quem=L.f?`Texto oficial compilado ${/^Câmara/.test(L.f)?"pela":"pelo"} ${esc(L.f)}${L.a?`, atualizado em ${artData(L.a)}`:""}.`:"";
  const num=L.num&&/\d/.test(L.num)&&!/^(Constituição|ADCT)/.test(L.num)&&L.n!==L.num?L.num:"";
  const notas=!(S.cfg&&S.cfg.artNotas===false);
  return `<div class="art-camada" id="art-camada"><div class="art-folha${notas?"":" sem-notas"}" role="dialog" aria-modal="true" aria-labelledby="art-tit" tabindex="-1">
  <div class="art-pega" aria-hidden="true"></div>
  <header class="art-cab"><span class="art-selo">${ic("balanca")}</span><div class="art-cab-t"><small>${esc(nome)}${num&&L.n?` · ${esc(num)}`:""}</small><h2 id="art-tit">${esc(titulo)}</h2></div>
   <button class="art-x" data-art="fechar" aria-label="Fechar">${ic("x")}</button></header>
  <div class="art-rola">
   ${temAlvo?`<p class="art-dica">${ic("lampada")}<span>O trecho citado está destacado. Leia o artigo inteiro: a pegadinha costuma morar no detalhe ao redor.</span></p>`:`<p class="art-dica">${ic("lampada")}<span>Leia com calma, em voz baixa: lei seca se aprende relendo.</span></p>`}
   ${arts.map(a=>artCorpo(lei,a,arts.length>1)).join("")}
   <div class="art-acoes"><button class="botao linha" data-art="copiar">${ic("copiar")}Copiar o texto</button><button class="botao linha" data-art="notas" aria-pressed="${notas}">${ic("info")}Notas de alteração</button></div>
   <p class="art-fonte">${quem} ${L.url?`<a href="${esc(L.url)}" target="_blank" rel="noopener">${ic("externo")}Ver a lei inteira no site oficial</a>`:""}</p>
  </div></div></div>`}
function artMostra(html,bt,lei,arts){artFechar(true);
  const box=document.createElement("div");box.innerHTML=html;const cam=box.firstElementChild;document.body.appendChild(cam);
  artAberto={lei,arts,volta:bt,tela:rota.tela};document.documentElement.classList.add("art-trava");
  const f=cam.querySelector(".art-folha");requestAnimationFrame(()=>{cam.classList.add("aberta");artRolaAlvo(cam);f.focus({preventScroll:true})});
  syncVoltar()}
function artRolaAlvo(cam){const alvo=cam.querySelector(".al.alvo[data-primeiro]");const rola=cam.querySelector(".art-rola");
  if(alvo&&rola&&alvo.offsetTop>rola.clientHeight*.6)rola.scrollTop=Math.max(0,alvo.offsetTop-rola.clientHeight*.3)}
/* folha sem o texto: abrindo (a lei está baixando) ou um aviso (sem internet, ou artigo que o app ainda não tem) */
function artFolhaAviso(lei,arts,tipo){const L=LEIS_IDX[lei];
  const titulo=arts.length===1?`Art. ${artNum(arts[0].n)}`:`Arts. ${arts.map(a=>artNum(a.n)).join(", ")}`;
  const corpo=tipo==="abrindo"?`<div class="art-abrindo" role="status"><span class="esq l1"></span><span class="esq l2"></span><span class="esq l3"></span><span class="sr">Abrindo o texto da lei…</span></div>`
    :`<div class="art-falta">${ilustra(tipo==="rede"?"rede":"livros")}<p><b>${tipo==="rede"?"Sem internet agora":"Este artigo ainda não está no app"}</b>${tipo==="rede"?"O texto desta lei ainda não foi guardado no aparelho. Conecte-se e toque de novo: depois de aberto uma vez, ele fica disponível sem internet.":"Você pode ler o texto oficial completo no site do governo."}</p></div>`;
  return `<div class="art-camada" id="art-camada"><div class="art-folha" role="dialog" aria-modal="true" aria-labelledby="art-tit" tabindex="-1" aria-busy="${tipo==="abrindo"}">
  <div class="art-pega" aria-hidden="true"></div>
  <header class="art-cab"><span class="art-selo">${ic("balanca")}</span><div class="art-cab-t"><small>${esc(L.n||L.num)}</small><h2 id="art-tit">${esc(titulo)}</h2></div>
   <button class="art-x" data-art="fechar" aria-label="Fechar">${ic("x")}</button></header>
  <div class="art-rola">${corpo}${tipo!=="abrindo"&&L.url?`<p class="art-fonte"><a href="${esc(L.url)}" target="_blank" rel="noopener">${ic("externo")}Ver a lei no site oficial</a></p>`:""}</div></div></div>`}
function artAbrir(bt){const lei=bt.dataset.lei;let arts;try{arts=JSON.parse(bt.dataset.arts)}catch(e){return}
  if(!window.LEIS_IDX||!LEIS_IDX[lei]||!arts.length)return;
  try{som("vira")}catch(e){}
  const pronto=T=>{const tem=T?arts.filter(a=>T.arts[a.n]):[];
    if(!tem.length){artMostra(artFolhaAviso(lei,arts,T?"falta":"rede"),bt,lei,arts);return}
    artMostra(artFolha(lei,tem),bt,lei,tem)};
  if(artTxt(lei)){pronto(artTxt(lei));return}
  artMostra(artFolhaAviso(lei,arts,"abrindo"),bt,lei,arts);
  artLei(lei).then(T=>{if(artAberto&&artAberto.volta===bt)pronto(T)})}
function artFechar(semVolta){const cam=$("#art-camada");if(!cam){artAberto=null;return}
  const volta=artAberto&&artAberto.volta;artAberto=null;document.documentElement.classList.remove("art-trava");
  if(document.documentElement.dataset.anim==="on"&&!semVolta){cam.classList.remove("aberta");cam.classList.add("saindo");setTimeout(()=>cam.remove(),220)}else cam.remove();
  if(!semVolta){if(volta&&volta.isConnected)try{volta.focus({preventScroll:true})}catch(e){}syncVoltar()}}
function artCopiar(bt){if(!artAberto)return;const T=artTxt(artAberto.lei),L=LEIS_IDX[artAberto.lei];
  const txt=artAberto.arts.map(a=>(T.arts[a.n]||[]).map(l=>artSepara(l)[0]).join("\n")).join("\n\n")+`\n\n(${L.n||L.num}${L.n&&L.num&&L.n!==L.num?", "+L.num:""})`;
  const ok=()=>{bt.classList.add("feito");const t0=bt.innerHTML;bt.innerHTML=`${ic("ok")}Copiado`;setTimeout(()=>{if(bt.isConnected){bt.innerHTML=t0;bt.classList.remove("feito")}},1600)};
  try{navigator.clipboard.writeText(txt).then(ok,()=>{})}catch(e){}}
document.addEventListener("click",e=>{
  const l=e.target.closest&&e.target.closest(".art-link");
  if(l){e.preventDefault();e.stopPropagation();artAbrir(l);return}
  const cam=e.target.closest&&e.target.closest("#art-camada");if(!cam)return;
  e.stopPropagation();
  const b=e.target.closest("[data-art]");const a=b&&b.dataset.art;
  if(a==="fechar"||e.target===cam){artFechar();return}
  if(a==="copiar"){artCopiar(b);return}
  if(a==="notas"){S.cfg=S.cfg||{};S.cfg.artNotas=b.getAttribute("aria-pressed")!=="true"?true:false;salvar();b.setAttribute("aria-pressed",String(S.cfg.artNotas));cam.querySelector(".art-folha").classList.toggle("sem-notas",!S.cfg.artNotas);return}
},true);
document.addEventListener("keydown",e=>{if(!artAberto)return;const cam=$("#art-camada");if(!cam)return;
  if(e.key==="Escape"){e.preventDefault();e.stopPropagation();artFechar();return}
  if(e.key==="Tab"){const f=[...cam.querySelectorAll("button,a[href],[tabindex='-1']")].filter(x=>x.offsetParent!==null||x.classList.contains("art-folha"));if(!f.length)return;
    const p=f[0],u=f[f.length-1];if(e.shiftKey&&(document.activeElement===p||document.activeElement===cam.querySelector(".art-folha"))){e.preventDefault();u.focus()}else if(!e.shiftKey&&document.activeElement===u){e.preventDefault();p.focus()}}},true);
/* voltar do celular fecha a folha antes de sair da tela */
{const p0=podeVoltar;podeVoltar=function(){return !!artAberto||p0()}}
{const v0=voltarSistema;voltarSistema=function(){if(artAberto){artFechar();return}return v0()}}
/* trocar de tela (por um lembrete, por exemplo) fecha a folha; redesenhar a mesma tela não */
{const r0=render;render=function(){const x=r0.apply(this,arguments);if(artAberto&&rota.tela!==artAberto.tela)artFechar(true);return x}}
