"use strict";
/* ---------- teste inverso ----------
   A questão recuperada (acertou depois de errar) ou já acertada numa revisão volta invertida: a resposta vira o enunciado
   e as alternativas viram perguntas. Só inverte quando faz sentido: ficam de fora o comando negativo (incorreta, exceto),
   a resposta que não se sustenta sozinha (todas, apenas I e II) e o enunciado com itens. As outras perguntas vêm da mesma
   matéria, de preferência do mesmo assunto, e nunca têm resposta parecida com a certa, para que só uma sirva.
   Na revisão espaçada, o inverso vale do 1º ao 4º acerto; a última revisão (30 dias) volta ao formato da prova.
   sessao.inv[id] e cadRef.inv guardam as perguntas sorteadas (índice 0 é a da própria questão). */
P.inverte='<path d="M4 8h15l-4-4M20 16H5l4 4"/>';
const INV_NEG=/\b(INCORRET\w*|EXCETO|NÃO|SALVO)\b|incorret|exceto|\bfals[ao]s?\b|\berrad[ao]s?\b|inverídic|não (é|está|se aplica|corresponde)/;
const INV_META=/^(todas|nenhuma|apenas|somente|ambas|I[\s,]|II|III|IV\b|V\b|[VF],|certo|errado|sim\b|não\b)/i;
const INV_ITENS=/(^|\s)(I|II|III)\s*[-–.)]|afirmativas|assertivas|afirmações|proposições|\bitens\b|\bseguintes\b/i;
/* enunciado genérico ("assinale a correta", "é correto afirmar") não identifica a resposta: não serve de pergunta */
const INV_GEN=/(assinale|marque|indique|aponte) a (alternativa|opção|afirmativa|assertiva)? ?(correta|verdadeira|certa)|(é|está) correto (afirmar|dizer)|pode-se afirmar|(está|é) corret[ao]s?\s*:?\s*$|é correta a/i;
const invApta=q=>!!q&&q.q.length<=300&&q.o[0].length<=200&&!INV_NEG.test(q.q)&&!INV_GEN.test(q.q)&&!INV_META.test(q.o[0].trim())&&!INV_ITENS.test(q.q);
const invTok=t=>new Set(String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9 ]+/g," ").split(" ").filter(w=>w.length>3||/\d/.test(w)));
function invParece(a,b){const A=invTok(a),B=invTok(b);if(!A.size||!B.size)return a.trim().toLowerCase()===b.trim().toLowerCase();let n=0;A.forEach(w=>{if(B.has(w))n++});return n/Math.min(A.size,B.size)>=.5}
/* quer o inverso: na revisão, do 1º ao 4º acerto; fora dela, enquanto está "recuperada" no caderno */
function invQuer(id){const r=S.qrev&&S.qrev[id];if(r)return r.n>=1&&r.n<PASSOS_Q.length-1;const e=S.cad&&S.cad[id];return !!(e&&!e.fora&&cadEst(id)==="recuperada")}
function invSorteia(id){const q=QMAP[id];if(!invApta(q))return null;const g=grupoDe(q),L=[];
 const serve=x=>x.id!==id&&x.m===q.m&&invApta(x)&&!invParece(x.o[0],q.o[0])&&!invParece(x.q,q.q)&&L.every(y=>!invParece(QMAP[y].q,x.q)&&!invParece(QMAP[y].o[0],x.o[0]));
 const C=QS.filter(x=>x.m===q.m&&x.id!==id);
 [emb(C.filter(x=>grupoDe(x)===g)),emb(C.filter(x=>grupoDe(x)!==g))].forEach(l=>l.forEach(x=>{if(L.length<3&&serve(x))L.push(x.id)}));
 return L.length===3?[id,...L]:null}
function invMonta(qids){const o={};qids.forEach(id=>{if(invQuer(id)){const L=invSorteia(id);if(L)o[id]=L}});return Object.keys(o).length?o:undefined}
const invDe=(s,id)=>{const L=s&&s.inv&&s.inv[id];return L&&L.every(x=>QMAP[x])?L:null};
/* enunciado como pergunta: o "…é chamado de:" vira uma lacuna */
const invPerg=q=>/:\s*$/.test(q.q)?`${esc(q.q.replace(/\s*:\s*$/,""))} <span class="inv-lac" aria-label="lacuna"></span>`:esc(q.q);
const invFrase=q=>`${esc(q.q)} <b>${esc(q.o[0])}</b>`;
function invTopo(q,novo){return `<div class="inv-cab"><span class="inv-selo">${ic("inverte")}Teste inverso</span><small>A resposta vira a pergunta</small></div>
 <div class="inv-resp${novo?" entra":""}"><small>A resposta é</small><p>${esc(q.o[0])}</p></div><p class="inv-qual">Qual destas perguntas ela responde?</p>`}
function invAlts(L,ord,r,marc,mostra,attr){return `<div class="alts inv-alts" role="radiogroup" aria-label="Perguntas">${ord.map((oi,p)=>{let c="";if(mostra){if(oi===0)c="certa";else if(oi===r)c="errada"}else if(oi===marc)c="marcada";
 return `<button class="alt ${c}" role="radio" aria-checked="${oi===marc}" ${attr} data-o="${oi}" ${mostra?"disabled":""}><span class="letra">${LETRAS[p]}</span><span>${invPerg(QMAP[L[oi]])}</span></button>`}).join("")}</div>`}
function invExplica(q,L,r,ord,cad){const ok=r===0,x=r>0?QMAP[L[r]]:null;
 return `<div class="coment ${ok?"":"err"} inv-coment"><h3>${r===undefined?"Em branco":ok?"Inverso certo":"Inverso incorreto"} · era a ${LETRAS[ord.indexOf(0)]}</h3>
 <p class="inv-frase">${ic("inverte")}<span>${invFrase(q)}</span></p><p>${esc(q.e)}</p><p class="fund">${esc(q.f)}</p>
 ${x?`<div class="inv-comp"><p class="porque-t">Compare com a pergunta que você marcou</p><p>${invFrase(x)}</p><p class="inv-dica">Perguntas vizinhas, respostas diferentes. Grave o detalhe do enunciado que separa uma da outra.</p></div>`:""}
 <p class="inv-porque">${ic("lampada")}<span><b>Por que inverter?</b> Na prova você vai da pergunta à resposta. Aqui faz o caminho de volta: ligar a resposta ao contexto certo mostra que você entendeu, e não só reconheceu a alternativa. A memória fica firme nos dois sentidos.</span></p>
 ${ok||cad?"":`<p class="cad-foi">${ic("caderno")}<span>Guardada no seu <b>Caderno de erros</b>, com a explicação, para refazer depois.</span></p>`}${botaoRep(q)}</div>`}
function telaQuizInv(s,id,q,L){const ord=s.ordem[id],r=s.resp[id],mostra=!s.corrFinal&&r!==undefined;const M=META[q.m];
 const modo=modoQ(),pv=(pend&&pend.id===id)?pend.o:undefined,marc=pv!==undefined?pv:r;const rest=s.limite?s.limite-s.tempo:s.tempo;
 const dir=`<span class="relogio" id="relogio">${ic("relogio")}<span id="rel-t">${mmss(rest)}</span></span>`;
 const novo=r===undefined&&!(pend&&pend.id===id);
 return topo(`Questão ${p2(idx+1)} de ${s.qids.length}`,"Teste inverso",{voltarAcao:"pausar",dir})+
 `<main class="wrap"><div class="q-cab inv${novo?" novo":""}"><div class="q-mat">${tile(M.cor,M.ic)}<b>${esc(M.nome)}</b><span>· ${esc(q.a)}</span></div>${invTopo(q,novo)}</div>
 ${invAlts(L,ord,r,marc,mostra,'data-acao="marcar"')}
 ${modo==="confirmar"&&!mostra?(pv!==undefined&&pv!==r?`<div class="botoes" style="margin-top:12px"><button class="botao cheio" data-acao="confirmar-resp">Confirmar resposta</button></div>`:r===undefined?`<p class="dica-modo">Toque em uma pergunta e depois em "Confirmar resposta".</p>`:""):""}
 ${setasAcima()&&!mostra?navQuizAcima():""}
 ${mostra?invExplica(q,L,r,ord):""}
 ${setasAcima()&&mostra?navQuizAcima():""}</main>`+(setasAcima()?"":navQuiz())+(folha?telaFolha():"")}
/* na correção do resultado */
function invCorr(a,id,i,L){const q=QMAP[id],x=a.resp[id],ord=a.ordem[id],k=x===undefined?"br":x===0?"ok":"er";
 return `<details class="rev"><summary><span class="num ${k}">${p2(i+1)}</span><span class="rq"><span class="rotulo">${esc(META[q.m].nome)} · teste inverso</span><br>A resposta é: <b>${esc(q.o[0])}</b></span></summary>
 <div class="rbody">${ord.map((oi,p)=>`<p>${oi===0?"<b>":""}${LETRAS[p]}) ${invPerg(QMAP[L[oi]])}${oi===0?` <span class="gab">${ic("ok")}gabarito</span></b>`:""}${oi===x&&oi!==0?" <span class='c-er'>(sua resposta)</span>":""}</p>`).join("")}
 <p class="inv-frase" style="margin-top:10px">${ic("inverte")}<span>${invFrase(q)}</span></p>${x>0?`<p class="fund">A pergunta que você marcou: ${invFrase(QMAP[L[x]])}</p>`:""}<p>${esc(q.e)}</p><p class="fund">${esc(q.f)}</p>${botaoRep(q)}</div></details>`}
/* aviso na tela de começar */
function invAvisoPre(s){if(s.tipo!=="err")return "";const n=s.qids.filter(id=>invQuer(id)&&invApta(QMAP[id])).length;if(!n)return "";
 return `<p class="inv-pre">${ic("inverte")}<span>${n===1?"Uma questão que você já recuperou volta":`Até ${n} questões que você já recuperou voltam`} no <b>teste inverso</b>: a resposta aparece como enunciado e você escolhe a pergunta certa.</span></p>`}
/* ---------- caderno de erros ----------
   Cada questão errada vai para S.cad ({id: {n: vezes que errou, r: alternativa marcada no último erro (br: deixou em branco),
   t0/t: primeiro e último erro, s: acertos seguidos depois do erro, ta: último acerto, mot: por que errou, nota: anotação, fora: tirada do caderno}}).
   O registro acontece em registrar(). Situação: "refazer" (a última resposta foi errada), "recuperada" (acertou depois de errar)
   e "dominada" (3 acertos seguidos). A revisão espaçada (S.qrev) continua à parte e aparece aqui como atalho.
   Segredo "Errar é humano": 5 toques rápidos na ilustração do caderno. */
P.caderno='<path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6z"/><path d="M3 7h3M3 12h3M3 17h3M6 3v18"/><path d="M10.5 8.5l4 4M14.5 8.5l-4 4"/>';
ILU.caderno=`<path d="M60 34h112a8 8 0 0 1 8 8v86a8 8 0 0 1-8 8H60z" class="f-t"/><rect x="66" y="26" width="108" height="104" rx="6" class="f-w s-t" stroke-width="2"/>`+
 [38,52,66,80,94,108,122].map(y=>`<circle cx="66" cy="${y}" r="4.5" class="f-s s-t" stroke-width="2"/>`).join("")+
 `<path d="M84 48h76M84 66h76M84 84h76M84 102h76M84 118h46" class="s-l" stroke-width="2.5" stroke-linecap="round"/>
 <path d="M84 39h40M84 57h56M84 75h30M84 93h48" class="s-t" stroke-width="3" stroke-linecap="round" opacity=".28"/>
 <path class="cad-ix" d="M146 34l10 10M156 34l-10 10"/><ellipse class="cad-io" cx="104" cy="57" rx="24" ry="8"/><path class="cad-iv" d="M146 88l5 6 10-12"/>
 <g class="cad-lapis"><rect x="190" y="24" width="15" height="78" rx="2" class="f-b"/><rect x="190" y="18" width="15" height="9" class="f-s s-t" stroke-width="1.5"/><path class="cad-borr" d="M190 18v-6a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v6z"/><path d="M190 102l7.5 18 7.5-18z" class="f-w s-t" stroke-width="1.5"/><path d="M195.5 115.5l2 4.5 2-4.5z" class="f-t"/></g>`;
const CAD_MOT=[["nao","Não sabia o conteúdo","livro","Volte ao tema na apostila e refaça a questão no mesmo dia: a lembrança fresca fixa melhor."],
 ["confundi","Confundi institutos","setas","Monte um quadro com as diferenças entre os dois institutos. Diferença bem vista não se confunde mais."],
 ["pegadinha","Caí na pegadinha","exc","Sublinhe o comando (correta, incorreta, exceto) e desconfie de palavras absolutas como sempre, nunca e somente."],
 ["memoria","Esqueci prazo ou número","relogio","Prazo e número pedem repetição: transforme em cartão de memorização e revise em dias alternados."],
 ["chute","Chutei","alvo","Chute certo não ensina. Leia a explicação de todas as alternativas, não só da certa."]];
const CAD_ST={refazer:["Para refazer","er"],recuperada:["Recuperada","rc"],dominada:["Dominada","ok"]};
const CAD_DOMINA=3;
let cadF={st:"refazer",m:"",ord:"rec",n:20},cadAberto=null,cadEntra=null,cadRef=null,cadFx=null,cadTirada=null;
function cadMigra(){if(S.cad)return;const c={};
 S.hist.slice().sort((a,b)=>(a.inicio||0)-(b.inicio||0)).forEach(a=>(a.qids||[]).forEach(id=>{const r=a.resp&&a.resp[id];if(r===undefined)return;const t=a.fim||a.inicio||Date.now();
  if(r===0){if(c[id]){c[id].s++;c[id].ta=t}}else{const x=c[id]||{n:0,t0:t};x.n++;x.t=t;x.s=0;x.r=r;c[id]=x}}));
 Object.keys(S.stats||{}).forEach(id=>{const s=S.stats[id];if(s.u===0&&!c[id])c[id]={n:Math.max(1,(s.n||1)-(s.ok||0)),t0:s.t||Date.now(),t:s.t||Date.now(),s:0,br:1};else if(s.u===1&&c[id]&&!c[id].s)c[id].s=1});
 Object.keys(c).forEach(id=>{if(!QMAP[id])delete c[id]});S.cad=c}
function cadAnota(id,c,o){cadMigra();const e=S.cad[id],t=Date.now();
 if(!c){const x=e||{n:0,t0:t};x.n++;x.t=t;x.s=0;delete x.inv;if(o==="inv"){x.inv=1;delete x.r;delete x.br}else if(o>0){x.r=o;delete x.br}else{delete x.r;x.br=1}delete x.fora;S.cad[id]=x}
 else if(e){e.s=(e.s||0)+1;e.ta=t}}
function cadIds(){cadMigra();return Object.keys(S.cad).filter(id=>QMAP[id]&&!S.cad[id].fora)}
function cadEst(id){const e=S.cad[id],st=S.stats[id];const u=st?st.u:(e.s?1:0);return !u?"refazer":(e.s||0)>=CAD_DOMINA?"dominada":"recuperada"}
function cadPendentes(){return cadIds().filter(id=>cadEst(id)==="refazer").length}
/* a questão aberta continua na lista mesmo quando muda de situação (ex.: acertou ao refazer) */
function cadLista(st,m,ord,fixo){const l=cadIds().filter(id=>id===fixo||(st==="todas"||cadEst(id)===st)&&(!m||QMAP[id].m===m));
 return ord==="mais"?l.sort((a,b)=>S.cad[b].n-S.cad[a].n||S.cad[b].t-S.cad[a].t):l.sort((a,b)=>S.cad[b].t-S.cad[a].t)}
function cadSim(key,p){const st=p[1]||"refazer",m=decodeURIComponent(p[2]||"");
 return {key,tipo:"err",titulo:"Caderno de erros",sub:(st==="todas"?"Todas as questões":CAD_ST[st][0]+(st==="refazer"?"":"s"))+(m&&META[m]?" · "+META[m].nome:""),qids:cadLista(st,m,"rec"),limite:0}}
function cadQuando(t){const d0=new Date();d0.setHours(0,0,0,0);const d=Math.floor((d0.getTime()-new Date(t).setHours(0,0,0,0))/864e5);
 return d<=0?"hoje":d===1?"ontem":d<7?`há ${d} dias`:d<30?`há ${Math.floor(d/7)} semana${d<14?"":"s"}`:new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"short"}).format(new Date(t)).replace(" de ","/").replace(".","")}
/* ordem fixa das alternativas para cada questão na explicação (o gabarito não fica sempre na letra A) */
function cadOrd(id){let h=0;for(const ch of id)h=(h*31+ch.charCodeAt(0))>>>0;const a=[0,1,2,3];for(let i=3;i>0;i--){h=(h*1103515245+12345)>>>0;const j=h%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function telaCaderno(){const ids=cadIds(),novo=!rota.manterScroll;const cnt={refazer:0,recuperada:0,dominada:0},porM={},porMot={};
 ids.forEach(id=>{const st=cadEst(id);cnt[st]++;const m=QMAP[id].m;if(st!=="dominada")porM[m]=(porM[m]||0)+1;const mo=S.cad[id].mot;if(mo)porMot[mo]=(porMot[mo]||0)+1});
 const tot=ids.length;
 if(!tot)return topo("Caderno de erros","Onde cada erro vira lição",{menu:true})+`<main class="wrap cad">${vazio("caderno","Seu caderno está em branco","Quando você errar uma questão, ela vem para cá com a explicação de cada alternativa e um botão para refazer. Errar no treino é o jeito mais barato de acertar na prova.",`<button class="botao cheio" data-acao="ir-raiz" data-tela="hoje">Ver o plano de hoje</button>`,"var(--erro)")}</main>`;
 if(cadF.st!=="todas"&&!cnt[cadF.st]&&!cadAberto)cadF.st=cnt.refazer?"refazer":"todas";
 const pct=k=>tot?Math.round(cnt[k]*100/tot):0,rec=tot?Math.round((cnt.recuperada+cnt.dominada)*100/tot):0;
 const num=(k,l)=>`<button class="cad-n ${CAD_ST[k][1]}" data-cad="st" data-v="${k}" aria-pressed="${cadF.st===k}"><b${novo?` data-n="${cnt[k]}"`:""}>${cnt[k]}</b><span>${l}</span></button>`;
 const hero=`<section class="cad-hero${novo?" novo":""}"><div class="cad-hero-txt"><p class="cad-kicker">${ic("caderno")} Errar faz parte</p><h2>Cada erro vira lição</h2><p>${cnt.refazer?`Refaça as questões até acertar ${CAD_DOMINA} vezes seguidas: aí ela está dominada.`:"Nenhuma questão pendente. Continue revisando as recuperadas até dominar."}</p></div>
  <div class="cad-hero-ilu" data-cad="ilu" aria-hidden="true">${ilustra("caderno","var(--erro)")}</div>
  <div class="cad-placar">${num("refazer","para refazer")}${num("recuperada","recuperadas")}${num("dominada","dominadas")}</div>
  <div class="cad-trilha" role="img" aria-label="${rec}% do caderno recuperado"><i class="er" style="width:${pct("refazer")}%"></i><i class="rc" style="width:${pct("recuperada")}%"></i><i class="ok" style="width:${pct("dominada")}%"></i></div>
  <p class="cad-leg"><b>${rec}%</b> do caderno já foi recuperado${rec>=100?". Caderno limpo!":rec>=50?". Mais da metade!":""}</p></section>`;
 const eh=errosHoje().length;
 const revisao=eh?`<button class="cad-rev" data-acao="erradas-hoje">${tile("var(--erro)","calendario")}<span><b>Revisão espaçada de hoje: ${eh} ${eh===1?"questão":"questões"}</b><small>Chegaram no dia de revisar. Cada acerto adia a próxima revisão.</small></span>${ic("prox")}</button>`:"";
 const mots=Object.keys(porMot).length;const topMot=CAD_MOT.slice().sort((a,b)=>(porMot[b[0]]||0)-(porMot[a[0]]||0))[0];const maxMot=Math.max(1,...Object.values(porMot));
 const porque=`<div class="secao" role="heading" aria-level="2">Por que você erra</div>`+(mots?`<div class="cad-bloco"><div class="cad-mots">${CAD_MOT.filter(x=>porMot[x[0]]).map(x=>`<div class="cad-mot${x===topMot?" top":""}"><span class="cad-mot-ic">${ic(x[2])}</span><span class="cad-mot-l"><span>${x[1]}</span><span class="cad-barra"><i style="--w:${Math.round(porMot[x[0]]*100/maxMot)}%"></i></span></span><b>${porMot[x[0]]}</b></div>`).join("")}</div>
  <p class="cad-dica">${ic("lampada")}<span><b>Para o seu erro mais comum:</b> ${topMot[3]}</span></p></div>`
  :`<div class="dica"><p style="margin:0">Abra uma questão e marque <b>por que você errou</b>: não sabia, confundiu, caiu na pegadinha, esqueceu o número ou chutou. O caderno mostra aqui o seu padrão de erro e uma dica para cada um.</p></div>`);
 const ms=Object.keys(porM).sort((a,b)=>porM[b]-porM[a]),maxM=porM[ms[0]]||1;
 const onde=ms.length>1?`<div class="secao" role="heading" aria-level="2">Onde você mais erra</div><div class="cad-bloco cad-onde">${ms.slice(0,5).map(m=>`<button class="cad-mat" data-cad="m" data-v="${m}" aria-pressed="${cadF.m===m}">${tile(META[m].cor,META[m].ic)}<span class="cad-mot-l"><span>${esc(META[m].nome)}</span><span class="cad-barra"><i style="--w:${Math.round(porM[m]*100/maxM)}%;--c:${META[m].cor}"></i></span></span><b>${porM[m]}</b></button>`).join("")}</div>`:"";
 const lista=cadLista(cadF.st,cadF.m,cadF.ord,cadAberto);const mats=[...new Set(cadLista(cadF.st,"","rec").map(id=>QMAP[id].m))];
 const seg=`<div class="cad-seg" role="group" aria-label="Situação">${["refazer","recuperada","dominada","todas"].map(k=>`<button data-cad="st" data-v="${k}" aria-pressed="${cadF.st===k}">${k==="todas"?"Todas":CAD_ST[k][0]+(k==="refazer"?"":"s")} <small>${k==="todas"?tot:cnt[k]}</small></button>`).join("")}</div>`;
 const chips=mats.length>1||cadF.m?`<div class="cad-chips" role="group" aria-label="Matéria"><button data-cad="m" data-v="" aria-pressed="${!cadF.m}">Todas as matérias</button>${mats.map(m=>`<button data-cad="m" data-v="${m}" aria-pressed="${cadF.m===m}"><i style="background:${META[m].cor}"></i>${esc(nomeCurto(META[m].nome))}</button>`).join("")}</div>`:"";
 const ordem=`<div class="cad-ordem"><span>${lista.length} ${lista.length===1?"questão":"questões"}</span><span class="cad-ord-bts"><button data-cad="ord" data-v="rec" aria-pressed="${cadF.ord==="rec"}">Recentes</button><button data-cad="ord" data-v="mais" aria-pressed="${cadF.ord==="mais"}">Mais erradas</button></span></div>`;
 const treinar=lista.length>1?`<button class="botao cheio cad-treinar" data-cad="treinar">${ic("refazer")} Refazer ${lista.length===1?"esta questão":`as ${lista.length} em sequência`}</button>`:"";
 const desf=cadTirada?`<div class="cad-desfaz" role="status"><span>Questão tirada do caderno.</span><button data-cad="desfazer">Desfazer</button></div>`:"";
 const cards=lista.slice(0,cadF.n).map((id,i)=>cadCard(id,i,novo)).join("");
 const out=topo("Caderno de erros",`${tot} ${tot===1?"questão":"questões"} · ${cnt.refazer} para refazer`,{menu:true})+
 `<main class="wrap cad">${hero}${revisao}${porque}${onde}<div class="secao" role="heading" aria-level="2">Suas questões</div>${seg}${chips}${ordem}${treinar}${desf}
 <div class="cad-lista">${cards||`<p class="cad-nada">${ic("ok")} Nada aqui com esse filtro.</p>`}</div>
 ${lista.length>cadF.n?`<button class="botao linha cad-mais" data-cad="mais">Mostrar mais ${Math.min(20,lista.length-cadF.n)}</button>`:""}</main>`;
 cadEntra=null;cadFx=null;return out}
function cadCard(id,i,novo){const q=QMAP[id],e=S.cad[id],st=cadEst(id),M=META[q.m],ab=cadAberto===id;const mo=CAD_MOT.find(x=>x[0]===e.mot);
 const fx=cadFx&&cadFx.id===id?(cadFx.ok?" fx-ok":" fx-er"):"";
 return `<article class="cad-q st-${CAD_ST[st][1]}${ab?" aberto":""}${novo&&i<8?" entra":""}${fx}" style="--i:${i}" data-id="${id}">
 <button class="cad-q-cab" data-cad="abre" data-id="${id}" aria-expanded="${ab}">${tile(M.cor,M.ic)}<span class="cad-q-txt"><span class="cad-q-meta"><b>${esc(M.nome)}</b> · ${esc(q.a)}</span><span class="cad-q-enun">${esc(q.q)}</span>
  <span class="cad-tags"><span class="cad-tag st">${CAD_ST[st][0]}${st==="recuperada"?` ${e.s||1}/${CAD_DOMINA}`:""}</span><span class="cad-tag">${ic("x")}Errou ${e.n}×</span><span class="cad-tag">${cadQuando(e.t)}</span>${mo?`<span class="cad-tag mot">${ic(mo[2])}${mo[1]}</span>`:""}${e.nota?`<span class="cad-tag">${ic("nota")}Anotação</span>`:""}</span></span>
  <span class="cad-seta">${ic("baixo")}</span></button>
 ${ab?(cadRef&&cadRef.id===id?cadRefaz(id):cadCorpo(id)):""}</article>`}
function cadAlts(q,ord,r,mostra,clicavel){const X=explQ(q);
 return `<div class="alts cad-alts" role="${clicavel?"radiogroup":"list"}" aria-label="Alternativas">${ord.map((oi,p)=>{const c=mostra?(oi===0?"certa":oi===r?"errada":""):"";
  const tag=mostra?(oi===0?`<span class="cad-gab">${ic("ok")}gabarito</span>`:oi===r?`<span class="cad-sua">${ic("x")}sua resposta</span>`:""):"";
  const px=mostra&&oi!==0&&X?`<small class="cad-px">${esc(X[oi-1])}</small>`:"";
  return clicavel?`<button class="alt" role="radio" aria-checked="false" data-cad="resp" data-o="${oi}"><span class="letra">${LETRAS[p]}</span><span>${esc(q.o[oi])}</span></button>`
   :`<div class="alt ${c}" role="listitem"><span class="letra">${LETRAS[p]}</span><span>${esc(q.o[oi])}${tag}${px}</span></div>`}).join("")}</div>`}
function cadCorpo(id){const q=QMAP[id],e=S.cad[id],st=cadEst(id);
 return `<div class="cad-corpo${cadEntra===id?" entra":""}">
 ${e.br?`<p class="cad-aviso">${ic("exc")} Da última vez você deixou esta questão em branco.</p>`:e.inv?`<p class="cad-aviso">${ic("inverte")} Da última vez você errou o teste inverso: reconheceu a resposta, mas não a pergunta. Releia o enunciado com calma.</p>`:""}
 ${cadAlts(q,cadOrd(id),e.br?undefined:e.r,true,false)}
 <div class="coment err cad-coment"><h3>${ic("lampada")} Entenda o gabarito</h3><p>${esc(q.e)}</p><p class="fund">${esc(q.f)}</p></div>
 <div class="cad-pq"><p class="cad-pq-t">Por que eu errei?</p><div class="cad-pq-bts">${CAD_MOT.map(x=>`<button data-cad="mot" data-id="${id}" data-v="${x[0]}" aria-pressed="${e.mot===x[0]}">${ic(x[2])}${x[1]}</button>`).join("")}</div>
 ${e.mot?`<p class="cad-dica">${ic("lampada")}<span>${CAD_MOT.find(x=>x[0]===e.mot)[3]}</span></p>`:""}</div>
 <label class="campo cad-nota"><span>${ic("nota")} O que eu aprendi</span><textarea data-cad-nota="${id}" rows="2" placeholder="Com suas palavras. Ex.: na dúvida entre as duas, o prazo é de 15 dias úteis.">${esc(e.nota||"")}</textarea></label>
 <div class="cad-acoes"><button class="botao cheio" data-cad="refazer" data-id="${id}">${ic("refazer")} ${st==="refazer"?"Refazer agora":"Refazer de novo"}</button>
 <div class="cad-acoes-l">${candidatosQ(q).length?`<button class="link-tema" data-acao="estudar" data-q="${q.id}">${ic("livro")} Estudar na apostila</button>`:""}<button class="link-tema cad-tirar" data-cad="tirar" data-id="${id}">${ic("x")} Tirar do caderno</button></div></div></div>`}
function cadRefaz(id){const q=QMAP[id],R=cadRef,e=S.cad[id],feito=R.r!==undefined,L=R.inv&&R.inv.every(x=>QMAP[x])?R.inv:null;
 let res="";if(feito){const ok=R.r===0,dom=ok&&(e.s||0)>=CAD_DOMINA;
  res=`<div class="cad-res ${ok?"ok":"er"}">${ok?`<span class="cad-carimbo${dom?" dom":""}">${dom?"Dominada":"Recuperada"}</span>`:""}
  <p><b>${ok?(dom?"Dominou! Essa não te pega mais.":"Acertou! Erro virou acerto."):"Ainda não foi dessa vez."}</b> ${ok?(dom?`Foram ${CAD_DOMINA} acertos seguidos.`:`Acerto ${e.s} de ${CAD_DOMINA} para dominar.`):"Tudo bem: veja a explicação e tente de novo mais tarde."}</p>
  <div class="cad-pontos" aria-hidden="true">${Array.from({length:CAD_DOMINA},(_,k)=>`<i class="${k<(e.s||0)?"on":""}"></i>`).join("")}</div></div>`}
 return `<div class="cad-corpo cad-refaz${cadEntra===id?" entra":""}${L?" inv":""}">${L?invTopo(q,!feito):`<p class="cad-aviso">${ic("relogio")} ${feito?"Resultado":"Sem olhar a explicação: qual é a certa?"}</p>`}
 ${L?invAlts(L,R.ord,R.r,undefined,feito,feito?"":'data-cad="resp"'):cadAlts(q,R.ord,R.r,feito,!feito)}${res}
 ${L&&feito?invExplica(q,L,R.r,R.ord,true):feito&&R.r!==0?`<div class="coment err cad-coment"><h3>${ic("lampada")} Entenda o gabarito</h3><p>${esc(q.e)}</p><p class="fund">${esc(q.f)}</p></div>`:""}
 <div class="cad-acoes">${feito?`<button class="botao cheio" data-cad="fecha-ref" data-id="${id}">${R.r===0?"Voltar à explicação":"Ver explicação completa"}</button>${R.r!==0?`<button class="botao linha" data-cad="refazer" data-id="${id}">Tentar de novo</button>`:""}`
  :`<button class="botao linha" data-cad="fecha-ref" data-id="${id}">Cancelar</button>`}</div></div>`}
function cadRender(){rota.manterScroll=true;render()}
function cadResponde(id,o){const R=cadRef;if(!R||R.id!==id||R.r!==undefined)return;R.r=o;const ok=o===0;
 marcarDia("q");registrar(id,ok,o>0&&R.inv?"inv":o);salvar();cadFx={id,ok};cadRender();
 const dom=ok&&(S.cad[id].s||0)>=CAD_DOMINA;efeitoResposta(ok);
 if(ok){som(dom?"aprovado":"acerto");setTimeout(()=>som("carimbo"),animOn()?520:10)}else som("erro");
 anunciar(ok?(dom?"Acertou e dominou a questão":"Acertou. Questão recuperada"):"Errou. A explicação está logo abaixo")}
document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;const b=t.closest("[data-cad]");if(!b||b.disabled)return;
 const a=b.dataset.cad,id=b.dataset.id;
 switch(a){
  case "st":cadF.st=b.dataset.v;cadF.n=20;cadAberto=null;cadRef=null;som("toque");cadRender();break;
  case "m":cadF.m=cadF.m===b.dataset.v&&b.closest(".cad-onde")?"":b.dataset.v;cadF.n=20;cadAberto=null;cadRef=null;som("toque");cadRender();
   if(b.closest(".cad-onde"))setTimeout(()=>{const s=document.querySelector(".cad-seg");if(s)s.scrollIntoView({behavior:animOn()?"smooth":"auto",block:"start"})},30);break;
  case "ord":cadF.ord=b.dataset.v;som("toque");cadRender();break;
  case "mais":cadF.n+=20;cadRender();break;
  case "abre":{const k=b.closest(".cad-q").dataset.id;cadAberto=cadAberto===k?null:k;cadEntra=cadAberto;cadRef=null;som(cadAberto?"vira":"toque");cadRender();
   if(cadAberto)setTimeout(()=>{const el=document.querySelector(`.cad-q[data-id="${cadAberto}"]`);if(el){const r=el.getBoundingClientRect();if(r.top<70||r.top>innerHeight*.5)el.scrollIntoView({behavior:animOn()?"smooth":"auto",block:"start"})}},30);break}
  case "mot":{const x=S.cad[id];if(!x)break;x.mot=x.mot===b.dataset.v?undefined:b.dataset.v;salvar();som("toque");cadRender();break}
  case "refazer":cadRef={id,ord:emb([0,1,2,3]),inv:invQuer(id)?invSorteia(id):null};cadAberto=id;cadEntra=id;som("vira");cadRender();break;
  case "resp":cadResponde(b.closest(".cad-q").dataset.id,+b.dataset.o);break;
  case "fecha-ref":cadRef=null;cadEntra=id;som("toque");cadRender();break;
  case "tirar":{const x=S.cad[id];if(!x)break;x.fora=1;cadTirada=id;cadAberto=null;cadRef=null;salvar();som("tira");cadRender();anunciar("Questão tirada do caderno");break}
  case "desfazer":if(cadTirada&&S.cad[cadTirada]){delete S.cad[cadTirada].fora;cadAberto=cadTirada;salvar();som("puxa")}cadTirada=null;cadRender();break;
  case "treinar":{const p=cadF;ir({tela:"pre",key:`cad:${p.st}:${encodeURIComponent(p.m)}`});break}
  case "abrir":ir({tela:"caderno"});break;
  case "ilu":{const il=b.querySelector(".ilu");if(il&&animOn()){il.classList.remove("pula");void il.getBoundingClientRect();il.classList.add("pula")}som("toque");if(ovoConta("errare",5,2600))ovoErrare();break}
 }});
let tCadNota=null;
document.addEventListener("input",e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.cadNota)return;const x=S.cad&&S.cad[t.dataset.cadNota];if(!x)return;x.nota=t.value.slice(0,1000);clearTimeout(tCadNota);tCadNota=setTimeout(salvar,400)});
/* números do placar contam ao abrir a tela; a mensagem de desfazer some quando o usuário sai do caderno */
try{new MutationObserver(()=>{if(rota.tela!=="caderno"){cadTirada=null;return}document.querySelectorAll(".cad-hero.novo b[data-n]").forEach(contarBR)}).observe($("#app"),{childList:true})}catch(e){}

/* segredo "Errar é humano": passar a borracha nos erros do caderno */
const OE_LINHAS=["Prazo da apelação: 10 dias","Habeas corpus só para estrangeiro","A lei pode retroagir para punir","Contrato verbal nunca vale","Aos 16 anos o voto é obrigatório","Só a polícia prende em flagrante"];
const OE_CERTO=["15 dias úteis (art. 1.003, § 5º, do CPC)","para qualquer pessoa (art. 5º, LXVIII, da CF)","só para beneficiar o réu (art. 5º, XL, da CF)","em regra vale (art. 107 do CC)","é facultativo até os 18 (art. 14, § 1º, II, c, da CF)","qualquer do povo pode prender (art. 301 do CPP)"];
function ovoErrare(rever){ovoCena("errare","ovo-err",`<h2>Errar é humano</h2><p class="frase">Este caderno está cheio de erros. Passe a borracha: toque em cada linha errada para corrigir.</p>
 <div class="oe-folha">${OE_LINHAS.map((l,i)=>`<button class="oe-linha" data-ovo="err-x" data-i="${i}" style="--i:${i}"><span class="oe-x" aria-hidden="true">${ic("x")}${ic("ok")}</span><span class="oe-t"><s>${esc(l)}</s><b>${esc(OE_CERTO[i])}</b></span><span class="oe-borr" aria-hidden="true"></span></button>`).join("")}</div>
 <p class="oe-msg" aria-live="polite">Faltam ${OE_LINHAS.length} correções.</p>
 <div class="oe-fim" hidden><p class="ovo-nota"><b>Errare humanum est, perseverare diabolicum.</b> Errar é humano; insistir no erro, não. A frase latina costuma ser atribuída a Sêneca. No Direito Penal o erro também tem nome: o <b>erro de tipo</b> (art. 20 do CP) e o <b>erro de proibição</b> (art. 21 do CP).</p></div>
 ${ovoBotoes(`<button class="botao" data-ovo="err-de-novo">Sujar de novo</button>`)}`,{rever,titulo:"Errar é humano"})}
document.addEventListener("click",e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-ovo="err-x"],[data-ovo="err-de-novo"]');if(!b)return;const c=b.closest(".ovo-err");if(!c)return;
 if(b.dataset.ovo==="err-de-novo"){c.querySelectorAll(".oe-linha").forEach(x=>{x.classList.remove("ok");x.disabled=false});c.querySelector(".oe-fim").hidden=true;c.querySelector(".oe-msg").textContent=`Faltam ${OE_LINHAS.length} correções.`;ovoSom("vira");return}
 if(b.classList.contains("ok"))return;b.classList.add("ok");b.disabled=true;const f=OE_LINHAS.length-c.querySelectorAll(".oe-linha.ok").length;
 c.querySelector(".oe-msg").textContent=f?`Faltam ${f} ${f===1?"correção":"correções"}.`:"Caderno passado a limpo!";ovoSom("tira");
 if(!f){c.querySelector(".oe-fim").hidden=false;setTimeout(()=>{ovoConfete();ovoSom("gabarito")},350)}});
OVOS.push({id:"errare",ic:"caderno",nome:"Errar é humano",dica:"No Caderno de erros, a ilustração do caderno esconde uma borracha. Toque nela várias vezes seguidas."});
OVO_ABRE.errare=ovoErrare;
