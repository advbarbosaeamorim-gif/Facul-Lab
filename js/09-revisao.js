"use strict";
/* ---------- revisão espaçada: central de revisão, força da memória e previsão ----------
   Junta as três revisões do app: cartões (intervalo e facilidade próprios de cada um), questões erradas
   (voltam em 1, 3, 7, 15 e 30 dias; 5 acertos seguidos e ela está dominada) e mapas mentais das apostilas lidas.
   A memória estimada segue a curva do esquecimento: no dia marcado para a revisão, a chance de lembrar é de cerca de 90%.
   Tudo aqui só lê S.cards, S.qrev, S.stats e S.revAp; os lotes de cartões seguem o ritmo de estudo. */
const RV_CX=[["Recém-aprendido",0,3,"var(--nv5)","acabou de entrar ou voltou depois de um erro. Volta quase todo dia."],
 ["Fixando",3,7,"var(--nv4)","passou pelas primeiras revisões. Volta em poucos dias."],
 ["Firme",7,21,"var(--nv3)","você lembra depois de uma semana. As revisões começam a se espaçar."],
 ["Sólido",21,60,"var(--nv7)","semanas sem ver e você ainda lembra. Volta mais ou menos uma vez por mês."],
 ["Duradouro",60,1e9,"var(--nv1)","memória de longo prazo. Só aparece de vez em quando, para não enferrujar."]];
const rvLote=()=>({leve:15,intenso:40}[S.cfg&&S.cfg.ritmo]||25);
const rvPl=(n,s,p)=>`${n} ${n===1?s:p}`;
function rvItens(){const L=[];const C=S.cards||{},Q=S.qrev||{};
 Object.keys(C).forEach(id=>{if(!DISC[id.split(":")[0]])return;const s=sr(Object.assign({},C[id]));L.push({t:"c",id,due:C[id].due||0,iv:s.iv||0,ult:C[id].t||0,lap:C[id].lap||0})});
 Object.keys(Q).forEach(id=>{if(!QMAP[id])return;const r=Q[id],st=S.stats[id]||{};L.push({t:"q",id,due:r.due||0,iv:PASSOS_Q[Math.min(r.n||0,PASSOS_Q.length-1)],ult:st.t||0,lap:r.lap||0,er:(st.n||0)-(st.ok||0)})});
 return L}
function rvMemoria(L){if(!L.length)return null;const now=Date.now();
 return Math.round(L.reduce((s,x)=>s+Math.pow(.9,Math.max(0,(now-(x.ult||now))/DIA)/Math.max(.5,x.iv)),0)*100/L.length)}
function rvPrevisao(n){const h0=inicioDia();const D=[];for(let i=0;i<n;i++)D.push({c:0,q:0,m:0,t:h0+i*DIA});
 const add=(due,k)=>{const i=Math.max(0,Math.floor((due-h0+36e5)/DIA));if(i<n)D[i][k]++};
 rvItens().forEach(x=>add(x.due,x.t));const A=agendaAp();Object.keys(A).forEach(d=>{if(DISC[d])add(A[d].prox,"m")});return D}
function rvCaixas(L){const n=RV_CX.map(()=>({c:0,q:0}));L.forEach(x=>{const i=RV_CX.findIndex(b=>x.iv<b[2]);n[i<0?4:i][x.t]++});return n}
function rvTeimQ(){const st=S.stats||{};return Object.keys(S.qrev||{}).filter(id=>QMAP[id]&&st[id]&&(st[id].n-st[id].ok)>=2)}
function rvTeimC(){const C=S.cards||{};return Object.keys(C).filter(id=>DISC[id.split(":")[0]]&&(C[id].lap||0)>=3).sort((a,b)=>C[b].lap-C[a].lap)}
const rvPartes=d=>[d.c&&rvPl(d.c,"cartão","cartões"),d.q&&rvPl(d.q,"questão","questões"),d.m&&rvPl(d.m,"mapa mental","mapas mentais")].filter(Boolean).join(", ").replace(/, ([^,]*)$/," e $1");
function rvRotDia(i,t){if(i===0)return "Hoje";if(i===1)return "Amanhã";const d=new Date(t+12*36e5);const w=new Intl.DateTimeFormat("pt-BR",{weekday:"long"}).format(d);return w.charAt(0).toUpperCase()+w.slice(1)+", "+d.getDate()+"/"+(d.getMonth()+1)}

/* abre uma sessão de cartões só com os ids pedidos, na ordem dada (os mais atrasados primeiro) */
function rvDeckCom(ids,titulo,max){const pos={};ids.forEach((id,i)=>pos[id]=i);const ds=[...new Set(ids.map(id=>id.split(":")[0]))].filter(d=>DISC[d]);
 return Promise.all([...new Set(ds.map(periodoDe))].filter(i=>i>=0).map(carregarApP)).then(()=>{const q=[];
  ds.filter(d=>apOk(periodoDe(d))).forEach(d=>cartoesDe(d).forEach(c=>{if(c.id in pos)q.push(c)}));
  const ord=q.sort((a,b)=>pos[a.id]-pos[b.id]).slice(0,max);
  deck={titulo,q:emb(ord),pos:0,virado:false,ok:0,er:0,tot:ord.length,rv:true};
  if(rota.tela==="cartao")render();else ir({tela:"cartao"})})}
function rvCartoesHoje(){const C=S.cards||{},now=Date.now();rvDeckCom(Object.keys(C).filter(id=>C[id].due<=now).sort((a,b)=>C[a].due-C[b].due),"Revisão do dia",rvLote())}
function rvMapa(d){const A=agendaAp();if(A[d]){A[d].n=Math.min(INTERV_AP.length-1,A[d].n+1);A[d].prox=inicioDia()+INTERV_AP[A[d].n]*DIA;salvar()}ir({tela:"ler",d,pg:999,pagina:true})}
function rvComecar(){if(contaVencidos())return rvCartoesHoje();if(errosHoje().length)return ir({tela:"pre",key:"errhoje"});const a=apsVencidas();if(a.length)rvMapa(a[0])}
/* fim de uma sessão da revisão: segue com o próximo lote ou com as questões */
function rvFimDeck(){if(!deck||!deck.rv)return "";const v=contaVencidos(),e=errosHoje().length;
 if(v)return `<button class="botao cheio" data-acao="rv-cartoes">Mais ${rvPl(Math.min(v,rvLote()),"cartão","cartões")}<small class="rv-bt-sub">${v>rvLote()?`${v} esperando, em lotes de ${rvLote()}`:"os últimos de hoje"}</small></button>`;
 if(e)return `<button class="botao cheio" data-acao="erradas-hoje">Seguir para as questões (${e})</button>`;
 return ""}

/* questão que sai da revisão depois de 5 acertos seguidos */
function rvDominou(){S.qdom=(S.qdom||0)+1;setTimeout(()=>{const t=document.createElement("div");t.className="rv-toast";t.setAttribute("role","status");
 t.innerHTML=`${ic("estrela")}<span><b>Questão dominada!</b><small>5 acertos seguidos: ela saiu da revisão.</small></span>`;document.body.appendChild(t);setTimeout(()=>t.classList.add("sai"),2600);setTimeout(()=>t.remove(),3200)},350)}

/* medidor de memória (semicírculo com ponteiro) e anel pequeno do Hoje */
function rvMedidor(p){const v=p===null?0:p/100;const C=Math.PI*80;
 const marcas=[0,.25,.5,.75,1].map(k=>{const a=Math.PI*(1-k);return `<path d="M${(100+68*Math.cos(a)).toFixed(1)} ${(100-68*Math.sin(a)).toFixed(1)}L${(100+60*Math.cos(a)).toFixed(1)} ${(100-60*Math.sin(a)).toFixed(1)}" class="rv-marca"/>`}).join("");
 return `<svg viewBox="0 0 200 116" aria-hidden="true" focusable="false"><defs><linearGradient id="rv-gr" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#e5484d"/><stop offset=".5" stop-color="#f5a524"/><stop offset="1" stop-color="#22a06b"/></linearGradient></defs>
 <path d="M20 100A80 80 0 0 1 180 100" class="rv-arco-t"/><path d="M20 100A80 80 0 0 1 180 100" class="rv-arco" stroke-dasharray="${C.toFixed(1)}" style="--off:${(C*(1-v)).toFixed(1)};--tot:${C.toFixed(1)}"/>${marcas}
 <g class="rv-ponteiro" style="--a:${(-90+180*v).toFixed(1)}deg"><path d="M100 100L96 98 100 30 104 98z" class="rv-agulha"/><circle cx="100" cy="100" r="9" class="rv-eixo"/><circle cx="100" cy="100" r="3.5" class="rv-eixo-c"/></g></svg>`}
function rvAnel(p){const C=2*Math.PI*19,v=p===null?0:p/100;
 return `<span class="rv-anel" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" class="rv-anel-t"/><circle cx="24" cy="24" r="19" class="rv-anel-v" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-v)).toFixed(1)}" transform="rotate(-90 24 24)"/></svg><b>${p===null?"—":p}<small>${p===null?"":"%"}</small></b></span>`}
const rvTomMem=p=>p===null?"":p>=85?"Memória afiada":p>=70?"Boa, mas pedindo revisão":p>=50?"Começando a apagar":"Hora de revisar";

/* curva do esquecimento interativa: revisões nos dias 1, 4, 10 e 21; cada uma deixa a queda mais lenta */
const RV_REV=[1,4,10,21],RV_EST=[1.6,4,9,20,45];
function rvRet(t,n){let t0=0,k=0;for(let i=0;i<n;i++)if(t>=RV_REV[i]){t0=RV_REV[i];k=i+1}return Math.exp(-(t-t0)/RV_EST[k])}
const rvX=t=>34+t*276/30,rvY=r=>16+(1-r)*124;
function rvCurvaD(n){let d="",ant=null;for(let s=0;s<=120;s++){const t=s/4;const r=rvRet(t,n);
 if(ant!==null&&r>ant+.01)d+=`L${rvX(t).toFixed(1)} ${rvY(ant).toFixed(1)}`;d+=(s?"L":"M")+rvX(t).toFixed(1)+" "+rvY(r).toFixed(1);ant=r}return d}
function rvCurvaTxt(n){const p=Math.round(rvRet(30,n)*100);
 return n===0?`<b>Sem revisão</b>, a memória despenca nos primeiros dias. No 30º dia sobra ${p<1?"menos de 1%":`cerca de ${p}%`} do que você estudou.`
 :`<b>Com ${rvPl(n,"revisão","revisões")}</b> (no${n>1?"s":""} dia${n>1?"s":""} ${RV_REV.slice(0,n).join(", ").replace(/, (\d+)$/," e $1")}), a curva cai cada vez mais devagar. No 30º dia você ainda lembra ${p<1?"menos de 1%":`cerca de <b>${p}%</b>`}.`}
function rvCurvaMarcas(n){return RV_REV.slice(0,n).map((t,i)=>`<g class="rv-cm" style="--i:${i}"><circle cx="${rvX(t).toFixed(1)}" cy="${rvY(1)}" r="5.5"/><path d="M${rvX(t).toFixed(1)} ${rvY(1)+8}V140" /></g>`).join("")}
let rvCurvaN=0;
function rvCurva(){const n=rvCurvaN;
 return `<figure class="rv-curva"><svg viewBox="0 0 320 166" role="img" aria-label="Curva do esquecimento">
 ${[1,.5,0].map(r=>`<path d="M34 ${rvY(r)}H310" class="rv-grade"/><text x="28" y="${rvY(r)+4}" class="rv-eixo-t" text-anchor="end">${Math.round(r*100)}%</text>`).join("")}
 ${[0,7,15,30].map(t=>`<text x="${rvX(t)}" y="158" class="rv-eixo-t" text-anchor="${t===30?"end":t?"middle":"start"}">${t?"dia "+t:"estudou"}</text>`).join("")}
 <path d="${rvCurvaD(0)}" class="rv-fantasma"/><g class="rv-cms">${rvCurvaMarcas(n)}</g><path d="${rvCurvaD(n)}" class="rv-linha"/></svg>
 <figcaption><div class="rv-seg" role="group" aria-label="Quantas revisões fazer">${[0,1,2,3,4].map(k=>`<button data-acao="rv-curva" data-n="${k}" aria-pressed="${k===n}">${k}<small>${k===1?"revisão":"revisões"}</small></button>`).join("")}</div>
 <p class="rv-curva-txt" aria-live="polite">${rvCurvaTxt(n)}</p></figcaption></figure>`}
function rvCurvaMuda(n){rvCurvaN=n;const f=document.querySelector(".rv-curva");if(!f)return;
 f.querySelectorAll(".rv-seg button").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.n===n)));
 f.querySelector(".rv-curva-txt").innerHTML=rvCurvaTxt(n);f.querySelector(".rv-cms").innerHTML=rvCurvaMarcas(n);
 const p=f.querySelector(".rv-linha");p.setAttribute("d",rvCurvaD(n));
 if(animOn()){const L=p.getTotalLength();p.style.transition="none";p.style.strokeDasharray=L;p.style.strokeDashoffset=L;void p.getBoundingClientRect();p.style.transition="stroke-dashoffset 1.1s cubic-bezier(.3,.7,.3,1)";p.style.strokeDashoffset=0;setTimeout(()=>{p.style.strokeDasharray="";p.style.transition=""},1200)}}

function telaRevisao(){const L=rvItens(),mem=rvMemoria(L),P=rvPrevisao(14),cx=rvCaixas(L);
 const vc=contaVencidos(),ve=errosHoje().length,aps=apsVencidas(),va=aps.length,tot=vc+ve+va;
 const tC=rvTeimC(),tQ=rvTeimQ(),dom=(S.qdom||0)+L.filter(x=>x.iv>=60).length;
 const mx=Math.max(1,...P.map(d=>d.c+d.q+d.m)),sem=P.slice(1,8).reduce((s,d)=>s+d.c+d.q+d.m,0);
 const cxMax=Math.max(1,...cx.map(n=>n.c+n.q));
 const tileH=(acao,attrs,cor,icn,n,rot,sub)=>`<button class="rv-t${n?"":" ok"}" data-acao="${acao}" ${attrs} ${n?"":"disabled"} style="--c:${cor}"><span class="rv-t-ic">${ic(n?icn:"ok")}</span><b>${n}</b><span class="rv-t-rot">${rot}</span><small>${n?sub:"em dia"}</small></button>`;
 return topo("Revisão espaçada","Cartões, questões e mapas mentais na hora certa",{menu:!pilha.length})+
 `<main class="wrap rv">
 <section class="rv-hero" aria-labelledby="rv-mem">
  <button class="rv-medidor" data-acao="rv-medidor" aria-label="${mem===null?"Memória estimada: ainda sem dados":`Memória estimada: ${mem}%`}">${rvMedidor(mem)}</button>
  <div class="rv-hero-txt"><p class="rv-k">Memória estimada agora</p><h2 id="rv-mem">${mem===null?"Ainda vazia":mem+"%"}<small>${esc(rvTomMem(mem))}</small></h2>
  <p>${mem===null?"Responda cartões ou erre uma questão (acontece!) e ela entra aqui. O app traz cada uma de volta na hora certa.":`Se fosse testado agora, você lembraria cerca de ${mem}% do que está em revisão. Revisar o que chegou hoje traz esse número de volta para perto de 100%.`}</p></div>
  ${ilustra("memoria","var(--toga-txt)")}
 </section>
 <div class="secao-linha"><div class="secao" role="heading" aria-level="2">Para hoje</div><span class="contador">${tot?rvPl(tot,"item","itens"):"tudo em dia"}</span></div>
 <div class="rv-hoje">${tileH("rv-cartoes","","var(--lacre)","cartas",vc,vc===1?"cartão":"cartões",vc>rvLote()?`em lotes de ${rvLote()}`:"lembre antes de virar")}
  ${tileH("erradas-hoje","","var(--nv2)","refazer",ve,ve===1?"questão":"questões","que você errou")}
  ${tileH("rev-ap",va?`data-d="${aps[0]}"`:"","var(--nv1)","livro",va,va===1?"mapa mental":"mapas mentais",va?esc(nomeCurto(infoDisc(aps[0]).nome)):"")}</div>
 ${tot?`<button class="botao cheio rv-comecar" data-acao="rv-comecar">${ic("seta")} Começar a revisão do dia</button><p class="rv-ordem">Primeiro os cartões, depois as questões e, por fim, os mapas mentais. Cada acerto empurra a próxima revisão para mais longe.</p>`
 :vazio("trofeu",L.length?"Revisão em dia!":"Nada para revisar ainda",L.length?(P[1].c+P[1].q+P[1].m?`Amanhã chegam ${rvPartes(P[1])}. Até lá, siga com o plano de hoje.`:"Nada marcado para amanhã. Aproveite para adiantar cartões novos."):"Estude cartões de memorização ou faça um simulado. O que você errar entra na revisão sozinho.",`<button class="botao linha" data-acao="ir-raiz" data-tela="cartoes">Estudar cartões novos</button>`,"var(--ok)")}
 <div class="secao" role="heading" aria-level="2">Próximos 14 dias</div>
 <div class="rv-bloco"><div class="rv-prev">${P.map((d,i)=>{const t=d.c+d.q+d.m;const dt=new Date(d.t+12*36e5);
  return `<button class="rv-barra${i?"":" hj"}" data-acao="rv-dia" data-i="${i}" aria-pressed="false" aria-label="${rvRotDia(i,d.t)}: ${t?rvPartes(d):"nada"}" style="--i:${i}"><b>${t||""}</b><span class="rv-col" style="--h:${t?Math.max(6,Math.round(t*100/mx)):0}"><i class="c" style="flex-grow:${d.c}"></i><i class="q" style="flex-grow:${d.q}"></i><i class="m" style="flex-grow:${d.m}"></i></span><small>${i?new Intl.DateTimeFormat("pt-BR",{weekday:"short"}).format(dt).slice(0,3).replace(".",""):"hoje"}</small><em>${dt.getDate()}</em></button>`}).join("")}</div>
  <p class="rv-leg"><span><i class="c"></i>Cartões</span><span><i class="q"></i>Questões</span><span><i class="m"></i>Mapas mentais</span></p>
  <p class="rv-dia-info" aria-live="polite">${sem?`Nos próximos 7 dias chegam ${rvPl(sem,"revisão","revisões")}. Toque num dia para ver o que vem.`:"Nenhuma revisão marcada para os próximos dias. Toque num dia para ver."}</p></div>
 <div class="secao" role="heading" aria-level="2">Força da memória</div>
 <div class="rv-bloco"><div class="rv-caixas">${cx.map((n,i)=>{const t=n.c+n.q;return `<button class="rv-cx" data-acao="rv-cx" data-i="${i}" aria-pressed="false" style="--c:${RV_CX[i][3]};--h:${t?Math.max(8,Math.round(t*100/cxMax)):0}%;--i:${i}"><span class="rv-pote"><i></i><b>${t}</b></span><small>${RV_CX[i][0]}</small></button>`}).join("")}</div>
  <p class="rv-cx-info" aria-live="polite">Cada acerto passa o item para a caixa seguinte, com uma revisão mais espaçada. Um erro devolve para a primeira. Toque numa caixa.</p>
  <div class="rv-nums"><span><b>${L.length}</b>em revisão</span><span><b>${dom}</b>dominados</span><span><b>${tC.length+tQ.length}</b>teimosos</span></div></div>
 ${tC.length||tQ.length?`<div class="rv-teim">${ilustra("lupa","var(--erro)")}<div><b>Os teimosos</b><p>${[tC.length&&rvPl(tC.length,"cartão que você errou","cartões que você errou")+" 3 vezes ou mais",tQ.length&&rvPl(tQ.length,"questão errada","questões erradas")+" mais de uma vez"].filter(Boolean).join(" e ")}. Antes de repetir, releia o tema: entender vence decorar.</p>
  <div class="botoes">${tC.length?`<button class="botao linha" data-acao="rv-teim-c">Cartões teimosos</button>`:""}${tQ.length?`<button class="botao linha" data-acao="rv-teim-q">Questões teimosas</button>`:""}</div></div></div>`:""}
 <div class="secao" role="heading" aria-level="2">Por que funciona</div>
 <div class="rv-bloco rv-explica"><p>Em 1885, o psicólogo alemão <b>Hermann Ebbinghaus</b> mediu quanto esquecemos com o tempo: a memória cai rápido nos primeiros dias e depois vai se apagando. Cada revisão feita bem quando você está quase esquecendo deixa a queda mais lenta. Toque nos números e veja:</p>
 ${rvCurva()}
 <ul class="rv-regras"><li style="--c:var(--lacre)">${ic("cartas")}<span><b>Cartões:</b> você diz como foi lembrar. <em>Errei</em> volta na mesma sessão; <em>Difícil</em>, <em>Acertei</em> e <em>Fácil</em> espaçam cada vez mais. Cada cartão aprende o seu ritmo.</span></li>
 <li style="--c:var(--nv2)">${ic("refazer")}<span><b>Questões erradas:</b> voltam no dia seguinte e, a cada acerto, em 3, 7, 15 e 30 dias. Depois do primeiro acerto, elas voltam no <b>teste inverso</b>: a resposta vira o enunciado e você acha a pergunta. A última revisão volta no formato da prova. Cinco acertos seguidos e ela está dominada.</span></li>
 <li style="--c:var(--nv1)">${ic("livro")}<span><b>Mapas mentais:</b> quando você termina uma apostila, o mapa volta 1, 7, 15, 30 e 60 dias depois.</span></li></ul>
 <p class="rv-nota">Os lotes de cartões seguem o seu <button class="link-inline" data-acao="ir-raiz" data-tela="config">ritmo de estudo</button>: ${rvLote()} por vez agora.</p></div></main>`}

/* cartão do Hoje: memória estimada, o que chega hoje e a semana que vem */
function rvHoje(){const L=rvItens(),aps=apsVencidas();if(!L.length&&!aps.length)return "";
 const P=rvPrevisao(7),h={c:contaVencidos(),q:errosHoje().length,m:aps.length},tot=h.c+h.q+h.m,mx=Math.max(1,...P.map(d=>d.c+d.q+d.m)),mem=rvMemoria(L);
 return `<button class="rv-mini${tot?" tem":""}" data-acao="rv-central">${rvAnel(mem)}<span class="rv-mini-txt"><b>${tot?`Revisão espaçada: ${rvPl(tot,"item","itens")}`:"Revisão espaçada em dia"}</b><small>${tot?rvPartes(h)+" chegaram hoje":P[1].c+P[1].q+P[1].m?`Amanhã: ${rvPartes(P[1])}`:"Memória estimada e próximos dias"}</small></span>
 <span class="rv-mini-sem" aria-hidden="true">${P.map((d,i)=>{const t=d.c+d.q+d.m;return `<i class="${i?"":"hj"}" style="--h:${t?Math.max(12,Math.round(t*100/mx)):4}%;--i:${i}"></i>`}).join("")}</span>${ic("prox")}</button>`}

/* ilustração da central: cartões, seta de volta e relógio */
ILU.memoria=`<g transform="rotate(-14 98 92)"><rect x="58" y="58" width="76" height="54" rx="8" class="f-a" opacity=".55"/></g><g transform="rotate(7 122 86)"><rect x="80" y="54" width="78" height="56" rx="8" class="f-b"/></g><rect x="94" y="48" width="82" height="58" rx="9" class="f-w s-t" stroke-width="2"/><path d="M106 64h56M106 76h42M106 88h50" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".35"/><path d="M66 120a56 16 0 0 0 108 2" class="s-b" fill="none" stroke-width="5" stroke-linecap="round"/><path d="M168 108l12 12-15 5z" class="f-b"/><circle cx="184" cy="46" r="21" class="f-t"/><circle cx="184" cy="46" r="15.5" class="f-w"/><path d="M184 36v10l7 5" class="s-t" stroke-width="3" stroke-linecap="round" fill="none"/>`;

/* ações da revisão (ouvinte próprio, sem mexer no clique principal) */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-acao^='rv-']");if(!b||b.disabled)return;const a=b.dataset.acao;
 if(a==="rv-central"){gaveta=false;ir({tela:"revisao"})}
 else if(a==="rv-comecar")rvComecar();
 else if(a==="rv-cartoes")rvCartoesHoje();
 else if(a==="rv-teim-c")rvDeckCom(rvTeimC(),"Cartões teimosos",20);
 else if(a==="rv-teim-q")ir({tela:"pre",key:"teim"});
 else if(a==="rv-curva"){rvCurvaMuda(+b.dataset.n);som("toque")}
 else if(a==="rv-dia"){const P=rvPrevisao(14),i=+b.dataset.i,d=P[i],t=d.c+d.q+d.m;
  document.querySelectorAll(".rv-barra").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
  const el=document.querySelector(".rv-dia-info");if(el)el.innerHTML=`<b>${rvRotDia(i,d.t)}:</b> ${t?rvPartes(d)+(i===0?" (com os atrasados)":""):"nada marcado. Dia livre para conteúdo novo."}`;som("toque")}
 else if(a==="rv-cx"){const i=+b.dataset.i,n=rvCaixas(rvItens())[i],X=RV_CX[i];
  document.querySelectorAll(".rv-cx").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));ovoReanima(b,"pula");
  const el=document.querySelector(".rv-cx-info");if(el)el.innerHTML=`<b>${X[0]}</b> (${X[2]>1e8?"60 dias ou mais":X[1]?`de ${X[1]} a ${X[2]-1} dias`:"até 2 dias"}): ${X[4]} ${n.c+n.q?`Aqui estão ${rvPartes(n)}.`:"Ainda vazia."}`;som("toque")}
 else if(a==="rv-medidor"){ovoReanima(b,"treme");som("toque");if(ovoConta("rvmed",5,2500))ovoMemoria()}});
/* ao avaliar um cartão, uma etiqueta sobe do botão dizendo quando ele volta */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('[data-acao="card-nota"]');if(!b||!animOn())return;
 const sm=b.querySelector("small"),v=+b.dataset.v,r=b.getBoundingClientRect(),txt=v===0?"Volta já já":"Volta "+(sm?sm.textContent:"");
 setTimeout(()=>{const s=document.createElement("span");s.className="rv-voa v"+v;s.textContent=txt;s.style.left=(r.left+r.width/2)+"px";s.style.top=(r.top-4)+"px";document.body.appendChild(s);setTimeout(()=>s.remove(),1400)},0)},true);

/* segredo: Memória de elefante (5 toques seguidos no medidor de memória) */
OVOS.push({id:"memoria",ic:"cartas",nome:"Memória de elefante",dica:"Na Revisão espaçada, toque várias vezes seguidas no medidor de memória."});
const OME_FALAS=["Não esqueço!","Nem tente.","Art. 5º, XIV: informação é direito.","Tema 786 do STF, lembra?","Elefante não esquece. Você também não."];
let omeI=0;
const OME_SVG=`<svg class="ome-svg" viewBox="0 0 240 170" aria-hidden="true"><ellipse class="ome-sombra" cx="124" cy="160" rx="84" ry="7"/>
 <g class="ome-corpo"><rect x="88" y="116" width="20" height="40" rx="9" class="ome-p2"/><rect x="160" y="116" width="20" height="40" rx="9" class="ome-p2"/><path class="ome-rabo" d="M188 98q16 6 12 26"/>
 <ellipse cx="140" cy="100" rx="56" ry="42" class="ome-p"/><rect x="110" y="122" width="20" height="36" rx="9" class="ome-p"/><rect x="172" y="120" width="19" height="36" rx="9" class="ome-p"/>
 <rect x="122" y="70" width="44" height="30" rx="5" class="ome-carta" transform="rotate(-8 144 85)"/><path d="M130 80h26M130 88h18" class="ome-linha" transform="rotate(-8 144 85)"/></g>
 <g class="ome-cabeca"><path class="ome-tromba" d="M52 92c-14 10-16 30-6 42 6 7 15 5 13-3"/><ellipse cx="74" cy="76" rx="34" ry="32" class="ome-p"/><path d="M90 50c24-10 42 8 36 32s-24 30-38 20z" class="ome-orelha"/><path d="M96 60c14-4 22 8 18 22s-14 16-22 10z" class="ome-orelha-in"/>
 <circle cx="64" cy="70" r="5" class="ome-olho"/><circle cx="66" cy="68" r="1.6" class="ome-brilho"/><path d="M58 98q8 8 18 1" class="ome-presa"/><ellipse cx="52" cy="80" rx="5" ry="3" class="ome-bochecha"/></g></svg>`;
function ovoMemoria(rever){omeI=0;ovoCena("memoria","ovo-memoria",`<div class="ome-palco">${OME_SVG}<span class="ome-fala">${OME_FALAS[0]}</span></div>
 <h2>Memória de elefante</h2><p class="frase">Dizem que o elefante nunca esquece. Com a revisão espaçada, você também não.</p>
 <p class="ovo-nota"><b>E o direito ao esquecimento?</b> Em 2021, o STF julgou o Tema 786 (RE 1.010.606, caso Aída Curi) e decidiu que é incompatível com a Constituição um direito ao esquecimento entendido como o poder de impedir, só pela passagem do tempo, a divulgação de fatos verdadeiros e obtidos de forma lícita. Excessos continuam sendo analisados caso a caso, pela proteção da honra, da imagem e da privacidade.</p>${ovoBotoes(`<button class="botao" data-ovo="mem-esquece">Tentar fazer esquecer</button>`)}`,{rever,titulo:"Memória de elefante",confete:true})}
OVO_ABRE.memoria=ovoMemoria;
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('[data-ovo="mem-esquece"]');if(!b)return;const c=b.closest(".festa");if(!c)return;
 omeI=(omeI+1)%OME_FALAS.length||1;const f=c.querySelector(".ome-fala");if(f)f.textContent=OME_FALAS[omeI];ovoReanima(c.querySelector(".ome-palco"),"nega");ovoSom("puxa")});
