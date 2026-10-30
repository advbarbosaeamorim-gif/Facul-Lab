"use strict";
/* ---------- resumo da semana: cartão de segunda a domingo com o que foi estudado, o que evoluiu e o que pede reforço ----------
   As respostas de cada dia ficam em S.semQ ({dia: {questão: 1 certa | 0 errada}}, últimos 63 dias). Nos dias de antes disso,
   o resumo usa a última resposta de cada questão (S.stats). No domingo (e na segunda, para a semana que passou) o Hoje mostra
   um aviso até o cartão ser aberto (S.semVisto = segunda-feira da semana vista). O cartão vira imagem (canvas) para compartilhar,
   na cor escolhida (S.cfg.semCor) e no formato post 4:5 ou story 9:16 (S.cfg.semFmt). Segredo: tocar 3 vezes no carimbo. */
P.compart='<path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>';
P.baixar='<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>';
P.sobe='<path d="M4 17l6-6 4 4 6-7M14 8h6v6"/>';
const SEM_CORES=[
 {id:"tema",nome:"Tema do app"},
 {id:"aurora",nome:"Ipê",a:"#7c3aed",b:"#db2777"},
 {id:"oceano",nome:"Oceano",a:"#1d4ed8",b:"#06b6d4"},
 {id:"mata",nome:"Mata",a:"#065f46",b:"#65a30d"},
 {id:"brasa",nome:"Brasa",a:"#c2410c",b:"#e11d48"},
 {id:"noite",nome:"Noite dourada",a:"#0b1022",b:"#3b2a85",ac:"#fbbf24"},
 {id:"papel",nome:"Papel timbrado",a:"#fbf6ea",b:"#efe1c3",fg:"#2a1d14",sub:"#6b5544",ac:"#8a2232",chip:"rgba(110,70,30,.09)",bolha:"rgba(138,34,50,.06)"}
];
const SEM_NIVEIS=[
 {min:0,tit:"Semana em recesso",frase:"Todo processo tem pausas. Segunda o expediente recomeça, e uma questão já acende a chama.",selo:["EM","RECESSO"]},
 {min:1,tit:"Petição inicial protocolada",frase:"O primeiro passo está dado. Agora é dar andamento ao processo, um dia de cada vez.",selo:["PEDIDO","INICIAL"]},
 {min:3,tit:"Processo em andamento",frase:"Metade da semana com estudo. Mais um ou dois dias e a sentença sai a seu favor.",selo:["EM","ANDAMENTO"]},
 {min:5,tit:"Sentença favorável",frase:"Constância de quem vai longe. Sua dedicação foi julgada procedente.",selo:["SENTENÇA","FAVORÁVEL"]},
 {min:7,tit:"Trânsito em julgado",frase:"Sete dias de sete. Decisão irrecorrível: você estudou a semana inteira!",selo:["TRANSITADO","EM JULGADO"]}
];
const SEM_DIAS=["segunda","terça","quarta","quinta","sexta","sábado","domingo"];
function semCorAtual(){const c=S.cfg&&S.cfg.semCor;return SEM_CORES.some(x=>x.id===c)?c:"tema"}
function semStory(){return !!(S.cfg&&S.cfg.semFmt==="story")}
/* segunda-feira da semana (off = 0 esta, -1 a passada...) */
function semSeg(off){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7+7*(off||0));d.setHours(0,0,0,0);return d}
function semKeys(seg){const r=[];for(let i=0;i<7;i++){const d=new Date(seg);d.setDate(d.getDate()+i);r.push(hojeStr(d.getTime()))}return r}
function semFaixa(seg){const a=new Date(seg),b=new Date(seg);b.setDate(b.getDate()+6);const M=new Intl.DateTimeFormat("pt-BR",{month:"long"});
 return a.getMonth()===b.getMonth()?`${a.getDate()} a ${b.getDate()} de ${M.format(b)}`:`${a.getDate()} de ${MESES_C[a.getMonth()]} a ${b.getDate()} de ${MESES_C[b.getMonth()]}`}
/* guarda cada resposta do dia (para comparar semanas sem perder o que foi refeito depois) */
function semGuarda(id,c){S.semQ=S.semQ||{};const k=hojeStr();(S.semQ[k]=S.semQ[k]||{})[id]=c?1:0;
 const ks=Object.keys(S.semQ).sort();if(ks.length>63)ks.slice(0,ks.length-63).forEach(z=>delete S.semQ[z])}
{const reg0=registrar;registrar=function(id,c,o){reg0(id,c,o);try{semGuarda(id,c)}catch(e){}}}
function semRespostas(ks){const out={},G=S.semQ||{},F={};ks.forEach(k=>{if(G[k])out[k]=G[k];else F[k]=out[k]={}});
 if(Object.keys(F).length)Object.keys(S.stats||{}).forEach(id=>{const s=S.stats[id];if(!s||!s.t)return;const k=hojeStr(s.t);if(F[k])F[k][id]=s.u?1:0});
 return out}
const semPct=x=>x.o+x.e?Math.round(x.o*100/(x.o+x.e)):null;
function semDados(off){const seg=semSeg(off),ks=semKeys(seg),D=S.dias||{},R=semRespostas(ks),hj=hojeStr();
 const dias=ks.map((k,i)=>{const x=D[k]||{};return {k,i,q:x.q||0,c:x.c||0,p:x.p||0,on:temAtiv(x),hoje:k===hj,fut:k>hj}});
 const mats={},ass={};let o=0,e=0;
 ks.forEach(k=>{const r=R[k]||{};Object.keys(r).forEach(id=>{const q=QMAP[id];if(!q||!META[q.m])return;const c=r[id]?1:0;o+=c;e+=1-c;
  const m=mats[q.m]=mats[q.m]||{m:q.m,o:0,e:0};m.o+=c;m.e+=1-c;const g=grupoDe(q);const a=ass[q.m+"|"+g]=ass[q.m+"|"+g]||{m:q.m,a:g,o:0,e:0};a.o+=c;a.e+=1-c})});
 const soma=f=>dias.reduce((s,z)=>s+z[f],0);
 return {off,seg,ks,dias,q:soma("q"),c:soma("c"),p:soma("p"),on:dias.filter(z=>z.on).length,o,e,pct:semPct({o,e}),mats,ass}}
/* ofensiva no fim da semana (na semana atual, a de hoje) */
function semSeqAte(k){const D=S.dias||{};const d=new Date(k+"T12:00:00");let n=0;while(temAtiv(D[hojeStr(d.getTime())])){n++;d.setDate(d.getDate()-1)}return n}
function semResumo(off){const A=semDados(off),B=semDados(off-1);
 const ev=Object.values(A.mats).map(x=>{const y=B.mats[x.m],v=x.o+x.e;return {m:x.m,v,p:semPct(x),d:y&&y.o+y.e>=3&&v>=3?semPct(x)-semPct(y):null}});
 const sobe=ev.filter(x=>x.d!==null&&x.d>0).sort((a,b)=>b.d-a.d||b.v-a.v).slice(0,2);
 const treinou=ev.filter(x=>x.v>=3).sort((a,b)=>b.v-a.v);
 const fracos=Object.values(A.ass).map(x=>Object.assign({v:x.o+x.e,p:semPct(x)},x)).filter(x=>x.v>=2&&x.p<70).sort((a,b)=>a.p-b.p||b.v-a.v).slice(0,2);
 /* recorde: mais questões que em qualquer uma das 12 semanas anteriores (com pelo menos uma delas estudada) */
 const D=S.dias||{};let rec=A.q>0,antes=false;for(let k=1;k<=12&&rec;k++){const q=semKeys(semSeg(off-k)).reduce((s,z)=>s+((D[z]||{}).q||0),0);if(q)antes=true;if(q>=A.q)rec=false}
 const nv=SEM_NIVEIS.filter(x=>A.on>=x.min).pop();
 const fimK=off===0?hojeStr():A.ks[6];const seq=off===0?sequencia():semSeqAte(fimK);
 const broc=(typeof BROCARDOS!=="undefined"&&BROCARDOS.length)?BROCARDOS[((Math.round(A.seg.getTime()/6048e5))%BROCARDOS.length+BROCARDOS.length)%BROCARDOS.length]:null;
 return {A,B,sobe,treinou,fracos,rec:rec&&antes,nv,seq,broc,emCurso:off===0&&new Date().getDay()!==0}}
const semNome=m=>nomeCurto(META[m].nome);
function semDelta(a,b,suf){if(a===null||b===null)return "";const d=a-b;return d>0?`+${d}${suf||""}`:d<0?`−${-d}${suf||""}`:"="}
function semTxtDelta(R){const a=R.A.q,b=R.B.q;if(!a&&!b)return "";if(!b)return "a primeira semana com questões";const d=a-b;return d>0?`+${d} que a semana passada`:d<0?`${d} que a semana passada`.replace("-","−"):"igual à semana passada"}
/* carimbo da semana: anel com texto e o veredito no meio */
let semSeloN=0;
function semSeloSvg(lin){const id="sem-anel-"+(++semSeloN);const n=Math.max(...lin.map(s=>s.length));const fs=Math.min(15,62/(n*.66)).toFixed(1);const y0=60-(lin.length-1)*fs*.55;
 return `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false"><defs><path id="${id}" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs>
 <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" stroke-width="1.6"/>
 <text font-size="10" font-weight="800" fill="currentColor"><textPath href="#${id}" textLength="272" lengthAdjust="spacing">SEMANA JULGADA ★ FACUL LAB ★</textPath></text>
 <text text-anchor="middle" font-weight="800" font-size="${fs}" fill="currentColor">${lin.map((s,i)=>`<tspan x="60" y="${(y0+i*fs*1.1+fs*.36).toFixed(1)}">${esc(s)}</tspan>`).join("")}</text></svg>`}
function semCorEstilo(id){const c=SEM_CORES.find(x=>x.id===id)||SEM_CORES[0];if(!c.a)return "";
 return `--sa:${c.a};--sb:${c.b};${c.fg?`--sfg:${c.fg};--ssub:${c.sub};`:""}${c.ac?`--sac:${c.ac};`:""}${c.chip?`--schip:${c.chip};`:""}${c.bolha?`--sbolha:${c.bolha};`:""}`}
function semAnel(p){const C=2*Math.PI*15;return `<svg class="sc-anel" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15"/><circle cx="18" cy="18" r="15" class="v" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-(p||0)/100)).toFixed(1)}" transform="rotate(-90 18 18)"/></svg>`}
function semCartao(R,cor){const A=R.A,mx=Math.max(1,...A.dias.map(z=>z.q));const dl=semTxtDelta(R);
 const up=R.sobe.length?R.sobe.map(x=>`<li><b>${esc(semNome(x.m))}</b><em>+${x.d} pts</em></li>`).join("")
  :R.treinou.length?`<li><b>${esc(semNome(R.treinou[0].m))}</b><em>${R.treinou[0].v} quest.</em></li><li class="sc-obs">Matéria mais treinada da semana</li>`
  :`<li class="sc-obs">Resolva questões para medir a evolução</li>`;
 const dn=R.fracos.length?R.fracos.map(x=>`<li><b>${esc(x.a)}</b><em>${x.p}%</em></li>`).join("")
  :A.o+A.e?`<li class="sc-obs">Nenhum assunto abaixo de 70%. Mandou bem!</li>`:`<li class="sc-obs">Sem questões nesta semana</li>`;
 return `<article class="sem-card${R.rec?" recorde":""}" id="sem-card" data-cor="${cor}" style="${semCorEstilo(cor)}" aria-label="Resumo da semana de ${semFaixa(A.seg)}">
 <i class="sc-bolha b1" aria-hidden="true"></i><i class="sc-bolha b2" aria-hidden="true"></i><i class="sc-bolha b3" aria-hidden="true"></i>
 <header class="sc-topo"><span class="sc-marca">${ic("balanca")}Facul Lab</span><span class="sc-data">${semFaixa(A.seg)}${R.emCurso?" · em curso":""}</span></header>
 <p class="sc-kicker">${R.rec?"Recorde! ":""}Resumo da semana</p>
 <h2 class="sc-tit">${esc(R.nv.tit)}</h2><p class="sc-frase">${esc(R.nv.frase)}</p>
 <button class="sc-selo" data-sem="selo" aria-label="Carimbo da semana: ${esc(R.nv.selo.join(" ").toLowerCase())}">${semSeloSvg(R.nv.selo)}</button>
 <div class="sc-hero"><b class="sc-num">${A.q}</b><span>quest${A.q===1?"ão resolvida":"ões resolvidas"}${dl?`<em class="sc-delta">${esc(dl)}</em>`:""}${R.seq>1?`<em class="sc-delta sc-fogo">${ic("chama")} ofensiva de ${R.seq} dias</em>`:""}</span></div>
 <div class="sc-barras" role="group" aria-label="Questões por dia">${A.dias.map(z=>`<button class="sc-dia${z.on?" on":""}${z.hoje?" hoje":""}${z.fut?" fut":""}" data-sem="dia" data-i="${z.i}" style="--h:${Math.round(z.q*100/mx)}%;--i:${z.i}" aria-label="${SEM_DIAS[z.i]}: ${z.q} questões"><b>${z.q||""}</b><span class="sc-col"><i></i></span><small>${SEM_DIAS[z.i].slice(0,3)}</small></button>`).join("")}</div>
 <p class="sc-info" aria-live="polite">Toque em um dia para ver os detalhes</p>
 <div class="sc-stats">
  <div>${semAnel(A.pct)}<b>${A.pct===null?"—":A.pct+"%"}</b><small>de acerto</small></div>
  <div>${ic("chama")}<b>${A.on}/7</b><small>dias com estudo</small></div>
  <div>${ic("cartas")}<b>${A.c}</b><small>cartões revisados</small></div>
  <div>${ic("livro")}<b>${A.p}</b><small>temas lidos</small></div>
 </div>
 <div class="sc-duo"><section class="sc-box"><h3>${ic("sobe")} Evoluiu</h3><ul>${up}</ul></section><section class="sc-box"><h3>${ic("alvo")} Para reforçar</h3><ul>${dn}</ul></section></div>
 ${R.broc?`<footer class="sc-rodape"><span class="sc-broc-tit">Brocardo da semana</span><i>${esc(R.broc[0])}</i><span>${esc(R.broc[1])}</span></footer>`:""}
 </article>`}
function semComp(R){const A=R.A,B=R.B;const L=[["Questões",A.q,B.q,""],["Acerto",A.pct,B.pct," pts"],["Dias com estudo",A.on,B.on,""],["Cartões revisados",A.c,B.c,""],["Temas lidos",A.p,B.p,""]];
 return `<div class="sem-comp">${L.map(([n,a,b,s])=>{const d=semDelta(a,b,s);const cl=!d||d==="="?"":d[0]==="+"?" sobe":" desce";const fmt=v=>v===null?"—":n==="Acerto"?v+"%":v;
  return `<div class="scp-l"><span>${n}</span><span class="scp-v"><small>${fmt(b)}</small>${ic("prox")}<b>${fmt(a)}</b></span><em class="scp-d${cl}">${d||"—"}</em></div>`}).join("")}</div>`}
function semPlano(R){let h="";const f=R.fracos[0];
 if(f)h+=itemPlano(false,"treinar-ass",`data-sc="${f.m}" data-a="${esc(encodeURIComponent(f.a))}"`,"var(--erro)","alvo",`Reforçar: ${esc(f.a)}`,`${esc(semNome(f.m))} · ${f.p}% de acerto na semana. Treine só esse assunto`);
 const er=errosPendentes();if(er)h+=itemPlano(false,"erradas","","var(--lacre)","refazer",`Refazer ${er} quest${er>1?"ões erradas":"ão errada"}`,"Errar, entender e refazer é o jeito mais rápido de fixar");
 const venc=contaVencidos();if(venc)h+=itemPlano(false,"cards-venc","","var(--nv6)","cartas",`Revisar ${venc} cart${venc>1?"ões":"ão"}`,"Chegaram no dia certo da revisão espaçada");
 const alvo=Math.min(7,Math.max(3,R.A.on+1));
 h+=itemPlano(false,"ir-raiz",`data-tela="metas"`,"var(--ok)","chama",R.A.on>=7?"Manter os 7 dias de estudo":`Meta: estudar ${alvo} dias na semana`,R.A.on>=7?"Sequência perfeita. Até um dia leve conta para a chama":`Nesta semana foram ${R.A.on}. Um dia a mais já faz diferença na prova`);
 return h}
function telaSemanal(){const off=Math.min(0,Math.max(-12,rota.sem|0));rota.sem=off;const R=semResumo(off),A=R.A,cor=semCorAtual();
 const rot=off===0?"Esta semana":off===-1?"Semana passada":`Há ${-off} semanas`;
 if((semAviso()===off)&&S.semVisto!==A.ks[0]){S.semVisto=A.ks[0];salvar()}
 return topo("Resumo da semana",semFaixa(A.seg),{menu:true})+`<main class="wrap sem">
 ${capaTela("trofeu","Sua semana em um cartão","O que você estudou, o que evoluiu e o que pede reforço. Depois, é só compartilhar.")}
 <div class="sem-nav"><button class="sn-bt" data-sem="ant" ${off<=-12?"disabled":""} aria-label="Semana anterior">${ic("voltar")}</button><div class="sn-meio"><b>${rot}</b><small>${semFaixa(A.seg)}${R.emCurso?" · fecha no domingo":""}</small></div><button class="sn-bt" data-sem="prox" ${off>=0?"disabled":""} aria-label="Próxima semana">${ic("prox")}</button></div>
 <div class="sem-palco">${semCartao(R,cor)}</div>
 <div class="sem-acoes"><button class="botao cheio" data-sem="gerar">${ic("compart")}<span>Compartilhar</span></button><button class="botao linha" data-sem="baixar">${ic("baixar")}<span>Salvar imagem</span></button></div>
 <div class="secao" role="heading" aria-level="2">Cor do cartão</div>
 <div class="sem-cores" role="group" aria-label="Cor do cartão">${SEM_CORES.map(c=>`<button data-sem="cor" data-v="${c.id}" aria-pressed="${c.id===cor}"><i style="${c.a?`--a:${c.a};--b:${c.b}`:""}"${c.a?"":' class="tema"'}></i><span>${esc(c.nome)}</span></button>`).join("")}</div>
 <div class="sem-fmt" role="group" aria-label="Formato da imagem"><button data-sem="fmt" data-v="post" aria-pressed="${!semStory()}"><i class="f-post"></i><span><b>Post</b><small>4:5, para o feed</small></span></button><button data-sem="fmt" data-v="story" aria-pressed="${semStory()}"><i class="f-story"></i><span><b>Story</b><small>9:16, para status</small></span></button></div>
 <div class="secao" role="heading" aria-level="2">Comparado com a semana anterior</div>${semComp(R)}
 ${off>=-1?`<div class="secao" role="heading" aria-level="2">Para a próxima semana</div><div class="lista plano-lista">${semPlano(R)}</div>`:""}
 <details class="sem-como"><summary>${ic("info")} Como o resumo é calculado</summary><ul>
  <li><b>Semana</b>: de segunda a domingo. No domingo o cartão fica completo e o app avisa no Hoje.</li>
  <li><b>Questões, cartões e temas</b>: tudo o que você fez em cada dia, inclusive a lei seca.</li>
  <li><b>Acerto</b>: as respostas dadas na semana. Se refez uma questão no mesmo dia, vale a última tentativa.</li>
  <li><b>Evoluiu</b>: matérias em que o acerto subiu em relação à semana anterior (com pelo menos 3 questões em cada uma).</li>
  <li><b>Para reforçar</b>: assuntos com menos de 70% de acerto na semana. O plano abaixo do cartão leva direto para eles.</li>
  <li><b>Carimbo</b>: recesso (nenhum dia), pedido inicial (1 ou 2 dias), em andamento (3 ou 4), sentença favorável (5 ou 6) e trânsito em julgado (7 de 7).</li></ul></details>
 </main>`}
/* aviso no Hoje: domingo (semana atual) e segunda (a que passou), até abrir o cartão */
function semAviso(){const d=new Date().getDay();return d===0?0:d===1?-1:null}
function semBanner(){const off=semAviso();if(off===null)return "";const A=semDados(off);if(!A.on||S.semVisto===A.ks[0])return "";const nv=SEM_NIVEIS.filter(x=>A.on>=x.min).pop();
 return `<button class="sem-banner" data-sem-abrir="${off}"><span class="sb-selo">${semSeloSvg(nv.selo)}</span><span class="sb-txt"><small>${off===0?"Chegou o domingo":"Sua semana passada"}</small><b>Seu resumo da semana está pronto</b><span>${A.q} questões, ${A.on} de 7 dias. Veja e compartilhe.</span></span>${ic("prox")}</button>`}
function semEnfeita(){if(rota.tela==="hoje"){const hero=document.querySelector(".hoje-hero");if(hero&&!document.querySelector(".hoje .sem-banner")){const h=semBanner();if(h)hero.insertAdjacentHTML("beforebegin",h)}return}
 if(rota.tela==="semanal"&&(semRevelar||rota!==semRotaVista)){const nova=rota!==semRotaVista;semRotaVista=rota;semRevelar=false;semRevela(nova)}}
let semRevelar=false,semRotaVista=null,semToques=[];
function semRevela(festa){const c=document.getElementById("sem-card");if(!c||!animOn())return;c.classList.add("revela");
 c.querySelectorAll(".sc-num,.sc-stats b").forEach(contar);
 setTimeout(()=>{if(c.isConnected)som("carimbo")},1050);
 const A=semResumo(rota.sem|0);if(festa&&(A.rec||A.A.on>=5))setTimeout(()=>{if(!c.isConnected)return;const cv=document.createElement("canvas");cv.className="sem-confete";cv.setAttribute("aria-hidden","true");document.body.appendChild(cv);confete(cv);som("meta");setTimeout(()=>cv.remove(),4200)},1500)}
try{new MutationObserver(semEnfeita).observe($("#app"),{childList:true})}catch(e){}
/* ---------- imagem do cartão (canvas): post 1080x1350 ou story 1080x1920 ---------- */
function semCorVals(id){const c=SEM_CORES.find(x=>x.id===id)||SEM_CORES[0];const base={fg:"#ffffff",sub:"rgba(255,255,255,.8)",ac:"#fde68a",chip:"rgba(255,255,255,.15)",bolha:"rgba(255,255,255,.09)"};
 if(c.a)return Object.assign(base,c);const cs=getComputedStyle(document.documentElement);const v=n=>cs.getPropertyValue(n).trim();
 return estiloAtual()==="premium"?Object.assign(base,{a:v("--p1")||"#2563eb",b:v("--p2")||"#06b6d4"}):Object.assign(base,{a:v("--toga")||"#1d4f91",b:v("--toga-2")||"#143a6d",ac:v("--lacre")||"#f2b632"})}
function semRR(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
function semQuebra(x,t,w){const ps=String(t).split(" ");const L=[];let l="";ps.forEach(p=>{const n=l?l+" "+p:p;if(x.measureText(n).width>w&&l){L.push(l);l=p}else l=n});if(l)L.push(l);return L}
function semIco(x,nome,X,Y,s,cor){const src=P[nome]||"";x.save();x.translate(X,Y);x.scale(s/24,s/24);x.strokeStyle=cor;x.lineWidth=2.2;x.lineCap="round";x.lineJoin="round";
 (src.match(/ d="[^"]+"/g)||[]).forEach(m=>{try{x.stroke(new Path2D(m.slice(4,-1)))}catch(e){}});
 (src.match(/<rect[^>]*>/g)||[]).forEach(m=>{const g=k=>+((m.match(new RegExp(' '+k+'="([\\d.]+)"'))||[])[1]||0);x.beginPath();if(x.roundRect)x.roundRect(g("x"),g("y"),g("width"),g("height"),g("rx"));else x.rect(g("x"),g("y"),g("width"),g("height"));x.stroke()});
 (src.match(/<circle[^>]*>/g)||[]).forEach(m=>{const g=k=>+((m.match(new RegExp(k+'="([\\d.]+)"'))||[])[1]||0);x.beginPath();x.arc(g("cx"),g("cy"),g("r"),0,Math.PI*2);x.stroke()});x.restore()}
function semSeloCanvas(x,cx,cy,r,lin,cor,F){x.save();x.translate(cx,cy);x.rotate(-12*Math.PI/180);x.strokeStyle=cor;x.fillStyle=cor;x.globalAlpha=.95;
 x.lineWidth=r*.07;x.beginPath();x.arc(0,0,r*.93,0,7);x.stroke();x.lineWidth=r*.028;x.beginPath();x.arc(0,0,r*.6,0,7);x.stroke();
 const txt="SEMANA JULGADA ★ FACUL LAB ★ ",rr=r*.73;x.font=`800 ${Math.round(r*.165)}px ${F}`;x.textAlign="center";x.textBaseline="middle";
 const ang=Math.PI*2/txt.length;[...txt].forEach((ch,i)=>{x.save();x.rotate(-Math.PI/2+i*ang);x.translate(rr,0);x.rotate(Math.PI/2);x.fillText(ch,0,0);x.restore()});
 const n=Math.max(...lin.map(s=>s.length));const fs=Math.min(r*.25,r*1.03/(n*.66));x.font=`800 ${Math.round(fs)}px ${F}`;
 lin.forEach((s,i)=>x.fillText(s,0,(i-(lin.length-1)/2)*fs*1.12));x.restore()}
async function semImagem(R,corId,story){const W=1080,H=story?1920:1350,dy=story?285:0;const cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d");
 const C=semCorVals(corId),papel=corId==="papel";const F='"Plus Jakarta Sans", system-ui, sans-serif',FT=papel?'"Zilla Slab", Georgia, serif':F;
 try{await Promise.all(['800 80px "Plus Jakarta Sans"','700 40px "Plus Jakarta Sans"','500 30px "Plus Jakarta Sans"','italic 700 30px "Plus Jakarta Sans"','700 70px "Zilla Slab"'].map(f=>document.fonts.load(f)))}catch(e){}
 const g=x.createLinearGradient(0,0,W*.6,H);g.addColorStop(0,C.a);g.addColorStop(1,C.b);x.fillStyle=g;x.fillRect(0,0,W,H);
 x.fillStyle=C.bolha;[[W-40,90,300],[30,H*.62,190],[W*.62,H+40,130],[W*.2,40,70]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,7);x.fill()});
 if(papel){x.strokeStyle=C.ac;x.globalAlpha=.5;x.lineWidth=4;x.strokeRect(28,28,W-56,H-56);x.lineWidth=1.5;x.strokeRect(42,42,W-84,H-84);x.globalAlpha=1}
 const A=R.A,M=80,CW=W-2*M;x.textBaseline="alphabetic";x.translate(0,dy);
 /* topo */
 semIco(x,"balanca",M,64,44,C.fg);x.fillStyle=C.fg;x.font=`800 36px ${F}`;x.textAlign="left";x.fillText("Facul Lab",M+56,100);
 const fx=semFaixa(A.seg)+(R.emCurso?" · em curso":"");x.font=`700 28px ${F}`;const fw=x.measureText(fx).width+44;x.fillStyle=C.chip;semRR(x,W-M-fw,58,fw,56,28);x.fill();x.fillStyle=C.fg;x.textAlign="center";x.fillText(fx,W-M-fw/2,96);
 /* título e carimbo */
 x.textAlign="left";x.fillStyle=C.sub;x.font=`800 26px ${F}`;x.fillText([...((R.rec?"RECORDE! ":"")+"RESUMO DA SEMANA")].join(String.fromCharCode(8202)),M,196);
 x.fillStyle=C.fg;x.font=`${papel?700:800} 68px ${FT}`;let y=268;semQuebra(x,R.nv.tit,CW-260).slice(0,2).forEach(l=>{x.fillText(l,M,y);y+=76});
 x.fillStyle=C.sub;x.font=`500 30px ${F}`;y+=2;semQuebra(x,R.nv.frase,CW-250).slice(0,2).forEach(l=>{x.fillText(l,M,y);y+=42});
 semSeloCanvas(x,W-M-118,262,122,R.nv.selo,C.ac,F);
 /* número da semana */
 const sobra=Math.max(0,y+14-436);y=Math.max(y+14,436);x.fillStyle=C.fg;x.font=`800 168px ${F}`;x.fillText(String(A.q),M-6,y+130);const nw=x.measureText(String(A.q)).width;
 const hx=M+nw+26;x.font=`800 38px ${F}`;x.fillText(A.q===1?"questão":"questões",hx,y+50);x.fillText(A.q===1?"resolvida":"resolvidas",hx,y+92);
 const chips=[semTxtDelta(R),R.seq>1?`ofensiva de ${R.seq} dias`:""].filter(Boolean);let cx=hx;x.font=`700 24px ${F}`;
 chips.forEach((t,i)=>{const fogo=i===chips.length-1&&R.seq>1;const w=x.measureText(t).width+36+(fogo?30:0);if(cx+w>W-M)return;x.fillStyle=C.chip;semRR(x,cx,y+108,w,42,21);x.fill();if(fogo)semIco(x,"chama",cx+14,y+117,24,C.ac);x.fillStyle=C.fg;x.fillText(t,cx+18+(fogo?30:0),y+137);cx+=w+10});
 /* barras */
 y+=172;const mx=Math.max(1,...A.dias.map(z=>z.q)),bw=(CW-6*22)/7,bh=Math.max(70,130-sobra);
 A.dias.forEach((z,i)=>{const bx=M+i*(bw+22);x.fillStyle=C.chip;semRR(x,bx,y+34,bw,bh,20);x.fill();const h=Math.max(z.q?20:0,Math.round(bh*z.q/mx));
  if(h){x.globalAlpha=z.on?.95:.4;x.fillStyle=C.fg;semRR(x,bx,y+34+bh-h,bw,h,Math.min(20,h/2));x.fill();x.globalAlpha=1}
  x.textAlign="center";x.fillStyle=C.fg;x.font=`800 24px ${F}`;if(z.q)x.fillText(String(z.q),bx+bw/2,y+24);
  x.fillStyle=z.hoje?C.fg:C.sub;x.font=`700 24px ${F}`;x.fillText(SEM_DIAS[i].slice(0,3),bx+bw/2,y+bh+70);
  if(z.on){x.fillStyle=C.ac;x.beginPath();x.arc(bx+bw/2,y+bh+88,5,0,7);x.fill()}});
 /* números */
 y+=bh+108;const sw=(CW-3*20)/4,sh=146;const ST=[["anel",A.pct===null?"—":A.pct+"%","de acerto"],["chama",A.on+"/7","dias com estudo"],["cartas",String(A.c),"cartões revisados"],["livro",String(A.p),"temas lidos"]];
 ST.forEach(([icn,v,l],i)=>{const sx=M+i*(sw+20);x.fillStyle=C.chip;semRR(x,sx,y,sw,sh,28);x.fill();const mid=sx+sw/2;
  if(icn==="anel"){x.lineWidth=6;x.strokeStyle=C.chip;x.beginPath();x.arc(mid,y+31,15,0,7);x.stroke();x.strokeStyle=C.ac;x.lineCap="round";x.beginPath();x.arc(mid,y+31,15,-Math.PI/2,-Math.PI/2+Math.PI*2*((A.pct||0)/100));x.stroke()}
  else semIco(x,icn,mid-15,y+16,30,C.ac);
  x.textAlign="center";x.fillStyle=C.fg;x.font=`800 46px ${F}`;x.fillText(v,mid,y+98);x.fillStyle=C.sub;x.font=`600 21px ${F}`;x.fillText(l,mid,y+128)});
 /* evoluiu e para reforçar */
 y+=sh+20;const bw2=(CW-20)/2,bh2=176;
 const lista=(t,icn,itens,bx)=>{x.fillStyle=C.chip;semRR(x,bx,y,bw2,bh2,28);x.fill();semIco(x,icn,bx+26,y+26,28,C.ac);x.textAlign="left";x.fillStyle=C.sub;x.font=`800 22px ${F}`;x.fillText(t.toUpperCase(),bx+64,y+49);
  let ly=y+96;itens.forEach(([n,v,obs])=>{if(obs){x.fillStyle=C.sub;x.font=`600 24px ${F}`;semQuebra(x,n,bw2-52).slice(0,3).forEach(l=>{x.fillText(l,bx+26,ly);ly+=32});return}
   x.font=`800 26px ${F}`;const vw=x.measureText(v).width;x.fillStyle=C.ac;x.textAlign="right";x.fillText(v,bx+bw2-26,ly);x.textAlign="left";x.fillStyle=C.fg;x.font=`700 26px ${F}`;
   let nm=n;const mw=bw2-52-vw-18;if(x.measureText(nm).width>mw){while(x.measureText(nm+"…").width>mw&&nm.length>3)nm=nm.slice(0,-1);nm=nm.replace(/\s+$/,"")+"…"}x.fillText(nm,bx+26,ly);ly+=48})};
 const up=R.sobe.length?R.sobe.map(z=>[semNome(z.m),`+${z.d} pts`]):R.treinou.length?[[semNome(R.treinou[0].m),`${R.treinou[0].v} quest.`],["Matéria mais treinada","",1]]:[["Resolva questões para medir a evolução","",1]];
 const dn=R.fracos.length?R.fracos.map(z=>[z.a,z.p+"%"]):[[A.o+A.e?"Nenhum assunto abaixo de 70%. Mandou bem!":"Sem questões nesta semana","",1]];
 lista("Evoluiu","sobe",up,M);lista("Para reforçar","alvo",dn,M+bw2+20);
 /* rodapé: brocardo da semana e endereço */
 y+=bh2+34;x.strokeStyle=C.sub;x.globalAlpha=.5;x.setLineDash([10,10]);x.lineWidth=2;x.beginPath();x.moveTo(M,y);x.lineTo(W-M,y);x.stroke();x.setLineDash([]);x.globalAlpha=1;
 if(R.broc){x.textAlign="left";x.fillStyle=C.fg;x.font=`italic 700 28px ${F}`;let by=y+46;semQuebra(x,"“"+R.broc[0]+"”",CW-300).slice(0,1).forEach(l=>{x.fillText(l,M,by);by+=36});x.fillStyle=C.sub;x.font=`500 24px ${F}`;semQuebra(x,R.broc[1],CW-300).slice(0,1).forEach(l=>x.fillText(l,M,by))}
 x.textAlign="right";x.fillStyle=C.sub;x.font=`700 22px ${F}`;x.fillText("facul-lab.netlify.app",W-M,y+46);
 if(story){x.textAlign="center";x.fillStyle=C.fg;x.font=`800 34px ${F}`;x.fillText("Estudo de Direito, um dia de cada vez",W/2,-140)}
 return cv}
let semImg=null;
function semTextoPartilha(R){const A=R.A;return `Minha semana no Facul Lab: ${A.q} questões${A.pct!==null?`, ${A.pct}% de acerto`:""} e ${A.on} de 7 dias estudando. ${R.nv.tit}!`}
async function semGerar(acao,btn){if(btn){btn.disabled=true;btn.classList.add("gerando")}
 try{const R=semResumo(rota.sem|0);const cv=await semImagem(R,semCorAtual(),semStory());const blob=await new Promise(r=>cv.toBlob(r,"image/png"));if(!blob)throw 0;
  if(semImg)URL.revokeObjectURL(semImg.url);semImg={blob,url:URL.createObjectURL(blob),nome:`facul-lab-semana-${R.A.ks[0]}${semStory()?"-story":""}.png`,txt:semTextoPartilha(R)};
  if(acao==="baixar"){semBaixar();return}
  semPrevia()}catch(e){anunciar("Não foi possível gerar a imagem")}
 finally{if(btn){btn.disabled=false;btn.classList.remove("gerando")}}}
function semPrevia(){const velho=document.querySelector(".festa");if(velho)velho.remove();const pode=semPodePartilhar();
 const el=document.createElement("div");el.className="festa sem-previa";el.dataset.acao="festa-fechar";el.setAttribute("role","dialog");el.setAttribute("aria-label","Imagem do resumo da semana");
 el.innerHTML=`<div class="festa-card"><p class="sp-tit">${ic("ok")} Imagem pronta</p><img src="${semImg.url}" alt="Cartão do resumo da semana" class="${semStory()?"story":""}"><div class="botoes">${pode?`<button class="botao cheio" data-sem="pv-partilhar">${ic("compart")}<span>Enviar</span></button>`:""}<button class="botao${pode?"":" cheio"}" data-sem="pv-baixar">${ic("baixar")}<span>Salvar no aparelho</span></button><button class="botao" data-acao="festa-fechar">Fechar</button></div>${pode?"":`<p class="nota" style="margin:8px 0 0">Neste navegador, salve a imagem e envie pelo app que quiser.</p>`}</div>`;
 document.body.appendChild(el);syncVoltar();som("vira")}
function semPodePartilhar(){try{return !!(semImg&&navigator.canShare&&navigator.canShare({files:[new File([semImg.blob],semImg.nome,{type:"image/png"})]}))}catch(e){return false}}
async function semPartilhar(){if(!semImg)return;try{await navigator.share({files:[new File([semImg.blob],semImg.nome,{type:"image/png"})],title:"Meu resumo da semana",text:semImg.txt});som("aprovado")}catch(e){if(e&&e.name!=="AbortError")semBaixar()}}
function semBaixar(){if(!semImg)return;const a=document.createElement("a");a.href=semImg.url;a.download=semImg.nome;document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),500);som("carimbo");anunciar("Imagem salva no aparelho")}
/* ---------- segredo: Embargos de declaração (3 toques no carimbo da semana) ---------- */
const EMB_VICIOS=[["obscuridade","Obscuridade"],["contradicao","Contradição"],["omissao","Omissão"],["erro","Erro material"]];
const EMB_CASOS=[
 {v:"contradicao",txt:"Reconheço que o estudante resolveu questões em todos os dias da semana. Por isso, julgo improcedente o pedido, pois ele não estudou nenhum dia.",ok:"A fundamentação diz uma coisa e o dispositivo diz o contrário. Os embargos pedem que o juiz elimine a contradição.",no:"Olhe de novo: a decisão afirma e nega a mesma coisa. Quando as partes da decisão não combinam entre si, o vício é a contradição."},
 {v:"omissao",txt:"O estudante pediu que fossem contadas as questões e os cartões revisados. Julgo procedente o pedido quanto às questões.",ok:"O juiz esqueceu de decidir sobre os cartões, um ponto que devia analisar. Os embargos servem para suprir a omissão.",no:"Repare no que ficou de fora: o pedido tinha dois pontos e a decisão só respondeu um. Ponto sem resposta é omissão."},
 {v:"erro",txt:"Somadas as 20 questões de segunda-feira e as 10 de terça-feira, o estudante resolveu 300 questões na semana.",ok:"20 + 10 dá 30, não 300. Erro de cálculo evidente é erro material e pode ser corrigido até de ofício (art. 494, I, do CPC).",no:"Faça a conta: 20 + 10 não dá 300. Engano evidente de digitação ou de cálculo é erro material."},
 {v:"obscuridade",txt:"Julgo o pedido nos termos daquilo que, dos autos não constando, constar possa, conforme não se sabe se será.",ok:"Ninguém entende o que foi decidido. Os embargos pedem que o juiz esclareça a obscuridade.",no:"Leia em voz alta: dá para saber o que foi decidido? Decisão confusa, que não se entende, tem obscuridade."}
];
let embI=0;
function embPalco(){const c=EMB_CASOS[embI];return `<div class="emb-palco"><div class="emb-folha"><span class="emb-cab">${ic("martelo")} Sentença da semana</span><p>“${esc(c.txt)}”</p><span class="emb-carimbo" aria-hidden="true">Embargos<br>acolhidos</span></div>
 <p class="emb-perg">Qual é o vício desta decisão?</p><div class="emb-ops">${EMB_VICIOS.map(([k,n])=>`<button class="botao linha" data-sem="emb-op" data-v="${k}">${n}</button>`).join("")}</div><p class="emb-resp" aria-live="polite"></p></div>`}
function ovoEmbargos(rever){embI=Math.floor(Math.random()*EMB_CASOS.length);
 ovoCena("embargos","ovo-emb",`<h2>Embargos de declaração</h2><p class="frase">Você tocou tanto no carimbo que recorreu da sentença! Ache o defeito da decisão e oponha os embargos.</p>${embPalco()}
 <p class="ovo-nota"><b>Embargos de declaração</b> cabem contra qualquer decisão judicial para esclarecer <b>obscuridade</b>, eliminar <b>contradição</b>, suprir <b>omissão</b> ou corrigir <b>erro material</b> (art. 1.022 do CPC). O prazo é de 5 dias (art. 1.023) e eles interrompem o prazo para os outros recursos (art. 1.026). Se forem só para atrasar o processo, são protelatórios e geram multa de até 2% do valor da causa (art. 1.026, § 2º).</p>${ovoBotoes(`<button class="botao" data-sem="emb-outra">Outra sentença</button>`)}`,{rever,titulo:"Embargos de declaração"});ovoSomDepois("martelo",animOn()?350:30)}
OVOS.push({id:"embargos",ic:"recibo",nome:"Embargos de declaração",dica:"No resumo da semana, o carimbo aceita recurso. Toque nele três vezes seguidas."});
OVO_ABRE.embargos=ovoEmbargos;
/* cliques da tela do resumo, do aviso no Hoje e do segredo */
document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;
 const ab=t.closest("[data-sem-abrir]");if(ab){raiz({tela:"semanal",sem:+ab.dataset.semAbrir||0});som("abre");return}
 const b=t.closest("[data-sem]");if(!b||b.disabled)return;const a=b.dataset.sem;
 if(a==="ant"||a==="prox"){rota.sem=(rota.sem|0)+(a==="ant"?-1:1);rota.manterScroll=true;semRevelar=true;render();som("vira")}
 else if(a==="cor"){S.cfg.semCor=b.dataset.v;salvar();const c=document.getElementById("sem-card");if(c){c.setAttribute("style",semCorEstilo(b.dataset.v));c.dataset.cor=b.dataset.v;ovoReanima(c,"troca")}
  document.querySelectorAll('.sem-cores [data-sem="cor"]').forEach(x=>x.setAttribute("aria-pressed",String(x===b)));som("toque")}
 else if(a==="fmt"){S.cfg.semFmt=b.dataset.v;salvar();document.querySelectorAll('.sem-fmt [data-sem="fmt"]').forEach(x=>x.setAttribute("aria-pressed",String(x===b)));som("toque")}
 else if(a==="dia"){const R=semDados(rota.sem|0),z=R.dias[+b.dataset.i];const info=document.querySelector(".sc-info");
  document.querySelectorAll(".sc-dia.sel").forEach(x=>{if(x!==b)x.classList.remove("sel")});const sel=b.classList.toggle("sel");
  if(info)info.textContent=!sel?"Toque em um dia para ver os detalhes":z.fut?`${SEM_DIAS[z.i][0].toUpperCase()+SEM_DIAS[z.i].slice(1)}: ainda vai chegar`:!z.on?`${SEM_DIAS[z.i][0].toUpperCase()+SEM_DIAS[z.i].slice(1)}: sem estudo registrado`:`${SEM_DIAS[z.i][0].toUpperCase()+SEM_DIAS[z.i].slice(1)}: ${z.q} quest${z.q===1?"ão":"ões"}, ${z.c} cart${z.c===1?"ão":"ões"} e ${z.p} tema${z.p===1?"":"s"} lido${z.p===1?"":"s"}`;
  som("toque")}
 else if(a==="selo"){ovoReanima(b,"bate");som("carimbo");const n=Date.now();semToques=semToques.filter(x=>n-x<2500);semToques.push(n);if(semToques.length>=3){semToques=[];setTimeout(()=>ovoEmbargos(),380)}}
 else if(a==="gerar"||a==="baixar")semGerar(a,b);
 else if(a==="pv-partilhar")semPartilhar();
 else if(a==="pv-baixar")semBaixar();
 else if(a==="emb-op"){const c=EMB_CASOS[embI],pal=b.closest(".emb-palco"),ok=b.dataset.v===c.v;if(!pal||pal.classList.contains("acolhido"))return;
  b.classList.add(ok?"certa":"errada");pal.querySelector(".emb-resp").innerHTML=`<b>${ok?"Embargos acolhidos!":"Embargos rejeitados."}</b> ${esc(ok?c.ok:c.no)}`;
  if(ok){pal.classList.add("acolhido");ovoSomDepois("carimbo",animOn()?380:30);ovoConfete()}else som("erro")}
 else if(a==="emb-outra"){const pal=document.querySelector(".ovo-emb .emb-palco");if(!pal)return;embI=(embI+1+Math.floor(Math.random()*(EMB_CASOS.length-1)))%EMB_CASOS.length;pal.outerHTML=embPalco();ovoReanima(document.querySelector(".ovo-emb .emb-palco"),"troca");som("vira")}
});
