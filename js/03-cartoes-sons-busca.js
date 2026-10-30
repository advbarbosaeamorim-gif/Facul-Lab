"use strict";
/* ---------- cartões de memorização (revisão espaçada) ---------- */
const INTERV=[0,1,3,7,15,30,60,120];
function cartoesDe(d){const P=paginas(d);const out=[];P.secs.forEach((s,k)=>{let j=0;s.corpo.split("\n").forEach(l=>{l=l.trim();if(l.startsWith("?? ")){const x=l.slice(3);const m=x.indexOf(" | ");if(m>0)out.push({id:`${d}:${k+1}:${j}`,d,k:k+1,p:x.slice(0,m),r:x.slice(m+3)});j++}})});return out}
const estC=id=>(S.cards&&S.cards[id])||null;
const DIA=864e5;
/* Cada cartão guarda o intervalo atual (iv, em dias) e a facilidade (ef). Acertar multiplica o intervalo pela facilidade;
   errar zera o intervalo e torna o cartão um pouco mais "difícil", para ele voltar com mais frequência. Cartões antigos (só com b) são convertidos. */
function sr(s){s=s||{};if(s.iv===undefined){s.iv=s.b?INTERV[Math.min(INTERV.length-1,s.b)]:0;s.ef=2.5}if(!s.ef)s.ef=2.5;return s}
function proxIv(s0,nota){const s=sr(Object.assign({},s0));let iv=s.iv||0,ef=s.ef;
 if(nota===0)return {iv:0,ef:Math.max(1.3,ef-0.2)};
 if(nota===1){iv=iv<1?1:Math.max(iv+1,Math.round(iv*1.2));ef=Math.max(1.3,ef-0.15)}
 else if(nota===2){iv=iv<1?1:iv<3?3:Math.round(iv*ef)}
 else{iv=iv<1?4:Math.round(Math.max(iv,1)*ef*1.3)+1;ef=Math.min(3.2,ef+0.15)}
 return {iv:Math.min(365,iv),ef}}
const txtIv=d=>d<1?"hoje":d===1?"amanhã":d<30?`em ${d} dias`:d<60?"em 1 mês":`em ${Math.round(d/30)} meses`;
function contaVencidos(){const now=Date.now();return Object.keys(S.cards||{}).filter(id=>S.cards[id].due<=now).length}
function infoDeck(d){const cs=cartoesDe(d);const now=Date.now();let novos=0,venc=0;cs.forEach(c=>{const s=estC(c.id);if(!s)novos++;else if(s.due<=now)venc++});return {cs,novos,venc}}
let deck=null;
function montarDeck(ds,novosMax){const now=Date.now();let v=[],n=[];ds.forEach(d=>{cartoesDe(d).forEach(c=>{const s=estC(c.id);if(!s)n.push(c);else if(s.due<=now)v.push(c)})});
 v.sort((a,b)=>estC(a.id).due-estC(b.id).due);return emb(v).concat(n.slice(0,novosMax))}
function iniciarDeck(ds,novosMax,titulo){Promise.all([...new Set(ds.map(periodoDe))].map(carregarApP)).then(()=>{const q=montarDeck(ds.filter(d=>apOk(periodoDe(d))),novosMax);
  deck={titulo,q,pos:0,virado:false,ok:0,er:0,tot:q.length};ir({tela:"cartao"})})}
function telaCartoes(){const i=rota.p===undefined?periodo:rota.p;rota.p=i;if(!apOk(i))return aguardandoAp(i,"Cartões de memorização");
 const ds=PERIODOS[i].filter(d=>window.APOSTILA[i].mat&&window.APOSTILA[i].mat[d]);const venc=contaVencidos();
 const extra=`<div class="periodos" role="group" aria-label="Período">${PERIODOS.map((_,j)=>`<button data-acao="cards-per" data-p="${j}" aria-pressed="${i===j}">${j+1}º período</button>`).join("")}</div>`;
 return topo("Cartões de memorização","Perguntas das apostilas com revisão espaçada",{menu:true,extra})+
 `<main class="wrap">${capaTela("cartas","Memorize sem decorar","Tente lembrar antes de virar. O app traz cada cartão de volta na hora certa.")}${Object.keys(S.cards||{}).length?"":`<div class="dica"><p style="margin:0">Leia a pergunta, tente responder de cabeça e só depois vire o cartão. Depois diga como foi: <b>Errei</b>, <b>Difícil</b>, <b>Acertei</b> ou <b>Fácil</b>. Cada cartão aprende o seu ritmo: o que você acerta com facilidade volta cada vez mais tarde, e o que você erra volta logo, até fixar.</p></div>`}
 ${venc?`<button class="card destaque" data-acao="cards-venc" style="margin-top:12px">${tile("var(--lacre)","refazer")}<b>Revisar os ${venc} cartões de hoje</b><small>Cartões de todas as matérias que chegaram no dia de revisão</small></button>`:""}
 <div class="secao" role="heading" aria-level="2">${i+1}º período</div><div class="lista">${ds.map(d=>{const f=infoDisc(d);const x=infoDeck(d);
  return `<button class="item" data-acao="cards-disc" data-d="${d}" ${x.cs.length?"":"disabled"}>${tile(f.cor,f.ic)}<span style="min-width:0"><span class="item-tit">${esc(f.nome)}</span><br><span class="item-sub">${x.cs.length} cartões · ${x.novos} novos · ${x.venc} para revisar</span></span><span class="item-data">${ic("prox")}</span></button>`}).join("")}</div></main>`}
function telaCartao(){if(!deck)return topo("Cartões","",{})+`<main class="wrap">${vazio("cartas","Nenhuma sessão aberta","Escolha uma matéria para estudar os cartões dela, ou revise os que chegaram no dia de hoje.",`<button class="botao cheio" data-acao="ir-raiz" data-tela="cartoes">Escolher cartões</button>`)}</main>`;
 if(deck.pos>=deck.q.length){const v=versoGeral(deck.tot+deck.ok);
  if(!deck.tot)return topo(deck.titulo,"Tudo em dia",{})+`<main class="wrap">${vazio("cartas","Nada para revisar agora","Todos os cartões estão em dia. Volte amanhã, ou estude cartões novos de uma matéria: eles entram na revisão espaçada a partir da primeira resposta.",`<button class="botao cheio" data-acao="ir-raiz" data-tela="cartoes">Escolher cartões novos</button>`)}</main>`;
  return topo(deck.titulo,"Sessão concluída",{})+`<main class="wrap"><div class="placar ${deck.er?"aprov":"perf"}"><div class="pct">${deck.tot}</div><div><h2>Sessão concluída</h2><p>${deck.ok} acertos de primeira · ${deck.er} para rever</p><p>${(()=>{const now=Date.now();const am=Object.keys(S.cards||{}).filter(id=>S.cards[id].due<=inicioDia(now)+2*DIA).length;return am?`Amanhã: ${am} ${am>1?"cartões":"cartão"} para revisar.`:"Nenhum cartão marcado para amanhã."})()}</p></div></div>${versoCard(v,"Para seguir firme")}
  <div class="botoes">${rvFimDeck()}<button class="botao ${deck.rv?"linha":"cheio"}" data-acao="voltar">Voltar</button></div></main>`}
 const c=deck.q[deck.pos];const f=infoDisc(c.d);const s=estC(c.id);
 const lab=n=>n===0?"volta nesta sessão":txtIv(proxIv(s,n).iv);
 return topo(deck.titulo,`Cartão ${deck.pos+1} de ${deck.q.length}`,{extra:`<div class="progresso-leitura"><i style="width:${Math.round(deck.pos*100/deck.q.length)}%"></i></div>`})+
 `<main class="wrap"><div class="flash" style="--c:${f.cor}">${ilustra(AP_DISC[c.d]||"livros",f.cor)}<div class="flash-cab">${tile(f.cor,f.ic)}<span>${esc(nomeCurto(f.nome))} · Tema ${c.k}${s?(s.lap?` · errou ${s.lap}×`:""):" · novo"}</span></div>
 <p class="flash-q">${inl(c.p)}</p>${deck.virado?`<div class="flash-r">${inl(c.r)}</div>`:""}</div>
 ${deck.virado?`<p class="nota-q" id="pergunta-nota">Como foi lembrar a resposta?</p><div class="notas-flash" role="group" aria-labelledby="pergunta-nota"><button class="botao linha f-er" data-acao="card-nota" data-v="0">Errei<small>${lab(0)}</small></button><button class="botao linha" data-acao="card-nota" data-v="1">Difícil<small>${lab(1)}</small></button><button class="botao linha" data-acao="card-nota" data-v="2">Acertei<small>${lab(2)}</small></button><button class="botao linha f-ok" data-acao="card-nota" data-v="3">Fácil<small>${lab(3)}</small></button></div>
  <button class="link-tema" data-acao="abrir-tema" data-d="${c.d}" data-k="${c.k}">${ic("livro")} Ver este tema na apostila</button>`
 :`<div class="botoes"><button class="botao cheio" data-acao="card-virar">Mostrar resposta</button></div>`}</main>`}
function avaliarCartao(nota){const c=deck.q[deck.pos];S.cards=S.cards||{};const s=sr(S.cards[c.id]||{b:0,due:0,n:0});const agora=Date.now();const r=proxIv(s,nota);s.ef=r.ef;
 if(nota===0){s.iv=0;s.b=0;s.lap=(s.lap||0)+1;s.due=agora+10*60*1000;if(!c.rep){deck.q.push(Object.assign({},c,{rep:1}))}deck.er+=c.rep?0:1}
 else{/* pequena variação nos intervalos longos evita que muitos cartões vençam no mesmo dia */
  let iv=r.iv;if(iv>=7)iv=Math.max(1,iv+Math.round(iv*0.06*(Math.random()*2-1)));s.iv=iv;s.b=INTERV.findIndex(x=>x>=iv);if(s.b<0)s.b=INTERV.length-1;
  s.due=inicioDia(agora)+iv*DIA;if(!c.rep)deck.ok++}
 s.n=(s.n||0)+1;s.t=agora;S.cards[c.id]=s;marcarDia("c");salvar();deck.pos++;deck.virado=false;anunciar(nota===0?"O cartão volta ainda nesta sessão":"Próxima revisão "+txtIv(s.iv))}

/* ---------- revisão das apostilas lidas e tela "Revisar hoje" ---------- */
const INTERV_AP=[1,7,15,30,60];
function agendaAp(){S.revAp=S.revAp||{};Object.keys(S.lidos||{}).forEach(d=>{if(!S.revAp[d])S.revAp[d]={n:0,prox:inicioDia(S.lidos[d])+864e5}});Object.keys(S.revAp).forEach(d=>{if(!(S.lidos&&S.lidos[d]))delete S.revAp[d]});return S.revAp}
function apsVencidas(){const A=agendaAp();const now=Date.now();return Object.keys(A).filter(d=>A[d].prox<=now&&DISC[d])}
function errosPendentes(){return Object.keys(S.stats).filter(k=>S.stats[k].u===0&&QMAP[k]).length}
function itensHoje(){return contaVencidos()+apsVencidas().length+(errosHoje().length?1:0)}
function itemPlano(feito,acao,attrs,cor,icn,tit,sub,desab){return `<button class="item plano${feito?" feito":""}" data-acao="${acao}" ${attrs||""} ${desab?"disabled":""}>${tile(feito?"var(--ok)":cor,feito?"ok":icn)}<span style="min-width:0"><span class="item-tit">${tit}</span><br><span class="item-sub">${sub}</span></span><span class="item-data">${ic("prox")}</span></button>`}
/* anel de progresso da meta e semana de estudo */
function anel(v,max,rot){const p=max?Math.min(1,v/max):0;const C=2*Math.PI*42;
 return `<svg class="anel" viewBox="0 0 100 100" role="img" aria-label="${esc(rot)}"><circle cx="50" cy="50" r="42" class="anel-t"/><circle cx="50" cy="50" r="42" class="anel-v${p>=1?" cheio":""}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-p)).toFixed(1)}" transform="rotate(-90 50 50)"/></svg>`}
/* três letras: só a inicial deixava "S D S T Q Q S", com três S e dois Q */
const DIA_CURTO=["dom","seg","ter","qua","qui","sex","sáb"];
function semana(){const D=S.dias||{};const fmt=new Intl.DateTimeFormat("pt-BR",{weekday:"long"});let h="",n=0;
 for(let k=6;k>=0;k--){const d=new Date();d.setDate(d.getDate()-k);const on=temAtiv(D[hojeStr(d.getTime())]);if(on)n++;
  h+=`<li class="dia${on?" on":""}${k===0?" hoje":""}" style="--d:${6-k}"><i aria-hidden="true">${on?ic("ok"):""}</i><span aria-hidden="true">${DIA_CURTO[d.getDay()]}</span><span class="sr">${fmt.format(d)}${k===0?" (hoje)":""}: ${on?"estudou":"sem estudo"}</span></li>`}
 return `<ol class="semana" aria-label="Estudo nos últimos 7 dias: ${n} de 7">${h}</ol>`}
/* ---------- chama da ofensiva e calendário da prova ---------- */
function chamaViva(seq){const on=seq>0;const nv=seq>=30?" n3":seq>=7?" n2":"";
 return `<button class="chama-viva${on?nv:" apagada"}" data-acao="chama" aria-label="${on?`Ofensiva de ${seq} dia${seq===1?"":"s"} seguido${seq===1?"":"s"}. Toque para atiçar a chama`:"Ofensiva apagada. Estude hoje para acender a chama"}"><svg viewBox="0 0 64 80" aria-hidden="true" focusable="false"><defs><linearGradient id="cv-g1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e3321b"/><stop offset=".55" stop-color="#ff7a1a"/><stop offset="1" stop-color="#ffb52e"/></linearGradient><linearGradient id="cv-g2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff951f"/><stop offset="1" stop-color="#ffd84a"/></linearGradient><radialGradient id="cv-g3" cx=".5" cy=".78" r=".65"><stop offset="0" stop-color="#fffbea"/><stop offset="1" stop-color="#ffe26a"/></radialGradient></defs>
 <ellipse class="cv-brilho" cx="32" cy="75" rx="22" ry="4.5"/>
 <g class="cv-ext"><path fill="url(#cv-g1)" d="M32 78C16 78 6 67 6 53c0-12 7-20 13-27 1 6 4 10 8 11-1-13 5-25 17-33-2 11 3 18 9 26 4 6 7 12 7 21 0 16-12 27-28 27z"/></g>
 <g class="cv-mei"><path fill="url(#cv-g2)" d="M32 78c-10 0-17-7-17-16 0-8 5-13 9-18 1 4 3 7 6 8 0-7 3-13 9-17-1 7 2 11 5 16 3 4 5 8 5 13 0 8-7 14-17 14z"/></g>
 <g class="cv-int"><path fill="url(#cv-g3)" d="M32 78c-5 0-9-4-9-9 0-5 3-8 6-11 1 3 2 4 4 5 1-3 2-6 5-8 0 4 1 6 2 9 1 2 1 4 1 6 0 5-4 8-9 8z"/></g></svg></button>`}
const MESES_C=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
function calProva(x){const p=x&&x.dt,falta=x?x.n:null;
 if(!p||falta===null)return `<button class="cal-prova vazio" data-acao="ir-raiz" data-tela="config" aria-label="Definir a data da prova nas configurações"><span class="cal-in"><span class="cal-pag"><span class="cal-mes">prova</span><span class="cal-dia">?</span><span class="cal-sem">definir</span></span></span></button>`;
 const d=new Date(p+"T12:00:00");const sem=new Intl.DateTimeFormat("pt-BR",{weekday:"short"}).format(d).replace(".","");const ok=falta>=0;const semanas=falta>=14;
 return `<button class="cal-prova" data-acao="cal-vira" aria-label="${esc(x.nome||"Prova")} em ${d.getDate()} de ${new Intl.DateTimeFormat("pt-BR",{month:"long"}).format(d)}. Toque para virar o calendário"><span class="cal-in"><span class="cal-pag cal-frente"><span class="cal-mes">${MESES_C[d.getMonth()]}</span><span class="cal-dia">${d.getDate()}</span><span class="cal-sem">${sem}</span></span><span class="cal-pag cal-verso"><span class="cal-mes">faltam</span><span class="cal-dia">${ok?(semanas?Math.floor(falta/7):falta):"0"}</span><span class="cal-sem">${ok?(semanas?"semanas":falta===1?"dia":"dias"):"passou"}</span></span></span></button>`}
/* ---------- animações e efeitos interativos ---------- */
function animOn(){if(S.cfg&&S.cfg.anim==="off")return false;try{return !(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){return true}}
function contar(el){const t=el.firstChild;if(!t||t.nodeType!==3)return;const m=t.nodeValue.match(/^(\d+)(%?)$/);if(!m)return;const fim=+m[1];if(fim<2)return;const t0=performance.now(),dur=750;
 (function p(now){const k=Math.min(1,(now-t0)/dur);t.nodeValue=Math.round(fim*(1-Math.pow(1-k,3)))+m[2];if(k<1&&el.isConnected)requestAnimationFrame(p);else t.nodeValue=fim+m[2]})(t0)}
function animarTela(nova){document.documentElement.setAttribute("data-anim",S.cfg&&S.cfg.anim==="off"?"off":"on");
 if(!nova||!animOn())return;const m=document.querySelector("#app main");if(!m)return;let i=0;const GRUPO=".lista,.grade-mat,.hoje-stats,.estilos,.cores,.paletas,.opcoes";
 const marca=x=>{x.style.setProperty("--i",Math.min(i++,14));x.classList.add("ent")};
 [...m.children].forEach(c=>{if(c.matches(GRUPO))[...c.children].forEach(marca);else marca(c)});
 m.querySelectorAll(".hs b").forEach(contar);
 m.querySelectorAll(".anel-v").forEach(c=>{const fim=c.getAttribute("stroke-dashoffset");c.style.transition="none";c.style.strokeDashoffset=c.getAttribute("stroke-dasharray");requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.transition="";c.style.strokeDashoffset=fim}))});
 m.querySelectorAll(".b7").forEach((b,k)=>b.style.setProperty("--i",k));
 m.querySelectorAll(".sb-num b").forEach(contarBR);
 m.classList.add("anim-on")}
function faiscas(btn){if(!animOn())return;btn.classList.remove("aticar");void btn.offsetWidth;btn.classList.add("aticar");if(btn.classList.contains("apagada"))return;
 for(let k=0;k<10;k++){const s=document.createElement("span");s.className="faisca";const a=-Math.PI/2+(Math.random()-.5)*2.2,r=26+Math.random()*30;s.style.setProperty("--dx",(Math.cos(a)*r).toFixed(1)+"px");s.style.setProperty("--dy",(Math.sin(a)*r).toFixed(1)+"px");s.style.animationDelay=(Math.random()*.12).toFixed(2)+"s";btn.appendChild(s);setTimeout(()=>s.remove(),1100)}}
function estouro(el,cores){if(!el||!animOn())return;const r=el.getBoundingClientRect();const cx=r.left+Math.min(r.width,60)/2+8,cy=r.top+r.height/2;
 for(let k=0;k<16;k++){const s=document.createElement("span");s.className="estouro";s.style.left=cx+"px";s.style.top=cy+"px";s.style.background=cores[k%cores.length];const a=Math.random()*Math.PI*2,d=40+Math.random()*50;
  s.style.setProperty("--dx",(Math.cos(a)*d).toFixed(0)+"px");s.style.setProperty("--dy",(Math.sin(a)*d-20).toFixed(0)+"px");s.style.setProperty("--r",Math.round(Math.random()*540)+"deg");document.body.appendChild(s);setTimeout(()=>s.remove(),900)}}
function efeitoResposta(certo){if(!animOn())return;const ok=document.querySelector("#app .alt.certa"),er=document.querySelector("#app .alt.errada");
 if(certo&&ok){ok.classList.add("anim-ok");estouro(ok,["#3bb273","#f2b632","#2e86ab","#ffffff"])}else if(er){er.classList.add("anim-err");if(ok)ok.classList.add("anim-ok")}
 else{const sel=document.querySelector('#app .alt[aria-checked="true"]');if(sel)sel.classList.add("anim-ok")}}
function efeitoCartao(cls){if(!animOn())return;const f=document.querySelector("#app .flash");if(f){f.classList.remove("vira","desliza");void f.offsetWidth;f.classList.add(cls)}}
/* ---------- sons e vibração ----------
   Tudo gerado na hora pelo Web Audio (nenhum arquivo para baixar, funciona offline), mas imitando instrumentos de verdade:
   marimba de madeira, kalimba, um "coral" macio de fundo, papel, fogo e madeira batendo. Tudo passa por uma sala com eco curto
   (reverb) e um filtro que corta o agudo áspero, e cada nota varia um pouquinho de altura e força, como tocada à mão.
   S.cfg.som: "on" (som + vibração), "som" (só som), "vib" (só vibração) ou "off". O erro tem um som macio, para não punir. */
let AC=null,ofensivaNova=false;
const somModo=()=>(S.cfg&&S.cfg.som)||"on";
const somTocaSom=()=>{const m=somModo();return m==="on"||m==="som"},somVibra=()=>{const m=somModo();return m==="on"||m==="vib"};
const SOM_OP=[["on","Som e vibração","Sons suaves e um toque no celular","som"],["som","Só som","Sons, sem vibrar","nota"],["vib","Só vibrar","Sem som, só um toque no celular","vibra"],["off","Desligados","Silêncio total","mudo"]];
function audio(){if(AC)return AC;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
 try{if(navigator.audioSession)navigator.audioSession.type="ambient"}catch(e){}/* no iPhone, respeita o modo silencioso e não para a música */
 try{AC=new C();const comp=AC.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;comp.connect(AC.destination);
  /* corta o chiado agudo: o que deixa um som "de robô" é o agudo puro e reto */
  const lp=AC.createBiquadFilter();lp.type="lowpass";lp.frequency.value=5200;lp.Q.value=.5;lp.connect(comp);
  /* sala pequena: um eco curto e escuro, que deixa tudo mais quente */
  const sr=AC.sampleRate,n=Math.floor(sr*1.7),ir=AC.createBuffer(2,n,sr);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);let y=0;for(let i=0;i<n;i++){y+=.22*((Math.random()*2-1)-y);d[i]=y*Math.pow(1-i/n,3.2)*(i<sr*.012?i/(sr*.012):1)}}
  const rv=AC.createConvolver();rv.buffer=ir;const molhado=AC.createGain();molhado.gain.value=.5;rv.connect(molhado);molhado.connect(lp);
  AC.saida=lp;AC.eco=rv;
  const nb=AC.createBuffer(1,sr,sr),nd=nb.getChannelData(0);for(let i=0;i<sr;i++)nd[i]=Math.random()*2-1;AC.ruido=nb}catch(e){AC=null}return AC}
const varia=(x,p)=>x*(1+(Math.random()*2-1)*p);
/* cada voz vai seca para a saída e um pouco para o eco */
function voz(a,eco){const g=a.createGain();g.connect(a.saida);if(eco){const e=a.createGain();e.gain.value=eco;g.connect(e);e.connect(a.eco)}return g}
function parcial(a,t,f,v,dec,dest,ataque,tipo){const o=a.createOscillator(),g=a.createGain();o.type=tipo||"sine";o.frequency.setValueAtTime(f,t);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+(ataque||.004));g.gain.exponentialRampToValueAtTime(.0001,t+dec);o.connect(g);g.connect(dest);o.start(t);o.stop(t+dec+.05)}
/* marimba: madeira macia, o parcial alto some rápido e fica só o corpo da nota */
function marimba(a,t,f,vol,dec,eco){f=varia(f,.004);vol=varia(vol,.08);dec=dec||.7;const d=voz(a,eco===undefined?.35:eco);
 parcial(a,t,f,vol,dec,d,.003);parcial(a,t,f*3.93,vol*.16,dec*.18,d,.002);parcial(a,t,f*9.2,vol*.04,dec*.06,d,.001);
 ruidoCurto(a,t,.018,f*2,vol*.25,d)}
/* kalimba / sininho de madeira: nota redonda com um brilho que se apaga devagar */
function kalimba(a,t,f,vol,dec,eco){f=varia(f,.004);vol=varia(vol,.08);dec=dec||1.2;const d=voz(a,eco===undefined?.5:eco);
 parcial(a,t,f,vol,dec,d,.006);parcial(a,t,f*1.004,vol*.35,dec*.8,d,.006);parcial(a,t,f*5.4,vol*.06,dec*.12,d,.002);parcial(a,t,f*2,vol*.08,dec*.5,d,.008)}
/* coral macio de fundo: duas cordas levemente desafinadas, filtradas, que entram e saem devagar */
function coral(a,t,fs,dur,vol){const d=voz(a,.6),lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.setValueAtTime(700,t);lp.frequency.linearRampToValueAtTime(1500,t+dur*.4);lp.frequency.linearRampToValueAtTime(600,t+dur);lp.Q.value=.6;lp.connect(d);
 const g=a.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+Math.min(.25,dur*.3));g.gain.setValueAtTime(vol,t+dur*.55);g.gain.exponentialRampToValueAtTime(.0001,t+dur);g.connect(lp);
 fs.forEach(f=>[-7,7].forEach(c=>{const o=a.createOscillator();o.type="sawtooth";o.frequency.value=f;o.detune.value=c+Math.random()*4;o.connect(g);o.start(t);o.stop(t+dur+.05)}))}
/* ruído filtrado: papel, sopro, fogo, batida de madeira */
function ruido(a,t,dur,o){const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),d=o.dest||voz(a,o.eco||.25);s.buffer=a.ruido;s.loop=true;
 fl.type=o.tipo||"bandpass";fl.Q.value=o.Q||1;fl.frequency.setValueAtTime(o.f1,t);if(o.f2)fl.frequency.exponentialRampToValueAtTime(o.f2,t+dur);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(o.vol,t+dur*(o.pico||.3));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 s.connect(fl);fl.connect(g);g.connect(d);s.start(t,Math.random()*.5);s.stop(t+dur+.05)}
function ruidoCurto(a,t,dur,f,vol,dest){ruido(a,t,dur,{f1:Math.min(f,4000),Q:.8,vol,pico:.08,dest})}
/* bolhinha: um "plop" curto e redondo */
function bolha(a,t,f,vol){f=varia(f,.04);const d=voz(a,.2),o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.setValueAtTime(f*.55,t);o.frequency.exponentialRampToValueAtTime(f,t+.035);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+.12);o.connect(g);g.connect(d);o.start(t);o.stop(t+.15)}
/* madeira batendo (martelo, carimbo): um baque grave com um estalo */
function baque(a,t,f,vol){const d=voz(a,.3),o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.setValueAtTime(f*1.8,t);o.frequency.exponentialRampToValueAtTime(f,t+.05);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+.28);o.connect(g);g.connect(d);o.start(t);o.stop(t+.3);
 ruido(a,t,.06,{f1:1100,Q:1.2,vol:vol*.7,pico:.05,dest:d})}
/* estalos de lenha */
function estalos(a,t,n,dur,vol){for(let i=0;i<n;i++)ruido(a,t+Math.random()*dur,.02+Math.random()*.03,{tipo:"highpass",f1:1800+Math.random()*1500,Q:.7,vol:vol*(.5+Math.random()*.5),pico:.05,eco:.2})}
/* papel virando */
function papel(a,t,dur,vol){ruido(a,t,dur,{f1:3200,f2:1100,Q:.9,vol,pico:.35,eco:.2});ruido(a,t+dur*.45,dur*.6,{f1:1800,f2:700,Q:1.2,vol:vol*.6,pico:.2,eco:.2})}
const rolado=(a,t,fs,passo,vol,dec,inst)=>fs.forEach((f,i)=>(inst||marimba)(a,t+i*passo+Math.random()*.012,f,vol,dec));
/* notas (Hz) */
const N={G3:196,A3:220,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,G5:783.99,A5:880,C6:1046.5,D6:1174.7,E6:1318.5};
const SONS={
 acerto:a=>{const t=a.currentTime+.01;marimba(a,t,N.G4,.2,.55);marimba(a,t+.075,N.D5,.22,.85);kalimba(a,t+.075,N.G5,.05,1.1)},
 erro:a=>{const t=a.currentTime+.01;marimba(a,t,N.D4,.15,.35,.25);marimba(a,t+.12,N.A3,.15,.5,.25)},
 toque:a=>bolha(a,a.currentTime+.005,560,.24),
 vira:a=>papel(a,a.currentTime+.005,.2,.26),
 mes:a=>{const t=a.currentTime+.005;papel(a,t,.24,.24);marimba(a,t+.26,N.E4,.1,.25,.2)},
 fim:a=>{const t=a.currentTime+.01;rolado(a,t,[N.C4,N.E4,N.G4,N.C5],.1,.17,.9)},
 aprovado:a=>{const t=a.currentTime+.01;rolado(a,t,[N.C5,N.E5,N.G5],.09,.17,.9);coral(a,t+.2,[N.C4,N.E4,N.G4],1.5,.03);kalimba(a,t+.32,N.C6,.07,1.5)},
 gabarito:a=>{const t=a.currentTime+.01;rolado(a,t,[N.G4,N.C5,N.E5,N.G5,N.C6],.075,.16,.9);coral(a,t+.25,[N.C4,N.G4,N.E5,N.D5],2.2,.028);
  [N.E6,N.C6,N.G5,N.E6].forEach((f,i)=>kalimba(a,t+.45+i*.16,f,.045,1.4))},
 meta:a=>{const t=a.currentTime+.01;[N.E5,N.G5,N.A5,N.C6].forEach((f,i)=>kalimba(a,t+i*.11,f,.11,1.3));coral(a,t+.3,[N.F4,N.A4,N.C5],1.6,.03)},
 chama:a=>{const t=a.currentTime+.01;ruido(a,t,.7,{tipo:"lowpass",f1:220,f2:1400,Q:.8,vol:.22,pico:.5,eco:.3});estalos(a,t+.1,7,.7,.09);marimba(a,t+.25,N.G4,.12,.7);marimba(a,t+.34,N.D5,.12,.9)},
 fogo:a=>{const t=a.currentTime+.005;ruido(a,t,.38,{tipo:"lowpass",f1:260,f2:1100,Q:.8,vol:.28,pico:.4,eco:.25});estalos(a,t+.05,4,.35,.12)},
 segredo:a=>{const t=a.currentTime+.01;[N.C5,N.D5,N.E5,N.G5,N.A5,N.C6].forEach((f,i)=>kalimba(a,t+i*.07,f,.08,1.3));coral(a,t+.15,[N.C4,N.G4,N.E5],1.8,.026)},
 abre:a=>{const t=a.currentTime+.01;kalimba(a,t,N.G5,.08,1.1);kalimba(a,t+.1,N.C6,.07,1.3)},
 peso:a=>{const t=a.currentTime+.005;baque(a,t,170,.26);kalimba(a,t+.01,varia(N.A5,.03),.04,.5)},
 tira:a=>bolha(a,a.currentTime+.005,380,.22),
 martelo:a=>{const t=a.currentTime+.01;baque(a,t,120,.3);baque(a,t+.16,110,.22)},
 carimbo:a=>{const t=a.currentTime+.01;baque(a,t,90,.42);ruido(a,t+.02,.12,{tipo:"lowpass",f1:600,Q:.7,vol:.18,pico:.1})},
 pomba:a=>{const t=a.currentTime+.01;for(let i=0;i<5;i++)ruido(a,t+i*.085,.07,{f1:1300,f2:700,Q:.8,vol:.12*(1-i*.12),pico:.3,eco:.2});rolado(a,t+.35,[N.E5,N.G5,N.C6],.09,.07,1.2,kalimba)},
 coruja:a=>{const t=a.currentTime+.05,d=voz(a,.5);[[0,.32,415],[.42,.6,392]].forEach(([dt,dur,f])=>{const o=a.createOscillator(),lfo=a.createOscillator(),lg=a.createGain(),g=a.createGain(),lp=a.createBiquadFilter();
  o.type="triangle";o.frequency.setValueAtTime(f*1.04,t+dt);o.frequency.exponentialRampToValueAtTime(f*.96,t+dt+dur);lfo.frequency.value=5.5;lg.gain.value=5;lfo.connect(lg);lg.connect(o.frequency);
  lp.type="lowpass";lp.frequency.value=900;g.gain.setValueAtTime(.0001,t+dt);g.gain.linearRampToValueAtTime(.16,t+dt+.07);g.gain.exponentialRampToValueAtTime(.0001,t+dt+dur);
  o.connect(lp);lp.connect(g);g.connect(d);o.start(t+dt);lfo.start(t+dt);o.stop(t+dt+dur+.05);lfo.stop(t+dt+dur+.05)})},
 puxa:a=>bolha(a,a.currentTime+.005,320,.2)
};
const VIBRA={acerto:18,erro:[40,60,40],toque:8,vira:8,mes:10,fim:60,aprovado:[50,50,90],gabarito:[60,60,60,60,160],meta:[80,60,160],chama:[30,40,30,40,60],fogo:[12,30,12],
 segredo:[20,40,20,40,60],abre:15,peso:12,tira:8,martelo:[35,120,30],carimbo:45,pomba:[10,30,10,30,10],coruja:[20,180,30],puxa:6};
function som(nome){if(document.hidden)return;
 if(somVibra()&&VIBRA[nome]&&navigator.vibrate){try{navigator.vibrate(VIBRA[nome])}catch(e){}}
 if(!somTocaSom()||!SONS[nome])return;const a=audio();if(!a)return;
 try{if(a.state==="suspended")a.resume();SONS[nome](a)}catch(e){}}
/* o navegador só libera o áudio depois de um toque na tela */
document.addEventListener("pointerdown",()=>{if(!somTocaSom())return;const a=audio();if(a&&a.state==="suspended")a.resume().catch(()=>{})},{passive:true,capture:true});
document.addEventListener("pointerdown",e=>{if(!animOn())return;const el=e.target.closest(".card,.item,.botao,.alt,.opcoes button,.cores button,.estilos button,.paletas button");if(!el||el.disabled)return;
 const r=el.getBoundingClientRect();const t=Math.max(r.width,r.height)*2.2;const o=document.createElement("span");o.className="onda";o.style.width=o.style.height=t+"px";o.style.left=(e.clientX-r.left-t/2)+"px";o.style.top=(e.clientY-r.top-t/2)+"px";
 el.classList.add("onda-host");el.appendChild(o);setTimeout(()=>o.remove(),650)},{passive:true});
let iluInclinada=null;
document.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse"||!animOn())return;const box=e.target.closest&&e.target.closest(".hoje-hero,.capa-tela,.vazio-ilu");const ilu=box&&box.querySelector(".ilu");
 if(iluInclinada&&iluInclinada!==ilu){iluInclinada.style.removeProperty("--rx");iluInclinada.style.removeProperty("--ry");iluInclinada=null}
 if(!ilu)return;const r=box.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ilu.style.setProperty("--ry",(x*18).toFixed(1)+"deg");ilu.style.setProperty("--rx",(-y*14).toFixed(1)+"deg");iluInclinada=ilu},{passive:true});
document.addEventListener("click",e=>{const ilu=e.target.closest&&e.target.closest(".hoje-hero .ilu,.capa-tela .ilu,.vazio-ilu .ilu");if(!ilu||!animOn())return;ilu.classList.remove("pula");void ilu.getBoundingClientRect();ilu.classList.add("pula");setTimeout(()=>ilu.classList.remove("pula"),650)});
function dataHoje(){const t=new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long"}).format(new Date());return t.charAt(0).toUpperCase()+t.slice(1)}
function telaHoje(){const per=perAtual(),fs=fase(),F=FASES[fs];const venc=contaVencidos(),aps=apsVencidas(),errs=errosHoje().length;const seq=sequencia();const meta=metaDia();const hoje=(S.dias&&S.dias[hojeStr()])||{};const falta=diasProva();
 const PP=planoProvas();const dsPv=PP?[...PP.hoje,...PP.leve].map(x=>x.p.d):[];
 const foco0=discsFoco(),foco=foco0.filter(d=>!dsPv.includes(d));const precisa=[...new Set(foco0.concat(dsPv).map(periodoDe).filter(i=>i>=0&&!apOk(i)))];if(precisa.length)Promise.all(precisa.map(carregarApP)).then(()=>reRenderSe("hoje"));
 const sug=simSugerido();const tema=fs==="reta"?null:proximoTema(foco);const novos=novosDoFoco(foco);
 const resumoPer=per===null?null:per===9?(foco.length?periodoDe(foco[0]):null):per;
 const qOk=(hoje.q||0)>=meta,cOk=!venc&&(hoje.c||0)>0,lOk=(hoje.p||0)>0;
 const pv=PP?PP.hoje.map(grupoProva).join("")+(PP.leve.length?`<div class="lista plano-lista pp-leve">${PP.leve.map(itensProvaLeve).join("")}</div>`:""):"";
 let itens="";
 itens+=itemPlano(qOk,sug?"abrir":"proximo",sug?`data-key="${sug.key}"`:"","var(--toga)","alvo",`Questões: ${hoje.q||0} de ${meta}`,sug?`Sugestão: ${esc(sug.tit)} · ${esc(sug.sub)}`:"Faça um simulado para cumprir a meta");
 if(errs)itens+=itemPlano(false,"erradas-hoje","","var(--erro)","refazer",`Revisar questões erradas: ${errs}`,fs==="reta"?"Prioridade na reta final · cada acerto adia a próxima revisão":"Revisão espaçada: cada acerto adia a próxima (3, 7, 15 e 30 dias)");
 const fr=assuntoMaisFraco(per===null||per===9?OAB:foco.filter(d=>DISC[d]));
 if(fr)itens+=itemPlano(false,"treinar-ass",`data-sc="${fr.sc}" data-a="${esc(encodeURIComponent(fr.a))}"`,"var(--erro)","exc",`Ponto fraco: ${esc(fr.a)}`,`${esc(nomeCurto(nomeEscopo(fr.sc)))} · ${fr.pct}% de acerto em ${fr.v} questões`);
 itens+=itemPlano(cOk,venc?"cards-venc":"cards-foco","","var(--lacre)","cartas",venc?`Cartões para revisar: ${venc}`:novos?`Cartões novos: ${novos}`:"Cartões de memorização",venc?"Chegaram no dia de revisão; depois, faça os novos do seu foco":novos?(per===9?`De ${esc(META[materiaMaisFraca().m].nome)}, a matéria em foco agora`:`Das matérias do ${per+1}º período`):(hoje.c?`${hoje.c} revisados hoje`:"Nada pendente por hoje"),!venc&&!novos);
 if(fs==="reta"&&resumoPer!==null)itens+=itemPlano(false,"resumo",`data-p="${resumoPer}"`,"var(--nv2)","recibo",`Ler o resumo do ${resumoPer+1}º período`,"Na reta final, revise pelos resumos em vez de conteúdo novo");
 else if(tema)itens+=itemPlano(lOk,"abrir-tema",`data-d="${tema.d}" data-k="${tema.pg}"`,infoDisc(tema.d).cor,"livro",`Ler: ${esc(tema.tit)}`,`${esc(nomeCurto(infoDisc(tema.d).nome))} · tema ${tema.pg}${lOk?" · você já leu hoje":""}`);
 else if(per!==null&&!precisa.length)itens+=itemPlano(true,"ap",`data-p="${per===9?9:per}"`,"var(--ok)","livro","Apostilas do seu foco concluídas","Revise pelos mapas mentais quando eles aparecerem aqui");
 itens+=aps.map(d=>{const f=infoDisc(d);const n=S.revAp[d].n;return itemPlano(false,"rev-ap",`data-d="${d}"`,f.cor,f.ic,`Rever o mapa mental: ${esc(nomeCurto(f.nome))}`,`${n+1}ª revisão da apostila lida`)}).join("");
 const nTot=((pv+itens).match(/class="item plano/g)||[]).length,nFeito=((pv+itens).match(/class="item plano feito/g)||[]).length;const pend=nTot-nFeito;
 const tudo=qOk&&(cOk||!venc)&&!errs&&!aps.length;
 const titulo=tudo?"Plano de hoje cumprido":pend===1?"Falta 1 tarefa para hoje":`${pend} tarefas para hoje`;
 const linha=tudo?"Você fechou o dia. Se quiser ir além, revise um mapa mental ou adiante cartões novos.":(hoje.q||0)<meta?`Faltam ${meta-(hoje.q||0)} questões para a meta de ${meta}.`:"Meta de questões batida. Agora, revise o que está pendente.";
 return topo("Hoje",`${dataHoje()}`,{menu:true,dir:`<button class="icone" data-acao="ir-raiz" data-tela="config" aria-label="Configurações">${ic("eng")}</button>`})+
 `<main class="wrap hoje">${per===null?perRapido():""}${motivaBanner()}
 <section class="hoje-hero" aria-labelledby="hoje-tit">
  <div class="hh-txt"><p class="hh-fase">${esc(nomePer(per))} · ${esc(F.nome)}</p><h2 id="hoje-tit">${titulo}</h2><p class="hh-linha">${linha}</p></div>
  ${ilustra(tudo?"trofeu":"estudo","var(--toga-txt)")}
 </section>
 <div class="hoje-stats">
  <div class="hs hs-meta">${anel(hoje.q||0,meta,`${hoje.q||0} de ${meta} questões hoje`)}<div><b>${hoje.q||0}<small>/${meta}</small></b><span>questões hoje</span></div></div>
  <div class="hs hs-seq">${chamaViva(seq)}<div><b>${seq}</b><span>dia${seq===1?"":"s"} seguido${seq===1?"":"s"}</span></div>${semana()}</div>
  ${(()=>{const px=provaProx(),fx=px?px.n:null;return `<div class="hs hs-prova">${calProva(px)}<div><b>${fx===null||fx<0?"—":fx}</b><span>${fx===null?"sem data de prova":fx<0?"a prova já passou":(fx===1?"dia para ":"dias para ")+(px.nome?`a <em class="hs-qual">${esc(px.nome)}</em>`:"a prova")}</span></div></div>`})()}
 </div>
 
 ${blocoProvasHoje(PP)}${rvHoje()}${guardaLembrete()}
 <div class="secao-linha"><div class="secao" role="heading" aria-level="2">Plano de hoje</div><span class="contador">${nFeito} de ${nTot} feito${nFeito===1?"":"s"}</span></div>
 ${PP?`<div class="pp-intro"><p class="pp-etapa"><span class="pp-num">1</span><span><b>Prioridade: suas provas</b><small>${esc(explicaPP(PP))}</small></span></p>${PP.L.length>=2?agendaPP(PP):""}</div>${pv}
 <p class="pp-etapa"><span class="pp-num">2</span><span><b>Depois: ${per===9?"seu foco na OAB":per===null?"o restante do dia":"as outras matérias do período"}</b><small>Com a prova em dia, siga com a meta, as revisões e o resto do período.</small></span></p>`:""}
 <div class="lista plano-lista">${itens}</div>
 ${per!==null?`<div class="dica"><p style="margin:0"><b>${esc(F.nome)}.</b> ${esc(F.txt)} <button class="link-inline" data-acao="ir-raiz" data-tela="config">Alterar</button></p></div>`:""}
 <div class="secao" role="heading" aria-level="2">Atalhos</div><div class="grade-mat atalhos">
 <button class="card" data-acao="ir-raiz" data-tela="busca"><span class="at-ilu">${ilustra("lupa","var(--toga)")}</span><b>Buscar em tudo</b><small>Apostilas, questões, resumos e lei seca</small></button>
 <button class="card" data-acao="ir-raiz" data-tela="foco"><span class="at-ilu">${ilustra("foco","#e5484d")}</span><b>Modo foco</b><small>Pomodoro com a chama crescendo</small></button>
 <button class="card" data-acao="ir-raiz" data-tela="cartoes"><span class="at-ilu">${ilustra("cartas","var(--lacre)")}</span><b>Todos os cartões</b><small>Escolha uma matéria</small></button>
 <button class="card" data-acao="ir-raiz" data-tela="favs"><span class="at-ilu">${ilustra("marcador","var(--nv5)")}</span><b>Favoritos e anotações</b><small>Seus temas marcados</small></button>
 <button class="card" data-acao="ir-raiz" data-tela="caderno"><span class="at-ilu">${ilustra("caderno","var(--erro)")}</span><b>Caderno de erros</b><small>${cadPendentes()?`${cadPendentes()} para refazer`:"Seus erros viram lição"}</small></button>
 <button class="card" data-acao="ir-raiz" data-tela="metas"><span class="at-ilu">${ilustra("alvo","var(--ok)")}</span><b>Metas e desempenho</b><small>Sequência, meta e pontos fracos</small></button>
 <button class="card" data-acao="ir-raiz" data-tela="progresso"><span class="at-ilu">${ilustra("trofeu","var(--toga)")}</span><b>Progresso geral</b><small>Acertos em todas as matérias</small></button>
 <button class="card" data-acao="ir-raiz" data-tela="config"><span class="at-ilu">${ilustra("engrenagem","var(--muted)")}</span><b>Configurações</b><small>Período, prova e aparência</small></button></div></main>`}

/* ---------- progresso geral: o mesmo painel do Simulado OAB, somando tudo o que foi respondido ---------- */
function telaProgresso(){
 const c=S.hist.filter(a=>a.status==="concluido");
 const media=c.length?Math.round(c.reduce((s,a)=>s+res(a).pct,0)/c.length):0;
 const tm=c.length?c.reduce((s,a)=>s+a.tempo,0)/c.length:0;
 let ok=0,er=0;Object.keys(S.stats).forEach(k=>{if(!QMAP[k])return;if(S.stats[k].u)ok++;else er++});
 const tot=ok+er,n=QS.length;
 const ms=Object.keys(porM).filter(m=>META[m]).map(m=>{const x=statMat(porM[m]);return {m,...x,pct:x.v?Math.round(x.o*100/x.v):null}}).sort((a,b)=>(b.v>0)-(a.v>0)||(a.pct===null?0:a.pct)-(b.pct===null?0:b.pct)||META[a.m].nome.localeCompare(META[b.m].nome));
 const nh=itensHoje(),sq=sequencia();
 return topo("Progresso geral","Faculdade e Exame de Ordem, tudo junto",{menu:true})+
 `<main class="wrap">${capaTela("trofeu","Seu caminho até aqui","Todas as questões que você respondeu, nos simulados da OAB, por matéria e da faculdade.")}
  <button class="card hoje-card" data-acao="ir-raiz" data-tela="hoje">${tile("var(--lacre)","alvo")}<b>${nh?`Revisar hoje: ${nh} ${nh>1?"itens":"item"}`:"Plano de hoje"}</b><small>${perAtual()!==null?esc(nomePer(perAtual()))+" · ":""}${sq?`${sq} dia${sq>1?"s":""} seguido${sq>1?"s":""} de estudo · `:""}${esc(textoProva())}</small></button>
  <div class="metrica" style="margin-top:6px">${tile("var(--toga)","pct")}<div><div class="top"><span>Nota média nos simulados</span><b>${c.length?media+"%":"—"}</b></div><div class="trilho"><i class="f-toga" style="width:${media}%;background:var(--ok)"></i></div></div></div>
  <div class="metrica">${tile("var(--lacre)","relogio")}<div><div class="top"><span>Tempo médio por simulado</span><b>${c.length?dur(tm):"—"}</b></div><div class="trilho"><i class="f-lacre" style="width:${Math.min(100,tm*100/(5*3600))}%"></i></div></div></div>
  <div class="secao" role="heading" aria-level="2">Questões respondidas</div>
  <div class="metrica">${tile("var(--toga)","barras")}<div><div class="top"><span>${tot.toLocaleString("pt-BR")} de ${n.toLocaleString("pt-BR")}</span>${contagem({ok,er,br:0}).replace(/<span class="c-br"[\s\S]*?<\/span><\/span>(?=<\/span>$)/,"")}</div>
   <div class="trilho"><i class="f-ok" style="width:${ok*100/n}%"></i><i class="f-er" style="width:${er*100/n}%"></i></div></div></div>
  <div class="secao" role="heading" aria-level="2">% acertos por matéria</div>
  ${tot?"":`<p class="sinc" style="text-align:left">Responda questões de qualquer matéria e o acerto de cada uma aparece aqui.</p>`}
  <div class="assuntos">${ms.map(x=>`<button class="assunto" data-acao="materia" data-m="${x.m}">${tile(META[x.m].cor,META[x.m].ic)}<span class="barra${x.v?" tem":""}">${x.v?`<i class="ok" style="width:${x.pct}%"></i><i class="er" style="width:${100-x.pct}%"></i>`:""}<span><b>${esc(META[x.m].nome)}</b><em>${x.v?x.pct+"%":"—"}</em></span></span></button>`).join("")}</div>
  <p class="sinc">${esc(statusSinc)}</p></main>`}

/* ---------- busca nas apostilas ---------- */
const limpo=t=>String(t).replace(/\*\*|==/g,"").replace(/^(::\S+|!!|\?\?|>|#+|\* )\s?/gm,"").replace(/\s\|\s/g," — ").replace(/\|/g," ");
/* ---------- busca inteligente ----------
   A consulta vira um "casador": aceita acentos, plural e singular, "art."/"artigo"/"art 8º",
   e siglas de leis e tribunais ("CF" = "Constituição Federal"). Primeiro procura a expressão inteira;
   se nada aparece, procura todas as palavras em qualquer ordem; só então sugere uma correção. */
const SIGLAS=[["constituicao federal","constituicao da republica","constituicao de 1988","cf/88","cf 88","crfb/88","crfb","cf"],["codigo civil","cc/02","cc"],["codigo de processo civil","cpc/15","cpc"],["codigo penal","cp"],["codigo de processo penal","cpp"],["consolidacao das leis do trabalho","clt"],["codigo de defesa do consumidor","cdc"],["estatuto da crianca e do adolescente","eca"],["codigo tributario nacional","ctn"],["lei de execucao penal","lep"],["supremo tribunal federal","stf"],["superior tribunal de justica","stj"],["tribunal superior do trabalho","tst"],["ordem dos advogados do brasil","oab"],["ministerio publico","mp"],["habeas corpus","hc"],["mandado de seguranca","ms"],["acao direta de inconstitucionalidade","adi"],["arguicao de descumprimento de preceito fundamental","adpf"],["juizados especiais criminais","jecrim"],["lei de introducao as normas do direito brasileiro","lindb"]];
const PARADA=new Set("a o e de da do das dos em na no nas nos um uma por com que ao aos as os se sua seu para pela pelo".split(" "));
const escRe=t=>t.replace(/[.*+?^${}()|[\]\\\/]/g,"\\$&");
const SEP="[^a-z0-9§]+";
function variantesPalavra(w){if(/^\d+$/.test(w))return `(?<![0-9])${w}(?:\\s*[º°o](?![a-z]))?(?![0-9])`;
 let r;if(/oes$|aos$|aes$/.test(w))r=w.slice(0,-3)+"(?:ao|oes|aos|aes)";else if(/ao$/.test(w))r=w.slice(0,-2)+"(?:ao|oes|aos|aes)";
 else if(/ais$/.test(w))r=w.slice(0,-3)+"(?:al|ais)";else if(/al$/.test(w)&&w.length>4)r=w.slice(0,-2)+"(?:al|ais)";
 else if(/eis$/.test(w))r=w.slice(0,-3)+"(?:el|eis)";else if(/res$|zes$/.test(w))r=w.slice(0,-2)+"(?:es)?";else if(/[rz]$/.test(w)&&w.length>3)r=w+"(?:es)?";
 else if(/s$/.test(w)&&w.length>3)r=w.slice(0,-1)+"s?";else r=w.length>2?w+"s?":w;
 return `(?<![a-z0-9])${r}(?![a-z0-9])`}
function partesConsulta(nq){const t=nq.replace(/[“”"']/g," ").replace(/(\d)\s*[º°]/g,"$1").replace(/\b(arts?|artigos?)\.?\s*(\d)/g,"art $2").replace(/§\s*/g,"§ ").split(/[^a-z0-9§\/]+/).filter(Boolean);
 const out=[];for(let i=0;i<t.length;i++){const w=t[i];
  /* artigo, parágrafo e inciso seguidos de número */
  if(/^(art|arts|artigo|artigos)$/.test(w)&&/^\d+$/.test(t[i+1]||"")){out.push({re:`(?<![a-z])art(?:igo)?s?\\.?\\s*${t[i+1]}(?:\\s*[º°o](?![a-z]))?(?![0-9])`,w:"art "+t[i+1],fixo:1,tipo:"art"});i++;continue}
  if(/^(§|par|paragrafo)$/.test(w)&&/^\d+$/.test(t[i+1]||"")){out.push({re:`(?:§|par(?:agrafo)?\\.?)\\s*${t[i+1]}(?:\\s*[º°o](?![a-z]))?(?![0-9])`,w:"§ "+t[i+1],fixo:1});i++;continue}
  /* siglas e nomes de leis e tribunais: o trecho mais longo que bater */
  let achou=null;for(const g of SIGLAS)for(const v of g){const vt=v.split(/[^a-z0-9\/]+/);if(vt.every((x,k)=>t[i+k]===x)&&(!achou||vt.length>achou.n))achou={g,n:vt.length}}
  if(achou){const alts=[...achou.g].sort((a,b)=>b.length-a.length).map(v=>v.split(" ").map(escRe).join(SEP));out.push({re:`(?<![a-z0-9])(?:${alts.join("|")})(?![a-z0-9])`,w:t.slice(i,i+achou.n).join(" "),fixo:1,tipo:"lei"});i+=achou.n-1;continue}
  out.push({re:variantesPalavra(escRe(w)),w,parada:PARADA.has(w)})}
 /* "art. 8 da CF": o artigo e a lei precisam estar perto um do outro, em qualquer ordem, para não misturar leis diferentes */
 const ia=out.findIndex(x=>x.tipo==="art"),il=out.findIndex(x=>x.tipo==="lei");
 if(ia>=0&&il>=0){const A=out[ia],L=out[il];const j={re:`(?:${A.re}.{0,45}?${L.re}|${L.re}.{0,30}?${A.re})`,w:A.w+" "+L.w,fixo:1,tipo:"artlei"};
  const lo=Math.min(ia,il),hi=Math.max(ia,il);return out.slice(0,lo).concat([j],out.slice(hi+1),out.slice(lo+1,hi).filter(x=>!x.parada))}
 return out}
const CASA_CACHE={};
/* modo "frase": a consulta inteira, em ordem; modo "todas": cada palavra importante em qualquer lugar */
function casador(q,modo){modo=modo||"frase";const k=modo+"\u0001"+q;if(CASA_CACHE[k])return CASA_CACHE[k];
 const nq=semAcento(String(q).trim());const ps=partesConsulta(nq);let m;
 if(!ps.length)m={vazio:true,idx:()=>-1,conta:()=>0,marcas:()=>[]};
 else if(modo==="frase"){const re=new RegExp(ps.map(x=>x.re).join(SEP),"g");
  m={idx:nt=>{re.lastIndex=0;const r=re.exec(nt);return r?r.index:-1},conta:nt=>{re.lastIndex=0;let c=0;while(c<99&&re.exec(nt))c++;return c},
   marcas:nt=>{re.lastIndex=0;const o=[];let r;while((r=re.exec(nt))&&o.length<200){if(!r[0].length){re.lastIndex++;continue}o.push([r.index,r.index+r[0].length])}return o}}}
 else{const imp=ps.filter(x=>!x.parada);const usa=imp.length?imp:ps;const res=usa.map(x=>new RegExp(x.re,"g"));
  m={idx:nt=>{let p0=-1;for(const re of res){re.lastIndex=0;const r=re.exec(nt);if(!r)return -1;if(p0<0)p0=r.index}return p0},
   conta:nt=>{let mn=99;for(const re of res){re.lastIndex=0;let c=0;while(c<99&&re.exec(nt))c++;mn=Math.min(mn,c);if(!mn)break}return mn},
   marcas:nt=>{const o=[];for(const re of res){re.lastIndex=0;let r;while((r=re.exec(nt))&&o.length<200){if(!r[0].length){re.lastIndex++;continue}o.push([r.index,r.index+r[0].length])}}return o.sort((a,b)=>a[0]-b[0]).filter((x,i,a)=>!i||x[0]>=a[i-1][1])}}}
 m.q=q;m.modo=modo;return CASA_CACHE[k]=m}
function realce(txt,q){const m=typeof q==="string"?casador(q,"todas"):q;const nt=semAcento(txt);let h="",i=0;
 for(const [a,b] of m.marcas(nt)){h+=esc(txt.slice(i,a))+"<mark>"+esc(txt.slice(a,b))+"</mark>";i=b}return h+esc(txt.slice(i))}
/* ---------- "Você quis dizer…": vocabulário do próprio conteúdo ---------- */
let VOCAB=null,VOCAB_N=-1,CORPUS="",FORMA=new Map();
function vocabulario(){const n=PERIODOS.filter((_,i)=>apOk(i)).length;if(VOCAB&&VOCAB_N===n)return VOCAB;
 const partes=[];QS.forEach(x=>partes.push(x.q,x.a,(x.o||[]).join(" "),x.e||""));
 PERIODOS.forEach((ds,i)=>{if(!apOk(i))return;ds.forEach(d=>{const t=window.APOSTILA[i].mat[d];if(t)partes.push(limpo(t))})});
 (window.RESUMOS||[]).forEach(R=>{if(R)Object.keys(R).forEach(d=>{const x=R[d];partes.push(typeof x==="string"?x:x.join(" "))})});
 LS.forEach(x=>partes.push(x.t,x.ref));
 const todo=partes.join(" ");CORPUS=" "+semAcento(todo).replace(/[^a-z0-9]+/g," ")+" ";const V=new Map();
 const F=new Map();(todo.toLowerCase().match(/[a-zà-öø-ÿ]{3,}/g)||[]).forEach(w=>{const k=semAcento(w);if(k===w)return;const x=F.get(k)||{};x[w]=(x[w]||0)+1;F.set(k,x)});
 FORMA=new Map();F.forEach((x,k)=>FORMA.set(k,Object.keys(x).sort((a,b)=>x[b]-x[a])[0]));
 CORPUS.split(" ").forEach(w=>{if(w.length>=3&&!/\d/.test(w))V.set(w,(V.get(w)||0)+1)});
 VOCAB=V;VOCAB_N=n;return V}
/* distância de edição com troca de letras vizinhas (Damerau), parando cedo quando passa do limite */
function distancia(a,b,lim){if(Math.abs(a.length-b.length)>lim)return lim+1;const m=a.length,n=b.length;let p2=null,p=Array.from({length:n+1},(_,j)=>j);
 for(let i=1;i<=m;i++){const c=[i];let mn=i;for(let j=1;j<=n;j++){let v=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));
  if(p2&&i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])v=Math.min(v,p2[j-2]+1);c[j]=v;if(v<mn)mn=v}if(mn>lim)return lim+1;p2=p;p=c}return p[n]}
function candidatos(w,V){const lim=w.length<=4?1:w.length<=7?2:3;const out=[];
 V.forEach((c,v)=>{if(c<2||v===w||Math.abs(v.length-w.length)>lim)return;const d=distancia(w,v,lim);if(d<=lim)out.push({v,d:d+(v[0]===w[0]?0:.6),c})});
 return out.sort((x,y)=>x.d-y.d||y.c-x.c).slice(0,4)}
function sugestao(q,forcar){const V=vocabulario();const nq=semAcento(q).trim();const ws=nq.split(/[^a-z0-9§]+/).filter(Boolean);if(!ws.length)return null;
 const fixos=new Set();partesConsulta(nq).forEach(x=>{if(x.fixo)x.w.split(" ").forEach(z=>fixos.add(z))});
 /* "forcar": as palavras existem, mas a expressão não; tenta trocas pequenas que formem uma expressão do conteúdo */
 const opc=ws.map(w=>{if(w.length<3||/\d/.test(w)||PARADA.has(w)||fixos.has(w))return [{v:w,d:0,c:V.get(w)||1}];
  if((V.get(w)||0)>=2)return forcar&&w.length>=4?[{v:w,d:0,c:V.get(w)}].concat(candidatos(w,V).slice(0,3)):[{v:w,d:0,c:V.get(w)}];const c=candidatos(w,V);return c.length?c:[{v:w,d:0,c:0}]});
 if(opc.every((o,i)=>o.length===1&&o[0].v===ws[i]))return null;
 /* combina as opções e prefere a frase que aparece no conteúdo; depois, a mais próxima do que foi digitado */
 let comb=[[]];opc.forEach(o=>{const nv=[];comb.forEach(c=>o.forEach(x=>{if(nv.length<96)nv.push(c.concat([x]))}));comb=nv});
 let melhor=null;comb.forEach(c=>{const fr=c.map(x=>x.v).join(" ");if(fr===nq)return;const d=c.reduce((s,x)=>s+x.d,0);const desc=c.some(x=>!x.c);
  let n=0,p=CORPUS.indexOf(" "+fr+" ");while(p>=0&&n<50){n++;p=CORPUS.indexOf(" "+fr+" ",p+1)}
  const sc=(n?1000+Math.log(1+n)*40:0)-d*120+c.reduce((s,x)=>s+Math.log(1+x.c),0)-(desc?500:0);
  if(!melhor||sc>melhor.sc)melhor={fr,sc,n,d}});
 /* só sugere com boa confiança: a frase existe no conteúdo, ou cada palavra é uma correção curta e comum */
 if(!melhor||melhor.sc<0||(!melhor.n&&ws.length>1&&melhor.d>ws.length)||(forcar&&(!melhor.n||melhor.d>2)))return null;
 return melhor.fr.split(" ").map(w=>FORMA.get(w)||w).join(" ")}
/* ---------- busca global: apostilas, questões, resumos e lei seca ---------- */
const FILTROS_BUSCA=[["tudo","Tudo"],["ap","Apostilas"],["q","Questões"],["res","Resumos"],["ls","Lei seca"]];
function trecho(txt,nt,nq,p0,m){const a=Math.max(0,p0-70);const tr=p0>=0?txt.slice(a,p0+String(m.q).length+110):txt.slice(0,160);return `${a?"…":""}${realce(tr,m)}…`}
function buscaAp(m){const out=[];
 PERIODOS.forEach((ds,i)=>ds.forEach(d=>{if(!(window.APOSTILA&&window.APOSTILA[i]&&window.APOSTILA[i].mat[d]))return;const P=paginas(d);
  P.secs.forEach((s,k)=>{const txt=s.lp||(s.lp=limpo(s.corpo).replace(/\s+/g," "));const nt=s.lnt||(s.lnt=semAcento(txt));const p0=m.idx(nt);const c=p0>=0?m.conta(nt):0;
   const tt=m.idx(semAcento(s.tit))>=0;if(c||tt)out.push({d,k:k+1,tit:s.tit,c,tt,txt,p0})})}));
 return out.sort((a,b)=>(b.tt-a.tt)||(b.c-a.c))}
function buscaQ(m){const out=[];QS.forEach(x=>{const t=x.nt||(x.nt=semAcento([x.q,x.a,(x.o||[]).join(" "),x.e||"",x.f||""].join(" \u0001 ")));if(m.idx(t)<0)return;
  const naQ=m.idx(semAcento(x.q));const sc=(m.idx(semAcento(x.a))>=0?3:0)+(naQ>=0?2:0)+1;out.push({x,sc,naQ})});return out.sort((a,b)=>b.sc-a.sc)}
function buscaRes(m){const out=[];(window.RESUMOS||[]).forEach((R,i)=>{if(!R)return;Object.keys(R).forEach(d=>{if(!DISC[d])return;const x=R[d];const txt=limpo(typeof x==="string"?x:x.join(" ")).replace(/\s+/g," ");const nt=semAcento(txt);const p0=m.idx(nt);
  if(p0>=0||m.idx(semAcento(infoDisc(d).nome))>=0)out.push({i,d,txt,p0})})});return out}
function buscaLs(m){return LS.filter(x=>m.idx(semAcento(x.t+" "+x.ref))>=0)}
function itemQBusca(r,q){const x=r.x,M=META[x.m];const ord=permFixa([0,1,2,3].map(String),"b-"+x.id).map(Number);
 return `<details class="rev res-q"><summary><span class="tile-mini" style="--c:${M.cor}">${ic(M.ic)}</span><span class="rq"><span class="rotulo">${esc(nomeCurto(M.nome))} · ${realce(x.a,q)}</span><br>${realce(x.q,q)}</span></summary>
  <div class="rbody">${ord.map((oi,p)=>`<p>${oi===0?"<b>":""}${LETRAS[p]}) ${realce(x.o[oi],q)}${oi===0?` <span class="gab">${ic("ok")}gabarito</span></b>`:""}</p>`).join("")}
  <p style="margin-top:10px">${realce(x.e||"",q)}</p>${x.f?`<p class="fund">${esc(x.f)}</p>`:""}
  <div class="acoes-linha"><button class="link-tema" data-acao="treinar-ass" data-sc="${x.m}" data-a="${esc(encodeURIComponent(grupoDe(x)))}">${ic("alvo")} Treinar este assunto</button>${candidatosQ(x).length?`<button class="link-tema" data-acao="estudar" data-q="${x.id}">${ic("livro")} Estudar na apostila</button>`:""}</div></div></details>`}
function procurar(m,f){return {ap:(f==="tudo"||f==="ap")?buscaAp(m):[],q:(f==="tudo"||f==="q")?buscaQ(m):[],res:(f==="tudo"||f==="res")?buscaRes(m):[],ls:(f==="tudo"||f==="ls")?buscaLs(m):[]}}
const totalR=R=>R.ap.length+R.q.length+R.res.length+R.ls.length;
function resultadosBusca(q,f){q=String(q||"").trim();f=f||"tudo";
 if(q.length<3&&!partesConsulta(semAcento(q)).some(x=>x.fixo))return buscaInicio();
 const todas=PERIODOS.every((_,i)=>apOk(i));
 /* 1) a expressão exata (com variações de acento, plural, artigo e sigla); 2) todas as palavras em qualquer ordem;
    3) com erro de digitação, a correção mais provável, só quando ela de fato aparece no conteúdo */
 let m=casador(q,"frase"),R=procurar(m,f),aviso="";
 if(!totalR(R)){const m2=casador(q,"todas");if(m2.modo&&partesConsulta(semAcento(q)).filter(x=>!x.parada).length>1){const R2=procurar(m2,f);if(totalR(R2)){m=m2;R=R2;aviso=`<p class="nota busca-aviso">Nenhum trecho com a expressão exata. Mostrando onde aparecem todas as palavras.</p>`}}}
 const sug=todas||f==="q"||f==="ls"?(sugestao(q)||(m.modo!=="frase"||!totalR(R)?sugestao(q,true):null)):null;let mS=null,RS=null;
 if(sug){mS=casador(sug,"frase");RS=procurar(mS,f);if(!totalR(RS)){const m3=casador(sug,"todas");RS=procurar(m3,f);mS=m3}}
 if(!totalR(R)&&sug&&totalR(RS)){aviso=`<p class="quis-dizer anim-q" role="status">${ic("lampada")}<span>Mostrando resultados para <b>${esc(sug)}</b>. Você digitou “${esc(q)}”.</span></p>`;m=mS;R=RS;q=sug}
 else if(sug&&(totalR(RS)>totalR(R)*3||m.modo!=="frase"))aviso=`<p class="quis-dizer anim-q">${ic("lampada")}<span>Você quis dizer <button class="link-inline" data-acao="busca-sug" data-v="${esc(sug)}"><b>${esc(sug)}</b></button>?</span></p>`+aviso;
 const lim=f==="tudo"?{ap:8,q:6,res:4,ls:4}:{ap:60,q:40,res:40,ls:40};
 const tot=totalR(R);
 if(!tot)return (todas||f==="q"||f==="ls"?"":`<p class="nota">Carregando as apostilas…</p>`)+vazio("lupa",`Nada encontrado para “${esc(q)}”`,"Tente uma palavra mais curta, o número do artigo (por exemplo, “art. 5”) ou um sinônimo. Se estiver filtrando, volte para <b>Tudo</b>.").replace('class="vazio-ilu"','class="vazio-ilu busca-vazia"');
 const mais=(k,n)=>f==="tudo"&&n>lim[k]?`<button class="ver-mais" data-acao="busca-f" data-v="${k}">Ver os ${n} resultados ${ic("prox")}</button>`:"";
 let h=aviso+`<p class="nota" role="status">${tot} resultado${tot>1?"s":""} para “${esc(q)}”</p>`;
 if(R.ap.length||(!todas&&(f==="tudo"||f==="ap")))h+=`<div class="secao" role="heading" aria-level="2">Apostilas <span class="n">${R.ap.length}</span></div>${todas?"":`<p class="nota">Carregando as apostilas de todos os períodos…</p>`}<div class="lista res-anim">${R.ap.slice(0,lim.ap).map(r=>{const fi=infoDisc(r.d);
  return `<button class="item res-busca" data-acao="abrir-tema" data-d="${r.d}" data-k="${r.k}" data-q="${esc(q)}">${tile(fi.cor,fi.ic)}<span style="min-width:0"><span class="item-tit">${realce(r.tit,m)}</span><br><span class="item-sub">${esc(nomeCurto(fi.nome))} · Tema ${r.k}${r.c?` · ${r.c} ocorrência${r.c>1?"s":""}`:""}</span><span class="trecho">${trecho(r.txt,null,null,r.p0,m)}</span></span></button>`}).join("")}</div>${mais("ap",R.ap.length)}`;
 if(R.q.length)h+=`<div class="secao" role="heading" aria-level="2">Questões <span class="n">${R.q.length}</span></div><p class="nota" style="margin-top:0">Toque para ver as alternativas, o gabarito e o comentário.</p><div class="revisao res-anim">${R.q.slice(0,lim.q).map(r=>itemQBusca(r,m)).join("")}</div>${mais("q",R.q.length)}`;
 if(R.res.length)h+=`<div class="secao" role="heading" aria-level="2">Resumos <span class="n">${R.res.length}</span></div><div class="lista res-anim">${R.res.slice(0,lim.res).map(r=>{const fi=infoDisc(r.d);
  return `<button class="item res-busca" data-acao="resumo" data-p="${r.i}" data-q="${esc(q)}">${tile(fi.cor,"recibo")}<span style="min-width:0"><span class="item-tit">${esc(nomeCurto(fi.nome))}</span><br><span class="item-sub">Resumo do ${r.i+1}º período</span>${r.p0>=0?`<span class="trecho">${trecho(r.txt,null,null,r.p0,m)}</span>`:""}</span></button>`}).join("")}</div>${mais("res",R.res.length)}`;
 if(R.ls.length)h+=`<div class="secao" role="heading" aria-level="2">Lei seca <span class="n">${R.ls.length}</span></div><div class="alts ls-lista res-anim">${R.ls.slice(0,lim.ls).map(x=>`<details><summary><span>${realce(x.ref,m)}</span><small>${esc(nomeCurto(META[x.m].nome))}</small></summary><p>${realce(x.t,m)}</p></details>`).join("")}</div>${mais("ls",R.ls.length)}`;
 return h}
/* resultados entram em cascata; as marcas acendem em seguida */
function animarBusca(){if(!animOn())return;const box=document.getElementById("res-busca");if(!box)return;let i=0;
 box.querySelectorAll(".quis-dizer,.busca-aviso,.res-anim>*,.secao,.ver-mais").forEach(el=>{if(i>18)return;el.style.setProperty("--i",i++);el.classList.add("b-ent")});
 box.querySelectorAll("mark").forEach((mk,k)=>{if(k<40){mk.style.setProperty("--i",Math.min(k,12));mk.classList.add("b-mark")}})}
function telaBusca(){const q=rota.q||"";const f=rota.bf||"tudo";const todas=PERIODOS.every((_,i)=>apOk(i));if(!todas)carregarTodas().then(()=>reRenderSe("busca"));
 const chips=`<div class="chips" role="group" aria-label="Onde buscar">${FILTROS_BUSCA.map(([k,n])=>`<button data-acao="busca-f" data-v="${k}" aria-pressed="${f===k}">${n}</button>`).join("")}</div>`;
 return topo("Buscar","Apostilas, questões, resumos e lei seca",{menu:true,extra:chips})+
 `<main class="wrap">${capaTela("lupa","Encontre qualquer assunto","Uma palavra, um instituto ou um artigo de lei.")}<div class="busca">${ic("lupa")}<label class="sr" for="q-busca">Buscar no conteúdo</label><input type="search" id="q-busca" name="busca" placeholder="Palavra, expressão ou artigo…" value="${esc(q)}" autocomplete="off" spellcheck="false" enterkeyhint="search"></div>
 <div id="res-busca">${resultadosBusca(q,f)}</div></main>`}
function realcarPagina(){if((rota.tela!=="ler"&&rota.tela!=="resumo")||!rota.q)return;if(semAcento(rota.q).trim().length<3)return;const mq=casador(rota.q,"todas");
 const arts=document.querySelectorAll("main article.texto, main .tema-ban h3, main .resumo-folha");let primeiro=null;
 arts.forEach(art=>{const w=document.createTreeWalker(art,NodeFilter.SHOW_TEXT);const nos=[];while(w.nextNode())nos.push(w.currentNode);
  nos.forEach(n=>{const t=n.nodeValue;const nt=semAcento(t);if(!mq.marcas(nt).length)return;const sp=document.createElement("span");sp.innerHTML=realce(t,mq);sp.querySelectorAll("mark").forEach(m=>{m.className="achado";if(!primeiro)primeiro=m});n.parentNode.replaceChild(sp,n)})});
 if(primeiro)setTimeout(()=>{try{primeiro.scrollIntoView({block:"center"})}catch(e){}},60)}

/* ---------- favoritos e anotações ---------- */
function telaFavs(){const keys=[...new Set(Object.keys(S.fav||{}).concat(Object.keys(S.notas||{}).filter(k=>S.notas[k])))];
 const pers=[...new Set(keys.map(k=>periodoDe(k.split(":")[0])).filter(i=>i>=0))];const falt=pers.filter(i=>!apOk(i));if(falt.length)Promise.all(falt.map(carregarApP)).then(()=>reRenderSe("favs"));
 const itens=keys.map(k=>{const [d,ks]=k.split(":");const i=periodoDe(d);if(i<0||!DISC[d])return null;const kk=+ks;let tit=`Tema ${kk}`;if(apOk(i)){const P=paginas(d);if(P.secs[kk-1])tit=P.secs[kk-1].tit}return {k,d,kk,tit,fav:!!(S.fav&&S.fav[k]),nota:(S.notas&&S.notas[k])||""}}).filter(Boolean)
  .sort((a,b)=>periodoDe(a.d)-periodoDe(b.d)||a.d.localeCompare(b.d)||a.kk-b.kk);
 return topo("Favoritos e anotações",`${itens.length} tema${itens.length===1?"":"s"}`,{menu:true})+
 `<main class="wrap">${itens.length?`<div class="lista">${itens.map(x=>{const f=infoDisc(x.d);return `<button class="item" data-acao="abrir-tema" data-d="${x.d}" data-k="${x.kk}">${tile(f.cor,f.ic)}<span style="min-width:0"><span class="item-tit">${x.fav?`<span class="fav-ic" title="Favorito">${ic("estrela")}</span>`:""}${esc(x.tit)}</span><br><span class="item-sub">${esc(nomeCurto(f.nome))} · Tema ${x.kk}</span>${x.nota?`<span class="trecho">${esc(x.nota.slice(0,180))}${x.nota.length>180?"…":""}</span>`:""}</span><span class="item-data">${ic("prox")}</span></button>`}).join("")}</div>`
  :vazio("marcador","Nenhum tema salvo ainda","Dentro de cada tema da apostila, toque em <b>Favoritar este tema</b> ou escreva em <b>Minhas anotações</b>. O que você salvar aparece aqui, em ordem de período e de tema, para revisar antes da prova.",`<button class="botao cheio" data-acao="ir-raiz" data-tela="faculdade">Abrir as apostilas</button>`)}</main>`}

/* ---------- da questão para o tema da apostila ---------- */
const STOP=new Set("sobre entre quando qual quais pois para pela pelo pelos pelas como mais menos esta este essa esse isso aquele aquela segundo conforme deve pode podem sendo seja sera serao tambem ainda apenas caso fato artigo direito direitos alternativa correta incorreta afirmar assinale".split(" "));
const tokens=t=>semAcento(t).split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!STOP.has(w));
const CACHE_TQ={};
function candidatosQ(q){const pr=["prc","prp","prt","prpub","rev"];let c=Object.keys(DISC).filter(d=>!pr.includes(d)&&DISC[d].t&&DISC[d].t.includes(q.t));
 if(!c.length)c=Object.keys(DISC).filter(d=>!pr.includes(d)&&(DISC[d].m||[]).includes(q.m));
 if(!c.length)c=Object.keys(DISC).filter(d=>!pr.includes(d)&&DISC[d].base===q.m);return c.filter(d=>periodoDe(d)>=0)}
function temaDaQuestao(q){if(CACHE_TQ[q.id])return Promise.resolve(CACHE_TQ[q.id]);const cs=candidatosQ(q);
 return Promise.all([...new Set(cs.map(periodoDe))].map(carregarApP)).then(()=>{const docs=[];
  cs.forEach(d=>{const i=periodoDe(d);if(!apOk(i)||!window.APOSTILA[i].mat[d])return;paginas(d).secs.forEach((s,k)=>{const cont={};tokens(s.corpo).forEach(w=>cont[w]=(cont[w]||0)+1);docs.push({d,k:k+1,tit:new Set(tokens(s.tit)),cont})})});
  if(!docs.length)return null;const qt={};tokens(q.a).forEach(w=>qt[w]=(qt[w]||0)+3);tokens(q.q+" "+q.e+" "+(q.o?q.o[0]:"")).forEach(w=>qt[w]=(qt[w]||0)+1);
  let best=null,bs=-1;docs.forEach(doc=>{let sc=0;for(const w in qt){const df=docs.filter(x=>x.cont[w]).length;if(!df&&!doc.tit.has(w))continue;const idf=Math.log(1+docs.length/(1+df));if(doc.tit.has(w))sc+=qt[w]*3*idf;if(doc.cont[w])sc+=qt[w]*Math.log(1+doc.cont[w])*idf}if(sc>bs){bs=sc;best=doc}});
  return CACHE_TQ[q.id]=best?{d:best.d,k:best.k}:null})}

/* ---------- festa ao gabaritar ---------- */
const TROFEU=`<svg class="trofeu" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="46" fill="#f2b632"/><circle cx="48" cy="48" r="38" fill="#f6c453"/><path d="M31 22h34v16a17 17 0 0 1-34 0z" fill="#fff"/><path d="M31 26h-8a10 10 0 0 0 10 14M65 26h8a10 10 0 0 1-10 14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="44" y="54" width="8" height="11" fill="#fff"/><rect x="34" y="65" width="28" height="9" rx="2" fill="#fff"/><path d="M48 27l3 6 6.5 1-4.7 4.5 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5L38.5 34l6.5-1z" fill="#f2b632"/></svg>`;
function confete(cv){if(!cv)return;try{if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return}catch(e){}
 const ctx=cv.getContext("2d");if(!ctx)return;const dpr=window.devicePixelRatio||1;const W=cv.clientWidth||innerWidth,H=cv.clientHeight||innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.scale(dpr,dpr);
 const cores=["#f2b632","#e4572e","#2e86ab","#3bb273","#a23b72","#ffffff"];
 const ps=Array.from({length:170},()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*12,vy:-Math.random()*13-4,s:Math.random()*7+4,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cores[Math.floor(Math.random()*cores.length)],f:Math.random()<.5}));
 const t0=performance.now();
 (function passo(t){const dt=t-t0;ctx.clearRect(0,0,W,H);ps.forEach(p=>{p.vy+=.32;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=Math.max(0,1-dt/4200);ctx.fillStyle=p.c;
   if(p.f)ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);else{ctx.beginPath();ctx.arc(0,0,p.s/3,0,7);ctx.fill()}ctx.restore()});
  if(dt<4200&&cv.isConnected)requestAnimationFrame(passo);else ctx.clearRect(0,0,W,H)})(t0)}
function mostrarFesta(a){const v=versoDaChave(a.key);const fr=MOTIVA[Math.floor(Math.random()*MOTIVA.length)];
 const velho=document.querySelector(".festa");if(velho)velho.remove();
 const el=document.createElement("div");el.className="festa";el.dataset.acao="festa-fechar";el.setAttribute("role","dialog");el.setAttribute("aria-label","Gabarito perfeito");
 el.innerHTML=`<canvas aria-hidden="true"></canvas><div class="festa-card">${TROFEU}<h2>Gabaritou!</h2><p class="frase">${esc(fr)}</p>${versoCard(v,"Para celebrar")}<button class="botao cheio" data-acao="festa-fechar" style="width:100%">Continuar</button></div>`;
 document.body.appendChild(el);confete(el.querySelector("canvas"));som("gabarito");syncVoltar()}
