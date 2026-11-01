"use strict";
/* ---------- treino sob medida ----------
   A pessoa escolhe as matérias, quais questões (todas, só as que nunca fez, só as que errou), o nível e a
   quantidade (10, 20 ou 40). O app sorteia do banco e abre a tela de configurar, como um simulado comum.
   S.cfg.sob guarda as últimas escolhas; S.sob guarda, por treino montado, a lista sorteada (os 12 mais novos),
   para que "Refazer", "Continuar" e o histórico achem as mesmas questões. Chave do treino: "sob:<semente>". */
P.medida='<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>';
const SOB_N=[10,20,40];
const SOB_F=[["todas","Todas","Já feitas ou não, tudo misturado","livro"],["nunca","Só as que nunca fiz","Questões inéditas para você","estrela"],["erradas","Só as que errei","A última resposta foi errada","refazer"]];
const SOB_NV=[["todos","Qualquer",null],["faceis","Mais fáceis",[1,2]],["medias","Médias",[3]],["dificeis","Mais difíceis",[4,5]]];
const SOB_SO_FAC=["ied","tge","soc","psc","crim","masc"];
const sobMats=()=>OAB.concat(SOB_SO_FAC).filter(m=>META[m]&&(porM[m]||[]).length);
const sobNome=m=>{const n=META[m].nome.replace(/^Direito (do |da |de )?/,"");return n.charAt(0).toUpperCase()+n.slice(1)};
/* matérias com questões ligadas às disciplinas de um período */
function sobMatsPer(p){const s=new Set();(PERIODOS[p]||[]).forEach(d=>{if(!DISC[d])return;idsDisc(d).forEach(id=>{const q=QMAP[id];if(q)s.add(q.m)})});return sobMats().filter(m=>s.has(m))}
function sobCfg(){S.cfg=S.cfg||{};let c=S.cfg.sob;
 if(!c||typeof c!=="object"){const p=perAtual();c=S.cfg.sob={ms:p!==null&&p<8&&sobMatsPer(p).length?sobMatsPer(p):OAB.slice(),n:20,f:"todas",nv:"todos"}}
 if(!Array.isArray(c.ms))c.ms=[];if(!SOB_N.includes(c.n))c.n=20;if(!SOB_F.some(x=>x[0]===c.f))c.f="todas";if(!SOB_NV.some(x=>x[0]===c.nv))c.nv="todos";
 return c}
/* questões que combinam com as escolhas (f e nv podem ser trocados para contar as outras opções) */
function sobPool(c,f,nvl){const ms=new Set(c.ms),st=S.stats||{},niv=(SOB_NV.find(x=>x[0]===(nvl||c.nv))||SOB_NV[0])[2];f=f||c.f;
 return QS.filter(q=>ms.has(q.m)&&(!niv||niv.includes(nv(q.id)))&&(f==="nunca"?!st[q.id]:f==="erradas"?!!(st[q.id]&&st[q.id].u===0):true)).map(q=>q.id)}
function sobDescricao(c){const ms=c.ms,todas=sobMats().every(m=>ms.includes(m)),oab=!todas&&OAB.every(m=>ms.includes(m))&&ms.length===OAB.length;
 const mat=todas?"Todas as matérias":oab?"Matérias da OAB":ms.length<=2?ms.map(m=>META[m].nome).join(" e "):`${ms.length} matérias`;
 const f={nunca:"só inéditas",erradas:"só as que errei"}[c.f]||"";const n={faceis:"mais fáceis",medias:"médias",dificeis:"mais difíceis"}[c.nv]||"";
 return [mat,f,n].filter(Boolean).join(" · ")}
/* sim() de um treino montado: a lista guardada ou, se já saiu de S.sob, a da última tentativa no histórico */
function sobSim(key){const sem=key.slice(4),x=S.sob&&S.sob[sem];let q=x&&x.q,d=x&&x.d;
 if(!q){const a=(S.hist||[]).find(h=>h.key===key);if(a){q=a.qids;d=a.sub}}
 return {key,tipo:"sob",titulo:"Treino sob medida",sub:d||"Questões que você escolheu",qids:(q||[]).filter(id=>QMAP[id]),limite:0}}
function sobMontar(){const c=sobCfg(),pool=sobPool(c);if(!pool.length)return;
 const q=emb(pool).slice(0,c.n),sem=Date.now().toString(36);S.sob=S.sob&&typeof S.sob==="object"?S.sob:{};
 S.sob[sem]={q,t:Date.now(),d:sobDescricao(c)};
 const ks=Object.keys(S.sob).sort((a,b)=>S.sob[b].t-S.sob[a].t);ks.slice(12).forEach(k=>{delete S.sob[k];if(S.res)delete S.res["sob:"+k]});
 salvar();som("toque");ir({tela:"pre",key:"sob:"+sem})}
/* últimos treinos montados, do mais novo ao mais antigo */
const sobRecentes=()=>Object.keys(S.sob||{}).sort((a,b)=>S.sob[b].t-S.sob[a].t).slice(0,4).map(k=>"sob:"+k);

let sobNumAntes=null;
function telaMedida(){const c=sobCfg();
 /* aberto pela Faculdade com um período: começa com as matérias daquele período (uma vez) */
 if(rota.p!==undefined&&!rota.pFeito){rota.pFeito=1;const l=sobMatsPer(rota.p);if(l.length){c.ms=l;salvar()}}
 const pool=sobPool(c),tot=pool.length,vai=Math.min(c.n,tot),per=perAtual();
 const chip=m=>{const M=META[m],on=c.ms.includes(m);return `<button class="sob-chip" data-sob="mat" data-m="${m}" aria-pressed="${on}" style="--c:${M.cor}">${tile(M.cor,M.ic,"tile-mini")}<span>${esc(sobNome(m))}</span><small>${(porM[m]||[]).length}</small></button>`};
 const fc={};SOB_F.forEach(([k])=>fc[k]=c.ms.length?sobPool(c,k).length:0);
 const nc={};SOB_NV.forEach(([k])=>nc[k]=c.ms.length?sobPool(c,null,k).length:0);
 const n1=sobNumAntes!==null&&sobNumAntes!==tot&&animOn()?sobNumAntes:tot;sobNumAntes=tot;
 const aviso=!c.ms.length?"Escolha pelo menos uma matéria.":!tot?(c.f==="erradas"?"Nenhuma questão errada com essas escolhas. Boa notícia: tente outro nível ou outras matérias.":c.f==="nunca"?"Você já fez todas as questões com essas escolhas. Tente outro nível ou outras matérias.":"Nenhuma questão combina com essas escolhas."):
  tot<c.n?`Só há ${tot} ${tot===1?"questão":"questões"} com essas escolhas: o treino terá ${tot}.`:`O app sorteia ${c.n} e embaralha a ordem.`;
 const rec=sobRecentes().map(k=>itemSim(k,S.sob[k.slice(4)]&&S.sob[k.slice(4)].d)).join("");
 return topo("Treino sob medida","Você escolhe as questões",{menu:!pilha.length})+
 `<main class="wrap sob">${capaTela("alvo","Monte o seu treino","Escolha as matérias, quais questões, o nível e quantas. O app sorteia do banco de "+QS.length.toLocaleString("pt-BR")+" questões.")}
 <div class="sob-passo"><b class="n" aria-hidden="true">1</b><h2>Matérias</h2><small>${c.ms.length} de ${sobMats().length}</small></div>
 <div class="sob-atalhos">${per!==null&&sobMatsPer(per).length?`<button data-sob="periodo">${ic("livro")}As do ${per+1}º período</button>`:""}<button data-sob="oab">${ic("balanca")}As da OAB</button><button data-sob="todas">${ic("ok")}Todas</button>${c.ms.length?`<button data-sob="nenhuma">${ic("x")}Limpar</button>`:""}</div>
 <p class="sob-grupo">Exame de Ordem</p><div class="sob-chips" role="group" aria-label="Matérias do Exame de Ordem">${OAB.filter(m=>META[m]&&(porM[m]||[]).length).map(chip).join("")}</div>
 <p class="sob-grupo">Só da faculdade</p><div class="sob-chips" role="group" aria-label="Matérias só da faculdade">${SOB_SO_FAC.filter(m=>META[m]&&(porM[m]||[]).length).map(chip).join("")}</div>
 <div class="sob-passo"><b class="n" aria-hidden="true">2</b><h2>Quais questões</h2></div>
 <div class="cores uma sob-f" role="group" aria-label="Quais questões">${SOB_F.map(([k,n,d,i])=>`<button data-sob="f" data-v="${k}" aria-pressed="${c.f===k}"><span class="ico-op">${ic(i)}</span><span>${n}<small>${d} · ${fc[k].toLocaleString("pt-BR")} ${fc[k]===1?"questão":"questões"}</small></span></button>`).join("")}</div>
 <div class="sob-passo"><b class="n" aria-hidden="true">3</b><h2>Nível</h2></div>
 <div class="sob-seg quatro" role="group" aria-label="Nível">${SOB_NV.map(([k,n])=>`<button data-sob="nv" data-v="${k}" aria-pressed="${c.nv===k}"><b>${n}</b><small>${nc[k].toLocaleString("pt-BR")}</small></button>`).join("")}</div>
 <div class="sob-passo"><b class="n" aria-hidden="true">4</b><h2>Quantas</h2></div>
 <div class="sob-seg" role="group" aria-label="Quantas questões">${SOB_N.map(n=>`<button data-sob="n" data-v="${n}" aria-pressed="${c.n===n}"><b>${n}</b><small>${n===10?"rápido":n===20?"na medida":"puxado"}</small></button>`).join("")}</div>
 <div class="sob-resumo" aria-live="polite"><p><b class="sob-num" data-para="${tot}">${n1.toLocaleString("pt-BR")}</b> ${tot===1?"questão combina":"questões combinam"} com as suas escolhas.<small>${aviso}</small></p>
  <button class="botao cheio" data-sob="montar" ${vai?"":"disabled"}>${ic("medida")}<span>${vai?`Montar treino de ${vai}`:"Montar treino"}</span></button></div>
 <div class="dica sob-dica"><p style="margin:0"><b>Dica de estudo:</b> misturar matérias no mesmo treino obriga você a reconhecer qual regra usar em cada questão, como no dia da prova. E refazer as que errou, depois de uns dias, é o jeito mais rápido de subir a nota.</p></div>
 ${rec?`<div class="secao" role="heading" aria-level="2">Seus últimos treinos</div><div class="lista">${rec}</div>`:""}</main>`}

/* o número de questões corre até o valor novo quando uma escolha muda */
function sobAnimaNum(){const el=document.querySelector(".sob-num");if(!el)return;const para=+el.dataset.para,de=+String(el.textContent).replace(/\D/g,"");
 if(!animOn()||de===para){el.textContent=para.toLocaleString("pt-BR");return}
 const t0=performance.now(),T=380;const passo=t=>{const k=Math.min(1,(t-t0)/T),e=1-Math.pow(1-k,3);el.textContent=Math.round(de+(para-de)*e).toLocaleString("pt-BR");if(k<1)requestAnimationFrame(passo)};requestAnimationFrame(passo)}

document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-sob]");if(!b||b.disabled)return;const a=b.dataset.sob;
 if(a==="abrir"){gaveta=false;ir(b.dataset.p!==undefined?{tela:"medida",p:+b.dataset.p}:{tela:"medida"});return}
 if(a==="montar"){sobMontar();return}
 const c=sobCfg();let pop=null;
 if(a==="mat"){const m=b.dataset.m,i=c.ms.indexOf(m);if(i>=0)c.ms.splice(i,1);else c.ms.push(m);pop=m}
 else if(a==="todas")c.ms=sobMats();else if(a==="oab")c.ms=OAB.filter(m=>META[m]&&(porM[m]||[]).length);else if(a==="nenhuma")c.ms=[];
 else if(a==="periodo"){const p=perAtual();if(p!==null)c.ms=sobMatsPer(p)}
 else if(a==="f")c.f=b.dataset.v;else if(a==="nv")c.nv=b.dataset.v;else if(a==="n")c.n=+b.dataset.v;else return;
 salvar();rota.manterScroll=true;render();sobAnimaNum();som("toque");
 if(pop&&animOn()){const x=document.querySelector(`.sob-chip[data-m="${pop}"]`);if(x)x.classList.add("pop")}});
