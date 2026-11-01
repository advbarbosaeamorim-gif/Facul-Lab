"use strict";
/* ---------- O que mudou na lei (dados em mudancas.js) ----------
   As leis e emendas de 2024 a 2026 que mudaram o que o app ensina: o que mudou, o antes e o agora, a vigência,
   a ementa oficial, onde estudar (temas da apostila) e as questões que citam a lei (simulado "mud:<id>").
   Novidades: o que entrou no app depois da última visita (S.mudVisto) ganha o selo "Nova", contador no menu
   e um aviso no Hoje. Na apostila, os temas explicados com uma dessas leis mostram o selo "Atualizado com…". */
const MUD=(window.MUDANCAS||[]).filter(x=>x&&x.id&&x.n&&x.data&&Array.isArray(x.mud)).sort((a,b)=>b.data.localeCompare(a.data));
const MUDMAP={};MUD.forEach(x=>MUDMAP[x.id]=x);
P.leinova='<path d="M18 11V8l-5-5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5M13 3v5h5M8.5 12h5M8.5 16h2.5"/><path d="M18 13.5l1.2 2.6 2.6 1.2-2.6 1.2L18 21l-1.2-2.5-2.6-1.2 2.6-1.2z"/>';
/* ilustração: a lei com um trecho riscado, o trecho novo em destaque, o selo de novidade e o calendário */
ILU.leinova=`<rect x="54" y="22" width="102" height="116" rx="7" class="f-w s-t" stroke-width="2"/><rect x="68" y="36" width="56" height="9" rx="4.5" class="f-a"/><path d="M68 58h72M68 70h58" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".3"/><path d="M68 85h54" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".3"/><path d="M64 85h64" class="s-b" stroke-width="3" stroke-linecap="round"/><rect x="63" y="95" width="80" height="15" rx="5" class="f-a" opacity=".3"/><path d="M69 102.5h62" class="s-t" stroke-width="4" stroke-linecap="round"/><path d="M68 124h42" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".3"/><circle cx="170" cy="44" r="23" class="f-b"/><path d="M170 30.5l4.1 8.7 9.4 1.3-6.9 6.5 1.7 9.4-8.3-4.6-8.3 4.6 1.7-9.4-6.9-6.5 9.4-1.3z" class="f-w"/><path d="M146 92c14 2 22 8 24 16" class="s-b" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 7"/><rect x="160" y="104" width="46" height="38" rx="6" class="f-w s-t" stroke-width="2"/><rect x="160" y="104" width="46" height="11" rx="5" class="f-t"/><path d="M171 99v9M195 99v9" class="s-t" stroke-width="3" stroke-linecap="round"/><path d="M169 124h6M181 124h6M193 124h5M169 133h6M181 133h6" class="s-t" stroke-width="3" stroke-linecap="round" opacity=".4"/><circle cx="196" cy="133" r="4" class="f-b"/>`;

const MUD_MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const MUD_MES_L=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
function mudData(x,longa){const [a,m,d]=x.data.split("-").map(Number);return longa?`${d}${d===1?"º":""} de ${MUD_MES_L[m-1]} de ${a}`:`${d} ${MUD_MES[m-1]}`}
/* nome curto da matéria para chips e etiquetas: "Penal", "Processo Penal", "Trabalho", "Ética" */
const MUD_CURTO={etica:"Ética",eca:"ECA",pc:"Processo Civil",pp:"Processo Penal",pt:"Processo do Trabalho",dh:"Direitos Humanos"};
function mudArea(m){if(MUD_CURTO[m])return MUD_CURTO[m];const n=(META[m]&&META[m].nome)||m;const s=n.replace(/^Direito (do |da |de )?/,"");return s.charAt(0).toUpperCase()+s.slice(1)}
function mudCor(x){const m=x.area&&x.area[0];return (META[m]&&META[m].cor)||"var(--toga)"}

/* ---------- novidades ---------- */
const mudUltima=()=>MUD.reduce((s,x)=>(x.em||"")>s?x.em:s,"");
function mudNovas(){if(!S.mudVisto)return MUD;return MUD.filter(x=>(x.em||"")>S.mudVisto)}
function mudMarcarVisto(){const u=mudUltima();if(u&&S.mudVisto!==u){S.mudVisto=u;salvar()}}
/* no menu: "nova" enquanto a pessoa não abriu a tela; depois, quantas leis entraram desde a última visita */
function mudBadge(){if(!MUD.length)return "";if(!S.mudVisto)return ` <span class="badge mud-badge">nova</span>`;const n=mudNovas().length;return n?` <span class="badge">${n}</span>`:""}
/* aviso no Hoje, até a pessoa abrir a tela ou dispensar */
function mudAviso(){if(!MUD.length)return "";const N=mudNovas();if(!N.length)return "";const prim=!S.mudVisto;
 const anos=MUD.map(x=>+x.data.slice(0,4));const a0=Math.min(...anos),a1=Math.max(...anos);
 const txt=prim?`${MUD.length} leis e emendas de ${a0} a ${a1}: o que mudou, o antes e o agora e onde estudar cada uma.`
  :N.length===1?`${N[0].n}: ${N[0].nome}.`:`${N.slice(0,2).map(x=>x.n).join(", ")}${N.length>2?` e mais ${N.length-2}`:""}.`;
 return `<section class="mud-aviso" aria-label="O que mudou na lei"><button class="mud-aviso-b" data-mud="abrir">${ilustra("leinova","var(--toga)")||`<span class="ma-tile">${tile("var(--toga)","leinova")}</span>`}<span class="ma-tx"><small>${prim?"Novo no app":"Novidade na lei"}</small><b>${prim?"O que mudou na lei":N.length===1?"1 mudança nova na lei":`${N.length} mudanças novas na lei`}</b><span>${esc(txt)}</span></span>${ic("prox")}</button>
 <button class="ma-x" data-mud="dispensar" aria-label="Dispensar este aviso">${ic("x")}</button></section>`}

/* ---------- temas da apostila: a posição é achada pelo título (se a apostila mudar de ordem, o selo acompanha) ---------- */
function mudPos(tm){const d=tm[0],k=tm[1],t=tm[2];try{const P=paginas(d);const a=semAcento(limpo(t||""));const j=a?P.secs.findIndex(s=>semAcento(limpo(s.tit))===a):-1;return j>=0?j+1:k}catch(e){return k}}
function mudDoTema(d,k){return MUD.filter(x=>(x.temas||[]).some(tm=>tm[0]===d&&mudPos(tm)===k))}
function mudSelo(d,k){const L=mudDoTema(d,k);if(!L.length)return "";const x=L[0];
 const tx=L.length===1?`Atualizado com a <b>${esc(x.n)}</b>`:`Atualizado com <b>${L.length} leis novas</b>`;
 const sub=L.length===1?`${esc(MUD_MES_L[+x.data.slice(5,7)-1])} de ${x.data.slice(0,4)} · ${esc(x.nome)}`:esc(L.slice(0,2).map(y=>y.n).join(", ")+(L.length>2?` e mais ${L.length-2}`:""));
 return `<button class="mud-selo" data-mud="tema-ver" data-d="${d}" data-k="${k}">${ic("leinova")}<span class="ms-tx"><span>${tx}</span><small>${sub}</small></span><span class="ms-ver">Ver o que mudou${ic("prox")}</span></button>`}
{const b0=blocoTema;blocoTema=function(d,f,P,k){const h=b0(d,f,P,k);let s="";try{s=mudSelo(d,k)}catch(e){}if(!s)return h;
 const fim="</h3></div></div>",i=h.indexOf(fim);return i<0?s+h:h.slice(0,i+fim.length)+s+h.slice(i+fim.length)}}

/* ---------- simulado com as questões que citam a lei ---------- */
{const s0=sim;sim=function(key){const p=String(key).split(":");if(p[0]!=="mud")return s0(key);const x=MUDMAP[p[1]];
 return {key,tipo:"mud",titulo:x?`Questões: ${x.n}`:"O que mudou na lei",sub:x?x.nome:"",qids:x&&x.q?x.q.filter(id=>QMAP[id]):[],limite:0}}}

/* ---------- a tela ---------- */
const mudAbertos=new Set();
function mudFiltrada(){const f=rota.mf||"todas";
 if(rota.tema){const [d,k]=String(rota.tema).split(":");return mudDoTema(d,+k)}
 if(f==="top")return MUD.filter(x=>x.top);
 return f==="todas"?MUD:MUD.filter(x=>(x.area||[]).includes(f))}
function mudChips(){const f=rota.tema?"":rota.mf||"todas";const cont={};MUD.forEach(x=>(x.area||[]).forEach(m=>cont[m]=(cont[m]||0)+1));
 const areas=Object.keys(cont).filter(m=>META[m]).sort((a,b)=>cont[b]-cont[a]||mudArea(a).localeCompare(mudArea(b)));
 const b=(v,t)=>`<button data-mud="filtro" data-v="${v}" aria-pressed="${f===v}">${t}</button>`;
 return `<div class="chips" role="group" aria-label="Filtrar por matéria">${b("todas","Todas")}${MUD.some(x=>x.top)?b("top","Revise primeiro"):""}${areas.map(m=>b(m,esc(mudArea(m)))).join("")}</div>`}
/* linha do tempo: um ponto por lei, no mês em que foi assinada; os anos levam à lista daquele ano */
function mudLinha(L){if(!MUD.length)return "";const ids=new Set(L.map(x=>x.id));
 const anos=[...new Set(MUD.map(x=>+x.data.slice(0,4)))].sort();const a0=anos[0],a1=anos[anos.length-1];const meses=(a1-a0+1)*12;
 const col=[...Array(meses)].map(()=>[]);[...MUD].reverse().forEach(x=>{const i=(+x.data.slice(0,4)-a0)*12+(+x.data.slice(5,7)-1);if(col[i])col[i].push(x)});
 let n=0;const pontos=col.map(c=>`<span class="ml-m">${c.map(x=>`<i class="${ids.has(x.id)?"":"fora"}" style="--c:${mudCor(x)};--i:${n++}"></i>`).join("")}</span>`).join("");
 const porAno=a=>L.filter(x=>+x.data.slice(0,4)===a).length;
 return `<div class="mud-linha"><div class="ml-pontos" style="--meses:${meses}" aria-hidden="true">${pontos}</div>
 <div class="ml-anos" style="--anos:${anos.length}">${[...Array(a1-a0+1)].map((_,j)=>{const a=a0+j,q=porAno(a);return `<button data-mud="ano" data-v="${a}" ${q?"":"disabled"}><b>${a}</b><small>${q} ${q===1?"lei":"leis"}</small></button>`}).join("")}</div></div>`}
function mudAA(x){if(!x.aa||!x.aa.length)return "";
 return `<div class="mud-aa"><p class="mud-sub">Antes e agora</p>${x.aa.map((r,i)=>`<div class="aa-l" style="--i:${i}"><b class="aa-i">${inl(r[0])}</b><span class="aa-antes"><small>Antes</small>${inl(r[1])}</span><span class="aa-seta" aria-hidden="true">${ic("prox")}</span><span class="aa-agora"><small>Agora</small>${inl(r[2])}</span></div>`).join("")}</div>`}
function mudTemas(x){const T=(x.temas||[]).filter(tm=>DISC[tm[0]]);if(!T.length)return "";
 return `<p class="mud-sub">Onde estudar no app</p><div class="mud-temas">${T.map(tm=>{const f=infoDisc(tm[0]);const k=mudPos(tm);
  return `<button class="mud-tema" data-mud="tema" data-d="${tm[0]}" data-k="${k}" data-t="${esc(tm[2]||"")}">${tile(f.cor,f.ic)}<span><small>${esc(nomeCurto(f.nome))} · tema ${k}</small><b>${esc(limpo(tm[2]||`Tema ${k}`))}</b></span>${ic("prox")}</button>`}).join("")}</div>`}
function mudItem(x,novas){const nova=novas.has(x.id);const aberto=mudAbertos.has(x.id)||rota.abrir===x.id;const [,,d]=x.data.split("-").map(Number);
 const areas=(x.area||[]).filter(m=>META[m]).map(mudArea).join(", ");const qs=x.q?x.q.filter(id=>QMAP[id]).length:0;
 return `<details class="mud${nova?" nova":""}" id="mud-${x.id}" data-mud-id="${x.id}" style="--c:${mudCor(x)}"${aberto?" open":""}>
 <summary><span class="mud-dia" aria-hidden="true"><b>${d}</b><small>${MUD_MES[+x.data.slice(5,7)-1]}</small></span>
 <span class="mud-tx"><small>${esc(x.n)}<span class="sr">, ${esc(mudData(x,true))}</span> · ${esc(areas)}</small><b>${esc(x.nome)}</b>${nova||x.top?`<span class="mud-tags">${nova?`<span class="mud-nova">Nova</span>`:""}${x.top?`<span class="mud-top">Revise primeiro</span>`:""}</span>`:""}</span>
 <span class="mud-seta" aria-hidden="true">${ic("prox")}</span></summary>
 <div class="mud-corpo" data-leis=""><p class="mud-sub">O que mudou</p><ul class="mud-o">${x.mud.map(m=>`<li>${inl(m)}</li>`).join("")}</ul>
 ${mudAA(x)}
 ${x.vig?`<p class="mud-vig">${ic("calendario")}<span>${inl(x.vig)}</span></p>`:""}
 ${mudTemas(x)}
 ${qs?`<p class="mud-sub">Treinar</p><div class="lista mud-treino">${itemSim("mud:"+x.id,qs===1?"A questão sobre esta lei":`As ${qs} questões sobre esta lei`)}</div>`:""}
 ${x.ementa?`<details class="mud-ementa"><summary>${ic("recibo")}Ementa oficial · ${esc(mudData(x,true))}</summary><p>${esc(x.ementa)}</p></details>`:""}</div></details>`}
function telaMudancas(){if(!MUD.length)return topo("O que mudou na lei","",{menu:!pilha.length})+`<main class="wrap">${vazio("leinova","Lista em preparação","As mudanças recentes nas leis aparecem aqui assim que entram nas apostilas.")}</main>`;
 if(!rota.novas)rota.novas=S.mudVisto?mudNovas().map(x=>x.id):[];mudMarcarVisto();
 const novas=new Set(rota.novas);const L=mudFiltrada();
 const anos=[...new Set(L.map(x=>x.data.slice(0,4)))].sort().reverse();
 const a0=MUD[MUD.length-1].data.slice(0,4),a1=MUD[0].data.slice(0,4);
 let filtro="";
 if(rota.tema){const [d,k]=String(rota.tema).split(":");let tit="";try{tit=paginas(d).secs[+k-1].tit}catch(e){const tm=(L[0]&&L[0].temas||[]).find(t=>t[0]===d);tit=tm?tm[2]:""}
  filtro=`<div class="mud-filtro"><p><small>Mudanças explicadas no tema</small><b>${esc(limpo(tit))}</b><span>${esc(nomeCurto(infoDisc(d).nome))} · tema ${k}</span></p><button class="botao linha" data-mud="todas">Ver todas as mudanças</button></div>`}
 const sub=rota.tema?`${L.length} ${L.length===1?"lei":"leis"} neste tema`:`${L.length} ${L.length===1?"lei ou emenda":"leis e emendas"} de ${a0} a ${a1}`;
 return topo("O que mudou na lei",sub,{menu:!pilha.length,extra:rota.tema?"":mudChips()})+
 `<main class="wrap mud-tela">${rota.tema?"":capaTela("leinova","O que mudou na lei","As leis novas que mudam o que você estuda, uma por uma.")}
 ${filtro||`<div class="dica"><p style="margin:0">As apostilas, os resumos e as questões do app <b>já estão com a redação nova</b>. Aqui você vê, lei por lei, o que mudou, o antes e o agora, onde estudar e questões para treinar. Toque numa lei para abrir.</p></div>${mudLinha(L)}`}
 ${L.length?anos.map(a=>{const LA=L.filter(x=>x.data.startsWith(a));return `<section class="mud-ano" id="mud-ano-${a}"><div class="secao-linha"><div class="secao" role="heading" aria-level="2">${a}</div><span class="contador">${LA.length} ${LA.length===1?"lei":"leis"}</span></div><div class="mud-lista">${LA.map(x=>mudItem(x,novas)).join("")}</div></section>`}).join("")
  :vazio("leinova","Nenhuma mudança neste filtro","Escolha outra matéria ou volte para todas.",`<button class="botao linha" data-mud="filtro" data-v="todas">Ver todas</button>`)}
 <p class="mud-fonte">Datas e ementas oficiais: Senado Federal, Dados Abertos (Legislação Federal). Lista conferida com as apostilas em ${esc(mudData({data:mudUltima()||MUD[0].data},true))}.</p></main>`}

/* ---------- toques ---------- */
async function mudAbrirTema(b){const d=b.dataset.d,i=periodoDe(d);if(i<0)return;let k=+b.dataset.k||1;
 if(!apOk(i)){b.classList.add("abrindo");await carregarApP(i);b.classList.remove("abrindo")}
 const t=b.dataset.t;if(t)k=mudPos([d,k,t]);ir({tela:"ler",d,pg:k,pagina:true})}
function mudRolar(el){if(!el)return;try{el.scrollIntoView({block:"start",behavior:animOn()?"smooth":"auto"})}catch(e){}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-mud]");if(!b||b.disabled)return;const a=b.dataset.mud;e.stopImmediatePropagation();
 if(a==="abrir"){gaveta=false;ir({tela:"mudancas"})}
 else if(a==="dispensar"){mudMarcarVisto();const s=b.closest(".mud-aviso");if(s&&animOn()){s.classList.add("sai");setTimeout(()=>{if(s.isConnected)s.remove()},260)}else if(s)s.remove()}
 else if(a==="filtro"){rota.mf=b.dataset.v;delete rota.tema;delete rota.abrir;rota.manterScroll=true;render();topoTela()}
 else if(a==="todas"){delete rota.tema;delete rota.abrir;rota.mf="todas";render();topoTela()}
 else if(a==="ano")mudRolar(document.getElementById("mud-ano-"+b.dataset.v));
 else if(a==="tema")mudAbrirTema(b);
 else if(a==="tema-ver"){const d=b.dataset.d,k=+b.dataset.k;const L=mudDoTema(d,k);ir({tela:"mudancas",tema:`${d}:${k}`,abrir:L.length===1?L[0].id:null})}},true);
/* quais leis estão abertas: continuam abertas depois de responder um simulado e voltar */
document.addEventListener("toggle",e=>{const el=e.target;if(!el||!el.matches||!el.matches("details.mud"))return;const id=el.dataset.mudId;
 if(el.open){mudAbertos.add(id);if(el.classList.contains("nova"))el.classList.add("vista")}else mudAbertos.delete(id)},true);
