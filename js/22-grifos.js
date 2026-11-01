"use strict";
/* ---------- marca-texto na apostila ----------
   Selecionar um trecho de um tema da apostila abre a barra do marca-texto: tocar numa das 4 cores grifa o trecho, que
   fica guardado neste aparelho e volta grifado sempre que o tema abre (também na impressão). Tocar num grifo deixa trocar
   a cor, copiar ou apagar. Todos os grifos ficam em Favoritos e grifos, por matéria e tema, com filtro por cor; tocar num
   deles abre o tema já no trecho.
   S.grifos = {id: {d, k: tema, tt: título do tema, t: texto exato, a/z: um pedaço antes e depois, o: posição no texto,
   c: cor, em: data}}. O texto com o antes e o depois acham o trecho de novo mesmo se a apostila ganhar texto antes dele;
   o título acha o tema se a ordem dos temas mudar. Se o próprio trecho mudar, o grifo fica na lista com um aviso. */
P.marcatexto='<path d="m9 11.5 6.8-6.8a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8L12.5 15"/><path d="m9 11.5 3.5 3.5-2.5 2.5H7.5L6 16v-2z"/><path d="M4 21h9"/>';
P.borracha='<path d="m7 21-4.3-4.3a1.5 1.5 0 0 1 0-2.1L13.3 4a1.5 1.5 0 0 1 2.1 0l5.6 5.6a1.5 1.5 0 0 1 0 2.1L11.7 21"/><path d="M7 21h14M8.5 9l7.5 7.5"/>';
ILU.marcatexto=`<rect x="56" y="28" width="108" height="108" rx="8" class="f-w s-t" stroke-width="2"/><path d="M72 50h66M72 64h76" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".3"/><rect x="66" y="74" width="70" height="16" rx="5" class="f-gr"/><path d="M72 82h58" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".55"/><path d="M72 100h72M72 114h50" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".3"/><g transform="rotate(-42 138 84)"><path d="M138 84l9-7h7v14h-7z" class="f-gr s-t" stroke-width="2"/><rect x="154" y="75" width="44" height="18" rx="4" class="f-a"/><rect x="186" y="75" width="16" height="18" rx="4" class="f-t"/></g>`;
SONS.grifa=a=>{const t=a.currentTime+.005;ruido(a,t,.26,{f1:1250,f2:2700,Q:1.5,vol:.16,pico:.6,eco:.12})};
VIBRA.grifa=10;

const GR_CORES=[["am","amarelo"],["vd","verde"],["rs","rosa"],["az","azul"]];
const grNome=c=>(GR_CORES.find(x=>x[0]===c)||GR_CORES[0])[1];
/* o texto que pode ser grifado: fica de fora o que é botão, campo, ilustração, esquema e pergunta do Teste-se */
const GR_FORA="summary,button:not(.art-link),input,textarea,select,label,svg,figure,[data-sem-grifo]";
const GR_BLOCO="p,li,td,th,h3,h4,h5,dd,dt,blockquote,aside,details,div,article";
const GR_LETRA=/[\p{L}\p{N}]/u;
const GR_MAX=4000;
let grB=null,grT=0,grTimer=0,grDesf=null,grMemo=null;

/* ---------- o texto do tema como uma linha só (com quebra entre blocos) e onde cada pedaço está ---------- */
function grModelo(art){const segs=[];let txt="",ult=null;
 const w=document.createTreeWalker(art,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement,f=p&&p.closest(GR_FORA);return f&&art.contains(f)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
 for(let n=w.nextNode();n;n=w.nextNode()){const v=n.nodeValue;if(!v)continue;const b=n.parentElement.closest(GR_BLOCO);
  if(ult&&b!==ult&&txt&&!/\s$/.test(txt))txt+="\n";ult=b;segs.push({n,i:txt.length,j:txt.length+v.length});txt+=v}
 return {txt,segs}}
/* seleção -> [início, fim] no texto do tema, sem espaços nas pontas e sem cortar palavra ao meio */
function grFaixa(M,r){let s=-1,e=-1;
 for(const x of M.segs){let ok=false;try{ok=r.intersectsNode(x.n)}catch(_){}if(!ok)continue;
  const a=x.n===r.startContainer?x.i+r.startOffset:x.i,b=x.n===r.endContainer?x.i+r.endOffset:x.j;if(s<0)s=a;e=b}
 if(s<0)return null;const T=M.txt;
 while(s<e&&/\s/.test(T[s]))s++;while(e>s&&/\s/.test(T[e-1]))e--;
 while(s>0&&GR_LETRA.test(T[s-1])&&GR_LETRA.test(T[s]))s--;
 while(e<T.length&&GR_LETRA.test(T[e])&&GR_LETRA.test(T[e-1]))e++;
 return e-s>=2?[s,e]:null}
const grComum=(a,b,fim)=>{let k=0;const n=Math.min(a.length,b.length);if(fim)while(k<n&&a[a.length-1-k]===b[b.length-1-k])k++;else while(k<n&&a[k]===b[k])k++;return k};
/* acha o trecho guardado: entre as ocorrências do texto, a que tem o mesmo antes e depois (e, no empate, a mais perto de onde estava) */
function grAchar(T,g){const t=g.t||"";if(t.length<2)return null;const A=g.a||"",Z=g.z||"";let best=-1,bs=-1e9;
 for(let i=T.indexOf(t),n=0;i>=0&&n<300;i=T.indexOf(t,i+1),n++){
  const sc=grComum(T.slice(Math.max(0,i-A.length),i),A,true)+grComum(T.slice(i+t.length,i+t.length+Z.length),Z,false)-Math.abs(i-(g.o||0))/1e6;
  if(sc>bs){bs=sc;best=i}}
 if(best>=0)return [best,best+t.length];
 try{const m=new RegExp(escRe(t.trim()).replace(/\s+/g,"\\s+")).exec(T);if(m)return [m.index,m.index+m[0].length]}catch(e){}
 return null}
/* pinta: cada pedaço de texto do trecho ganha um <mark> (o grifo pode atravessar negrito, link de artigo e parágrafos) */
function grEnvolver(M,s,e,g){const ms=[];
 for(const x of M.segs){if(x.j<=s||x.i>=e)continue;const a=Math.max(s,x.i)-x.i,b=Math.min(e,x.j)-x.i;if(b<=a)continue;
  let n=x.n;if(a>0)n=n.splitText(a);if(b-a<n.nodeValue.length)n.splitText(b-a);
  const m=document.createElement("mark");m.className=`grifo gr-${g.c}`;m.dataset.g=g.id;n.parentNode.insertBefore(m,n);m.appendChild(n);ms.push(m)}
 if(ms.length){ms[0].classList.add("gr-ini");ms[ms.length-1].classList.add("gr-fim")}
 return ms}
/* em que trecho do texto está cada grifo já pintado */
function grFaixasDe(M){const F={};for(const x of M.segs){const m=x.n.parentElement&&x.n.parentElement.closest("mark.grifo");if(!m)continue;
  const f=F[m.dataset.g]||(F[m.dataset.g]=[x.i,x.j]);f[0]=Math.min(f[0],x.i);f[1]=Math.max(f[1],x.j)}return F}

/* ---------- os grifos guardados ---------- */
function grLista(){const G=S.grifos||{};return Object.keys(G).filter(id=>G[id]&&G[id].d&&DISC[G[id].d]&&periodoDe(G[id].d)>=0).map(id=>Object.assign({id},G[id]))}
/* posição atual do tema pelo título (a apostila pode ganhar um tema novo antes dele) */
function grPos(g){try{if(!g.tt||!apOk(periodoDe(g.d)))return g.k;const P=paginas(g.d),a=semAcento(g.tt),s=P.secs[g.k-1];
  if(s&&semAcento(limpo(s.tit))===a)return g.k;const j=P.secs.findIndex(x=>semAcento(limpo(x.tit))===a);return j>=0?j+1:g.k}catch(e){return g.k}}
function grTitulo(g,k){try{if(apOk(periodoDe(g.d))){const s=paginas(g.d).secs[k-1];if(s)return limpo(s.tit)}}catch(e){}return g.tt||`Tema ${k}`}
/* " · 2 grifos" no índice dos temas da apostila */
function grSelo(d,k){if(!S.grifos)return "";if(!grMemo){grMemo={};grLista().forEach(g=>{const c=g.d+":"+grPos(g);grMemo[c]=(grMemo[c]||0)+1})}
 const n=grMemo[d+":"+k]||0;return n?` · ${n} grifo${n>1?"s":""}`:""}
function grAplicar(art){const [d,ks]=String(art.dataset.grifo||"").split(":"),k=+ks;if(!d||!k||!S.grifos)return;
 const L=grLista().filter(g=>g.d===d&&grPos(g)===k).sort((x,y)=>(x.o||0)-(y.o||0));if(!L.length)return;let mudou=false;
 for(const g of L){const M=grModelo(art),f=grAchar(M.txt,g),G=S.grifos[g.id];
  if(!f){if(!G.perdido){G.perdido=1;mudou=true}continue}
  if(G.perdido){delete G.perdido;mudou=true}
  if(G.k!==k){G.k=k;mudou=true}
  grEnvolver(M,f[0],f[1],g)}
 if(mudou)salvar()}
function grTirarMarcas(art,id){if(!art)return;art.querySelectorAll(id?`mark.grifo[data-g="${id}"]`:"mark.grifo").forEach(m=>m.replaceWith(...m.childNodes));art.normalize()}
function grReaplicar(art,novo){grTirarMarcas(art);grAplicar(art);
 if(novo&&animOn()){const ms=art.querySelectorAll(`mark.grifo[data-g="${novo}"]`);ms.forEach((m,i)=>{m.style.setProperty("--i",Math.min(i,8));m.classList.add("gr-novo")});
  setTimeout(()=>ms.forEach(m=>{m.classList.remove("gr-novo");m.style.removeProperty("--i")}),1400)}}
const grArtDe=n=>{const el=n&&(n.nodeType===1?n:n.parentElement);return el&&el.closest?el.closest("#app article[data-grifo]"):null};

/* ---------- a barra do marca-texto ----------
   novo: há um trecho selecionado (cores para grifar); grifo: tocou num grifo (trocar a cor, copiar, apagar);
   aviso: o que acabou de acontecer, com Desfazer. Fica embaixo; se o trecho estiver lá embaixo, sobe para o alto. */
function grBarra(modo,o){grB=Object.assign({modo},o);let b=document.getElementById("gr-barra");const novo=!b||b.classList.contains("sai");
 if(!b){b=document.createElement("div");b.id="gr-barra";b.className="gr-barra";b.setAttribute("role","toolbar");b.setAttribute("aria-label","Marca-texto");document.body.appendChild(b)}
 b.classList.remove("sai");b.removeAttribute("aria-hidden");b.dataset.modo=modo;b.classList.toggle("em-cima",!!o.emCima);
 const cor=c=>{const at=modo==="grifo"&&o.c===c;
  return `<button type="button" class="gr-cor gr-${c}" data-gr="cor" data-c="${c}"${modo==="grifo"?` aria-pressed="${at}"`:""} aria-label="${modo==="grifo"?(at?`Cor do grifo: ${grNome(c)}`:`Trocar para ${grNome(c)}`):`Grifar em ${grNome(c)}`}"><i>${ic("ok")}</i></button>`};
 b.innerHTML=modo==="novo"?`<span class="gr-b-t">${ic("marcatexto")}<b>Grifar</b></span><span class="gr-cores">${GR_CORES.map(([c])=>cor(c)).join("")}</span><button type="button" class="gr-b" data-gr="fechar" aria-label="Cancelar">${ic("x")}</button>`
  :modo==="grifo"?`<span class="gr-cores">${GR_CORES.map(([c])=>cor(c)).join("")}</span><span class="gr-sep" aria-hidden="true"></span><button type="button" class="gr-b" data-gr="copiar" aria-label="Copiar o trecho grifado">${ic("copiar")}</button><button type="button" class="gr-b" data-gr="apagar" aria-label="Apagar o grifo">${ic("borracha")}</button><button type="button" class="gr-b" data-gr="fechar" aria-label="Fechar">${ic("x")}</button>`
  :`<span class="gr-b-msg${o.ico==="ok"||o.ico==="marcatexto"?" ok":""}">${ic(o.ico||"ok")}<span><b>${o.tit}</b>${o.sub?`<small>${o.sub}</small>`:""}</span></span>${o.desfazer?`<button type="button" class="gr-b gr-txt" data-gr="desfazer">Desfazer</button>`:""}${o.ver?`<button type="button" class="gr-b gr-txt" data-gr="ver">Ver todos</button>`:""}`;
 if(novo&&animOn()){b.classList.remove("entra");void b.offsetWidth;b.classList.add("entra")}
 clearTimeout(grTimer);if(modo==="aviso")grTimer=setTimeout(grFechar,o.dur||4500)}
function grFechar(){clearTimeout(grTimer);document.querySelectorAll("mark.gr-ativo").forEach(m=>m.classList.remove("gr-ativo"));grB=null;
 const b=document.getElementById("gr-barra");if(!b)return;
 if(animOn()){b.classList.remove("entra");b.classList.add("sai");b.setAttribute("aria-hidden","true");setTimeout(()=>{if(b.classList.contains("sai"))b.remove()},200)}else b.remove()}
/* tira a seleção que estiver no texto do tema (ao fechar a barra) */
function grLimpaSel(){try{const s=getSelection();if(s&&!s.isCollapsed&&grArtDe(s.anchorNode))s.removeAllRanges()}catch(e){}}
const grEmCima=rc=>rc&&rc.bottom>innerHeight-140&&rc.top>150;
function grAtivar(art,id,emCima){const G=S.grifos&&S.grifos[id];if(!G)return;
 document.querySelectorAll("mark.gr-ativo").forEach(m=>m.classList.remove("gr-ativo"));
 art.querySelectorAll(`mark.grifo[data-g="${id}"]`).forEach(m=>m.classList.add("gr-ativo"));
 grBarra("grifo",{art,id,c:G.c,emCima});try{som("toque")}catch(e){}}

/* a seleção mudou: decide se mostra a barra (só dentro do texto de um tema) */
function grOlhar(){const sel=window.getSelection&&getSelection();
 if(!sel||!sel.rangeCount||sel.isCollapsed){if(grB&&grB.modo==="novo"&&!grB.tocando)grFechar();return}
 const r=sel.getRangeAt(0),art=grArtDe(r.commonAncestorContainer);
 const sai=()=>{if(grB&&grB.modo==="novo")grFechar()};if(!art){sai();return}
 const M=grModelo(art),f=grFaixa(M,r);if(!f){sai();return}
 let rc=null;try{rc=r.getBoundingClientRect()}catch(e){}const emCima=grEmCima(rc);
 /* trecho dentro de um grifo que já existe: as opções desse grifo */
 const F=grFaixasDe(M),dentro=Object.keys(F).find(id=>F[id][0]<=f[0]&&F[id][1]>=f[1]);
 if(dentro&&S.grifos&&S.grifos[dentro]){if(!(grB&&grB.modo==="grifo"&&grB.id===dentro))grAtivar(art,dentro,emCima);return}
 if(grB&&grB.modo==="novo"&&document.getElementById("gr-barra")){Object.assign(grB,{art,s:f[0],e:f[1]});document.getElementById("gr-barra").classList.toggle("em-cima",emCima);return}
 grBarra("novo",{art,s:f[0],e:f[1],emCima})}

function grCriar(c){const o=grB;if(!o||!o.art||!o.art.isConnected){grFechar();return}
 const art=o.art,[d,ks]=art.dataset.grifo.split(":"),k=+ks;const M=grModelo(art);let s=o.s,e=o.e;
 if(e>M.txt.length||e<=s){grFechar();return}
 if(e-s>GR_MAX){grBarra("aviso",{tit:"Trecho grande demais",sub:"Grife até uns três parágrafos por vez.",ico:"exc"});return}
 S.grifos=S.grifos||{};
 /* pintar por cima de um grifo junta os dois num só, com a cor nova (como o marca-texto de verdade) */
 const F=grFaixasDe(M),tirados=[];
 Object.keys(F).forEach(id=>{const f=F[id];if(f[0]<=e&&f[1]>=s&&S.grifos[id]){s=Math.min(s,f[0]);e=Math.max(e,f[1]);tirados.push(Object.assign({id},S.grifos[id]));delete S.grifos[id]}});
 let tt="";try{tt=limpo(paginas(d).secs[k-1].tit)}catch(x){}
 const id="g"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),T=M.txt;
 S.grifos[id]={d,k,tt,t:T.slice(s,e),a:T.slice(Math.max(0,s-48),s),z:T.slice(e,e+48),o:s,c,em:Date.now()};
 const prim=!S.cfg.grDica;S.cfg.grDica=1;salvar();grMemo=null;
 try{getSelection().removeAllRanges()}catch(x){}
 grReaplicar(art,id);grDesf={tipo:"criou",id,tirados,art};
 const dica=document.querySelector(".gr-dica");if(dica)dica.remove();
 try{som("grifa")}catch(x){}
 anunciar(`Trecho grifado em ${grNome(c)}. Os grifos ficam em Favoritos e grifos.`);
 grBarra("aviso",{tit:"Trecho grifado",sub:"Fica guardado em Favoritos e grifos",ico:"marcatexto",desfazer:true,ver:true,dur:prim?7000:4500,emCima:o.emCima})}
function grCor(id,c){const G=S.grifos&&S.grifos[id];if(!G||G.c===c)return;G.c=c;salvar();
 document.querySelectorAll(`mark.grifo[data-g="${id}"]`).forEach(m=>{GR_CORES.forEach(([x])=>m.classList.remove("gr-"+x));m.classList.add("gr-"+c)});
 grBarra("grifo",Object.assign({},grB,{c}));anunciar(`Grifo em ${grNome(c)}`);try{som("toque")}catch(e){}}
function grApagar(id,art){const G=S.grifos&&S.grifos[id];if(!G)return;delete S.grifos[id];salvar();grMemo=null;
 grTirarMarcas(art,id);grDesf={tipo:"apagou",g:Object.assign({id},G),art};
 grBarra("aviso",{tit:"Grifo apagado",ico:"borracha",desfazer:true});anunciar("Grifo apagado");try{som("tira")}catch(e){}}
function grDesfazer(){const u=grDesf;grDesf=null;grFechar();if(!u)return;S.grifos=S.grifos||{};
 const volta=g=>{const r=Object.assign({},g);delete r.id;S.grifos[g.id]=r};
 if(u.tipo==="criou"){delete S.grifos[u.id];u.tirados.forEach(volta)}else if(u.tipo==="apagou")volta(u.g);
 salvar();grMemo=null;
 if(u.art&&u.art.isConnected)grReaplicar(u.art);else if(rota.tela==="favs"){rota.manterScroll=true;render()}
 anunciar("Desfeito");try{som("toque")}catch(e){}}
function grCopiarTexto(txt,feito){try{navigator.clipboard.writeText(txt).then(feito,()=>{})}catch(e){}}
function grCopiar(id){const G=S.grifos&&S.grifos[id];if(!G)return;const k=grPos(G);
 grCopiarTexto(`"${G.t.replace(/[ \t]+/g," ").trim()}"\n(${nomeCurto(infoDisc(G.d).nome)}, tema ${k}: ${grTitulo(G,k)}. Facul Lab)`,
  ()=>{grBarra("aviso",{tit:"Trecho copiado",sub:"Cole onde quiser: anotações, resumo, mensagem",ico:"copiar",dur:2600,emCima:grB&&grB.emCima});anunciar("Trecho copiado")})}

/* ---------- Favoritos e grifos: a lista ---------- */
function grQuando(ts){if(!ts)return "";const d=Math.round((inicioDia()-inicioDia(ts))/864e5);
 return d<=0?"grifado hoje":d===1?"grifado ontem":d<7?`grifado há ${d} dias`:"grifado em "+new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"short"}).format(new Date(ts)).replace(" de "," ").replace(".","")}
const grCurto=t=>{const x=String(t).replace(/\s+/g," ").trim();return x.length>420?x.slice(0,400).replace(/\s\S*$/,"")+"…":x};
function grTela(){const L=grLista();
 if(!L.length)return vazio("marcatexto","Nenhum trecho grifado ainda","Na apostila, selecione um trecho do texto (no celular, segure o dedo numa palavra e arraste até onde quiser) e toque na cor do marca-texto. Cada grifo aparece aqui, por matéria e tema, para revisar antes da prova.",`<button class="botao cheio" data-acao="ir-raiz" data-tela="faculdade">Abrir as apostilas</button>`,"var(--toga-txt)");
 const falt=[...new Set(L.map(g=>periodoDe(g.d)))].filter(i=>i>=0&&!apOk(i));if(falt.length)Promise.all(falt.map(carregarApP)).then(()=>reRenderSe("favs"));
 const usadas=GR_CORES.filter(([c])=>L.some(g=>g.c===c)),f=usadas.some(([c])=>c===rota.grc)?rota.grc:"";
 const V=f?L.filter(g=>g.c===f):L;
 const filtro=usadas.length>1?`<div class="gr-filtro" role="group" aria-label="Mostrar os grifos de uma cor"><button type="button" data-gr="filtro" data-c="" aria-pressed="${!f}">Todas as cores<span>${L.length}</span></button>${usadas.map(([c,n])=>`<button type="button" data-gr="filtro" data-c="${c}" aria-pressed="${f===c}"><i class="gr-bola gr-${c}" aria-hidden="true"></i>${n.charAt(0).toUpperCase()+n.slice(1)}<span>${L.filter(g=>g.c===c).length}</span></button>`).join("")}</div>`:"";
 const porD={};V.forEach(g=>{g.kk=grPos(g);(porD[g.d]=porD[g.d]||[]).push(g)});
 const ordem=d=>{const i=periodoDe(d);return i*100+PERIODOS[i].indexOf(d)};
 return `<p class="gr-topo-dica">${ic("marcatexto")}<span>Toque num grifo para abrir o tema bem no trecho. Para grifar mais, selecione um trecho na apostila.</span></p>${filtro}`+
 Object.keys(porD).sort((a,b)=>ordem(a)-ordem(b)).map(d=>{const fi=infoDisc(d),gs=porD[d].sort((a,b)=>a.kk-b.kk||(a.o||0)-(b.o||0)),nome=nomeCurto(fi.nome);
  const temas=[];gs.forEach(g=>{let t=temas[temas.length-1];if(!t||t.k!==g.kk){t={k:g.kk,tit:grTitulo(g,g.kk),gs:[]};temas.push(t)}t.gs.push(g)});
  return `<section class="gr-mat" aria-label="${esc(nome)}"><div class="gr-mat-cab">${tile(fi.cor,fi.ic)}<span class="gr-mat-t"><b>${esc(nome)}</b><small>${periodoDe(d)+1}º período · ${gs.length} grifo${gs.length>1?"s":""}</small></span><button type="button" class="gr-b gr-copiar-mat" data-gr="copiar-mat" data-d="${d}" aria-label="Copiar os grifos de ${esc(nome)}${f?` em ${grNome(f)}`:""}">${ic("copiar")}</button></div>
  ${temas.map(t=>`<h3 class="gr-tema"><small>Tema ${t.k}</small>${esc(t.tit)}</h3><ul class="gr-lista">${t.gs.map(g=>`<li class="gr-item${g.perdido?" perdido":""}" data-id="${g.id}"><button type="button" class="gr-abrir" data-gr="ir" data-id="${g.id}"><span class="gr-q-caixa"><mark class="gr-q gr-${g.c}">${esc(grCurto(g.t))}</mark></span><small>${grQuando(g.em)}${g.perdido?" · a apostila foi atualizada e este trecho não está mais lá":""}</small></button><button type="button" class="gr-b gr-apagar" data-gr="apagar-l" data-id="${g.id}" aria-label="Apagar este grifo">${ic("borracha")}</button></li>`).join("")}</ul>`).join("")}</section>`}).join("")}
function grCopiarMat(d,b){const f=rota.grc||"";const gs=grLista().filter(g=>g.d===d&&(!f||g.c===f)).map(g=>Object.assign(g,{kk:grPos(g)})).sort((a,b)=>a.kk-b.kk||(a.o||0)-(b.o||0));if(!gs.length)return;
 let txt=`Meus grifos · ${nomeCurto(infoDisc(d).nome)} (Facul Lab)`,k=-1;
 gs.forEach(g=>{if(g.kk!==k){k=g.kk;txt+=`\n\nTema ${k} · ${grTitulo(g,k)}`}txt+=`\n• ${g.t.replace(/\s+/g," ").trim()}`});
 grCopiarTexto(txt,()=>{b.classList.add("feito");b.innerHTML=ic("ok");anunciar(`${gs.length} grifo${gs.length>1?"s":""} copiado${gs.length>1?"s":""}`);
  setTimeout(()=>{if(b.isConnected){b.classList.remove("feito");b.innerHTML=ic("copiar")}},1600)})}
function grApagarLista(id,b){const G=S.grifos&&S.grifos[id];if(!G)return;
 const fim=()=>{delete S.grifos[id];salvar();grMemo=null;grDesf={tipo:"apagou",g:Object.assign({id},G)};rota.manterScroll=true;render();
  grBarra("aviso",{tit:"Grifo apagado",ico:"borracha",desfazer:true});anunciar("Grifo apagado");try{som("tira")}catch(e){}};
 const li=b&&b.closest(".gr-item");if(li&&animOn()){li.classList.add("saindo");setTimeout(fim,200)}else fim()}

/* dica para quem ainda não grifou nada: aparece antes do texto do tema até o primeiro grifo (ou até dispensar) */
const GR_DICA_SVG=`<svg class="gr-dica-ilu" viewBox="0 0 96 64" aria-hidden="true" focusable="false"><rect x="4" y="4" width="88" height="56" rx="10" class="gd-fundo"/><rect x="14" y="14" width="60" height="5" rx="2.5" class="gd-l"/><rect class="gd-tinta" x="11" y="26" width="66" height="12" rx="3"/><rect x="14" y="29.5" width="56" height="5" rx="2.5" class="gd-l"/><rect x="14" y="45" width="44" height="5" rx="2.5" class="gd-l"/><g class="gd-caneta"><g transform="translate(12 37) rotate(-48)"><path d="M0 0l5-4h4v8H5z" class="gd-ponta"/><rect x="9" y="-5" width="24" height="10" rx="2.5" class="gd-corpo"/><rect x="27" y="-5" width="8" height="10" rx="2.5" class="gd-tampa"/></g></g></svg>`;
function grDica(art){if(!art||(S.cfg&&S.cfg.grDica)||grLista().length||document.querySelector(".gr-dica"))return;
 const el=document.createElement("aside");el.className="gr-dica";el.setAttribute("aria-label","Dica: marca-texto");
 el.innerHTML=`${GR_DICA_SVG}<div class="gr-dica-t"><b>Novo: marca-texto</b><p>Selecione um trecho do texto (no celular, segure o dedo numa palavra e arraste) e escolha a cor. Seus grifos ficam guardados em <b>Favoritos e grifos</b>.</p></div><button type="button" class="gr-dica-x" data-gr="dica-ok" aria-label="Entendi, fechar a dica">${ic("x")}</button>`;
 const antes=art.previousElementSibling&&art.previousElementSibling.matches(".ouvir")?art.previousElementSibling:art;antes.parentNode.insertBefore(el,antes)}

/* ---------- depois de cada tela: pinta os grifos, mostra a dica e, vindo da lista, rola até o grifo ---------- */
function grDepois(){if(rota.tela!=="ler")return;const arts=[...document.querySelectorAll("#app article[data-grifo]")];if(!arts.length)return;
 if(S.grifos&&Object.keys(S.grifos).length)arts.forEach(grAplicar);
 grDica(arts[0]);
 if(rota.gr){const id=rota.gr;delete rota.gr;try{guardarTela()}catch(e){}
  const m=document.querySelector(`#app mark.grifo[data-g="${id}"]`);if(!m)return;const det=m.closest("details");if(det)det.open=true;
  setTimeout(()=>{try{m.scrollIntoView({block:"center"})}catch(e){}const ms=document.querySelectorAll(`#app mark.grifo[data-g="${id}"]`);ms.forEach(x=>x.classList.add("gr-pisca"));
   setTimeout(()=>ms.forEach(x=>x.classList.remove("gr-pisca")),2600)},90)}}
{const r0=render;render=function(){grMemo=null;if(grB)grFechar();const x=r0.apply(this,arguments);try{grDepois()}catch(e){}return x}}
/* voltar do celular fecha as opções do grifo antes de sair da tela */
{const p0=podeVoltar;podeVoltar=function(){return !!(grB&&grB.modo==="grifo")||p0()}}
{const v0=voltarSistema;voltarSistema=function(){if(grB&&grB.modo==="grifo"){grFechar();return}return v0()}}
/* backup: os grifos contam junto com favoritos e anotações (juntar dois aparelhos soma os grifos dos dois) */
{const b0=bkResumo;bkResumo=function(o){const r=b0(o);r.fav+=Object.keys((o&&o.grifos)||{}).length;return r}}
{const it=BK_ITENS.find(x=>x[0]==="fav");if(it)it[1]="Favoritos, grifos e anotações"}
/* impressão: a apostila sai com os grifos */
addEventListener("beforeprint",()=>{try{document.querySelectorAll("#impressao article[data-grifo]").forEach(a=>{grTirarMarcas(a);grAplicar(a)})}catch(e){}});

/* ---------- eventos ---------- */
document.addEventListener("selectionchange",()=>{clearTimeout(grT);grT=setTimeout(grOlhar,140)});
document.addEventListener("pointerdown",e=>{const t=e.target;if(!t.closest)return;
 if(t.closest("#gr-barra")){if(grB)grB.tocando=true;return}
 if(t.closest(".art-link")){if(grB)grFechar();return}
 if(grB&&grB.modo==="grifo"&&!t.closest("mark.grifo"))grFechar()},true);
document.addEventListener("pointerup",()=>setTimeout(()=>{if(grB)grB.tocando=false},450),true);
/* no computador, clicar na barra não desfaz a seleção */
document.addEventListener("mousedown",e=>{if(e.target.closest&&e.target.closest("#gr-barra"))e.preventDefault()},true);
document.addEventListener("keydown",e=>{if(e.key!=="Escape"||!grB)return;grLimpaSel();grFechar()});
function grClique(b){const a=b.dataset.gr;
 if(a==="cor"){if(!grB)return;if(grB.modo==="novo")grCriar(b.dataset.c);else if(grB.modo==="grifo")grCor(grB.id,b.dataset.c);return}
 if(a==="fechar"){grLimpaSel();grFechar();return}
 if(a==="copiar"){if(grB&&grB.id)grCopiar(grB.id);return}
 if(a==="apagar"){if(grB&&grB.id)grApagar(grB.id,grB.art);return}
 if(a==="desfazer"){grDesfazer();return}
 if(a==="ver"){grFechar();ir({tela:"favs",aba:"grifos"});return}
 if(a==="dica-ok"){S.cfg.grDica=1;salvar();const d=b.closest(".gr-dica");if(d){if(animOn()){d.classList.add("saindo");setTimeout(()=>d.remove(),220)}else d.remove()}anunciar("Dica fechada");return}
 if(a==="aba"){rota.aba=b.dataset.v;render();return}
 if(a==="filtro"){rota.grc=b.dataset.c||"";rota.manterScroll=true;render();return}
 if(a==="ir"){const G=S.grifos&&S.grifos[b.dataset.id];if(!G)return;ir({tela:"ler",d:G.d,pg:grPos(G),pagina:true,gr:b.dataset.id});return}
 if(a==="apagar-l"){grApagarLista(b.dataset.id,b);return}
 if(a==="copiar-mat"){grCopiarMat(b.dataset.d,b);return}}
/* no celular, a barra age ao soltar o dedo (o toque que desfaz a seleção às vezes não vira clique) e o clique
   que viria depois é cancelado, para não cair no que estiver embaixo quando a barra muda ou some */
let grToque=null;
document.addEventListener("touchstart",e=>{const b=e.target.closest&&e.target.closest("#gr-barra [data-gr]");grToque=b&&e.touches.length===1?{b,x:e.touches[0].clientX,y:e.touches[0].clientY}:null},{capture:true,passive:true});
document.addEventListener("touchend",e=>{const t=grToque;grToque=null;if(!t||!t.b.isConnected)return;const c=e.changedTouches[0];if(!c||Math.hypot(c.clientX-t.x,c.clientY-t.y)>12)return;
 e.preventDefault();grClique(t.b)},{capture:true,passive:false});
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;
 const b=t.closest("[data-gr]");
 if(b){e.preventDefault();grClique(b);return}
 const m=t.closest("#app mark.grifo");if(!m)return;const sel=window.getSelection&&getSelection();if(sel&&!sel.isCollapsed)return;
 const art=grArtDe(m);if(!art)return;let rc=null;try{rc=m.getBoundingClientRect()}catch(x){}grAtivar(art,m.dataset.g,grEmCima(rc))});
