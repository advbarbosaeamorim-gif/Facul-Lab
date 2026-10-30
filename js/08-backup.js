"use strict";
/* ---------- backup do progresso em arquivo ----------
   O progresso (S) mora só neste aparelho. Aqui ele vira um arquivo .json para guardar, enviar e restaurar em outro aparelho,
   sem nuvem e sem conta. Restaurar pode juntar (fica o mais completo de cada parte) ou substituir; antes, o estado atual
   fica guardado em localStorage (faculLab.bkAntes) para o botão Desfazer. S.bk = {ult: data do último backup, n: quantos}.
   Segredo: cinco toques no lacre do arquivo abrem a "Cópia autenticada". */
P.baixar='<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>';
P.subir='<path d="M12 15V4M7 9l5-5 5 5M5 20h14"/>';
P.enviar='<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>';
P.arquivo='<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>';
P.juntar='<path d="M6 4v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4M12 15v5M9 17l3 3 3-3"/>';
P.cadeado='<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>';
P.celular='<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>';
const BK_ANTES="faculLab.bkAntes",BK_FMT="facul-lab-backup";
let bk={passo:0,arq:null,modo:"juntar",feito:false,salvo:null,erro:"",auto:null,mexeu:false};
const BK_PASSOS=[
 ["Salvar","No celular de agora, toque em <b>Salvar backup</b>. O app cria um arquivo com todo o seu progresso, lacrado e pronto para viajar."],
 ["Enviar","Mande o arquivo para você mesmo: WhatsApp, e-mail ou Google Drive. Ele é pequeno e fica guardado como qualquer documento."],
 ["Restaurar","No celular novo, abra o Facul Lab, entre em <b>Backup do progresso</b> e toque em <b>Restaurar de um arquivo</b>. Tudo volta como estava."]];
function bkResumo(o){o=o||{};const n=x=>Object.keys(x||{}).length;
 return {q:n(o.stats),sim:(o.hist||[]).length,dias:Object.keys(o.dias||{}).filter(k=>temAtiv(o.dias[k])).length,cards:n(o.cards),lidos:n(o.lidos),
  fav:n(o.fav)+Object.keys(o.notas||{}).filter(k=>o.notas[k]).length,ovos:n(o.ovos),ult:o.atualizado||0}}
const BK_ITENS=[["q","Questões respondidas","ok","var(--nv1)"],["sim","Simulados e listas","recibo","var(--nv2)"],["dias","Dias de estudo","chama","var(--nv4)"],
 ["cards","Cartões em revisão","cartas","var(--nv6)"],["lidos","Temas lidos","livro","var(--nv7)"],["fav","Favoritos e anotações","marcador","var(--nv3)"],["ovos","Segredos achados","estrela","var(--nv5)"]];
const bkNum=v=>Number(v||0).toLocaleString("pt-BR");
function bkQuando(ts){if(!ts)return "";return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ts)).replace(/\s?de\s?/g," ")}
function bkIdade(){const u=S.bk&&S.bk.ult;if(!u)return {cls:"nunca",txt:"Você ainda não fez nenhum backup."};
 const d=Math.round((inicioDia()-inicioDia(u))/864e5);const q=d<=0?"hoje":d===1?"ontem":`há ${d} dias`;
 return {cls:d>7?"velho":"ok",d,q,txt:d>7?`Seu último backup foi <b>${q}</b>. Que tal salvar um novo?`:`Último backup: <b>${q}</b>. Seu progresso está guardado.`}}
function bkNome(){const d=new Date();return `facul-lab-backup-${hojeStr()}-${p2(d.getHours())}h${p2(d.getMinutes())}.json`}
function bkTexto(){return JSON.stringify({formato:BK_FMT,versao:1,app:"Facul Lab",criado:Date.now(),resumo:bkResumo(S),dados:S})}
function bkMarca(){S.bk={ult:Date.now(),n:((S.bk&&S.bk.n)||0)+1};salvar()}
const bkPodeEnviar=()=>{try{return !!(navigator.canShare&&navigator.share&&["application/json","text/plain"].some(t=>navigator.canShare({files:[new File(["{}"],"a.json",{type:t})]})))}catch(e){return false}};

/* card de Configurações */
function bkCta(){const a=bkIdade();
 return `<button class="tour-cta bk-cta" data-bk="ir">${ilustra("carimbo","var(--lacre)")}<span><b>Backup do progresso</b><small>Salve tudo num arquivo e leve para outro celular, sem precisar de conta.</small><span class="bk-cta-st ${a.cls==="ok"?"":"velho"}">${a.cls==="nunca"?"Nenhum backup ainda":"Último backup "+a.q}</span></span>${ic("prox")}</button>`}

const BK_SVG=`<svg class="bk-svg" viewBox="0 0 320 150" aria-hidden="true" focusable="false">
 <path class="bk-trilha" d="M70 70Q160-26 250 70"/>
 <g><rect class="bk-cel" x="22" y="24" width="66" height="112" rx="12"/><rect class="bk-tela" x="29" y="36" width="52" height="86" rx="5"/><rect class="bk-cel-n" x="47" y="28" width="16" height="3" rx="1.5"/><text class="bk-rot" x="55" y="149">agora</text>
  <g class="bk-ok bk-ok-velho"><circle cx="82" cy="30" r="9"/><path d="M78 30l3 3 5-6"/></g></g>
 <g><rect class="bk-cel" x="232" y="24" width="66" height="112" rx="12"/><rect class="bk-tela" x="239" y="36" width="52" height="86" rx="5"/><rect class="bk-cel-n" x="257" y="28" width="16" height="3" rx="1.5"/><text class="bk-rot" x="265" y="149">celular novo</text>
  <circle class="bk-brilho" cx="265" cy="80" r="30" opacity="0"/>
  <g class="bk-ok bk-ok-novo"><circle cx="292" cy="30" r="9"/><path d="M288 30l3 3 5-6"/></g></g>
 <g class="bk-envelope"><path d="M146 6h28v18h-28zM146 6l14 10 14-10"/><path d="M128 14h10M124 22h12" opacity=".6"/></g>
 <g class="bk-doc"><g transform="translate(-20 -27)">
  <path class="bk-folha" d="M0 4a4 4 0 0 1 4-4h24l12 12v38a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4z"/><path class="bk-dobra" d="M28 0v8a4 4 0 0 0 4 4h8"/>
  <path class="bk-linha" d="M8 18h18M8 26h24M8 34h14"/>
  <g class="bk-lacre" data-bk="lacre"><circle cx="32" cy="45" r="16" fill="transparent"/><g class="bk-lacre-g"><circle class="bk-cera" cx="32" cy="45" r="9"/><path class="bk-bal" d="M32 39v10M27 41h10M27 41l-2 4h4zM37 41l-2 4h4zM29 49h6"/></g></g>
 </g></g></svg>`;

function telaBackup(){const r=bkResumo(S),a=bkIdade(),ps=bk.passo;
 const pv=bk.arq?bkPrevia():"";
 return topo("Backup do progresso","Leve seu estudo para qualquer aparelho",{})+
 `<main class="wrap bk">
 <section class="bk-hero p${ps}${S.bk&&S.bk.ult?" salvo":""}" aria-label="Como trocar de celular sem perder nada">
  <div class="bk-palco">${BK_SVG}</div>
  <div class="bk-passos" role="tablist" aria-label="Passo a passo">${BK_PASSOS.map(([n],i)=>`<button role="tab" data-bk="passo" data-v="${i}" aria-selected="${i===ps}"><span>${i+1}</span>${n}</button>`).join("")}</div>
  <p class="bk-leg" aria-live="polite">${BK_PASSOS[ps][1]}</p>
 </section>
 ${bk.erro?`<div class="bk-erro" role="alert">${ic("exc")}<span>${bk.erro}</span></div>`:""}
 ${bk.feito?bkFeitoHtml():pv}
 <div class="bk-status ${a.cls}">${ic(a.cls==="ok"?"ok":"relogio")}<span>${a.txt}</span></div>
 <div class="secao" role="heading" aria-level="2">O que vai no arquivo</div>
 <div class="bk-itens">${BK_ITENS.map(([k,n,i,c],j)=>`<div class="bk-item" style="--i:${j}">${tile(c,i)}<span><b>${bkNum(r[k])}</b><small>${n}</small></span></div>`).join("")}<div class="bk-item" style="--i:${BK_ITENS.length}">${tile("var(--muted)","eng")}<span><b>${estiloAtual()==="premium"?"Premium":"Clássico"}</b><small>Tema, metas, provas e ajustes</small></span></div></div>
 <div class="bk-acoes">
  <button class="bk-acao cheia" data-bk="salvar"><span class="bk-ai">${ic("baixar")}</span><span><b>Salvar backup</b><small>Baixa um arquivo com todo o seu progresso</small></span>${ic("prox")}</button>
  ${bkPodeEnviar()?`<button class="bk-acao" data-bk="enviar"><span class="bk-ai">${ic("enviar")}</span><span><b>Enviar para…</b><small>Mande o backup direto pelo WhatsApp, e-mail ou Drive</small></span>${ic("prox")}</button>`:""}
  <button class="bk-acao" data-bk="abrir"><span class="bk-ai">${ic("subir")}</span><span><b>Restaurar de um arquivo</b><small>Escolha um backup salvo antes${matchMedia("(pointer:fine)").matches?" ou arraste o arquivo para esta tela":""}</small></span>${ic("prox")}</button>
 </div>
 ${bk.salvo?`<div class="bk-recibo">${ic("arquivo")}<div><b>${esc(bk.salvo.nome)}</b><p>${bk.salvo.env?"Backup enviado.":`Arquivo salvo (${bk.salvo.kb} KB), normalmente na pasta <b>Downloads</b>.`} Guarde num lugar seguro: mande para você mesmo no WhatsApp ou no e-mail, ou deixe no Drive.</p></div></div>`:""}
 <div class="secao" role="heading" aria-level="2">Bom saber</div>
 <ul class="bk-dicas">
  <li>${ic("cadeado")}<span><b>Nada vai para a internet.</b> O arquivo é criado aqui mesmo, no seu aparelho, e só vai para onde você mandar.</span></li>
  <li>${ic("calendario")}<span><b>Faça um backup por semana</b> e sempre antes de trocar de celular, formatar ou limpar os dados do navegador.</span></li>
  <li>${ic("juntar")}<span><b>Estudou em dois aparelhos?</b> Na hora de restaurar, escolha <b>Juntar</b>: o app soma os dois e fica com o mais completo de cada parte.</span></li>
  <li>${ic("sino")}<span><b>Lembretes</b> ficam presos ao aparelho. No celular novo, ligue de novo em Configurações.</span></li>
 </ul>
 <input type="file" id="bk-arq" accept=".json,application/json,text/plain" hidden>
 <div class="bk-solta" aria-hidden="true"><div>${ic("subir")}Solte o arquivo de backup aqui</div></div>
 </main>`}

function bkPrevia(){const A=bkResumo(S),B=bk.arq.resumo,menos=B.q+B.sim+B.dias<A.q+A.sim+A.dias;
 const lin=(n,k)=>`<tr><td>${n}</td><td class="${A[k]>B[k]?"mais":""}">${bkNum(A[k])}</td><td class="${B[k]>A[k]?"mais":""}">${bkNum(B[k])}</td></tr>`;
 return `<section class="bk-previa" aria-label="Conferir o backup antes de restaurar">
  <div class="bk-pv-topo"><span class="bk-ai">${ic("arquivo")}</span><div><h2>Conferir antes de restaurar</h2><small>${esc(bk.arq.nome)}${bk.arq.criado?` · backup de ${esc(bkQuando(bk.arq.criado))}`:""}</small></div></div>
  <table class="bk-cmp"><thead><tr><th></th><th>Neste aparelho</th><th>No arquivo</th></tr></thead><tbody>
   ${lin("Questões respondidas","q")}${lin("Simulados e listas","sim")}${lin("Dias de estudo","dias")}${lin("Cartões em revisão","cards")}${lin("Temas lidos","lidos")}${lin("Segredos achados","ovos")}
  </tbody></table>
  <p class="nota">Como você quer restaurar?</p>
  <div class="bk-modos">
   <button data-bk="modo" data-v="juntar" aria-pressed="${bk.modo==="juntar"}">${ic("juntar")}<span><b>Juntar os dois<em>recomendado</em></b><small>Soma o que está aqui com o que está no arquivo. Nada se perde: fica o mais completo de cada parte.</small></span></button>
   <button data-bk="modo" data-v="trocar" aria-pressed="${bk.modo==="trocar"}">${ic("refazer")}<span><b>Substituir tudo</b><small>Este aparelho fica igualzinho ao arquivo. O progresso que existe aqui hoje é trocado.</small></span></button>
  </div>
  ${bk.modo==="trocar"&&menos?`<p class="bk-alerta"><b>Atenção:</b> o arquivo tem menos progresso do que este aparelho. Se substituir, o que só existe aqui some (mas dá para desfazer logo depois).</p>`:""}
  <div class="botoes"><button class="botao linha" data-bk="cancelar">Cancelar</button><button class="botao cheio" data-bk="restaurar">Restaurar agora</button></div>
 </section>`}

function bkFeitoHtml(){const r=bkResumo(S);let pode=false;try{pode=!!localStorage.getItem(BK_ANTES)}catch(e){}
 return `<section class="bk-feito" role="status"><div class="bk-selo">${ic("ok")}</div><h2>Progresso restaurado!</h2>
  <p>Agora são ${bkNum(r.q)} questões respondidas, ${bkNum(r.dias)} dias de estudo e ${bkNum(r.cards)} cartões em revisão neste aparelho. Bons estudos!</p>
  <div class="botoes">${pode?`<button class="botao linha" data-bk="desfazer">Desfazer</button>`:""}<button class="botao cheio" data-acao="ir-raiz" data-tela="hoje">Ver o plano de hoje</button></div></section>`}

/* juntar: para cada parte, fica o registro mais completo dos dois lados; partes desconhecidas (de versões novas do app) também passam */
function bkJuntar(a,b){const r=JSON.parse(JSON.stringify(a)),o=x=>x&&typeof x=="object"&&!Array.isArray(x);
 const ra=bkResumo(a),vazio=!ra.q&&!ra.sim&&!ra.dias&&!ra.cards;
 const cada=(k,esc)=>{const A=r[k]=o(r[k])?r[k]:{},B=o(b[k])?b[k]:{};Object.keys(B).forEach(id=>{A[id]=id in A?esc(A[id],B[id],id):B[id]})};
 /* num aparelho ainda sem estudo, as escolhas do arquivo (tema, período, provas) valem; senão, valem as daqui e o arquivo completa */
 r.cfg=vazio?Object.assign({},a.cfg,b.cfg):Object.assign({},b.cfg,a.cfg);if(a.cfg&&a.cfg.notif)r.cfg.notif=a.cfg.notif;else delete r.cfg.notif;
 const vistos=new Set((r.hist||[]).map(x=>x.id||x.key+":"+x.inicio));r.hist=(r.hist||[]).concat((b.hist||[]).filter(x=>!vistos.has(x.id||x.key+":"+x.inicio))).sort((x,y)=>(y.inicio||0)-(x.inicio||0));
 const ganhaS={};cada("stats",(x,y,id)=>{const g=(y.n||0)>(x.n||0)||((y.n||0)===(x.n||0)&&(y.t||0)>(x.t||0));ganhaS[id]=g;return g?y:x});
 {const A=r.qrev=o(r.qrev)?r.qrev:{},B=o(b.qrev)?b.qrev:{};Object.keys(B).forEach(id=>{if(!(id in A)||ganhaS[id])A[id]=B[id]});Object.keys(ganhaS).forEach(id=>{if(ganhaS[id]&&!(id in B))delete A[id]})}
 cada("dias",(x,y)=>{const z=Object.assign({},x);Object.keys(y).forEach(f=>{z[f]=typeof y[f]=="number"?Math.max(z[f]||0,y[f]):(z[f]??y[f])});return z});
 cada("cards",(x,y)=>((y.n||0)>(x.n||0)||((y.n||0)===(x.n||0)&&(y.t||0)>(x.t||0)))?y:x);
 cada("lidos",(x,y)=>Math.min(x||y,y||x));cada("revAp",(x,y)=>(y.n||0)>(x.n||0)?y:x);cada("apPg",(x,y)=>Math.max(x||0,y||0));cada("apT",(x,y)=>String(y)>String(x)?y:x);
 cada("ls",(x,y)=>((y.a||0)+(y.e||0))>((x.a||0)+(x.e||0))?y:x);cada("rep",(x,y)=>(y.d||0)>(x.d||0)?y:x);
 cada("fav",(x,y)=>x||y);cada("notas",(x,y)=>x||y);cada("ovos",(x,y)=>String(x)<String(y)?x:y);cada("sacode",(x,y)=>String(x)>String(y)?x:y);
 Object.keys(b).forEach(k=>{if(!(k in r))r[k]=b[k];else if(o(r[k])&&o(b[k])&&!["cfg","planoPv","bk"].includes(k))r[k]=Object.assign({},b[k],r[k])});
 r.v=2;return r}

function bkLer(txt,nome){bk.erro="";bk.feito=false;let j=null;try{j=JSON.parse(txt)}catch(e){}
 const dados=j&&j.formato===BK_FMT&&j.dados?j.dados:j&&(j.v===2||j.v===1)?j:null;const c=dados&&typeof dados=="object"?carregar(JSON.parse(JSON.stringify(dados))):null;
 if(!c){bk.arq=null;bk.erro=`Este arquivo não é um backup do Facul Lab${nome?` (<b>${esc(nome)}</b>)`:""}. Procure um arquivo que comece com <b>facul-lab-backup</b> e termine em <b>.json</b>.`;som("erro");rota.manterScroll=true;render();return}
 bk.arq={nome:nome||"backup.json",criado:(j&&j.criado)||c.atualizado||0,dados:c,resumo:bkResumo(c)};bk.modo="juntar";bkPara();bk.passo=2;
 som("abre");rota.manterScroll=true;render();setTimeout(()=>{const p=document.querySelector(".bk-previa");if(p)p.scrollIntoView({behavior:animOn()?"smooth":"auto",block:"start"})},60)}
function bkArquivo(f){if(!f)return;if(f.size>25e6){bk.erro="Esse arquivo é grande demais para ser um backup do Facul Lab.";som("erro");rota.manterScroll=true;render();return}
 const fr=new FileReader();fr.onload=()=>bkLer(String(fr.result||""),f.name);fr.onerror=()=>{bk.erro="Não consegui abrir esse arquivo. Tente de novo.";rota.manterScroll=true;render()};fr.readAsText(f)}

function bkRestaurar(){if(!bk.arq)return;try{localStorage.setItem(BK_ANTES,JSON.stringify(S))}catch(e){}
 const notif=S.cfg&&S.cfg.notif;let n=bk.modo==="trocar"?carregar(JSON.parse(JSON.stringify(bk.arq.dados))):bkJuntar(S,bk.arq.dados);
 n.cfg=n.cfg||{};if(notif)n.cfg.notif=notif;else delete n.cfg.notif;n.cfg.tour=true;
 n.bk={ult:Math.max((S.bk&&S.bk.ult)||0,(n.bk&&n.bk.ult)||0,bk.arq.criado||0),n:Math.max((S.bk&&S.bk.n)||0,(n.bk&&n.bk.n)||0)};
 S=n;salvar();bk.arq=null;bk.feito=true;bk.passo=2;if(perAtual()!==null)periodo=Math.min(9,perAtual());
 render();window.scrollTo(0,0);anunciar("Progresso restaurado");setTimeout(()=>{som("aprovado");estouro(document.querySelector(".bk-feito .bk-selo"),["#3bb273","#ffc53d","#ffffff"]);bkBrilho()},250)}
function bkDesfazer(){let t=null;try{t=localStorage.getItem(BK_ANTES)}catch(e){}const c=t&&carregar(JSON.parse(t));if(!c)return;
 S=c;salvar();try{localStorage.removeItem(BK_ANTES)}catch(e){}bk.feito=false;bk.passo=0;if(perAtual()!==null)periodo=Math.min(9,perAtual());rota.manterScroll=true;render();anunciar("Restauração desfeita");som("tira")}

function bkBaixar(){bkMarca();const txt=bkTexto(),nome=bkNome(),blob=new Blob([txt],{type:"application/json"});
 try{const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=nome;a.rel="noopener";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},4000)}catch(e){}
bk.salvo={nome,kb:Math.max(1,Math.round(blob.size/1024))};bkDepoisDeSalvar()}
async function bkEnviar(){bkMarca();const txt=bkTexto(),nome=bkNome();
 for(const t of ["application/json","text/plain"]){const f=new File([txt],nome,{type:t});
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:"Backup do Facul Lab",text:"Meu backup do Facul Lab. Para restaurar: Facul Lab > Backup do progresso > Restaurar de um arquivo."});bk.salvo={nome,env:true};bkDepoisDeSalvar()}catch(e){if(e&&e.name!=="AbortError")bkBaixar()}return}}
 bkBaixar()}
function bkDepoisDeSalvar(){bkPara();bk.passo=0;bk.erro="";rota.manterScroll=true;render();
 const h=document.querySelector(".bk-hero"),l=h&&h.querySelector(".bk-lacre");if(l){l.classList.remove("carimba");void l.getBoundingClientRect();l.classList.add("carimba")}
 som("vira");setTimeout(()=>som("carimbo"),260);setTimeout(()=>{if(rota.tela==="backup"&&!bk.mexeu){bkPasso(1);setTimeout(()=>{if(rota.tela==="backup"&&!bk.mexeu)bkPasso(2)},1500)}},900);
 setTimeout(()=>{const r=document.querySelector(".bk-recibo");if(r)r.scrollIntoView({behavior:animOn()?"smooth":"auto",block:"nearest"})},80)}
function bkBrilho(){const h=document.querySelector(".bk-hero");if(!h)return;h.classList.remove("p0","p1","p2");void h.getBoundingClientRect();h.classList.add("p2")}

/* passo a passo do palco: troca sem redesenhar a tela; sozinho na primeira visita, até a pessoa tocar */
function bkPasso(i){bk.passo=i;const h=document.querySelector(".bk-hero");if(!h)return;h.classList.remove("p0","p1","p2");h.classList.add("p"+i);
 h.querySelectorAll('[data-bk="passo"]').forEach(b=>b.setAttribute("aria-selected",String(+b.dataset.v===i)));
 const l=h.querySelector(".bk-leg");if(l){l.innerHTML=BK_PASSOS[i][1];ovoReanima(l,"troca")}}
function bkPara(){clearInterval(bk.auto);bk.auto=null}
function bkAuto(){bkPara();if(!animOn()||bk.mexeu||bk.arq||bk.feito)return;bk.auto=setInterval(()=>{if(rota.tela!=="backup"||!document.querySelector(".bk-hero")){bkPara();return}bkPasso((bk.passo+1)%3)},3200)}
let bkTelaAntes="";
try{new MutationObserver(()=>{const t=rota.tela;if(t==="backup"&&bkTelaAntes!=="backup"){bk.erro="";bk.salvo=null;bk.feito=false;bk.arq=null;bk.passo=0;bk.mexeu=false;bkAuto()}else if(t!=="backup")bkPara();bkTelaAntes=t}).observe($("#app"),{childList:true})}catch(e){}

document.addEventListener("click",e=>{const b=e.target&&e.target.closest&&e.target.closest("[data-bk]");if(!b)return;const a=b.dataset.bk;
 if(a==="passo"){bk.mexeu=true;bkPara();bkPasso(+b.dataset.v);som("toque")}
 else if(a==="ir")ir({tela:"backup"});
 else if(a==="salvar"){bk.mexeu=true;bkBaixar()}
 else if(a==="enviar"){bk.mexeu=true;bkEnviar()}
 else if(a==="abrir"){bk.mexeu=true;const i=document.getElementById("bk-arq");if(i){i.value="";i.click()}}
 else if(a==="modo"){bk.modo=b.dataset.v;rota.manterScroll=true;render();som("toque")}
 else if(a==="cancelar"){bk.arq=null;bk.passo=0;rota.manterScroll=true;render()}
 else if(a==="restaurar")bkRestaurar();
 else if(a==="desfazer")bkDesfazer();
 else if(a==="lacre"){ovoReanima(b,"toque");if(ovoConta("lacre",5,2500))ovoCopia();else som("toque")}
 else if(a==="ca-dif"&&!b.classList.contains("feito")){b.classList.add("feito");ovoSom("vira");caAtualiza()}
 else if(a==="ca-de-novo")ovoCopia(true)});
document.addEventListener("change",e=>{if(e.target&&e.target.id==="bk-arq"&&e.target.files)bkArquivo(e.target.files[0])});
/* no computador: arrastar o arquivo para a tela */
let bkArr=0;
const bkMain=()=>rota.tela==="backup"&&document.querySelector("main.bk");
document.addEventListener("dragenter",e=>{const m=bkMain();if(!m||!e.dataTransfer||![...(e.dataTransfer.types||[])].includes("Files"))return;bkArr++;m.classList.add("arrastando")});
document.addEventListener("dragover",e=>{if(bkMain())e.preventDefault()});
document.addEventListener("dragleave",()=>{const m=bkMain();if(m&&--bkArr<=0){bkArr=0;m.classList.remove("arrastando")}});
document.addEventListener("drop",e=>{const m=bkMain();if(!m)return;e.preventDefault();bkArr=0;m.classList.remove("arrastando");const f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];if(f){bk.mexeu=true;bkArquivo(f)}});

/* segredo 10. Cópia autenticada: a cópia tem três diferenças do original; corrigidas, o cartório carimba "confere com o original" */
const CA_DOC=(copia)=>{const d=(cls,alvo,ok,falta)=>copia?`<g class="ca-dif" data-bk="ca-dif"><rect class="alvo" ${alvo}/>${falta||""}<g class="ok">${ok}</g></g>`:ok;
 return `<svg class="ca-svg" viewBox="0 0 120 150" aria-hidden="true"><path class="t" d="M22 20h76"/><path class="l" d="M18 38h84M18 50h84"/>
 ${d("",'x="10" y="54" width="100" height="16"',`<path class="l" d="M18 62h84"/>`,`<path class="l curta" d="M18 62h40"/>`)}
 <path class="l" d="M18 74h70M18 86h84"/>
 ${d("",'x="10" y="96" width="70" height="30"',`<path class="ass" d="M18 116c6-14 10-14 10-4s4 8 8-2 6-6 8 2 6 2 10-4 8 0 12 2"/>`,`<path class="falta" d="M16 120h60"/>`)}
 ${d("",'x="78" y="100" width="34" height="36"',`<circle class="cera" cx="95" cy="118" r="12"/><path class="bal" d="M95 110v14M88 113h14M88 113l-3 5h6zM102 113l-3 5h6zM91 124h8"/>`,`<circle class="falta" cx="95" cy="118" r="12"/>`)}
 </svg>`};
function ovoCopia(rever){ovoCena("copia","ovo-copia",`<h2>Cópia autenticada</h2><p class="frase">O cartório só autentica a cópia se ela for idêntica ao original. Toque nas <b>3 diferenças</b> da cópia para corrigi-las.</p>
 <div class="ca-palco"><figure class="ca-doc"><figcaption>Original</figcaption>${CA_DOC(false)}</figure><figure class="ca-doc"><figcaption>Cópia</figcaption>${CA_DOC(true)}<span class="ca-carimbo">Confere com<br>o original</span></figure></div>
 <p class="ca-msg" aria-live="polite">Diferenças corrigidas: 0 de 3</p>
 <div class="ca-fim" hidden><p class="ovo-nota"><b>Autenticar</b> é atestar, com fé pública, que a cópia confere com o original. Para o CPC, as reproduções de documentos públicos autenticadas por oficial público ou conferidas em cartório fazem a mesma prova que os originais (art. 425, III). Seu backup é assim: uma cópia fiel do seu progresso.</p></div>
 ${ovoBotoes(`<button class="botao" data-bk="ca-de-novo">Conferir de novo</button>`)}`,{rever,titulo:"Cópia autenticada"})}
function caAtualiza(){const el=document.querySelector(".ovo-copia");if(!el)return;const n=el.querySelectorAll(".ca-dif.feito").length,ok=n>=3;
 const m=el.querySelector(".ca-msg");m.textContent=ok?"Confere com o original!":`Diferenças corrigidas: ${n} de 3`;m.classList.toggle("ok",ok);
 if(ok){el.classList.add("certo");el.querySelector(".ca-fim").hidden=false;setTimeout(()=>ovoSom("carimbo"),250);setTimeout(()=>{ovoConfete();ovoSom("gabarito")},700)}}
OVOS.push({id:"copia",ic:"recibo",nome:"Cópia autenticada",dica:"Em Backup do progresso, o lacre do arquivo guarda um segredo. Toque nele várias vezes seguidas."});
OVO_ABRE.copia=ovoCopia;
