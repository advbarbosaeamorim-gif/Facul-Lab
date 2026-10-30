"use strict";
/* ---------- lei seca ---------- */
const LS=(window.LEISECA||[]).filter(x=>x&&x.t&&Array.isArray(x.l)&&x.l.length===4&&x.t.indexOf(x.l[0])>=0&&META[x.m]);
const LSMAP={};LS.forEach(x=>LSMAP[x.id]=x);
let lsSess=null;
function lsMats(){return [...new Set(LS.map(x=>x.m))]}
function lsFiltro(){const f=rota.lsm||"todas";return f==="todas"?LS:LS.filter(x=>x.m===f)}
function lsSt(id){return (S.ls||{})[id]}
function lsDominado(id){const x=lsSt(id);return !!(x&&x.u===1&&x.a>=2)}
function telaLeiSeca(){const L=lsFiltro();const f=rota.lsm||"todas";const dom=L.filter(x=>lsDominado(x.id)).length;const err=L.filter(x=>{const z=lsSt(x.id);return z&&z.u===0}).length;
 const chips=`<div class="chips" role="group" aria-label="Filtrar por matéria"><button data-acao="ls-filtro" data-v="todas" aria-pressed="${f==="todas"}">Todas</button>${lsMats().map(m=>`<button data-acao="ls-filtro" data-v="${m}" aria-pressed="${f===m}">${esc(nomeCurto(META[m].nome))}</button>`).join("")}</div>`;
 return topo("Lei seca",`${L.length} dispositivos · ${dom} dominados`,{menu:true,extra:chips})+
 `<main class="wrap">${capaTela("pergaminho","A letra da lei","A FGV cobra o texto literal. Treine os artigos que mais caem.")}<div class="dica"><p style="margin:0">Treine o texto literal dos artigos mais cobrados. Em <b>Complete o artigo</b>, escolha o trecho que falta. Em <b>Certo ou errado</b>, diga se o texto mostrado é o da lei ou uma versão alterada, como a banca costuma fazer. O dispositivo conta como dominado depois de dois acertos seguidos.</p></div>
 <div class="botoes" style="margin-top:14px;display:grid;gap:10px">
  <button class="botao cheio" data-acao="ls-iniciar" data-modo="lac">Complete o artigo</button>
  <button class="botao linha" data-acao="ls-iniciar" data-modo="ce">Certo ou errado</button>
  ${err?`<button class="botao linha" data-acao="ls-iniciar" data-modo="err">Refazer os que errei (${err})</button>`:""}
 </div>
 <h2 style="margin:22px 2px 8px;font-size:1rem;font-family:var(--f-display)">Texto dos dispositivos</h2>
 <div class="alts ls-lista">${L.map(x=>{const z=lsSt(x.id);const st=lsDominado(x.id)?"dominado":z?(z.u?"acertou a última":"errou a última"):"não treinado";
  return `<details><summary><span>${esc(x.ref)}</span><small>${st}</small></summary><p>${esc(x.t)}</p></details>`}).join("")}</div>
 <p class="ls-ref" style="text-align:center;margin-top:14px">Textos conferidos com a legislação compilada do Planalto.</p></main>`}
function lsIniciar(modo){let L=lsFiltro();
 if(modo==="err")L=L.filter(x=>{const z=lsSt(x.id);return z&&z.u===0});
 else L=emb(L).sort((a,b)=>(lsDominado(a.id)?1:0)-(lsDominado(b.id)?1:0));
 L=L.slice(0,10);if(!L.length)return;
 const itens=L.map(x=>{const m=modo==="err"?(Math.random()<.5?"lac":"ce"):modo;return {id:x.id,modo:m,ord:emb([0,1,2,3]),certo:Math.random()<.5}});
 lsSess={itens,i:0,resp:{},ok:0};ir({tela:"ls-quiz"})}
function lsTextoLacuna(x,mostrar){const k=x.t.indexOf(x.l[0]);const a=esc(x.t.slice(0,k)),b=esc(x.t.slice(k+x.l[0].length));
 return a+(mostrar?`<span class="ls-marca">${esc(x.l[0])}</span>`:`<span class="ls-lac" aria-label="lacuna">${"_".repeat(10)}</span>`)+b}
function telaLsQuiz(){const s=lsSess;if(!s){rota={tela:"leiseca"};return telaLeiSeca()}
 if(s.i>=s.itens.length)return telaLsFim();
 const it=s.itens[s.i],x=LSMAP[it.id];if(!x){s.i++;return telaLsQuiz()}
 const r=s.resp[s.i],resp=r!==undefined;const M=META[x.m];
 const cab=`<div class="q-cab"><div class="q-mat">${tile(M.cor,M.ic)}<b>${esc(M.nome)}</b><span>· ${it.modo==="lac"?"Complete o artigo":"Certo ou errado"}</span></div>`;
 let corpo="";
 if(it.modo==="lac"){
  corpo=cab+`<p class="ls-texto">${lsTextoLacuna(x,resp)}</p><p class="ls-ref">${esc(x.ref)}</p></div>
  <div class="alts" role="radiogroup" aria-label="Trechos">${it.ord.map((oi,pos)=>{let c="";if(resp){if(oi===0)c="certa";else if(oi===r)c="errada"}
   return `<button class="alt ${c}" role="radio" aria-checked="${oi===r}" data-acao="ls-resp" data-v="${oi}" ${resp?"disabled":""}><span class="letra">${LETRAS[pos]}</span><span>${esc(x.l[oi])}</span></button>`}).join("")}</div>`;
  if(resp)corpo+=`<div class="coment ${r===0?"":"err"}"><h3>${r===0?"Resposta correta":"Resposta incorreta"}</h3><p>O texto da lei diz: <b>${esc(x.l[0])}</b>.</p>${x.ex?`<p>${esc(x.ex)}</p>`:""}<p class="fund">${esc(x.ref)}</p></div>`}
 else{const mostrado=it.certo?x.t:x.e;const acertou=resp&&((r===1)===it.certo);
  corpo=cab+`<p class="ls-texto">“${esc(mostrado)}”</p><p class="ls-ref">${esc(x.ref)}</p></div>
  <p style="margin:14px 2px 0;font-weight:600">Este é o texto da lei?</p>
  <div class="ls-ce"><button class="botao linha ${resp?(it.certo?"certa":r===1?"errada":""):""}" data-acao="ls-resp" data-v="1" ${resp?"disabled":""}>Certo</button><button class="botao linha ${resp?(!it.certo?"certa":r===0?"errada":""):""}" data-acao="ls-resp" data-v="0" ${resp?"disabled":""}>Errado</button></div>`;
  if(resp)corpo+=`<div class="coment ${acertou?"":"err"}"><h3>${acertou?"Resposta correta":"Resposta incorreta"} · ${it.certo?"o texto estava certo":"o texto estava alterado"}</h3>${it.certo?"":`<p>${esc(x.ex||"")}</p><p><b>Texto da lei:</b> ${esc(x.t)}</p>`}<p class="fund">${esc(x.ref)}</p></div>`}
 const ult=s.i===s.itens.length-1;
 return topo(`Lei seca · ${s.i+1} de ${s.itens.length}`,"",{voltarAcao:"ls-sair"})+`<main class="wrap">${corpo}</main>
 <nav class="nav"><div class="nav-in"><button data-acao="ls-sair">${ic("ant")}<span>Sair</span></button><span></span><button data-acao="ls-prox" class="forte" ${resp?"":"disabled"}>${ic("prox")}<span>${ult?"Ver resultado":"Próximo"}</span></button></div></nav>`}
function telaLsFim(){const s=lsSess,n=s.itens.length;
 const lista=s.itens.map((it,k)=>{const x=LSMAP[it.id];if(!x)return "";const r=s.resp[k];const ok=it.modo==="lac"?r===0:((r===1)===it.certo);
  return `<details><summary><span>${esc(x.ref)}</span><small class="${ok?"c-ok":"c-er"}">${ok?"acertou":"errou"}</small></summary><p>${esc(x.t)}</p></details>`}).join("");
 return topo("Resultado · lei seca","",{voltarAcao:"ls-sair"})+`<main class="wrap"><div class="q-cab" style="text-align:center"><p class="q-enun" style="font-size:1.6rem"><b>${s.ok} de ${n}</b></p><p class="ls-ref" style="margin-top:4px">acertos nesta rodada</p></div>
 <div class="alts ls-lista" style="margin-top:14px">${lista}</div>
 <div style="display:grid;gap:10px;margin-top:14px"><button class="botao cheio" data-acao="ls-sair">Voltar à lei seca</button></div></main>`}
function lsResponder(v){const s=lsSess;if(!s||s.resp[s.i]!==undefined)return;const it=s.itens[s.i];const ok=it.modo==="lac"?v===0:((v===1)===it.certo);
 s.resp[s.i]=v;if(ok)s.ok++;S.ls=S.ls||{};const z=S.ls[it.id]=S.ls[it.id]||{a:0,e:0,u:0};
 if(ok){z.a=z.u===1?z.a+1:1;z.u=1}else{z.e=(z.e||0)+1;z.a=0;z.u=0}z.d=Date.now();
 marcarDia("q");salvar();rota.manterScroll=true;render();som(ok?"acerto":"erro")}

/* ---------- gaveta ---------- */
function telaGaveta(){
  const it=(t,n,l)=>`<button data-acao="ir-raiz" data-tela="${t}"${rota.tela===t?' aria-current="page"':""}>${ic(n)}<span>${l}</span></button>`;
  return `<div class="camada" data-acao="fechar-gaveta"><aside class="gaveta" role="dialog" aria-modal="true" aria-label="Menu">
   <div class="gaveta-topo"><span class="marca" aria-hidden="true">${ic("balanca")}</span><b>Facul Lab</b><small>${QS.length.toLocaleString("pt-BR")} questões · faculdade e Exame de Ordem</small></div>
   <nav aria-label="Seções do app">${it("hoje","alvo","Hoje"+(itensHoje()?` <span class="badge">${itensHoje()}</span>`:""))}${it("revisao","refazer","Revisão espaçada")}${it("metas","barras","Metas e desempenho")}${it("semanal","calendario","Resumo da semana")}${it("progresso","pct","Progresso geral")}${it("busca","lupa","Buscar em tudo")}
   <p class="nav-grupo">Estudar</p>${it("faculdade","livro","Faculdade (1º ao 10º)")}${it("cartoes","cartas","Cartões de memorização")}${it("foco","tomate","Modo foco (Pomodoro)")}${it("leiseca","recibo","Lei seca")}${it("favs","marcador","Favoritos e anotações")}
   <p class="nav-grupo">Treinar</p>${it("oab","carro","Simulados OAB")}${it("materias","grade","Simulados por matéria")}${it("mprova","relogio","Modo prova (N1 e N2)")}
   ${it("caderno","caderno","Caderno de erros"+(cadPendentes()?` <span class="badge">${cadPendentes()}</span>`:""))}
   <hr>${it("config","eng","Configurações")}${it("backup","arquivo","Backup do progresso")}${it("reportes","exc","Questões reportadas"+(nRep()?` (${nRep()})`:""))}<button data-acao="tour">${ic("estrela")}<span>Tour pelo app</span></button>${it("sobre","info","Como funciona")}${it("quem","coracao","Sobre o Facul Lab")}</nav></aside></div>`}

/* ---------- OAB ---------- */
function telaOab(){
  const aba=rota.aba||"progresso";
  const extra=`<div class="abas" role="tablist"><button role="tab" aria-selected="${aba==="progresso"}" data-acao="aba" data-aba="progresso">Progresso</button><button role="tab" aria-selected="${aba==="historico"}" data-acao="aba" data-aba="historico">Histórico</button></div>`;
  return topo("Simulado OAB","1ª fase · 30 simulados de 80 questões",{menu:true,extra})+
   `<main class="wrap">${capaTela("balanca","Rumo à aprovação","30 simulados com a distribuição da 1ª fase. A meta é acertar 40 de 80.")}${aba==="progresso"?blocoProgresso():blocoHistorico()}<p class="sinc">${esc(statusSinc)}</p></main>
   <button class="fab" data-acao="proximo" aria-label="Iniciar próximo simulado">${ic("mais")}</button>`}
function concluidosOab(){const l=[];for(let k=0;k<N_SIM;k++){const a=S.hist.find(x=>x.key==="oab:"+k&&x.status==="concluido");if(a)l.push(a)}return l}
function blocoProgresso(){
  const c=concluidosOab();let ok=0,er=0;c.forEach(a=>{const r=res(a);ok+=r.ok;er+=r.er+r.br});
  const media=c.length?Math.round(c.reduce((s,a)=>s+res(a).pct,0)/c.length):0;
  const tm=c.length?c.reduce((s,a)=>s+a.tempo,0)/c.length:0;
  const tot=ok+er;
  const nh=itensHoje(),sq=sequencia();
  return `${true?`<button class="card hoje-card" data-acao="ir-raiz" data-tela="hoje">${tile("var(--lacre)","alvo")}<b>${nh?`Revisar hoje: ${nh} ${nh>1?"itens":"item"}`:"Plano de hoje"}</b><small>${perAtual()!==null?esc(nomePer(perAtual()))+" · ":""}${sq?`${sq} dia${sq>1?"s":""} seguido${sq>1?"s":""} de estudo · `:""}${esc(textoProva())}</small></button>`:""}<div class="metrica" style="margin-top:6px">${tile("var(--toga)","pct")}<div><div class="top"><span>Nota média</span><b>${c.length?media+"%":"—"}</b></div><div class="trilho"><i class="f-toga" style="width:${media}%;background:var(--ok)"></i></div></div></div>
  <div class="metrica">${tile("var(--lacre)","relogio")}<div><div class="top"><span>Tempo médio</span><b>${c.length?dur(tm):"—"}</b></div><div class="trilho"><i class="f-lacre" style="width:${Math.min(100,tm*100/(5*3600))}%"></i></div></div></div>
  <div class="secao" role="heading" aria-level="2">Progresso geral</div>
  <div class="metrica">${tile("var(--toga)","barras")}<div><div class="top"><span>${c.length} de ${N_SIM}</span>${contagem({ok,er,br:0}).replace(/<span class="c-br"[\s\S]*?<\/span><\/span>(?=<\/span>$)/,"")}</div>
   <div class="trilho"><i class="f-ok" style="width:${c.length*100/N_SIM*(tot?ok/tot:0)}%"></i><i class="f-er" style="width:${c.length*100/N_SIM*(tot?er/tot:0)}%"></i></div></div></div>
  <div class="secao" role="heading" aria-level="2">% acertos por assunto</div>
  <div class="assuntos">${OAB.map(m=>{const ids=porM[m]||[];let o=0,e=0;ids.forEach(id=>{const s=S.stats[id];if(s){if(s.u)o++;else e++}});const v=o+e;const pct=v?Math.round(o*100/v):null;
    return `<button class="assunto" data-acao="materia" data-m="${m}">${tile(META[m].cor,META[m].ic)}<span class="barra${v?" tem":""}">${v?`<i class="ok" style="width:${pct}%"></i><i class="er" style="width:${100-pct}%"></i>`:""}<span><b>${esc(META[m].nome)}</b><em>${v?pct+"%":"—"}</em></span></span></button>`}).join("")}</div>`}
function blocoHistorico(){
  const ks=[];for(let k=0;k<N_SIM;k++)ks.push("oab:"+k);
  const ord=ks.map((k,i)=>({k,i,e:estado(k)})).sort((x,y)=>{const pr={pausa:0,aprov:1,reprov:1,perf:1,nao:2};return pr[x.e.st]-pr[y.e.st]||((y.e.a&&y.e.a.inicio)||0)-((x.e.a&&x.e.a.inicio)||0)||x.i-y.i});
  return `<div class="lista" style="margin-top:4px">${ord.map(o=>itemSim(o.k)).join("")}</div>`}

/* ---------- matérias ---------- */
function statMat(ids){let o=0,e=0;ids.forEach(id=>{const s=S.stats[id];if(s){if(s.u)o++;else e++}});return {o,e,v:o+e,n:ids.length}}
/* ---------- desempenho por assunto ---------- */
const GA={};Object.keys(window.GRUPOS_ASS||{}).forEach(m=>{GA[m]={};window.GRUPOS_ASS[m].split("\n").forEach(l=>{const k=l.indexOf(":");if(k<0)return;const g=l.slice(0,k).trim();l.slice(k+1).split(";").forEach(a=>{a=a.trim();if(a)GA[m][a]=g})})});
const grupoDe=q=>(GA[q.m]&&GA[q.m][q.a])||q.a;
const idsEscopo=sc=>porM[sc]||(DISC[sc]?idsDisc(sc):[]);
const nomeEscopo=sc=>META[sc]?META[sc].nome:infoDisc(sc).nome;
function statAss(sc){const g={};idsEscopo(sc).forEach(id=>{const q=QMAP[id];if(!q)return;const k=grupoDe(q);const x=g[k]=g[k]||{a:k,o:0,e:0,n:0};x.n++;const s=S.stats[id];if(s){if(s.u)x.o++;else x.e++}});
 return Object.values(g).map(x=>{x.v=x.o+x.e;x.pct=x.v?Math.round(x.o*100/x.v):null;return x})}
const ehFraco=x=>x.v>=3&&x.pct<70;
function fracos(sc){return statAss(sc).filter(ehFraco).sort((a,b)=>a.pct-b.pct||b.v-a.v)}
function assuntoMaisFraco(scs){let b=null;scs.forEach(sc=>fracos(sc).forEach(x=>{if(!b||x.pct<b.pct||(x.pct===b.pct&&x.v>b.v))b=Object.assign({sc},x)}));return b}
function chaveAss(sc,a){return `ass:${sc}:${encodeURIComponent(a)}`}
function itemAss(sc,x,comNome){return `<button class="item ass" data-acao="treinar-ass" data-sc="${sc}" data-a="${esc(encodeURIComponent(x.a))}"><span class="ass-l"><span class="item-tit">${esc(x.a)}</span>${comNome?`<span class="item-sub">${esc(nomeCurto(nomeEscopo(sc)))}</span>`:""}<span class="trilho"><i class="f-ok" style="width:${x.o*100/x.n}%"></i><i class="f-er" style="width:${x.e*100/x.n}%"></i></span><span class="item-sub">${x.n} questõ${x.n>1?"es":"ão"} · ${x.v?`${x.pct}% de acerto em ${x.v} respondida${x.v>1?"s":""}`:"nenhuma respondida"}</span></span><span class="item-data">${ehFraco(x)?`<span class="tag-fraco">Ponto fraco</span>`:""}${ic("prox")}</span></button>`}
function secaoAss(sc){const L=statAss(sc).sort((a,b)=>(a.pct===null)-(b.pct===null)||(a.pct||0)-(b.pct||0)||b.n-a.n);const feitos=L.filter(x=>x.v).length;
 return `<div class="secao" role="heading" aria-level="2">Desempenho por assunto</div><p class="nota" style="margin-top:0">${feitos?"Do assunto em que você mais erra para o que mais acerta. Toque em um assunto para treinar só as questões dele.":"Responda algumas questões para ver em quais assuntos você acerta mais e menos. Você também pode treinar um assunto específico agora."}</p>
 <div class="lista">${L.map(x=>itemAss(sc,x)).join("")}</div>`}

/* ---------- reportar erro ---------- */
let repQ=null,repMot="";
const MOTIVOS=["Gabarito errado","Lei ou jurisprudência desatualizada","Enunciado ou alternativa confusa","Outro problema"];
const nRep=()=>Object.keys(S.rep||{}).filter(k=>QMAP[k]).length;
const botaoRep=q=>`<button class="link-rep" data-acao="reportar" data-q="${q.id}">${ic("exc")}${S.rep&&S.rep[q.id]?"Erro reportado · editar aviso":"Reportar erro nesta questão"}</button>`;
function telaRep(){const q=QMAP[repQ];if(!q)return "";const r=(S.rep||{})[repQ]||{};const mot=repMot||r.m||"";
 return `<div class="folha-camada" data-acao="fechar-rep"><div class="folha wrap" role="dialog" aria-label="Reportar erro">
  <h2>Reportar erro na questão</h2><p class="nota">${esc(META[q.m].nome)} · ${esc(q.a)} · código ${esc(q.id)}</p>
  <p class="rep-enun">${esc(q.q)}</p>
  <div class="opcoes col">${MOTIVOS.map(o=>`<button data-acao="rep-mot" data-v="${esc(o)}" aria-pressed="${o===mot}">${o}</button>`).join("")}</div>
  <label class="campo" style="margin-top:12px"><span>O que está errado? (opcional)</span><textarea id="rep-txt" rows="3" placeholder="Ex.: o prazo mudou com uma lei nova; a alternativa B também está certa">${esc(r.t||"")}</textarea></label>
  <div class="botoes">${r.d?`<button class="botao linha" data-acao="rep-tirar">Retirar o aviso</button>`:`<button class="botao linha" data-acao="rep-fechar">Cancelar</button>`}<button class="botao cheio" data-acao="rep-enviar" id="rep-ok" ${mot?"":"disabled"}>Salvar aviso</button></div>
 </div></div>`}
function textoReportes(){const ks=Object.keys(S.rep||{}).filter(k=>QMAP[k]).sort((a,b)=>S.rep[b].d-S.rep[a].d);
 return "Questões reportadas no Simulado OAB\n\n"+ks.map(k=>{const q=QMAP[k],r=S.rep[k];return `[${k}] ${META[q.m].nome} · ${q.a}\n${q.q}\nGabarito do app: ${q.o[0]}\nMotivo: ${r.m}${r.t?`\nObservação: ${r.t}`:""}`}).join("\n\n")}
function telaReportes(){const ks=Object.keys(S.rep||{}).filter(k=>QMAP[k]).sort((a,b)=>S.rep[b].d-S.rep[a].d);
 return topo("Questões reportadas",ks.length?`${ks.length} aviso${ks.length>1?"s":""}`:"Nenhum aviso",{menu:true})+
 `<main class="wrap">${ks.length?`<div class="dica"><p style="margin:0">Para corrigir, toque em <b>Copiar a lista</b> e cole na conversa com o Claude. Os avisos também ficam salvos na sua conta.</p></div>
 <div class="botoes"><button class="botao cheio" data-acao="copiar-rep">Copiar a lista</button></div>
 <div class="lista" style="margin-top:14px">${ks.map(k=>{const q=QMAP[k],r=S.rep[k];const M=META[q.m];
  return `<button class="item" data-acao="reportar" data-q="${k}">${tile(M.cor,M.ic)}<span style="min-width:0"><span class="item-tit">${esc(r.m)}</span><br><span class="item-sub">${esc(M.nome)} · ${esc(q.a)} · ${esc(k)}</span><span class="rep-q">${esc(q.q)}</span>${r.t?`<span class="rep-t">“${esc(r.t)}”</span>`:""}</span><span class="item-data">${ic("prox")}</span></button>`}).join("")}</div>`
 :vazio("checklist","Nenhuma questão reportada","Na correção de cada questão há o botão <b>Reportar erro nesta questão</b>. Use quando desconfiar de um gabarito ou de uma lei desatualizada: o aviso fica guardado aqui para você enviar depois.")}</main>`}

/* ---------- explicação de cada alternativa ---------- */
const explQ=q=>{const x=q.x||(window.EXPL&&window.EXPL[q.id]);return Array.isArray(x)&&x.length>=3?x:null};
function porQue(q,r,ord){const X=explQ(q);if(!X)return "";
 return `<div class="porque"><p class="porque-t">Por que as outras alternativas estão erradas</p>${ord.map((oi,p)=>oi===0?"":`<p class="${oi===r?"sua":""}"><b>${LETRAS[p]})</b> ${esc(X[oi-1])}${oi===r?` <span class="c-er">(sua resposta)</span>`:""}</p>`).join("")}</div>`}
function cardMat(id,acao,attr,nome,cor,icn,ids){const s=statMat(ids);
  return `<button class="card" data-acao="${acao}" ${attr}>${tile(cor,icn)}<b>${esc(nome)}</b><small>${ids.length} questões · ${s.v?Math.round(s.o*100/s.v)+"% de acerto":"não iniciado"}</small>
   <span class="trilho"><i class="f-ok" style="width:${s.o*100/(s.n||1)}%"></i><i class="f-er" style="width:${s.e*100/(s.n||1)}%"></i></span></button>`}
function telaMaterias(){
  return topo("Simulados por matéria","Escolha uma disciplina da OAB",{menu:true})+
  `<main class="wrap">${capaTela("alvo","Treine por matéria","Foque nas disciplinas em que você mais erra.")}<div class="grade-mat">${OAB.map(m=>cardMat(m,"materia",`data-m="${m}"`,META[m].nome,META[m].cor,META[m].ic,porM[m]||[])).join("")}</div><p class="sinc">${esc(statusSinc)}</p></main>`}
function telaMateria(){const m=rota.m,M=META[m];const n=nMat(m);const ks=[];for(let i=0;i<n;i++)ks.push(`mat:${m}:${i}`);
  return topo(M.nome,`${(porM[m]||[]).length} questões`,{})+
  `<main class="wrap"><div class="cabeca">${tile(M.cor,M.ic)}<div><h2>${esc(M.nome)}</h2><p class="nota">Na prova, caem ${(DIST.find(d=>d[0]===m)||[0,0])[1]} questões desta matéria.</p></div></div>
  <div class="secao" role="heading" aria-level="2">Simulados</div><div class="lista">${ks.map(k=>itemSim(k)).join("")}</div>
  <div class="secao" role="heading" aria-level="2">Treino livre</div><div class="lista">${itemSim("mtodas:"+m)}</div>${secaoAss(m)}</main>`}

/* ---------- faculdade ---------- */
function telaFaculdade(){
  const extra=`<div class="periodos" role="group" aria-label="Período">${PERIODOS.map((_,i)=>`<button data-acao="periodo" data-p="${i}" aria-pressed="${periodo===i}">${i+1}º período</button>`).join("")}</div>`;
  const ds=PERIODOS[periodo];
  return topo("Faculdade","Simulados do 1º ao 10º período",{menu:true,extra})+
  `<main class="wrap">${capaTela("capelo",`${periodo+1}º período`,"Apostila, resumo, cartões e simulados de cada disciplina.")}<div class="secao" role="heading" aria-level="2">Apostila do período</div>
  <button class="card apost" data-acao="ap" data-p="${periodo}">${tile("var(--toga)","livro")}<b>Apostila do ${periodo+1}º período</b><small>Explicação de todas as matérias, com técnicas de memorização, ilustrações e mapas mentais</small></button>
  <button class="card resumo" data-acao="resumo" data-p="${periodo}" style="margin-top:10px">${tile("var(--lacre)","recibo")}<b>Resumo do ${periodo+1}º período</b><small>Versão curta com todas as matérias juntas em um só arquivo</small></button>
  ${cardModoProva({p:periodo})}
  ${ds.length>1?`<div class="secao" role="heading" aria-level="2">Simulado do período</div>
  <button class="card destaque" data-acao="per" data-p="${periodo}">${tile("var(--lacre)","alvo")}<b>Simulado do ${periodo+1}º período</b><small>${idsPer(periodo).length} questões de ${ds.length} disciplinas · ${nPer(periodo)} simulado${nPer(periodo)>1?"s":""} de cerca de ${TAM_PER}</small>${(()=>{const s=statMat(idsPer(periodo));return `<span class="trilho"><i class="f-ok" style="width:${s.o*100/(s.n||1)}%"></i><i class="f-er" style="width:${s.e*100/(s.n||1)}%"></i></span>`})()}</button>`:""}
  <div class="secao" role="heading" aria-level="2">${periodo+1}º período · ${ds.length} disciplina${ds.length>1?"s":""}</div>
  <div class="grade-mat">${ds.map(d=>{const f=infoDisc(d);return cardMat(d,"disc",`data-d="${d}"`,f.nome,f.cor,f.ic,idsDisc(d))}).join("")}</div>
  <p class="nota" style="margin-top:16px">A grade segue a ordem mais comum dos cursos de Direito. Se a sua for diferente, as disciplinas continuam todas aqui, só mudam de período.</p></main>`}
function telaPeriodo(){const i=rota.p;const n=nPer(i);const ks=[];for(let k=0;k<n;k++)ks.push(`per:${i}:${k}`);
  const nomes=PERIODOS[i].map(d=>infoDisc(d).nome);
  return topo(`Simulado do ${i+1}º período`,`${idsPer(i).length} questões`,{})+
  `<main class="wrap"><div class="cabeca">${tile("var(--lacre)","alvo")}<div><h2>Simulado do ${i+1}º período</h2><p class="nota">Mistura ${esc(nomes.join(", "))}.</p></div></div>
  ${n>1?`<p class="nota" style="margin-top:14px">Os simulados vão do mais simples ao mais difícil. Faça na ordem: cada um prepara para o seguinte.</p>${escada()}`:""}
  <div class="secao" role="heading" aria-level="2">Simulados</div><div class="lista">${ks.map(k=>itemSim(k)).join("")}</div>
  ${n>1?`<div class="secao" role="heading" aria-level="2">Treino livre</div><div class="lista">${itemSim("ptodas:"+i)}</div>`:""}</main>`}
function telaDisc(){const d=rota.d,f=infoDisc(d);const n=nFac(d);const ks=[];for(let i=0;i<n;i++)ks.push(`fac:${d}:${i}`);
  return topo(f.nome,`${idsDisc(d).length} questões`,{})+
  `<main class="wrap"><div class="cabeca">${tile(f.cor,f.ic)}<div><h2>${esc(f.nome)}</h2><p class="nota">${idsDisc(d).length} questões · ${n} simulado${n>1?"s":""} de cerca de ${TAM_FAC} questões</p></div></div>
  ${temAp(d)?`<button class="btn-ap" data-acao="ler" data-d="${d}">${tile("var(--toga)","livro")}<span><b>Ler a apostila desta matéria</b><small>Teoria explicada, técnicas de memorização e mapa mental</small></span></button>`:""}
  ${cardModoProva({d})}
  ${n>1?`<p class="nota" style="margin-top:14px">Os simulados vão do mais simples ao mais difícil. Faça na ordem: cada um prepara para o seguinte.</p>${escada()}`:""}
  <div class="secao" role="heading" aria-level="2">Simulados</div><div class="lista">${ks.map(k=>itemSim(k)).join("")}</div>
  ${n>1?`<div class="secao" role="heading" aria-level="2">Treino livre</div><div class="lista">${itemSim("ftodas:"+d)}</div>`:""}${secaoAss(d)}</main>`}

/* ---------- configurar simulado ---------- */
function telaPre(){if(/^faixa:/.test(rota.key||"")){const d=rota.key.split(":")[1];if(!temOk(d)){apDaProva(d);return topo("Configurar simulado","Carregando os temas da apostila",{})+`<main class="wrap"><p class="nota">Carregando…</p></main>`}}
  const s=sim(rota.key);const e=estado(rota.key);
  const n=s.qids.length;
  const NI=s.nivel?NIVEL_INFO[s.nivel-1]:null;
  return topo("Configurar simulado",s.titulo+" · "+s.sub,{})+
  `<main class="wrap"><div class="cartao">
    ${NI?`<div class="box-nivel" style="--c:var(--nv${s.nivel})">${chipNivel(s.nivel)}<p>${esc(NI.dica)}</p></div>`:""}
    <div class="info"><div><strong>${n}</strong><small>questões</small></div><div><strong>${s.limite?dur(s.limite):"Livre"}</strong><small>${s.limite?"de prova":"sem cronômetro"}</small></div><div><strong>50%</strong><small>para aprovação</small></div></div>
    <div class="chave"><p><b>Correção no final ${S.cfg.corrFinal?"ligada":"desligada"}</b><small>${S.cfg.corrFinal?"A correção de cada questão será exibida ao final do simulado":"A correção aparece logo depois de cada resposta"}</small></p>
      <label class="switch"><input type="checkbox" id="corrFinal" ${S.cfg.corrFinal?"checked":""} aria-label="Correção no final"><span></span></label></div>
    <p class="nota">A ordem das alternativas muda a cada tentativa.${s.fixa?" As questões seguem a ordem das matérias na prova.":s.rampa?" As questões começam pelas mais simples e vão ficando mais difíceis; cada correção traz o comentário e o fundamento legal.":" A ordem das questões também muda."}</p>${invAvisoPre(s)}
  </div>
  <div class="botoes">${e.st==="pausa"?`<button class="botao linha" data-acao="comecar">Refazer simulado</button><button class="botao cheio" data-acao="continuar">Continuar onde parei</button>`
    :`${e.a?`<button class="botao linha" data-acao="ver-ultima">Ver última correção</button>`:""}<button class="botao cheio" data-acao="comecar">${e.a?"Refazer simulado":"Iniciar simulado"}</button>`}</div></main>`}
function comecar(key){const s=sim(key);if(!s||!s.qids.length)return;
  const qids=s.fixa?s.qids.slice():s.rampa?rampa(s.qids):emb(s.qids);const ordem={};qids.forEach(id=>ordem[id]=emb([0,1,2,3]));
  S.hist.forEach(a=>{if(a.key===key&&a.status==="pausado"){a.status="descartado"}});
  S.hist=S.hist.filter(a=>a.status!=="descartado");
  sessao={id:"a"+Date.now(),key,titulo:s.titulo,sub:s.sub,inicio:Date.now(),status:"pausado",qids,ordem,resp:{},tempo:0,limite:s.limite,corrFinal:!!S.cfg.corrFinal,pos:0,inv:s.tipo==="err"?invMonta(qids):undefined};
  S.hist.unshift(sessao);if(S.hist.length>200)S.hist.length=200;idx=0;folha=false;confirmar=null;salvar();ir({tela:"quiz"})}

/* ---------- prova ---------- */
function responderQ(o){const s=sessao,id=s.qids[idx];if(!s.corrFinal&&s.resp[id]!==undefined)return;
  if(s.resp[id]===undefined)marcarDia("q");s.resp[id]=o;if(!s.corrFinal)registrar(id,o===0,o>0&&invDe(s,id)?"inv":o);s.pos=idx;salvar();rota.manterScroll=true;render();if(!s.corrFinal){efeitoResposta(o===0);som(o===0?"acerto":"erro")}else{efeitoResposta(null);som("toque")}}
function telaQuiz(){const s=sessao,id=s.qids[idx],q=QMAP[id];
  if(!q){return topo("Questão indisponível","",{voltarAcao:"pausar"})+`<main class="wrap">${vazio("carimbo","Questão retirada do banco","Ela foi removida depois de uma revisão. Passe para a próxima: a sua nota considera só as questões disponíveis.")}</main>`+navQuiz()}
  const L=invDe(s,id);if(L)return telaQuizInv(s,id,q,L);
  const ord=s.ordem[id],r=s.resp[id],mostra=!s.corrFinal&&r!==undefined;const M=META[q.m];
  const modo=modoQ(),pv=(pend&&pend.id===id)?pend.o:undefined,marc=pv!==undefined?pv:r;
  const rest=s.limite?s.limite-s.tempo:s.tempo;
  const dir=`<span class="relogio${s.limite&&rest<alertaRel(s)?" alerta":""}" id="relogio">${ic("relogio")}<span id="rel-t">${mmss(rest)}</span></span>`;
  return topo(`Questão ${p2(idx+1)} de ${s.qids.length}`,s.mp?"Modo prova · correção no fim":"",{voltarAcao:"pausar",dir,extra:s.mp?mpBarraTempo(s):""})+
  `<main class="wrap"><div class="q-cab"><div class="q-mat">${tile(M.cor,M.ic)}<b>${esc(M.nome)}</b><span>· ${esc(q.a)}</span></div>${/^(fac|per|ftodas|ptodas):/.test(s.key)?`<div class="q-niv nivel" style="--c:var(--nv${nv(id)})">${barras(nv(id))}Dificuldade: ${NIVEL_INFO[nv(id)-1].nome}</div>`:""}<p class="q-enun">${esc(q.q)}</p></div>
  <div class="alts" role="radiogroup" aria-label="Alternativas">${ord.map((oi,pos)=>{let c="";if(mostra){if(oi===0)c="certa";else if(oi===r)c="errada"}else if(oi===marc)c="marcada";
    return `<button class="alt ${c}" role="radio" aria-checked="${oi===marc}" data-acao="marcar" data-o="${oi}" ${mostra?"disabled":""}><span class="letra">${LETRAS[pos]}</span><span>${esc(q.o[oi])}</span></button>`}).join("")}</div>
  ${modo==="confirmar"&&!mostra?(pv!==undefined&&pv!==r?`<div class="botoes" style="margin-top:12px"><button class="botao cheio" data-acao="confirmar-resp">Confirmar resposta</button></div>`:r===undefined?`<p class="dica-modo">Toque em uma alternativa e depois em "Confirmar resposta".</p>`:""):""}
  ${modo==="avancar"&&!mostra&&r===undefined?`<p class="dica-modo">Ao tocar na alternativa, o app passa sozinho para a próxima questão.</p>`:""}
  ${setasAcima()&&!mostra?navQuizAcima():""}
  ${mostra?comentario(q,r,ord):""}
  ${setasAcima()&&mostra?navQuizAcima():""}</main>`+(setasAcima()?"":navQuiz())+(folha?telaFolha():"")}
function navQuizAcima(){const s=sessao;return `<div class="nav-q"><button data-acao="ant" ${idx===0?"disabled":""}>${ic("ant")}<span>Anterior</span></button><button data-acao="folha" aria-label="Ver questões e finalizar">${ic("grade")}</button>${idx===s.qids.length-1?`<button class="cheio" data-acao="folha"><span>Finalizar</span></button>`:`<button class="cheio" data-acao="prox"><span>Próxima</span>${ic("prox")}</button>`}</div>`}
function navQuiz(){const s=sessao;return `<nav class="nav"><div class="nav-in">
  <button data-acao="ant" class="forte" ${idx===0?"disabled":""}>${ic("ant")}<span>Anterior</span></button>
  <button data-acao="folha">${ic("grade")}<span>Finalizar</span></button>
  <button data-acao="prox" ${idx===s.qids.length-1?"disabled":""}>${ic("prox")}<span>Próximo</span></button></div></nav>`}
function comentario(q,r,ord){const ok=r===0;
  return `<div class="coment ${ok?"":"err"}"><h3>${r===undefined?"Em branco":ok?"Resposta correta":"Resposta incorreta"} · gabarito ${LETRAS[ord.indexOf(0)]}</h3><p>${esc(q.e)}</p><p class="fund">${esc(q.f)}</p>${porQue(q,r,ord)}${ok?"":`<p class="cad-foi">${ic("caderno")}<span>Guardada no seu <b>Caderno de erros</b>, com a explicação, para refazer depois.</span></p>`}${botaoRep(q)}</div>`}
function telaFolha(){const s=sessao,r=res(s),feitas=s.qids.length-r.br;
  return `<div class="folha-camada" data-acao="fechar-folha"><div class="folha wrap" role="dialog" aria-label="Questões do simulado">
   <h2>${esc(s.titulo)}</h2><p class="nota">${esc(s.sub)} · ${feitas} de ${s.qids.length} respondidas</p>
   <div class="gq">${s.qids.map((id,i)=>{const x=s.resp[id];let c="";if(x!==undefined)c=s.corrFinal?"resp":(x===0?"g-ok":"g-er");return `<button class="${c} ${i===idx?"atual":""}" data-acao="pular" data-i="${i}" aria-label="Questão ${i+1}">${i+1}</button>`}).join("")}</div>
   <div class="legenda">${s.corrFinal?`<span><i style="background:var(--toga);border-color:var(--toga)"></i>Respondida</span>`:`<span><i style="background:var(--ok);border-color:var(--ok)"></i>Certa</span><span><i style="background:var(--erro);border-color:var(--erro)"></i>Errada</span>`}<span><i></i>Em branco</span></div>
   ${confirmar?`<div class="confirma"><p>${r.br?`Ainda há <b>${r.br}</b> questão(ões) em branco, que contam como erro. `:""}Finalizar e ver o resultado?</p><div class="lado"><button class="botao linha" data-acao="nao-finalizar">Voltar</button><button class="botao cheio" data-acao="finalizar">Finalizar</button></div></div>`
   :`<div class="botoes"><button class="botao cheio" data-acao="pedir-fim">Finalizar simulado</button><button class="botao linha" data-acao="pausar">Pausar e sair</button></div>`}
  </div></div>`}
function iniciarRelogio(){if(!sessao||tick)return;ultimoTick=Date.now();
  tick=setInterval(()=>{const now=Date.now();sessao.tempo+=(now-ultimoTick)/1000;ultimoTick=now;const el=document.getElementById("rel-t");if(!el)return;
    if(sessao.limite){const rest=sessao.limite-sessao.tempo;el.textContent=mmss(rest);const rl=document.getElementById("relogio");if(rl)rl.classList.toggle("alerta",rest<alertaRel(sessao));
      if(sessao.mp)mpTick(rest);
      if(rest<=0){sessao.tempo=sessao.limite;if(sessao.mp)sessao.mp.esgotou=true;finalizar()}}else el.textContent=mmss(sessao.tempo)},1000)}
function pararRelogio(){if(tick){clearInterval(tick);tick=null;if(sessao){sessao.tempo+=(Date.now()-ultimoTick)/1000;ultimoTick=Date.now()}}}
function finalizar(){pararRelogio();const a=sessao;a.status="concluido";a.fim=Date.now();
  a.qids.forEach(id=>{const r=a.resp[id];if(a.corrFinal||r===undefined)registrar(id,r===0,r>0&&invDe(a,id)?"inv":r)});
  sessao=null;folha=false;confirmar=null;salvar();
  const base=pilha.filter(r=>r.tela!=="quiz"&&r.tela!=="pre");pilha=base;rota={tela:"res",id:a.id,revela:!!a.mp};render();
  if(!a.mp){const p=res(a).pct;if(p===100)setTimeout(()=>mostrarFesta(a),250);else som(p>=50?"aprovado":"fim")}}
function pausar(){pararRelogio();if(sessao){sessao.pos=idx;salvar()}sessao=null;folha=false;confirmar=null;
  pilha=pilha.filter(r=>r.tela!=="quiz"&&r.tela!=="pre");rota=pilha.pop()||{tela:"oab",aba:"historico"};render()}

/* ---------- resultado ---------- */
function telaRes(){const a=S.hist.find(x=>x.id===rota.id);if(!a){rota={tela:"oab"};return telaOab()}
  if(a.mp)return telaResProva(a);
  const r=res(a),st=r.pct===100?"perf":r.pct>=50?"aprov":"reprov";
  const pm={};a.qids.forEach(id=>{const q=QMAP[id];if(!q)return;const x=pm[q.m]=pm[q.m]||{o:0,n:0};x.n++;if(a.resp[id]===0)x.o++});
  const temErr=r.er+r.br>0;
  return topo("Resultado",a.titulo+" · "+(a.sub||""),{})+
  `<main class="wrap"><div class="placar ${st}"><div class="pct">${r.pct}%</div><div><h2>${esc(a.titulo)}: ${ROTULO[st]}</h2><p>${r.ok} certas · ${r.er} erradas · ${r.br} em branco · ${dur(a.tempo)}</p><p>Na 1ª fase, a aprovação exige 40 acertos em 80 (50%).</p></div></div>
  ${st==="perf"?versoCard(versoDaChave(a.key),"Gabarito perfeito · uma palavra para você"):""}
  <div class="botoes"><button class="botao cheio" data-acao="refazer-sim" data-key="${a.key}">Refazer simulado</button>${temErr?`<button class="botao linha" data-acao="refazer-erradas-res">Refazer só as que errei</button><button class="botao linha" data-cad="abrir">${ic("caderno")} Abrir o caderno de erros</button>`:""}</div>
  ${Object.keys(pm).length>1?`<div class="secao" role="heading" aria-level="2">Desempenho por matéria</div><div class="desemp">${Object.keys(pm).map(m=>{const x=pm[m];const p=Math.round(x.o*100/x.n);
    return `<div class="linha">${tile(META[m].cor,META[m].ic)}<div><div style="display:flex;justify-content:space-between;gap:8px"><span>${esc(META[m].nome)}</span><b style="font-family:var(--f-mono);font-weight:500">${x.o}/${x.n}</b></div><div class="trilho"><i class="f-ok" style="width:${p}%"></i><i class="f-er" style="width:${100-p}%"></i></div></div><span></span></div>`}).join("")}</div>`:""}
  <div class="secao" role="heading" aria-level="2">Correção comentada</div>
  ${listaCorrecao(a)}</main>`}
function listaCorrecao(a){return `<div class="revisao">${a.qids.map((id,i)=>{const q=QMAP[id];if(!q)return "";const L=invDe(a,id);if(L)return invCorr(a,id,i,L);const x=a.resp[id],ord=a.ordem[id];const k=x===undefined?"br":x===0?"ok":"er";
    return `<details class="rev"><summary><span class="num ${k}">${p2(i+1)}</span><span class="rq"><span class="rotulo">${esc(META[q.m].nome)}</span><br>${esc(q.q)}</span></summary>
    <div class="rbody">${ord.map((oi,p)=>`<p>${oi===0?"<b>":""}${LETRAS[p]}) ${esc(q.o[oi])}${oi===0?` <span class="gab">${ic("ok")}gabarito</span></b>`:""}${oi===x&&oi!==0?" <span class='c-er'>(sua resposta)</span>":""}${oi!==0&&explQ(q)?`<span class="px">${esc(explQ(q)[oi-1])}</span>`:""}</p>`).join("")}
    <p style="margin-top:10px">${esc(q.e)}</p><p class="fund">${esc(q.f)}</p>${candidatosQ(q).length?`<button class="link-tema" data-acao="estudar" data-q="${q.id}">${ic("livro")} Estudar este tema na apostila</button>`:""}${botaoRep(q)}</div></details>`}).join("")}</div>`}

/* ---------- sobre ---------- */
/* ---------- Sobre o Facul Lab (texto do autor) ---------- */
function contarBR(el){const fim=+el.dataset.n;if(!(fim>1)||!animOn()){el.textContent=fim.toLocaleString("pt-BR");return}const t0=performance.now(),dur=1100;
 (function p(now){const k=Math.min(1,(now-t0)/dur);el.textContent=Math.round(fim*(1-Math.pow(1-k,3))).toLocaleString("pt-BR");if(k<1&&el.isConnected)requestAnimationFrame(p)})(t0)}
function telaQuem(){let feitas=0;Object.keys(S.stats).forEach(k=>{if(QMAP[k])feitas++});const dias=Object.keys(S.dias||{}).filter(k=>temAtiv(S.dias[k])).length;
 const num=(n,l)=>`<div class="sb-num"><b data-n="${n}">${n.toLocaleString("pt-BR")}</b><span>${l}</span></div>`;
 const serve=[["carro","Simulados da 1ª fase da OAB","no formato da prova, com cronômetro"],["grade","Treino por matéria","nas disciplinas cobradas no Exame"],["livro","Área da faculdade","separada do 1º ao 10º período"],["recibo","Gabarito comentado","com o artigo de lei de cada questão"],["cartas","Apostilas, resumos e cartões","de memorização, com revisão programada"],["chama","Metas diárias e sequência","de dias de estudo e contagem regressiva para a prova"]];
 return topo("Sobre o Facul Lab","Quem fez, por que e para quem",{menu:true})+
 `<main class="wrap sobre-fl">
  <section class="sb-hero"><div class="sb-logo" aria-hidden="true">${ic("balanca")}<i></i><i></i><i></i></div><h2>Facul Lab</h2><p>Do primeiro período até a OAB, uma questão de cada vez.</p></section>
  <section class="sb-bloco"><h3>${ic("coracao")} Quem sou eu</h3><p>Meu nome é <b>Nicolas Amorim</b> e sou estudante de Direito. Como muita gente, divido o tempo entre trabalho e faculdade, e sei como é difícil encaixar os estudos na rotina.</p></section>
  <section class="sb-bloco"><h3>${ic("lampada")} Por que criei o Facul Lab</h3><p>Sempre tive dificuldade de manter o foco por muito tempo na mesma coisa, e por isso começava cursos e não terminava. Funciono melhor com <b>metas curtas, resposta rápida e progresso que dá para ver</b>.</p>
   <p>A ideia veio do app de simulados do Detran: questão, correção na hora, próxima questão. Então pensei: por que não estudar Direito do mesmo jeito?</p>
   <div class="sb-ciclo" aria-hidden="true"><span><i>?</i>Questão</span><em></em><span class="ok"><i>${ic("ok")}</i>Correção na hora</span><em></em><span><i>${ic("prox")}</i>Próxima</span></div></section>
  <section class="sb-bloco"><h3>${ic("alvo")} Para que ele serve</h3><p>O Facul Lab foi criado para acompanhar o estudante do primeiro período até a OAB. Nele você encontra:</p>
   <ul class="sb-serve">${serve.map(([i,t,d],k)=>`<li style="--k:${k}"><span class="sb-ic">${ic(i)}</span><div><b>${t}</b><small>${d}</small></div></li>`).join("")}</ul>
   <p class="sb-nota">${ic("refazer")} As alternativas mudam de ordem a cada tentativa, para você aprender o conteúdo, e não decorar a posição da resposta.</p></section>
  <section class="sb-nums" aria-label="O Facul Lab em números">${num(QS.length,"questões")}${num(30,"simulados OAB")}${num(10,"períodos")}${num(LS.length,"artigos de lei seca")}</section>
  ${feitas?`<section class="sb-voce"><b>E você já começou a sua parte.</b><p>${feitas.toLocaleString("pt-BR")} ${feitas===1?"questão respondida":"questões respondidas"}${dias?` em ${dias} ${dias===1?"dia":"dias"} de estudo`:""}. Cada uma é um passo nesse caminho.</p></section>`:""}
  <section class="sb-bloco sb-obj"><h3>${ic("balanca")} Meu objetivo</h3><p>Meu objetivo é passar na OAB e me tornar advogado. Se o Facul Lab também ajudar outros estudantes com pouco tempo ou dificuldade de foco, ele terá cumprido o seu papel.</p>
   <div class="sb-trilha" aria-hidden="true"><span>1º período</span><svg viewBox="0 0 300 40" preserveAspectRatio="none"><path class="sb-tr-base" d="M6 30 C70 0 120 40 170 18 S260 6 294 14"/><path class="sb-tr-v" pathLength="100" d="M6 30 C70 0 120 40 170 18 S260 6 294 14"/></svg><span>OAB</span></div></section>
  ${ovosSecao()}
  <p class="sb-ass">Bons estudos!<span>Nicolas Amorim</span></p>
  <button class="botao cheio sb-cta" data-acao="ir-raiz" data-tela="hoje">${ic("alvo")} Bora estudar hoje</button>
 </main>`}
function telaSobre(){const nO=OAB.reduce((s,m)=>s+(porM[m]||[]).length,0);
  return topo("Como funciona","",{menu:true})+
  `<main class="wrap">${tourCta()}<div class="dica"><p style="margin:0 0 8px"><b>Simulados OAB.</b> São 30 provas fixas de 80 questões, com a mesma distribuição de matérias da 1ª fase: 8 de Ética, 6 de Civil, Processo Civil, Constitucional, Penal e Processo Penal, e assim por diante. Você tem 5 horas e precisa de 50% para aprovação.</p>
  <p style="margin:0 0 8px"><b>Banco atual.</b> ${nO} questões das matérias da OAB e ${QS.length-nO} de disciplinas da faculdade. Como 30 provas de 80 somam 2.400 posições, cada questão aparece, em média, em ${String(Math.round(2400/nO*10)/10).replace(".",",")} simulados diferentes. Conforme o banco crescer, os simulados ficam mais variados automaticamente.</p>
  <p style="margin:0 0 8px"><b>Questões.</b> São inéditas, no estilo da FGV, sobre os temas que mais caem. Cada uma traz comentário, o dispositivo legal ou precedente e a explicação de por que cada alternativa errada está errada. Se desconfiar de algum gabarito, use <b>Reportar erro nesta questão</b>.</p>
  <p style="margin:0 0 8px"><b>Caderno de erros.</b> Toda questão que você erra vai para o caderno, com a sua resposta, o gabarito e a explicação de cada alternativa. Marque por que errou, anote o que aprendeu e refaça: depois de 3 acertos seguidos ela fica dominada.</p>
  <p style="margin:0 0 8px"><b>Lei seca.</b> ${LS.length} dispositivos mais cobrados, com o texto literal conferido no Planalto, para treinar em dois formatos: complete o artigo e certo ou errado.</p>
  <p style="margin:0"><b>A cada tentativa</b> a ordem das alternativas muda. Nos simulados por matéria e da faculdade, a ordem das questões também muda.</p></div>
  <div class="secao" role="heading" aria-level="2">Banco por matéria</div><div class="desemp">${OAB.concat(["ied","tge","soc","psc","crim","masc"]).map(m=>`<div class="linha">${tile(META[m].cor,META[m].ic)}<span>${esc(META[m].nome)}</span><b style="font-family:var(--f-mono);font-weight:500">${(porM[m]||[]).length}</b></div>`).join("")}</div>
  <p class="sinc">${esc(statusSinc)}</p></main>`}

/* ---------- tour "Como funciona" ----------
   Abre sozinho na primeira entrada (até S.cfg.tour ficar marcado) e pode ser refeito pelo menu, pela tela Como funciona
   e por Configurações. Cada passo tem ilustração e uma demonstração para tocar; o período e o visual escolhidos aqui já valem no app.
   Ao terminar ou pular, o app oferece os lembretes no celular (window.lbConvite, quando existir). */
const TOUR_V=1;
let tourI=-1,tourDir=1,tourD={};
const TOUR_Q={p:"Na 1ª fase do Exame de Ordem, quantas questões você precisa acertar para ser aprovado?",alts:["30 das 80 questões","40 das 80 questões","48 das 80 questões","56 das 80 questões"],c:1,
 com:"A aprovação na 1ª fase pede metade da prova: 40 acertos em 80 questões. Os simulados OAB do app seguem a mesma regra, com 5 horas de prova."};
const TOUR_MENU=[["alvo","Hoje","O plano do dia, montado para o seu momento: questões, cartões e leitura."],["livro","Faculdade","Apostilas, resumos, cartões e questões do 1º ao 10º período."],["carro","Simulados OAB","30 provas de 80 questões, com a mesma distribuição de matérias da 1ª fase e cronômetro."],["grade","Por matéria","Simulados de uma matéria só, para atacar o ponto fraco."],["recibo","Lei seca","Os artigos mais cobrados, para completar o texto e julgar certo ou errado."],["lupa","Buscar em tudo","Ache qualquer tema nas apostilas, nas questões e nos cartões."],["marcador","Favoritos","Guarde questões e temas e escreva suas próprias anotações."],["caderno","Caderno de erros","Cada questão que você erra fica guardada com a explicação, para refazer até dominar."]];
const TOUR=[
 {ilu:"estudo",cor:"var(--nv2)",tit:"Bem-vindo ao Facul Lab",txt:()=>"Em um minuto você conhece tudo o que o app faz. Os exemplos de cada passo funcionam de verdade: toque neles.",demo:tourDemoOi},
 {ilu:"capelo",cor:"var(--nv6)",tit:"Em que momento você está?",txt:()=>"Escolha seu período. A tela Hoje usa essa escolha para sugerir as matérias, os cartões e os simulados certos para você.",demo:tourDemoPer},
 {ilu:"checklist",cor:"var(--nv1)",tit:"Hoje: seu plano do dia",txt:()=>"Sempre que você abre o app, a tela Hoje monta um plano curto. Cumpra os itens e o dia fica completo. Experimente tocar:",demo:tourDemoHoje},
 {ilu:"alvo",cor:"var(--nv5)",tit:"Questões que ensinam",txt:()=>`São ${QS.length.toLocaleString("pt-BR")} questões no estilo da FGV. Depois de responder, você vê o comentário, a base legal e por que as outras alternativas estão erradas. Responda esta:`,demo:tourDemoQ},
 {ilu:"cartas",cor:"var(--nv6)",tit:"Cartões de memorização",txt:()=>"Leia a pergunta, tente lembrar de cabeça e só depois vire. Conforme você responde, o app traz cada cartão de volta na hora certa.",demo:tourDemoCard},
 {ilu:"livros",cor:"var(--nv7)",tit:"Apostilas e lei seca",txt:()=>"Cada período tem apostilas com exemplos, ilustrações, simuladores e um teste no fim de cada tema. Na lei seca, você treina o texto literal da lei. Complete o artigo:",demo:tourDemoLs},
 {ilu:"chama",cor:"var(--nv4)",tit:"Metas, ofensiva e progresso",txt:()=>"Cumpra a meta diária para manter a chama acesa. Em Metas e desempenho e em Progresso geral você acompanha sua evolução em cada matéria.",demo:tourDemoMetas},
 {ilu:"lupa",cor:"var(--nv2)",tit:"Tudo a um toque no menu",txt:()=>"O botão de menu, no canto de cima da tela, leva a todas as partes do app. Toque em cada uma para ver o que faz:",demo:tourDemoMenu},
 {ilu:"engrenagem",cor:"var(--nv3)",tit:"Do seu jeito",txt:()=>"Escolha o visual agora. A mudança aparece na hora, e dá para trocar depois em Configurações.",demo:tourDemoVisual},
 {ilu:"trofeu",cor:"var(--nv3)",tit:"Tudo pronto!",txt:()=>"Você já conhece o caminho. Comece pelo plano de hoje: um pouco por dia, todo dia, até a aprovação.",demo:tourDemoFim}];
const tourNv=()=>tourD.novo?" novo":"";
function tourDemoOi(){const F=[["alvo","var(--toga)","Plano de hoje"],["ok","var(--ok)","Questões comentadas"],["cartas","var(--lacre)","Cartões"],["livro","var(--nv2)","Apostilas"],["recibo","var(--nv7)","Lei seca"],["chama","#ff8a1f","Metas e ofensiva"]];
 return `<div class="tour-oi">${F.map(([i,c,t],k)=>`<span class="tour-oi-chip" style="--k:${k}">${tile(c,i,"tile-mini")}${t}</span>`).join("")}</div>
 <p class="nota tour-centro">Deslize para o lado ou use os botões de baixo. Se preferir, toque em <b>Pular</b> e vá direto para o app.</p>`}
function tourDemoPer(){const per=perAtual();
 return `<div class="opcoes tour-per">${PERIODOS.slice(0,9).map((_,i)=>`<button data-acao="tour-per" data-v="${i}" aria-pressed="${per===i}">${i+1}º</button>`).join("")}<button class="tour-per-oab" data-acao="tour-per" data-v="9" aria-pressed="${per===9}">10º período ou formado</button></div>
 <p class="tour-res${per===null?" vazio":tourNv()}" aria-live="polite">${per===null?"Toque no seu período. Dá para mudar depois em Configurações.":per===9?`${ic("ok")}<span>Foco no Exame de Ordem: a tela Hoje vai priorizar os simulados e as matérias da OAB.</span>`:`${ic("ok")}<span>Pronto! A tela Hoje vai sugerir as matérias do ${per+1}º período.</span>`}</p>`}
function tourDemoHoje(){const f=tourD.plano||{};const it=[["alvo","var(--toga)","Questões: 20 de 20","Um simulado curto para cumprir a meta"],["cartas","var(--lacre)","Cartões para revisar","Os que chegaram no dia de revisão"],["livro","var(--nv2)","Ler um tema da apostila","Com exemplos e um teste no fim"]];
 const n=it.filter((_,i)=>f[i]).length;
 return `<div class="lista plano-lista tour-plano">${it.map(([icn,cor,t,s],i)=>`<button class="item plano${f[i]?" feito":""}" data-acao="tour-plano" data-v="${i}" aria-pressed="${!!f[i]}">${tile(f[i]?"var(--ok)":cor,f[i]?"ok":icn)}<span style="min-width:0"><span class="item-tit">${t}</span><br><span class="item-sub">${s}</span></span></button>`).join("")}</div>
 <p class="tour-res${n===3?" tour-chama":n?"":" vazio"}${tourNv()}" aria-live="polite">${n===3?`${ic("chama")}<span><b>Dia cumprido!</b> Sua ofensiva acende e cresce a cada dia seguido de estudo.</span>`:`${n} de 3 feitos. Toque nos itens para marcar.`}</p>`}
function tourDemoQ(){const q=TOUR_Q,r=tourD.q,feito=r!==undefined;
 return `<div class="tour-q"><p class="tour-enun">${q.p}</p><div class="lista">${q.alts.map((a,i)=>{const cl=feito?(i===q.c?" certa":i===r?" errada":""):"";const an=feito&&tourD.novo&&i===r?(i===q.c?" anim-ok":" anim-err"):"";
  return `<button class="alt${cl}${an}" data-acao="tour-q" data-v="${i}"${feito?" disabled":""}><span class="letra">${"ABCD"[i]}</span><span>${a}</span></button>`}).join("")}</div>
 ${feito?`<div class="tour-com${r===q.c?"":" err"}${tourNv()}" aria-live="polite"><b>${r===q.c?"Acertou!":"Não foi dessa vez."}</b> ${q.com}</div><button class="tour-link" data-acao="tour-q-de-novo">${ic("refazer")} Responder de novo</button>`:""}</div>`}
function tourDemoCard(){const v=tourD.virado,n=tourD.nota;const lab=k=>k===0?"volta nesta sessão":txtIv(proxIv(null,k).iv);
 return `<div class="flash tour-flash${v&&tourD.novo==="vira"?" vira":""}" style="--c:var(--nv6)"><p class="flash-q">Na revisão espaçada, quando um cartão volta para você?</p>${v?`<div class="flash-r">Depende de como você lembrou: o que você erra volta logo; o que você acerta demora cada vez mais para voltar, até ficar firme na memória.</div>`:""}</div>
 ${v?`<p class="nota-q">Como foi lembrar a resposta?</p><div class="notas-flash" role="group">${[["Errei","f-er"],["Difícil",""],["Acertei",""],["Fácil","f-ok"]].map(([t,c],k)=>`<button class="botao linha ${c}" data-acao="tour-card-nota" data-v="${k}" aria-pressed="${n===k}">${t}<small>${lab(k)}</small></button>`).join("")}</div>
  ${n!==undefined?`<p class="tour-res${tourNv()}" aria-live="polite">${ic("calendario")}<span>${n===0?"Este cartão volta ainda nesta sessão, até você acertar.":`Este cartão volta ${lab(n)}. O app guarda a data e avisa na tela Hoje.`}</span></p>`:""}`
  :`<div class="botoes"><button class="botao cheio" data-acao="tour-card-virar">${ic("cartas")} Virar o cartão</button></div>`}`}
function tourDemoLs(){const r=tourD.ls,ok=r==="iguais";
 return `<div class="tour-ls"><span class="tour-ls-ref">Constituição Federal, art. 5º, caput</span>
 <p>“Todos são <span class="tour-lacuna${r?(ok?" ok":" err"):""}${tourNv()}">${r?esc(r):"&nbsp;"}</span> perante a lei, sem distinção de qualquer natureza…”</p>
 <div class="opcoes">${["livres","iguais","soberanos"].map(o=>`<button data-acao="tour-ls" data-v="${o}" aria-pressed="${r===o}"${ok?" disabled":""}>${o}</button>`).join("")}</div></div>
 ${r?`<p class="tour-res${ok?"":" err"}${tourNv()}" aria-live="polite">${ic(ok?"ok":"x")}<span>${ok?"Isso! É o texto literal da Constituição, conferido no Planalto.":"Não é essa. Tente outra palavra."}</span></p>`:""}`}
function tourDemoMetas(){const n=tourD.dias||0;
 return `<div class="tour-metas"><ol class="tour-semana" aria-label="Dias de estudo nesta semana">${["D","S","T","Q","Q","S","S"].map((d,i)=>`<li class="${i<n?"on":""}${i===n-1&&tourD.novo?" novo":""}"><i>${ic("chama")}</i><small>${d}</small></li>`).join("")}</ol>
 <p class="tour-seq" aria-live="polite"><b>${n}</b> ${n===1?"dia":"dias"} de ofensiva</p>
 <div class="botoes"><button class="botao cheio" data-acao="tour-dia"${n>=7?" disabled":""}>${n>=7?"Semana completa!":`${ic("mais")} Estudar mais um dia`}</button></div></div>
 ${n>=7?`<p class="tour-res tour-chama${tourNv()}">${ic("estrela")}<span><b>Uma semana inteira!</b> No app, cada meta cumprida vira festa, e a chama mostra quantos dias seguidos você estudou.</span></p>`:""}`}
function tourDemoMenu(){const s=tourD.menu;
 return `<div class="tour-menu">${TOUR_MENU.map(([icn,n],i)=>`<button data-acao="tour-menu" data-v="${i}" aria-pressed="${s===i}">${ic(icn)}<span>${n}</span></button>`).join("")}</div>
 <p class="tour-res${s===undefined?" vazio":tourNv()}" aria-live="polite">${s===undefined?"Toque em uma parte do menu.":`${ic(TOUR_MENU[s][0])}<span><b>${TOUR_MENU[s][1]}.</b> ${TOUR_MENU[s][2]}</span>`}</p>`}
function tourDemoVisual(){const e=estiloAtual(),an=(S.cfg&&S.cfg.anim)||"on";
 return `<div class="estilos">${ESTILOS.map(([k,n,d])=>`<button data-acao="tour-estilo" data-v="${k}" aria-pressed="${e===k}"><span class="prev prev-${k}" aria-hidden="true"${prevEstilo(k)}><i></i><i></i><i></i><i></i></span><span><b>${n}</b>${k==="premium"?" <em>Padrão</em>":""}<small>${d}</small></span></button>`).join("")}</div>
 ${e==="premium"?`<p class="nota tour-sub"><b>Paleta do Premium</b></p><div class="paletas">${coresVisiveis(PALETAS,paletaAtual()).map(([k,n,d,c1,c2])=>`<button data-acao="tour-paleta" data-v="${k}" aria-pressed="${paletaAtual()===k}"><span class="amostra-g${k==="dinamica"?" din-amostra":""}" style="background:${k==="dinamica"?dinArco("conic"):`linear-gradient(135deg,${c1},${c2})`}"></span><span>${n}${k==="dinamica"?` <em class="din-novo">Novo</em>`:""}<small>${d}</small></span></button>`).join("")}</div>${botaoMaisCores(PALETAS,paletaAtual())}`:""}
 <p class="nota tour-sub"><b>Animações</b></p><div class="cores">${[["on","Ligadas","Movimento nas telas e nas respostas","chama"],["off","Desligadas","Tudo parado, para foco ou bateria","pausa"]].map(([k,n,d,i])=>`<button data-acao="tour-anim" data-v="${k}" aria-pressed="${an===k}"><span class="ico-op">${ic(i)}</span><span>${n}<small>${d}</small></span></button>`).join("")}</div>
 <p class="nota tour-sub"><b>Sons e vibração</b></p><div class="cores tres quatro">${SOM_OP.map(([k,n,d,i])=>`<button data-acao="tour-som" data-v="${k}" aria-pressed="${somModo()===k}"><span class="ico-op">${ic(i)}</span><span>${n}<small>${d}</small></span></button>`).join("")}</div>`}
function tourDemoFim(){const per=perAtual();const pl=PALETAS.find(x=>x[0]===paletaAtual());
 const L=[["capelo","Seu momento",per===null?"Ainda não escolhido":nomePer(per),1],["eng","Visual",estiloAtual()==="premium"?`Premium · ${pl[1]}`:"Clássico",8],[(S.cfg&&S.cfg.anim)==="off"?"pausa":"chama","Animações",(S.cfg&&S.cfg.anim)==="off"?"Desligadas":"Ligadas",8],[SOM_OP.find(x=>x[0]===somModo())[3],"Sons",SOM_OP.find(x=>x[0]===somModo())[1],8]];
 return `<div class="lista tour-resumo">${L.map(([i,t,v,k])=>`<button class="item" data-acao="tour-ir" data-v="${k}">${tile("var(--toga)",i==="capelo"?"livro":i)}<span style="min-width:0"><span class="item-sub">${t}</span><br><span class="item-tit">${esc(v)}</span></span><span class="item-data">Trocar</span></button>`).join("")}</div>
 <p class="nota tour-centro">Quer ver o tour de novo? Ele fica no menu, em <b>Tour pelo app</b>, e em Configurações.</p>`}
function tourHtml(){const P=TOUR[tourI],n=TOUR.length,ult=tourI===n-1;const cor=estiloAtual()==="premium"?"var(--p2)":P.cor;
 return `<div class="tour-topo"><div class="tour-pontos" role="group" aria-label="Passos do tour">${TOUR.map((x,i)=>`<button data-acao="tour-ir" data-v="${i}" aria-label="Passo ${i+1}: ${esc(x.tit)}"${i===tourI?' aria-current="step"':""}${i<tourI?' class="feito"':""}></button>`).join("")}</div>
  ${ult?"":`<button class="tour-pular" data-acao="tour-pular">Pular ${ic("prox")}</button>`}</div>
 <div class="tour-corpo"><div class="tour-passo${tourD.entra?` entra-${tourDir>0?"d":"e"}`:""}">
  <div class="tour-ilu">${ilustra(P.ilu,cor)}</div>
  <p class="tour-cont">${tourI+1} de ${n}</p><h2 id="tour-tit" tabindex="-1">${P.tit}</h2><p class="tour-txt">${P.txt()}</p>
  <div class="tour-demo">${P.demo()}</div></div></div>
 <div class="tour-base"><div><button class="botao linha" data-acao="tour-ant"${tourI?"":" disabled"} aria-label="Passo anterior">${ic("ant")}</button>
  ${ult?`<button class="botao cheio" data-acao="tour-fim">Começar a estudar ${ic("prox")}</button>`:`<button class="botao cheio" data-acao="tour-prox">${tourI?"Próximo":"Começar o tour"} ${ic("prox")}</button>`}</div></div>`}
function tourRender(entra){let el=document.getElementById("tour");
 const f=document.activeElement&&document.activeElement.closest?document.activeElement.closest("#tour [data-acao]"):null;const fa=f&&f.dataset.acao,fv=f&&f.dataset.v;
 const sc=el?el.querySelector(".tour-corpo").scrollTop:0;
 if(!el){el=document.createElement("div");el.id="tour";el.className="tour";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","tour-tit");
  document.body.appendChild(el);document.documentElement.classList.add("tour-on");const a=$("#app");if(a)a.inert=true;tourToque(el)}
 tourD.entra=!!entra&&animOn();el.innerHTML=tourHtml();tourD.novo=false;tourD.entra=false;
 const c=el.querySelector(".tour-corpo");
 if(entra){c.scrollTop=0;const t=el.querySelector("#tour-tit");try{t.focus({preventScroll:true})}catch(e){}}
 else{c.scrollTop=sc;const nv=el.querySelectorAll(".tour-demo .novo,.tour-demo .vira~*");if(nv.length)try{nv[nv.length-1].scrollIntoView({block:"nearest",behavior:animOn()?"smooth":"auto"})}catch(e){}
  if(fa){const b=el.querySelector(`[data-acao="${fa}"]${fv!==undefined?`[data-v="${fv}"]`:""}`);try{(b&&!b.disabled?b:el.querySelector("#tour-tit")).focus({preventScroll:true})}catch(e){}}}
 syncVoltar()}
function tourAbrir(){gaveta=false;tourI=0;tourDir=1;tourD={};rota.manterScroll=true;render();tourRender(true)}
function tourIr(i){if(i<0||i>=TOUR.length||i===tourI)return;tourDir=i>tourI?1:-1;tourI=i;tourRender(true)}
function tourFechar(destino){const el=document.getElementById("tour");if(el)el.remove();document.documentElement.classList.remove("tour-on");const a=$("#app");if(a)a.inert=false;
 tourI=-1;tourD={};S.cfg=S.cfg||{};S.cfg.tour=TOUR_V;salvar();
 if(destino)raiz({tela:destino});else{rota.manterScroll=true;render()}
 setTimeout(()=>{try{window.lbConvite&&window.lbConvite()}catch(e){}},400)}
/* deslizar para o lado troca de passo */
function tourToque(el){let x0=null,y0=0;
 el.addEventListener("touchstart",e=>{const t=e.touches[0];x0=t.clientX;y0=t.clientY},{passive:true});
 el.addEventListener("touchend",e=>{if(x0===null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
  if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)tourIr(tourI+(dx<0?1:-1))},{passive:true})}
/* chamada para o tour nas telas Como funciona e Configurações */
function tourCta(){return `<button class="tour-cta" data-acao="tour">${ilustra("estudo","var(--nv2)")}<span><b>Tour pelo app</b><small>Um passo a passo interativo de um minuto, com tudo o que o Facul Lab faz.</small></span>${ic("prox")}</button>`}

