"use strict";
/* ---------- provas anteriores da OAB: as provas reais da FGV (1ª fase), com o gabarito definitivo ----------
   provas/indice.js lista as provas (window.PROVAS_FGV: número, data e anuladas). As 80 questões de cada uma ficam em
   provas/oab-<n>.js e só carregam quando a prova é aberta, ou quando o progresso guardado tem questões dela
   (para o caderno de erros, a revisão espaçada e os resultados). Os dois são gerados por tools/provas/gerar.py
   a partir dos PDFs oficiais da FGV (caderno Tipo 1 + gabaritos preliminar e definitivo).
   As questões entram no QMAP com id "fgv<n>-<nº>" (ex.: fgv47-05), mas não no banco geral (QS): não se misturam
   aos simulados do app, à busca nem ao treino sob medida. Como em todo o app, q.o[0] é a alternativa certa;
   q.fgv.ord devolve a ordem do caderno (A, B, C, D), usada em toda tentativa.
   Anulada pela FGV: o ponto vale para todos, qualquer que seja a resposta (res conta como acerto), e ela não entra
   nas estatísticas, no caderno de erros nem na revisão (registrar ignora). Chave do simulado: "fgv:<n>". */
const FG_LISTA=(window.PROVAS_FGV||[]).filter(x=>x&&x.n).slice().sort((a,b)=>b.n-a.n);
const FG_OK={},FG_PROM={},FG_FALHA={};
const fgInfo=n=>FG_LISTA.find(x=>x.n===+n)||null;
const fgDoId=id=>{const m=/^fgv(\d+)-\d+$/.exec(id||"");return m?+m[1]:0};
const fgIdDe=(n,num)=>`fgv${n}-${p2(num)}`;
const fgChaveN=key=>{const m=/^fgv:(\d+)$/.exec(key||"");return m?+m[1]:0};
const fgDataD=s=>{const [a,m,d]=String(s||"").split("-").map(Number);return new Date(a,(m||1)-1,d||1)};
const fgDataLonga=s=>new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"long",year:"numeric"}).format(fgDataD(s));
const FG_MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const fgDataCurta=s=>{const d=fgDataD(s);return `${d.getDate()} ${FG_MES[d.getMonth()]} ${d.getFullYear()}`};
/* "1, 74 e 80" */
const fgLista=l=>l.length<2?String(l[0]||""):l.slice(0,-1).join(", ")+" e "+l[l.length-1];
const fgPl=(n,s,p)=>`${n} ${n===1?s:p}`;

/* chamado por provas/oab-<n>.js: cada questão vem como [matéria, enunciado, [A, B, C, D], gabarito ("A"…"D" ou "*")] */
function provaFGV(P){const n=+P.n;if(!n||!Array.isArray(P.q))return;
 P.q.forEach((x,i)=>{const [m,q,ops,g]=x,num=i+1,id=fgIdDe(n,num),anul=g==="*",gi="ABCD".indexOf(g);
  if(!META[m]||!Array.isArray(ops)||ops.length!==4||(!anul&&gi<0))return;
  const o=anul?ops.slice():[ops[gi]].concat(ops.filter((_,k)=>k!==gi));
  const ord=anul?[0,1,2,3]:[0,1,2,3].map(p=>p===gi?0:p<gi?p+1:p);
  QMAP[id]={id,m,t:m,a:"Prova da OAB",q,o,
   e:anul?"Questão anulada pela FGV depois dos recursos: o ponto foi dado a todos os examinandos.":"Resposta do gabarito definitivo da FGV (a banca não publica comentário das questões).",
   f:`${n}º Exame de Ordem Unificado (FGV), prova de ${fgDataLonga(P.data)} · questão ${num} do caderno Tipo 1`,
   fgv:{n,num,ord,anul,gp:anul&&P.anul?P.anul[num]||"":""}}});
 FG_OK[n]=1;delete FG_FALHA[n]}
function fgCarregar(n){n=+n;if(FG_OK[n])return Promise.resolve();if(FG_PROM[n])return FG_PROM[n];
 return FG_PROM[n]=new Promise((ok,falha)=>{const s=document.createElement("script");s.src=`provas/oab-${n}.js`;s.async=true;
  s.onload=()=>{delete FG_PROM[n];FG_OK[n]?ok():(FG_FALHA[n]=Date.now(),falha(new Error("vazio")))};
  s.onerror=()=>{s.remove();delete FG_PROM[n];FG_FALHA[n]=Date.now();falha(new Error("rede"))};document.head.appendChild(s)})}
/* carrega e redesenha as telas que mostram as questões; sem internet (e sem cópia guardada), a tela mostra o aviso */
function fgGarante(n){if(FG_OK[n]||FG_PROM[n])return;delete FG_FALHA[n];
 fgCarregar(n).then(()=>reRenderSe("pre","quiz","res","provas","caderno","revisao","progresso","metas","reportes","oab"),()=>reRenderSe("pre","quiz","res"))}
/* o progresso guardado tem questões de alguma prova? (tentativas, estatísticas, revisão, caderno, reportes)
   Sem internet, tenta de novo depois de 1 minuto ou quando a conexão volta. */
let fgVisto="",fgPrecisa=[];
function fgPrecarregar(){const sinal=(S.hist||[]).length+"/"+Object.keys(S.stats||{}).length+"/"+Object.keys(S.qrev||{}).length+"/"+Object.keys(S.cad||{}).length;
 if(sinal!==fgVisto){fgVisto=sinal;const ns=new Set();const ve=id=>{const n=fgDoId(id);if(n&&fgInfo(n))ns.add(n)};
  (S.hist||[]).forEach(a=>{const n=fgChaveN(a.key);if(n&&fgInfo(n))ns.add(n);else if(/^rev:/.test(a.key||"")&&a.qids)a.qids.forEach(ve)});
  [S.stats,S.qrev,S.cad,S.rep].forEach(o=>{if(o&&typeof o==="object")Object.keys(o).forEach(ve)});fgPrecisa=[...ns]}
 fgPrecisa.forEach(n=>{if(!FG_OK[n]&&!FG_PROM[n]&&(!FG_FALHA[n]||Date.now()-FG_FALHA[n]>6e4))fgGarante(n)})}
window.addEventListener("online",()=>{Object.keys(FG_FALHA).forEach(n=>delete FG_FALHA[n]);try{fgPrecarregar()}catch(e){}});

/* ---------- o simulado de cada prova ---------- */
{const s0=sim;sim=function(key){const n=fgChaveN(key);if(!n)return s0(key);const P=fgInfo(n);if(!P)return null;
 const qids=[];for(let i=1;i<=80;i++)qids.push(fgIdDe(n,i));
 return {key,tipo:"fgv",titulo:`${n}º Exame de Ordem`,sub:`Prova da FGV de ${fgDataCurta(P.data)}`,qids,limite:5*3600,fixa:true}}}
/* nota de corte da OAB: 40 acertos em 80 (50%) */
{const t0=tipoNota;tipoNota=function(key){return fgChaveN(key)?"oab":t0(key)}}
/* anulada: ponto para todos, mesmo em branco */
{const r0=res;res=function(a){const r=r0(a),n=a&&fgChaveN(a.key),P=n&&fgInfo(n);if(!P||!P.anul||!P.anul.length)return r;
 P.anul.forEach(num=>{const id=fgIdDe(n,num);if(!a.qids.includes(id))return;const x=a.resp[id];if(x===0)return;if(x===undefined)r.br--;else r.er--;r.ok++});
 r.pct=a.qids.length?Math.round(r.ok*100/a.qids.length):0;return r}}
{const g0=registrar;registrar=function(id,c,o){const q=QMAP[id];if(q&&q.fgv&&q.fgv.anul)return;return g0(id,c,o)}}
/* achar o tema na apostila: só pelo conteúdo da questão ("Prova da OAB" e o gabarito não dizem o assunto) */
{const t0=temaDaQuestao;temaDaQuestao=function(q){return t0(q&&q.fgv?Object.assign({},q,{a:"",e:""}):q)}}

/* começar: a ordem das questões e das alternativas é a do caderno */
function fgComecar(key){const s=sim(key);if(!s)return;const qids=s.qids.slice(),ordem={};
 qids.forEach(id=>{const q=QMAP[id];ordem[id]=q&&q.fgv?q.fgv.ord.slice():[0,1,2,3]});
 S.hist.forEach(a=>{if(a.key===key&&a.status==="pausado")a.status="descartado"});S.hist=S.hist.filter(a=>a.status!=="descartado");
 sessao={id:"a"+Date.now(),key,titulo:s.titulo,sub:s.sub,inicio:Date.now(),status:"pausado",qids,ordem,resp:{},tempo:0,limite:s.limite,corrFinal:!!S.cfg.corrFinal,pos:0};
 S.hist.unshift(sessao);podarHist();idx=0;folha=false;confirmar=null;salvar();ir({tela:"quiz"})}
/* 3, 2, 1, valendo! (como no modo prova; um toque pula) */
function fgContagem(key){if(!animOn()){som("abre");fgComecar(key);return}
 const el=document.createElement("div");el.className="mp-conta";el.setAttribute("role","status");el.setAttribute("aria-live","assertive");
 el.innerHTML=`<div class="mp-conta-in"><svg class="mp-conta-anel" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle class="v" cx="60" cy="60" r="52" pathLength="100"/></svg><span class="mp-conta-n">3</span><small>Respire fundo…</small></div>`;
 document.body.appendChild(el);const N=el.querySelector(".mp-conta-n"),T=el.querySelector("small");let k=3,fim=false;som("toque");
 const vai=()=>{if(fim)return;fim=true;clearInterval(t);el.classList.add("sai");setTimeout(()=>el.remove(),260);fgComecar(key)};
 const t=setInterval(()=>{k--;if(k>0){N.textContent=k;T.textContent=k===2?"5 horas, 80 questões":"Leia cada enunciado até o fim";if(typeof ovoReanima==="function")ovoReanima(N,"pula");som("toque")}
  else if(k===0){N.textContent="Valendo!";T.textContent="Boa prova!";el.classList.add("valendo");if(typeof ovoReanima==="function")ovoReanima(N,"pula");som("abre")}else vai()},850);
 el.addEventListener("click",vai)}
{const c0=comecar;comecar=function(key){const n=fgChaveN(key);if(!n)return c0(key);
 if(!FG_OK[n]){fgGarante(n);return}
 if(rota.tela==="pre")fgContagem(key);else fgComecar(key)}}

/* ---------- na questão: selo da prova, parágrafos do enunciado e a anulada sem certa/errada ---------- */
const fgSelo=q=>`<span class="q-caso fg-selo">${ic("prancheta")}${q.fgv.n}º Exame · questão ${q.fgv.num}${q.fgv.anul?" · anulada pela FGV":""}</span>`;
const fgEnun=(q,cls)=>`<div class="${cls}">${String(q.q).split("\n").map(x=>`<p>${esc(x)}</p>`).join("")}</div>`;
{const t0=telaQuiz;telaQuiz=function(){const s=sessao,id=s&&s.qids[idx],n=fgDoId(id);
 if(n&&!QMAP[id]){if(!FG_FALHA[n])fgGarante(n);
  return topo(`Questão ${idx+1} de ${s.qids.length}`,"",{voltarAcao:"pausar"})+`<main class="wrap">${FG_FALHA[n]
   ?vazio("provas","Sem internet para abrir a prova","As questões desta prova ficam guardadas no aparelho depois da primeira vez que ela abre com internet. Conecte-se e tente de novo; as suas respostas estão guardadas.",`<button class="botao cheio" data-fg="tentar" data-n="${n}">Tentar de novo</button>`)
   :`<div class="fg-abrindo" role="status">${vazio("provas","Abrindo a prova…","As 80 questões estão chegando.")}</div>`}</main>`+navQuiz()}
 let h=t0();const q=QMAP[id];if(!q||!q.fgv)return h;
 h=h.replace(`<span>· ${esc(q.a)}</span></div>`,`<span>· ${esc(q.a)}</span></div>${fgSelo(q)}`).replace(`<p class="q-enun">${esc(q.q)}</p>`,fgEnun(q,"q-enun fg-enun"));
 const r=s.resp[id];
 if(q.fgv.anul&&!s.corrFinal&&r!==undefined)h=h.replace(/class="alt (certa|errada)"([^>]*?)data-o="(\d)"/g,(m,c,meio,o)=>`class="alt${+o===r?" marcada":""}"${meio}data-o="${o}"`);
 return h}}
{const c0=comentario;comentario=function(q,r,ord){if(!q||!q.fgv||!q.fgv.anul)return c0(q,r,ord);
 return `<div class="coment fg-anulada"><h3>${ic("exc")} Questão anulada pela FGV</h3><p>Depois dos recursos, a FGV anulou esta questão e deu o ponto a todos, qualquer que fosse a resposta. Aqui ela também conta como acerto.${q.fgv.gp?` No gabarito preliminar, a resposta era a letra ${q.fgv.gp}.`:""}</p><p class="fund">${esc(q.f)}</p>${botaoRep(q)}</div>`}}

/* ---------- antes de começar ---------- */
function telaPreFgv(){const key=rota.key,n=fgChaveN(key),P=fgInfo(n);if(!P){rota={tela:"provas"};return telaProvas()}
 const e=estado(key),ok=!!FG_OK[n],an=P.anul||[];if(!ok&&!FG_FALHA[n])fgGarante(n);
 const ano=fgDataD(P.data).getFullYear();
 const botoes=!ok?(FG_FALHA[n]?`<div class="fg-falta">${vazio("provas","Sem internet para abrir a prova","Ela fica guardada no aparelho depois da primeira vez que abre com internet.",`<button class="botao cheio" data-fg="tentar" data-n="${n}">Tentar de novo</button>`)}</div>`
   :`<p class="nota fg-carregando" role="status">${ic("relogio")} Abrindo as 80 questões…</p>`)
  :e.st==="pausa"?`<div class="botoes"><button class="botao linha" data-acao="comecar">Começar de novo</button><button class="botao cheio" data-acao="continuar">Continuar onde parei</button></div>`
  :`<div class="botoes">${e.a&&!e.a.resumo?`<button class="botao linha" data-acao="ver-ultima">Ver última correção</button>`:""}<button class="botao cheio" data-acao="comecar">${e.a?"Fazer de novo":"Começar a prova"}</button></div>`;
 return topo(`${n}º Exame de Ordem`,`Prova da FGV de ${fgDataLonga(P.data)}`,{})+
 `<main class="wrap"><div class="cartao fg-pre">
   <div class="info"><div><strong>80</strong><small>questões</small></div><div><strong>5 h</strong><small>de prova</small></div><div><strong>40</strong><small>acertos para passar</small></div></div>
   <ul class="fg-itens">
    <li>${ic("prancheta")}<span><b>A prova como foi aplicada.</b> As questões do caderno Tipo 1, na mesma ordem, e as alternativas de A a D como no papel.</span></li>
    <li>${ic("ok")}<span><b>Gabarito definitivo da FGV.</b> ${an.length?`${an.length===1?"A questão":"As questões"} ${fgLista(an)} ${an.length===1?"foi anulada":"foram anuladas"}: o ponto vale para todos, como na prova.`:"Nenhuma questão foi anulada nesta prova."}</span></li>
    <li>${ic("livro")}<span><b>A banca não comenta as questões.</b> No resultado, cada uma tem o atalho para estudar o tema na apostila, e as erradas vão para o caderno de erros.</span></li>
   </ul>
   <div class="pre-corr"><p id="pre-corr-t"><b>Correção</b><small>${S.cfg.corrFinal?"O gabarito aparece só no resultado, como no dia da prova":"O gabarito aparece logo depois de cada resposta"}</small></p>
    <div class="cores" role="group" aria-labelledby="pre-corr-t">${[["0","Na hora","ok"],["1","No final","relogio"]].map(([k,t,i])=>`<button data-acao="cfg-corr" data-v="${k}" aria-pressed="${(S.cfg.corrFinal?"1":"0")===k}"><span class="ico-op">${ic(i)}</span><span>${t}</span></button>`).join("")}</div></div>
   <p class="fg-aviso">${ic("info")}<span>As questões são de ${ano}. Se uma lei mudou depois da prova, o gabarito oficial pode não valer mais hoje: confira em <button class="fg-link" data-acao="ir-raiz" data-tela="mudancas">O que mudou na lei</button>.</span></p>
  </div>${resEvolucao(key)}${botoes}</main>`}
{const t0=telaPre;telaPre=function(){return fgChaveN(rota.key)?telaPreFgv():t0()}}

/* ---------- resultado: nota de 0 a 80, como a FGV divulga ---------- */
function telaResFgv(a){const n=fgChaveN(a.key),P=fgInfo(n)||{n,anul:[]},r=res(a),st=stDe(a.key,r.pct),N=a.qids.length;
 const anul=(P.anul||[]).filter(x=>a.qids.includes(fgIdDe(n,x))),passou=r.ok>=N/2;
 const pm={};a.qids.forEach(id=>{const q=QMAP[id];if(!q)return;const x=pm[q.m]=pm[q.m]||{o:0,n:0};x.n++;if(a.resp[id]===0||q.fgv&&q.fgv.anul)x.o++});
 const erradas=a.qids.filter(id=>{const q=QMAP[id];return q&&!(q.fgv&&q.fgv.anul)&&a.resp[id]!==0}).length;
 const folga=r.ok-N/2;
 return topo("Resultado",`${n}º Exame de Ordem · prova da FGV`,{})+
 `<main class="wrap"><div class="placar ${st} fg-placar"><div class="pct">${r.ok}<small>/${N}</small></div><div><h2>${passou?(st==="perf"?"Gabaritou a prova!":"Aprovado na 1ª fase"):"Ainda não foi desta vez"}</h2>
  <p>${fgPl(r.ok,"certa","certas")} · ${fgPl(r.er,"errada","erradas")} · ${r.br} em branco · ${dur(a.tempo)}</p>
  <p>${passou?(folga>0?`Passou com ${fgPl(folga,"acerto","acertos")} de folga: a aprovação exige ${N/2}.`:"Passou na conta exata: a aprovação exige 40 acertos."):`Faltaram ${fgPl(-folga,"acerto","acertos")} para os ${N/2} da aprovação.`}${anul.length?` A nota inclui ${anul.length===1?`o ponto da questão ${anul[0]}, anulada`:`os pontos das questões ${fgLista(anul)}, anuladas`} pela FGV.`:""}</p></div></div>
  ${resEvolucao(a.key,a)}
  ${st==="perf"?versoCard(versoDaChave(a.key),"Gabarito perfeito · uma palavra para você"):""}
  <div class="botoes"><button class="botao cheio" data-acao="refazer-sim" data-key="${a.key}">Fazer a prova de novo</button>${erradas?`<button class="botao linha" data-fg="erradas">Refazer só as que errei (${erradas})</button><button class="botao linha" data-cad="abrir">${ic("caderno")} Abrir o caderno de erros</button>`:""}</div>
  <div class="secao" role="heading" aria-level="2">Desempenho por matéria</div><div class="desemp">${DIST.map(([m])=>m).filter(m=>pm[m]).map(m=>{const x=pm[m],p=Math.round(x.o*100/x.n);
   return `<div class="linha">${tile(META[m].cor,META[m].ic)}<div><div style="display:flex;justify-content:space-between;gap:8px"><span>${esc(META[m].nome)}</span><b style="font-family:var(--f-mono);font-weight:500">${x.o}/${x.n}</b></div><div class="trilho"><i class="f-ok" style="width:${p}%"></i><i class="f-er" style="width:${100-p}%"></i></div></div><span></span></div>`}).join("")}</div>
  <div class="secao" role="heading" aria-level="2">Correção, questão por questão</div>
  <p class="nota" style="margin-top:0">Toque numa questão para ver o enunciado inteiro, as alternativas e o gabarito.</p>
  ${fgCorrecao(a)}</main>`}
function fgCorrecao(a){return `<div class="revisao fg-correcao">${a.qids.map(id=>{const q=QMAP[id];if(!q||!q.fgv)return "";const F=q.fgv,x=a.resp[id],ord=a.ordem[id]||F.ord;
  const k=F.anul?"an":x===undefined?"br":x===0?"ok":"er",rot={an:"anulada",br:"em branco",ok:"certa",er:"errada"}[k];
  return `<details class="rev"><summary><span class="num ${k}" aria-label="Questão ${F.num}, ${rot}">${p2(F.num)}</span><span class="rq"><span class="rotulo">${esc(META[q.m].nome)}${F.anul?` · <b class="fg-an">anulada</b>`:""}</span><span class="fg-rq">${String(q.q).split("\n").map(t=>`<span>${esc(t)}</span>`).join("")}</span></span></summary>
  <div class="rbody">${ord.map((oi,p)=>{const certa=!F.anul&&oi===0,minha=oi===x;return `<p>${certa?"<b>":""}${LETRAS[p]}) ${esc(q.o[oi])}${certa?` <span class="gab">${ic("ok")}gabarito</span></b>`:""}${minha&&!certa?` <span class="${F.anul?"fg-sua":"c-er"}">(sua resposta)</span>`:""}</p>`}).join("")}
  ${F.anul?`<p class="fg-anul-txt">${ic("exc")}<span>Anulada pela FGV: o ponto vale para todos.${F.gp?` No gabarito preliminar, a resposta era a letra ${F.gp}.`:""}</span></p>`:""}
  <p class="fund">${esc(q.f)}</p>${candidatosQ(q).length?`<button class="link-tema" data-acao="estudar" data-q="${q.id}">${ic("livro")} Estudar este tema na apostila</button>`:""}${botaoRep(q)}</div></details>`}).join("")}</div>`}
{const t0=telaRes;telaRes=function(){const a=S.hist.find(x=>x.id===rota.id);if(a&&fgChaveN(a.key)){if(a.qids.some(id=>!QMAP[id])){const n=fgChaveN(a.key);if(!FG_FALHA[n])fgGarante(n);
   return topo("Resultado",a.titulo,{})+`<main class="wrap">${FG_FALHA[n]?vazio("provas","Sem internet para abrir a correção","A correção usa as questões da prova, que ficam guardadas no aparelho depois da primeira vez que ela abre com internet.",`<button class="botao cheio" data-fg="tentar" data-n="${n}">Tentar de novo</button>`):`<div class="fg-abrindo" role="status">${vazio("provas","Abrindo a correção…","")}</div>`}</main>`}
  return telaResFgv(a)}return t0()}}
/* refazer só as erradas (sem as anuladas), na ordem e com as alternativas do caderno */
function fgRefazerErradas(){const x=S.hist.find(y=>y.id===rota.id);if(!x)return;
 const ids=x.qids.filter(id=>{const q=QMAP[id];return q&&!(q.fgv&&q.fgv.anul)&&x.resp[id]!==0});if(!ids.length)return;
 const ordem={};ids.forEach(id=>ordem[id]=(QMAP[id].fgv||{}).ord?QMAP[id].fgv.ord.slice():[0,1,2,3]);
 sessao={id:"a"+Date.now(),key:"rev:"+x.id,titulo:"Revisão",sub:x.titulo+" · "+(x.sub||""),inicio:Date.now(),status:"pausado",qids:ids,ordem,resp:{},tempo:0,limite:0,corrFinal:false,pos:0};
 S.hist.unshift(sessao);podarHist();idx=0;folha=false;confirmar=null;salvar();ir({tela:"quiz"})}

/* ---------- a lista das provas ---------- */
function fgItem(P){const key="fgv:"+P.n,e=estado(key),a=e.a,R=resDe(key),an=(P.anul||[]).length;
 const dados=`Prova de ${fgDataCurta(P.data)} · 80 questões${an?` · ${fgPl(an,"anulada","anuladas")}`:""}`;let sub,rodape;
 if(e.st==="nao"){sub=dados;rodape=`<span class="sim-barra" aria-hidden="true"><i style="width:0"></i></span>`}
 else if(e.st==="pausa"){const f=a.qids.filter(id=>a.resp[id]!==undefined).length;sub=`Respondeu ${f} de ${a.qids.length} · toque para continuar`;rodape=`<span class="sim-barra pausa" aria-hidden="true"><i style="width:${Math.round(f*100/Math.max(1,a.qids.length))}%"></i></span>`}
 else{const r=e.r,melhor=R&&R.n>1?Math.round(R.b*80/100):0;sub=`${r.ok} de 80 acertos${melhor>r.ok?` · melhor ${melhor}`:""} · ${dur(a.tempo)}`;rodape=contagem(r)}
 const tit=e.st==="aprov"||e.st==="perf"?"Aprovado":e.st==="reprov"?"Abaixo dos 40":ROTULO[e.st];
 return `<button class="item fg-item" data-acao="abrir" data-key="${key}"><span class="selo ${e.st}">${ic(SELO[e.st])}</span>
  <span style="min-width:0"><span class="item-tit">${P.n}º Exame de Ordem: ${tit}</span><br><span class="item-sub">${sub}</span><br>${rodape}</span>
  <span class="item-data">${a?quando(a.inicio):""}</span></button>`}
function telaProvas(){const L=FG_LISTA,feitas=L.filter(P=>{const s=estado("fgv:"+P.n).st;return s!=="nao"&&s!=="pausa"}),aprov=feitas.filter(P=>{const s=estado("fgv:"+P.n).st;return s==="aprov"||s==="perf"}).length;
 const de=L.length?`do ${L[L.length-1].n}º ao ${L[0].n}º Exame`:"";
 return topo("Provas anteriores da OAB","As provas reais da FGV · 1ª fase",{})+
 `<main class="wrap">${capaTela("provas","Treine com a prova de verdade",`As ${L.length} provas mais recentes da 1ª fase, ${de}: as 80 questões de cada uma, na ordem do caderno, e o gabarito definitivo da FGV.`)}
  ${estiloAtual()==="premium"?"":`<p class="nota">As ${L.length} provas mais recentes da 1ª fase, ${de}: as 80 questões de cada uma, na ordem do caderno, e o gabarito definitivo da FGV.</p>`}
  <ul class="fg-regras"><li>${ic("relogio")}<span><b>5 horas</b><small>como no dia</small></span></li><li>${ic("alvo")}<span><b>40 de 80</b><small>para passar</small></span></li><li>${ic("ok")}<span><b>Anuladas</b><small>ponto para todos</small></span></li></ul>
  ${feitas.length?`<p class="fg-placar-geral">${ic("barras")}<span>Você já fez <b>${fgPl(feitas.length,"prova","provas")}</b> de ${L.length}${aprov?` e passou em <b>${aprov}</b>`:""}.</span></p>`:""}
  <div class="lista fg-lista">${L.map(fgItem).join("")}</div>
  <p class="nota fg-fonte">Fonte: cadernos de prova e gabaritos publicados pela FGV em oab.fgv.br. As questões são as da época de cada prova: se uma lei mudou depois, o gabarito oficial pode não valer mais hoje.</p></main>`}
/* atalho na tela do Simulado OAB */
function blocoProvas(){const L=FG_LISTA;if(!L.length)return "";const f=L.filter(P=>estado("fgv:"+P.n).st!=="nao").length;
 return `<div class="secao" role="heading" aria-level="2">Provas anteriores</div>
 <button class="btn-mp fg-card" data-fg="lista"><span class="btn-mp-ic" aria-hidden="true">${ic("prancheta")}</span><span><b>As provas reais da FGV</b><small>${L.length} provas, do ${L[L.length-1].n}º ao ${L[0].n}º Exame, com o gabarito oficial e as anuladas marcadas${f?` · você já fez ${f}`:""}</small></span>${ic("prox")}</button>`}

/* ilustração: o caderno de prova, a folha de respostas sendo marcada e o carimbo de aprovado */
ILU.provas=`<g class="fg-cad"><rect x="48" y="36" width="80" height="102" rx="7" class="f-s s-t" stroke-width="2" transform="rotate(-7 88 87)"/>`+
 `<rect x="58" y="28" width="82" height="106" rx="7" class="f-w s-t" stroke-width="2.5"/><path d="M58 35a7 7 0 0 1 7-7h68a7 7 0 0 1 7 7v17H58z" class="f-t"/>`+
 `<rect x="68" y="36" width="34" height="5" rx="2.5" class="f-w"/><rect x="68" y="44" width="22" height="3.5" rx="1.75" class="f-w" opacity=".7"/>`+
 `<path d="M99 64v26M86 70h26" class="s-t" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M86 70l-6 12h12zM112 70l-6 12h12z" class="f-a s-t" stroke-width="1.6" stroke-linejoin="round"/><rect x="92" y="90" width="14" height="4" rx="2" class="f-t"/>`+
 `<rect x="68" y="104" width="62" height="4" rx="2" class="f-s"/><rect x="68" y="113" width="48" height="4" rx="2" class="f-s"/><rect x="68" y="122" width="56" height="4" rx="2" class="f-s"/></g>`+
 `<g class="fg-folha" transform="rotate(6 172 96)"><rect x="140" y="48" width="64" height="88" rx="6" class="f-w s-t" stroke-width="2.5"/><rect x="150" y="57" width="30" height="5" rx="2.5" class="f-t"/>`+
 [0,1,2,3,4].map(i=>[0,1,2,3].map(j=>`<circle cx="${156+j*12}" cy="${76+i*12}" r="4" class="${j===[2,0,3,1,2][i]?"f-t fg-bolha":"f-w s-t"}" stroke-width="1.4"${j===[2,0,3,1,2][i]?` style="--k:${i}"`:""}/>`).join("")).join("")+`</g>`+
 `<g class="fg-carimbo"><circle cx="196" cy="42" r="17" class="f-b"/><circle cx="196" cy="42" r="12.5" fill="none" class="s-t" stroke-width="1.6" stroke-dasharray="3 2.4"/><path d="M189 42.5l4.6 4.6 9-9.6" fill="none" class="s-t" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`;

/* ---------- ações ---------- */
document.addEventListener("click",e=>{const b=e.target.closest("[data-fg]");if(!b||!b.closest("#app"))return;
 switch(b.dataset.fg){
  case "lista":gaveta=false;ir({tela:"provas"});break;
  case "tentar":{const n=+b.dataset.n;delete FG_FALHA[n];fgGarante(n);rota.manterScroll=true;render();break}
  case "erradas":fgRefazerErradas();break}});
/* o progresso guardado pode ter questões de provas que ainda não carregaram (também depois de restaurar um backup) */
{const r0=render;render=function(){const x=r0.apply(this,arguments);try{fgPrecarregar()}catch(e){}return x}}
