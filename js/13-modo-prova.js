"use strict";
/* ---------- modo prova: simulado cronometrado só com os temas da próxima N1 ou N2 ----------
   A pessoa escolhe a matéria, a prova (N1, N2 ou a matéria toda), quantas questões e o ritmo. As questões saem dos temas que caem
   (a divisão de "O que cai na N1 e na N2"), espalhadas por todos os temas e com prioridade às inéditas e às que ela errou.
   Como numa prova de verdade, a correção fica para o fim. O resultado mostra a nota estimada na escala da prova (N1 e N2 valem
   o que estiver em Notas e média, 50 cada por padrão), o desempenho por tema, o uso do tempo e um simulador "e se…" da outra prova.
   As tentativas ficam em S.hist com key "mp:<matéria>:<N1|N2|tudo>" e o campo mp; as escolhas de tamanho e ritmo em S.cfg.mp. */
const MP_TAM=[10,20,30];
const MP_RITMO=[["folga","Com folga",180,"3 min por questão","Para pensar com calma e reler o enunciado"],["real","Prova real",120,"2 min por questão","O ritmo de uma prova objetiva da faculdade"],["relampago","Relâmpago",60,"1 min por questão","Para treinar a agilidade na reta final"]];
const mpCfg=()=>{S.cfg=S.cfg||{};S.cfg.mp=S.cfg.mp||{};return S.cfg.mp};
const mpRitmo=()=>MP_RITMO.find(x=>x[0]===mpCfg().ritmo)||MP_RITMO[1];
const mpRot=r=>r==="tudo"?"Matéria toda":r;
const mpProvaDe=d=>((S.cfg&&S.cfg.provasFac)||[]).find(x=>x.d===d)||null;
/* a próxima prova cadastrada da matéria sugere o que treinar: N1, N2 ou a matéria toda (substitutiva, exame final…) */
function mpRDaProva(x){return x&&x.prox?(x.prox.r==="N1"||x.prox.r==="N2"?x.prox.r:"tudo"):"N1"}
function mpSugere(d){const p=mpProvaDe(d);return p&&avOn()?mpRDaProva(estadoProva(p)):"N1"}
function mpDivisao(d){if(!temOk(d))return null;return divisaoProva(mpProvaDe(d)||{d})}
function mpFaixa(d,r){if(r==="tudo")return null;const D=mpDivisao(d);if(!D)return null;
 if(r==="N1")return {ini:1,fim:D.corte,N:D.N};return D.n2tudo?null:{ini:D.corte+1,fim:D.N,N:D.N}}
function mpIds(d,fx){const tudo=idsDisc(d);if(!fx)return tudo;const ids=idsFaixa(d,fx.ini,fx.fim);return ids.length?ids:tudo}
function mpVale(d,r){if(r==="tudo")return 100;const p=mpProvaDe(d);const s=p?situacaoNotas(p):{v1:50,v2:50};return r==="N1"?s.v1:s.v2}
const alertaRel=s=>s&&s.mp?Math.min(600,s.limite*.2):600;
/* sorteio: um pouco de cada tema, primeiro as inéditas, depois as erradas; no fim, na ordem da matéria, como na prova */
function mpSorteia(d,fx,n){const ids=mpIds(d,fx),tem=temOk(d),porT={};
 ids.forEach(id=>{const k=tem?temaDaQ(d,id):0;(porT[k]=porT[k]||[]).push(id)});
 const peso=id=>{const s=S.stats[id];return (s?(s.u?2:1):0)+Math.random()*1.6};
 const G=emb(Object.keys(porT)).map(k=>porT[k].map(id=>[id,peso(id)]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]));
 const out=[];while(out.length<n&&G.some(g=>g.length))G.forEach(g=>{if(out.length<n&&g.length)out.push(g.shift())});
 return tem?out.sort((a,b)=>temaDaQ(d,a)-temaDaQ(d,b)):out}
function mpN(d,r){const tot=mpIds(d,mpFaixa(d,r)).length,c=mpCfg().n;return Math.min(tot,c===0?tot:(c||20))}
function mpComecar(d,r){const fx=mpFaixa(d,r),n=mpN(d,r);if(!n)return;
 const R=mpRitmo(),qids=mpSorteia(d,fx,n),ordem={};qids.forEach(id=>ordem[id]=emb([0,1,2,3]));const key=`mp:${d}:${r}`;
 S.hist=S.hist.filter(a=>!(a.key===key&&a.status==="pausado"));
 sessao={id:"a"+Date.now(),key,titulo:`Modo prova · ${mpRot(r)}`,sub:nomeCurto(infoDisc(d).nome)+(fx?` · ${txtFaixa(fx)}`:" · a matéria toda"),inicio:Date.now(),status:"pausado",qids,ordem,resp:{},tempo:0,limite:n*R[2],corrFinal:true,pos:0,
  mp:{d,r,fx,vale:mpVale(d,r),ritmo:R[0],av:[]}};
 S.hist.unshift(sessao);if(S.hist.length>200)S.hist.length=200;idx=0;folha=false;confirmar=null;salvar();
 /* "fazer outra prova" a partir do resultado: o resultado antigo sai da pilha, para o voltar levar ao modo prova */
 if(rota.tela==="res"){const v=pilha.length&&pilha[pilha.length-1].tela==="mprova"?pilha.pop():{tela:"mprova",d,r};rota=v}
 ir({tela:"quiz"})}
/* contagem regressiva antes de começar: 3, 2, 1, valendo! (um toque pula) */
function mpContagem(d,r){if(!animOn()){som("abre");mpComecar(d,r);return}
 const el=document.createElement("div");el.className="mp-conta";el.setAttribute("role","status");el.setAttribute("aria-live","assertive");
 el.innerHTML=`<div class="mp-conta-in"><svg class="mp-conta-anel" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle class="v" cx="60" cy="60" r="52" pathLength="100"/></svg><span class="mp-conta-n">3</span><small>Respire fundo…</small></div>`;
 document.body.appendChild(el);const N=el.querySelector(".mp-conta-n"),T=el.querySelector("small");let k=3,fim=false;som("toque");
 const vai=()=>{if(fim)return;fim=true;clearInterval(t);el.classList.add("sai");setTimeout(()=>el.remove(),260);mpComecar(d,r)};
 const t=setInterval(()=>{k--;if(k>0){N.textContent=k;T.textContent=k===2?"Leia cada enunciado até o fim":"Boa prova!";ovoReanima(N,"pula");som("toque")}
  else if(k===0){N.textContent="Valendo!";el.classList.add("valendo");ovoReanima(N,"pula");som("abre")}else vai()},850);
 el.addEventListener("click",vai)}
/* durante a prova: barra do tempo no topo e avisos na metade, a 5 minutos e a 1 minuto do fim */
function mpBarraTempo(s){const p=Math.max(0,Math.min(1,1-s.tempo/s.limite));
 return `<div class="mp-tempo${p<.2?" pouco":""}" role="progressbar" aria-label="Tempo restante" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p*100)}"><i id="mp-tempo-i" style="transform:scaleX(${p})"></i></div>`}
function mpTick(rest){const s=sessao;if(!s||!s.mp)return;const p=Math.max(0,rest/s.limite);
 const b=document.getElementById("mp-tempo-i");if(b){b.style.transform=`scaleX(${p})`;const w=b.parentNode;w.classList.toggle("pouco",p<.2);w.setAttribute("aria-valuenow",Math.round(p*100))}
 s.mp.av=s.mp.av||[];const L=s.limite,M=[[Math.round(L/2),"Metade do tempo. Confira se não ficou nenhuma em branco para trás.","toque"],[300,"Faltam 5 minutos. Responda as que faltam, mesmo no chute consciente.","abre"],[60,"Falta 1 minuto!","martelo"]];
 M.forEach(([t,txt,sn])=>{if(t<L-20&&rest<=t&&!s.mp.av.includes(t)){if(M.some(m=>m[0]<t&&rest<=m[0])){s.mp.av.push(t);return}s.mp.av.push(t);mpBalao(txt);som(sn)}})}
function mpBalao(txt){const v=$("#mp-balao");if(v)v.remove();const el=document.createElement("div");el.id="mp-balao";el.setAttribute("role","status");
 el.innerHTML=`${ic("relogio")}<span>${esc(txt)}</span>`;document.body.appendChild(el);setTimeout(()=>el.classList.add("sai"),3600);setTimeout(()=>el.remove(),4100)}

/* ilustração da capa: folha de prova sendo marcada, cronômetro correndo e o lápis */
ILU.prova=`<g class="mp-folha"><rect x="52" y="30" width="92" height="112" rx="8" class="f-w s-t" stroke-width="2.5"/><rect x="64" y="42" width="44" height="7" rx="3.5" class="f-t"/><rect x="64" y="54" width="68" height="4" rx="2" class="f-s"/>`+
 [0,1,2,3].map(i=>`<circle cx="70" cy="${74+i*17}" r="5.5" class="f-w s-t" stroke-width="2"/><rect x="82" y="${71+i*17}" width="${[46,38,50,30][i]}" height="5" rx="2.5" class="f-s"/><path class="mp-x" style="--k:${i}" d="M67 ${74+i*17}l2.4 2.6 4.6-5" fill="none" stroke="var(--ok)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" pathLength="10"/>`).join("")+`</g>`+
 `<g class="mp-crono"><rect x="166" y="22" width="12" height="8" rx="2" class="f-t"/><circle cx="172" cy="62" r="30" class="f-a"/><circle cx="172" cy="62" r="23" class="f-w"/>`+
 [0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<rect x="171" y="41" width="2" height="${i%3?3:6}" rx="1" class="f-t" transform="rotate(${i*30} 172 62)"/>`).join("")+
 `<path class="mp-seg" d="M172 62V45" stroke="var(--erro)" stroke-width="2.4" stroke-linecap="round"/><circle cx="172" cy="62" r="3.2" class="f-b"/></g>`+
 `<g class="mp-lapis"><path d="M150 132l40-40 9 9-40 40-13 4z" class="f-b"/><path d="M190 92l5-5 9 9-5 5z" class="f-t"/><path d="M146 145l4-13 9 9z" class="f-w s-t" stroke-width="1.6"/></g>`;

/* atalho nas telas da faculdade e da disciplina */
function cardModoProva(o){const d=o.d,x=d&&avOn()&&mpProvaDe(d)?estadoProva(mpProvaDe(d)):null;
 const txt=x&&x.prox?`${esc(x.prox.r||"Prova")} ${quandoTxt(x.prox.n)}: treine com cronômetro, só com o que cai, e veja a nota estimada`:"Cronômetro, só os temas da N1 ou da N2 e nota estimada no fim";
 return `<button class="btn-mp" data-mp="abrir"${d?` data-d="${d}" data-r="${mpSugere(d)}"`:` data-p="${o.p}"`}><span class="btn-mp-ic" aria-hidden="true">${ic("relogio")}<i></i></span><span><b>Modo prova${d?"":" do período"}</b><small>${txt}</small></span>${ic("prox")}</button>`}

/* ---------- tela do modo prova ---------- */
function telaModoProva(){const L=avOn()?provasAtivas():[];
 if(rota.d===undefined)rota.d=L.length?L.slice().sort((a,b)=>a.prox.n-b.prox.n)[0].p.d:null;
 const d=rota.d&&DISC[rota.d]?rota.d:null;if(d&&!rota.r)rota.r=mpSugere(d);
 if(d&&!temOk(d)&&periodoDe(d)>=0)carregarApP(periodoDe(d)).then(ok=>{if(ok)reRenderSe("mprova")});
 const per=rota.p!==undefined?rota.p:d?periodoDe(d):Math.min(PERIODOS.length-1,perAtual()===null?periodo:perAtual());
 const hist=S.hist.filter(a=>a.mp&&a.status==="concluido").slice(0,5);
 return topo("Modo prova","Simulado cronometrado com nota estimada",pilha.length?{}:{menu:true})+
 `<main class="wrap modo-prova">
  <section class="mp-hero"><div><b>Treine como no dia da prova</b><p>Relógio correndo, só os temas que caem e correção no fim. No resultado, a nota que você tiraria hoje.</p>
   <div class="mp-selos"><span>${ic("relogio")}Cronômetro</span><span>${ic("livro")}Só o que cai</span><span>${ic("alvo")}Nota estimada</span></div></div>${ilustra("prova","var(--p2,var(--lacre))")}</section>
  ${L.length?`<div class="secao" role="heading" aria-level="2">Suas próximas provas</div><div class="mp-provas">${L.slice().sort((a,b)=>a.prox.n-b.prox.n).slice(0,6).map(x=>{const f=infoDisc(x.p.d),r=mpRDaProva(x),fx=mpFaixa(x.p.d,r);
    return `<button class="mp-pv" style="--c:${f.cor}" data-mp="materia" data-d="${x.p.d}" data-r="${r}" aria-pressed="${d===x.p.d}">${tile(f.cor,f.ic)}<span><b>${esc(nomeCurto(f.nome))}</b><small>${esc(x.prox.r||"Prova")} ${quandoTxt(x.prox.n)}${fx?` · ${txtFaixa(fx)}`:""}</small></span><em class="mp-pv-dias">${x.prox.n===0?"hoje":x.prox.n+"d"}</em></button>`}).join("")}</div>`:""}
  <details class="mp-outra"${!L.length||(d&&!L.some(x=>x.p.d===d))?" open":""}><summary>${ic("grade")}<span><b>${L.length?"Outra matéria":"Escolha a matéria"}</b><small>${L.length?"Qualquer disciplina, de qualquer período":"Toque no período e depois na disciplina"}${!avOn()?" · cadastre as datas das provas em Configurações para o app sugerir sozinho":""}</small></span></summary>
   <div class="opcoes mp-pers" role="group" aria-label="Período">${PERIODOS.map((_,i)=>`<button data-mp="per" data-p="${i}" aria-pressed="${per===i}">${i+1}º</button>`).join("")}</div>
   <div class="mp-discs">${PERIODOS[per].filter(x=>DISC[x]).map(x=>{const f=infoDisc(x);return `<button class="mp-disc" style="--c:${f.cor}" data-mp="materia" data-d="${x}" aria-pressed="${d===x}">${tile(f.cor,f.ic,"tile-mini")}<span>${esc(nomeCurto(f.nome))}</span></button>`}).join("")}</div></details>
  ${d?mpConfig(d,rota.r):`<p class="nota mp-escolha">${ic("seta")} Escolha uma matéria para montar a sua prova.</p>`}
  ${hist.length?`<div class="secao" role="heading" aria-level="2">Suas últimas provas</div><div class="lista">${hist.map(a=>{const f=DISC[a.mp.d]?infoDisc(a.mp.d):{cor:"var(--toga)",ic:"relogio",nome:""};const r=res(a),nt=r.ok/a.qids.length*a.mp.vale,st=mpSt(r.ok/a.qids.length);
    return `<button class="item mp-hist" data-mp="ver" data-id="${a.id}">${tile(f.cor,f.ic)}<span style="min-width:0"><span class="item-tit">${esc(nomeCurto(f.nome))} · ${esc(mpRot(a.mp.r))}</span><br><span class="item-sub">${new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"short"}).format(a.inicio).replace(".","")} · ${r.ok} de ${a.qids.length} · ${dur(a.tempo)}</span></span><span class="mp-hist-nota ${st.k}"><b>${fmtNota(nt)}</b><small>de ${fmtNota(a.mp.vale)}</small></span></button>`}).join("")}</div>`:""}
 </main>`}
function mpConfig(d,r){const f=infoDisc(d),D=mpDivisao(d),carregando=!temOk(d)&&periodoDe(d)>=0&&!D;
 const fx=mpFaixa(d,r),tot=mpIds(d,fx).length,P=temOk(d)?paginas(d):null;
 const opR=[["N1",D?`temas 1 a ${D.corte}`:"1ª metade"],["N2",D?(D.n2tudo?"a matéria toda":`temas ${D.corte+1} a ${D.N}`):"2ª metade"],["tudo","substitutiva e exame final"]];
 const pausa=S.hist.find(a=>a.key===`mp:${d}:${r}`&&a.status==="pausado");
 return `<section class="mp-cfg" style="--c:${f.cor}" id="mp-cfg">
  <div class="mp-cfg-cab">${tile(f.cor,f.ic)}<div><h2>${esc(f.nome)}</h2><small>${tot} ${tot===1?"questão":"questões"} no banco para esta prova</small></div></div>
  <p class="mp-rot">Qual prova?</p>
  <div class="mp-seg" role="group" aria-label="Qual prova">${opR.map(([k,s])=>`<button data-mp="prova" data-r="${k}" aria-pressed="${r===k}"><b>${mpRot(k)}</b><small>${s}</small></button>`).join("")}</div>
  ${carregando?`<p class="nota mp-carrega">${ic("livro")} Carregando os temas da apostila…</p>`
   :P&&D?`<div class="mp-temas" aria-label="Temas que caem"><p class="mp-rot">O que cai ${fx?`· ${txtFaixa(fx)} de ${fx.N}`:"· a matéria toda"}</p><ol>${P.secs.map((x,k)=>{const dentro=!fx||(k+1>=fx.ini&&k+1<=fx.fim);return `<li class="${dentro?"cai":""}" style="--i:${k}" title="${esc(limpo(x.tit))}"><span>${k+1}</span>${dentro?esc(limpo(x.tit)):""}</li>`}).join("")}</ol>
    <p class="nota">${r==="tudo"?"Substitutiva e exame final cobram a matéria inteira.":"A divisão entre N1 e N2 é a mesma de Configurações › Suas provas. Lá você ajusta onde a N1 termina."}</p></div>`
   :`<p class="nota">Esta matéria ainda não tem os temas da apostila separados, então a prova sorteia questões de toda a matéria.</p>`}
  <p class="mp-rot">Quantas questões?</p>
  <div class="opcoes mp-tam" role="group" aria-label="Quantas questões">${MP_TAM.map(n=>`<button data-mp="tam" data-v="${n}" aria-pressed="${mpCfg().n===n||(!mpCfg().n&&mpCfg().n!==0&&n===20)}" ${n>tot?"disabled":""}>${n}</button>`).join("")}<button data-mp="tam" data-v="0" aria-pressed="${mpCfg().n===0}">Todas (${tot})</button></div>
  <p class="mp-rot">Ritmo</p>
  <div class="mp-ritmos" role="group" aria-label="Ritmo">${MP_RITMO.map(([k,nome,seg,t,dd])=>`<button data-mp="ritmo" data-v="${k}" aria-pressed="${mpRitmo()[0]===k}"><span class="mp-rit-ic" aria-hidden="true"><i style="--v:${seg/60}"></i></span><b>${nome}</b><small>${t}</small></button>`).join("")}</div>
  <div id="mp-resumo">${mpResumo(d,r)}</div>
  <details class="mp-regras"><summary>${ic("info")} Como funciona o modo prova</summary><ul>
   <li>${ic("relogio")}<span><b>O relógio corre.</b> Quando o tempo acaba, a prova é entregue sozinha. Você recebe avisos na metade, a 5 minutos e a 1 minuto do fim.</span></li>
   <li>${ic("recibo")}<span><b>Correção só no fim.</b> Como na sala, você não sabe se acertou até entregar. Em branco conta como erro.</span></li>
   <li>${ic("grade")}<span><b>Pule e volte.</b> O botão Finalizar abre a folha de respostas: dá para pular as difíceis e voltar nelas depois.</span></li>
   <li>${ic("alvo")}<span><b>Nota estimada.</b> O acerto vira nota na escala da prova (N1 e N2 valem o que está em Notas e média). Quanto mais questões, mais confiável.</span></li>
   <li>${ic("pausa")}<span><b>Precisou sair?</b> O relógio pausa e a prova fica guardada aqui para continuar. Na sala, ele não para!</span></li></ul></details>
  <div class="botoes mp-bts">${pausa?`<button class="botao linha" data-mp="continuar" data-id="${pausa.id}">Continuar a prova pausada · ${mmss(pausa.limite-pausa.tempo)}</button>`:""}<button class="botao cheio mp-vai" data-mp="comecar" ${tot?"":"disabled"}>${ic("relogio")} ${pausa?"Começar uma nova":"Começar a prova"}</button></div>
 </section>`}
function mpResumo(d,r){const n=mpN(d,r),R=mpRitmo(),seg=n*R[2],min=Math.round(seg/60),vale=mpVale(d,r);const ang=Math.min(1,seg/3600);
 return `<div class="mp-resumo"><svg class="mp-dial" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" class="mp-dial-f"/><circle cx="50" cy="50" r="42" class="mp-dial-v" pathLength="100" style="stroke-dashoffset:${100-ang*100}"/>${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<rect x="49.2" y="11" width="1.6" height="${i%3?3:5}" rx=".8" transform="rotate(${i*30} 50 50)"/>`).join("")}<path class="mp-dial-p" d="M50 50V18" style="transform:rotate(${ang*360}deg)"/><circle cx="50" cy="50" r="3.4"/></svg>
  <div class="mp-res-t"><b><span class="mp-min">${min}</span> min</b><span>${n} ${n===1?"questão":"questões"} · ${R[1].toLowerCase()}</span><span>Vale ${fmtNota(vale)} pontos${r==="tudo"?" (escala do exame final)":` (${r})`}</span></div></div>`}

/* ---------- resultado do modo prova ---------- */
const mpSt=p=>p>=.7?{k:"ok",t:"Rumo à aprovação direta",s:"Acima de 70%: no ritmo dos 70 pontos que aprovam sem exame final."}
 :p>=.4?{k:"ex",t:"Zona do exame final",s:"Entre 40% e 70%: se a outra prova for igual, você iria para o exame final."}
 :{k:"rp",t:"Hora de reforçar",s:"Abaixo de 40%: revise os temas em vermelho e faça outra prova."};
function telaResProva(a){const M=a.mp,r=res(a),n=a.qids.length,p=n?r.ok/n:0,nota=p*M.vale,st=mpSt(p),f=DISC[M.d]?infoDisc(M.d):{nome:"",cor:"var(--toga)",ic:"relogio"};
 const erro=Math.max(.04,Math.sqrt(p*(1-p)/Math.max(1,n)))*M.vale,lo=Math.max(0,nota-erro),hi=Math.min(M.vale,nota+erro);
 const ant=S.hist.filter(x=>x.key===a.key&&x.status==="concluido"&&x.mp).slice(0,6).reverse();
 const usado=Math.min(a.tempo,a.limite),porQ=n?usado/n:0,sobra=a.limite-usado;
 return topo("Resultado da prova",`${nomeCurto(f.nome)} · ${mpRot(M.r)}`,{})+
 `<main class="wrap mp-res">
  <section class="mp-boletim ${st.k}${rota.revela?" revela":""}" aria-label="Nota estimada: ${fmtNota(nota)} de ${fmtNota(M.vale)}">
   ${M.esgotou?`<span class="mp-esgotou">${ic("relogio")} Tempo esgotado: a prova foi entregue sozinha</span>`:""}
   <svg class="mp-gauge" viewBox="0 0 200 116" aria-hidden="true"><path class="g-f" d="M18 104a82 82 0 0 1 164 0" pathLength="100"/><path class="g-v" d="M18 104a82 82 0 0 1 164 0" pathLength="100" style="--p:${p*100}"/>
    <g class="g-m"><path d="M${100-82*Math.cos(Math.PI*.4)} ${104-82*Math.sin(Math.PI*.4)}l${-9*Math.cos(Math.PI*.4)} ${-9*Math.sin(Math.PI*.4)}"/><path d="M${100-82*Math.cos(Math.PI*.7)} ${104-82*Math.sin(Math.PI*.7)}l${-9*Math.cos(Math.PI*.7)} ${-9*Math.sin(Math.PI*.7)}"/></g>
    <text x="${100-100*Math.cos(Math.PI*.4)}" y="${104-100*Math.sin(Math.PI*.4)+3}">40%</text><text x="${100-100*Math.cos(Math.PI*.7)}" y="${104-100*Math.sin(Math.PI*.7)+3}">70%</text>
    <g class="g-agulha" style="--a:${p*180}deg"><path d="M100 104L36 104" /><circle cx="100" cy="104" r="7"/></g></svg>
   <div class="mp-nota"><small>Nota estimada${M.r==="tudo"?"":` na ${M.r}`}</small><b><span class="mp-conta-nota" data-v="${nota}">${fmtNota(nota)}</span><em> de ${fmtNota(M.vale)}</em></b>
    <span class="mp-faixa">Algo entre ${fmtNota(lo)} e ${fmtNota(hi)}${M.vale!==10?` · ≈ ${fmtNota(p*10)} de 10`:""}</span></div>
   <div class="mp-carimbo" aria-hidden="true"><span>${st.t}</span></div>
   <p class="mp-st"><b>${r.ok} de ${n} certas (${Math.round(p*100)}%)</b> · ${r.er} erradas · ${r.br} em branco<br>${st.s}</p>
  </section>
  <div class="botoes mp-bts"><button class="botao cheio" data-mp="de-novo" data-d="${M.d}" data-r="${M.r}">${ic("refazer")} Fazer outra prova</button>${r.er+r.br?`<button class="botao linha" data-acao="refazer-erradas-res">Refazer só as que errei</button>`:""}</div>
  ${mpEse(a,nota)}
  ${mpPorTema(a)}
  <section class="mp-bloco"><h3>${ic("relogio")} Seu tempo</h3>
   <div class="mp-tempo-res"><div class="mp-tbar"><i style="width:${a.limite?usado*100/a.limite:0}%"></i></div><p><b>${dur(usado)}</b> de ${dur(a.limite)} · ${mmss(porQ)} por questão (o ritmo pedia ${mmss(a.limite/Math.max(1,n))})</p></div>
   <p class="nota">${M.esgotou?`O tempo acabou com ${r.br} ${r.br===1?"questão":"questões"} em branco. Na próxima, pule as difíceis e volte nelas no fim, pela folha de respostas.`:sobra>a.limite*.4?"Sobrou bastante tempo. Use a sobra para reler as questões marcadas antes de entregar: muita gente erra por pressa.":porQ>a.limite/n*.9?"Você usou quase todo o tempo. Treine o ritmo Relâmpago para ganhar folga no dia.":"Bom ritmo: deu tempo de responder tudo com calma."}</p></section>
  ${ant.length>1?`<section class="mp-bloco"><h3>${ic("barras")} Sua evolução nesta prova</h3><div class="mp-evo">${ant.map((x,i)=>{const pp=res(x).ok/x.qids.length;return `<div class="${x.id===a.id?"atual":""}" style="--h:${Math.max(4,pp*100)}%;--i:${i}"><b>${fmtNota(pp*x.mp.vale)}</b><i class="${mpSt(pp).k}"></i><small>${new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"numeric"}).format(x.inicio)}</small></div>`}).join("")}</div></section>`:""}
  <div class="secao" role="heading" aria-level="2">Correção comentada</div>
  ${listaCorrecao(a)}
  <div class="botoes"><button class="botao linha" data-mp="abrir" data-d="${M.d}" data-r="${M.r}">Voltar ao modo prova</button></div></main>`}
/* desempenho por tema da apostila, com atalho para revisar o mais fraco */
function mpPorTema(a){const d=a.mp.d;if(!temOk(d))return "";const P=paginas(d),G={};
 a.qids.forEach(id=>{if(!QMAP[id])return;const k=temaDaQ(d,id);const x=G[k]=G[k]||{k,o:0,n:0};x.n++;if(a.resp[id]===0)x.o++});
 const L=Object.values(G).filter(x=>x.k&&P.secs[x.k-1]).sort((x,y)=>x.k-y.k);if(L.length<2)return "";
 const fraco=L.filter(x=>x.o<x.n).sort((x,y)=>x.o/x.n-y.o/y.n||y.n-x.n)[0];
 return `<section class="mp-bloco"><h3>${ic("livro")} Por tema</h3><div class="mp-temas-res">${L.map((x,i)=>{const pp=x.o/x.n;return `<div class="mp-tr${fraco&&fraco.k===x.k?" fraco":""}" style="--i:${i}"><span class="mp-tr-n">${x.k}</span><div><span class="mp-tr-t">${esc(limpo(P.secs[x.k-1].tit))}</span><i class="mp-tr-b"><i class="${mpSt(pp).k}" style="width:${pp*100}%"></i></i></div><b>${x.o}/${x.n}</b></div>`}).join("")}</div>
  ${fraco?`<button class="btn-ap mp-revisar" data-acao="abrir-tema" data-d="${d}" data-k="${fraco.k}">${tile("var(--erro)","livro")}<span><b>Revisar o tema ${fraco.k}</b><small>${esc(limpo(P.secs[fraco.k-1].tit))}: foi onde você mais errou</small></span></button>`:`<p class="nota">${ic("ok")} Você foi bem em todos os temas. Que tal o ritmo Relâmpago?</p>`}</section>`}
/* "e se…": arraste a nota da outra prova e veja se passa direto, vai para o exame final ou não alcança */
function mpEse(a,nota){const M=a.mp;if(M.r==="tudo")return "";const p=mpProvaDe(M.d),s=p?situacaoNotas(p):{v1:50,v2:50,n1:null,n2:null};
 const outra=M.r==="N1"?"N2":"N1",vOut=M.r==="N1"?s.v2:s.v1,real=M.r==="N1"?s.n2:s.n1;
 const ini=real!=null?real:Math.max(0,Math.min(vOut,Math.ceil((NOTA_REGRA.dir-nota)*2)/2));
 return `<section class="mp-bloco mp-ese" data-nota="${nota}" data-max="${vOut}" data-outra="${outra}" data-r="${M.r}">
  <h3>${ic("alvo")} E se…</h3><p class="nota">${real!=null?`Com a sua ${outra} de verdade (${fmtNota(real)}), somada a esta nota:`:`Arraste para ver quanto você precisa tirar na ${outra}. N1 + N2 somam até 100: com 70 passa direto, de 40 a 69,9 vai para o exame final.`}</p>
  <div class="mp-ese-regua" aria-hidden="true"><i class="a" style="width:${nota}%"></i><i class="b" style="left:${nota}%;width:${ini}%"></i><span class="m" style="left:40%">40</span><span class="m m70" style="left:70%">70</span></div>
  ${real!=null?"":`<label class="mp-ese-ctl"><span>${outra}</span><input type="range" min="0" max="${vOut}" step="0.5" value="${ini}" data-mp-ese aria-label="Nota na ${outra}"><b class="mp-ese-v">${fmtNota(ini)}</b></label>`}
  <div class="mp-ese-res" aria-live="polite">${mpEseTxt(nota,ini,outra,real!=null)}</div></section>`}
function mpEseTxt(nota,x,outra,real){const soma=nota+x,R=NOTA_REGRA;
 const k=soma>=R.dir?"ok":soma>=R.ex?"ex":"rp";
 const t=k==="ok"?`<b>Aprovado direto</b> com ${fmtNota(soma)} pontos.${real?"":` ${x<=0?"Nem precisa pontuar na "+outra+"!":`Basta ${fmtNota(Math.max(0,R.dir-nota))} na ${outra}.`}`}`
  :k==="ex"?`<b>Exame final</b> com ${fmtNota(soma)} pontos: precisaria de ${fmtNota(2*R.fim-soma)} no exame.${real?"":` Para passar direto, mire em ${fmtNota(R.dir-nota)} na ${outra}.`}`
  :`<b>Abaixo de 40</b> (${fmtNota(soma)} pontos).${real?"":R.ex-nota>0?` Com ${fmtNota(R.ex-nota)} na ${outra}, você garante o exame final.`:""}`;
 return `<p class="${k}"><span class="mp-ese-ic">${ic(k==="ok"?"ok":k==="ex"?"exc":"x")}</span><span>${t}</span></p>`}

/* revelação do resultado: a agulha sobe, a nota conta e o carimbo bate */
function mpRevela(){if(rota.tela!=="res"||!rota.revela)return;rota.revela=false;const b=document.querySelector(".mp-boletim");if(!b)return;
 const a=S.hist.find(x=>x.id===rota.id);if(!a)return;const p=res(a).ok/a.qids.length,el=b.querySelector(".mp-conta-nota");
 if(!animOn()){som(p>=.7?"aprovado":"fim");return}
 const fim=+el.dataset.v,t0=performance.now(),T=1300;(function passo(t){const k=Math.min(1,(t-t0)/T);el.textContent=fmtNota(fim*(1-Math.pow(1-k,3)));if(k<1&&el.isConnected)requestAnimationFrame(passo)})(t0);
 setTimeout(()=>{if(!b.isConnected)return;b.classList.add("bateu");som("carimbo")},1350);
 setTimeout(()=>{if(!b.isConnected)return;if(p>=.7){som(p===1?"gabarito":"aprovado");estouro(b.querySelector(".mp-carimbo"),["#3bb273","#ffc53d","#2e86ab","#ffffff"]);if(p===1)setTimeout(()=>mostrarFesta(a),900)}else if(p>=.4)som("meta");else som("fim")},1800)}
try{new MutationObserver(mpRevela).observe($("#app"),{childList:true})}catch(e){}

/* ações do modo prova (ficam fora do clique principal) */
function mpIr(o){const r={tela:"mprova",d:o.d||null};if(o.r)r.r=o.r;if(o.p!==undefined)r.p=+o.p;if(rota.tela==="mprova"){Object.assign(rota,r);rota.manterScroll=true;render()}else ir(r)}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-mp]");if(!b||b.disabled)return;const a=b.dataset.mp,D=b.dataset;
 switch(a){
  case "abrir":gaveta=false;if(rota.tela==="res"&&pilha.length&&pilha[pilha.length-1].tela==="mprova"&&D.d){rota=pilha.pop();rota.d=D.d;rota.r=D.r;render();break}ir(D.d?{tela:"mprova",d:D.d,r:D.r||mpSugere(D.d)}:{tela:"mprova",d:null,p:+D.p});break;
  case "materia":som("toque");mpIr({d:D.d,r:D.r||mpSugere(D.d)});setTimeout(()=>{const c=$("#mp-cfg");if(c)try{c.scrollIntoView({block:"start",behavior:animOn()?"smooth":"auto"})}catch(err){}},60);break;
  case "per":som("toque");rota.p=+D.p;rota.manterScroll=true;render();{const o=document.querySelector(".mp-outra");if(o)o.open=true}break;
  case "prova":som("toque");rota.r=D.r;rota.manterScroll=true;render();break;
  case "tam":case "ritmo":{if(a==="tam")mpCfg().n=+D.v;else mpCfg().ritmo=D.v;salvar();som("toque");
   b.parentNode.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
   const box=$("#mp-resumo");if(box&&rota.d){const v=box.querySelector(".mp-dial-p"),c=box.querySelector(".mp-dial-v"),antes=v?v.style.transform:"",cAntes=c?c.style.strokeDashoffset:"";box.innerHTML=mpResumo(rota.d,rota.r);
    const v2=box.querySelector(".mp-dial-p"),c2=box.querySelector(".mp-dial-v");if(animOn()&&v2&&antes){const fv=v2.style.transform,fc=c2.style.strokeDashoffset;v2.style.transform=antes;c2.style.strokeDashoffset=cAntes;requestAnimationFrame(()=>requestAnimationFrame(()=>{v2.style.transform=fv;c2.style.strokeDashoffset=fc}))}
    ovoReanima(box.querySelector(".mp-min"),"pula");anunciar(box.querySelector(".mp-res-t").textContent.replace(/\s+/g," "))}break}
  case "comecar":case "de-novo":{const d=D.d||rota.d,r=D.r||rota.r;if(d)mpContagem(d,r);break}
  case "continuar":{const x=S.hist.find(y=>y.id===D.id);if(!x)break;sessao=x;idx=Math.min(x.pos||0,x.qids.length-1);folha=false;confirmar=null;ir({tela:"quiz"});break}
  case "ver":ir({tela:"res",id:D.id});break;
 }});
document.addEventListener("input",e=>{const el=e.target;if(!el.dataset||el.dataset.mpEse===undefined)return;const box=el.closest(".mp-ese");if(!box)return;
 const nota=+box.dataset.nota,x=+el.value,outra=box.dataset.outra;box.querySelector(".mp-ese-v").textContent=fmtNota(x);
 const b=box.querySelector(".mp-ese-regua .b");if(b)b.style.width=Math.min(100-nota,x)+"%";
 const res2=box.querySelector(".mp-ese-res"),k0=res2.firstElementChild&&res2.firstElementChild.className;res2.innerHTML=mpEseTxt(nota,x,outra,false);
 const k1=res2.firstElementChild.className;if(k0!==k1){som(k1==="ok"?"acerto":k1==="ex"?"toque":"erro");ovoReanima(res2.firstElementChild,"pula")}});

/* segredo do modo prova: toque cinco vezes no relógio durante a prova e o fiscal aparece */
const FISCAL_SVG=`<svg class="of2-svg" viewBox="0 0 240 170" aria-hidden="true">
 <rect x="20" y="118" width="200" height="12" rx="4" class="of2-mesa"/><rect x="38" y="130" width="10" height="34" class="of2-mesa"/><rect x="192" y="130" width="10" height="34" class="of2-mesa"/>
 <g class="of2-prova"><rect x="70" y="98" width="70" height="22" rx="3" class="of2-papel" transform="rotate(-4 105 109)"/><path d="M78 106h40M78 112h30" class="of2-linha" transform="rotate(-4 105 109)"/></g>
 <g class="of2-cola"><rect x="150" y="104" width="22" height="14" rx="2" class="of2-papel2"/><path d="M154 109h14M154 113h10" class="of2-linha"/></g>
 <g class="of2-fiscal"><path d="M84 96c0-24 16-38 36-38s36 14 36 38z" class="of2-corpo"/><circle cx="120" cy="40" r="24" class="of2-rosto"/><path d="M96 34c4-16 44-16 48 0" class="of2-cabelo"/>
  <g class="of2-oculos"><circle cx="110" cy="40" r="8"/><circle cx="130" cy="40" r="8"/><path d="M118 40h4"/></g>
  <g class="of2-olhos"><circle cx="110" cy="40" r="2.6"/><circle cx="130" cy="40" r="2.6"/></g><path d="M112 54q8 4 16 0" class="of2-boca"/>
  <path d="M146 70l26-14" class="of2-braco"/><g class="of2-apito"><rect x="168" y="48" width="14" height="8" rx="3"/></g></g>
 <g class="of2-som"><path d="M190 40q8-6 0-14M198 46q14-12 0-26"/></g></svg>`;
function ovoFiscal(rever){ovoCena("fiscal","ovo-fiscal",`<div class="of2-palco">${FISCAL_SVG}</div>
 <h2>Olho na prova!</h2><p class="frase">O fiscal viu você mexendo no relógio. Tudo certo: aqui ninguém cola, só treina.</p>
 <p class="ovo-nota"><b>Cola pode ser crime?</b> Em concurso público, vestibular, exame público ou exame previsto em lei, como o Exame de Ordem, sim: o <b>art. 311-A do Código Penal</b> (Lei 12.550/2011) pune quem utiliza ou divulga indevidamente conteúdo sigiloso do certame, com reclusão de 1 a 4 anos e multa. Antes dessa lei, o STF julgou que a "cola eletrônica" não se encaixava em nenhum crime (Inq 1.145), e por isso o tipo foi criado. Já numa prova da faculdade, cola é falta acadêmica, punida pelas regras da instituição.</p>
 ${!rever&&sessao&&sessao.mp?`<p class="of2-aviso">${ic("relogio")} O relógio da sua prova continua correndo!</p>`:""}${ovoBotoes(`<button class="botao" data-ovo="fiscal-cola">Esconder a cola</button>`)}`,{rever,titulo:"Olho na prova!"});
 ovoSomDepois("martelo",animOn()?500:40)}
OVOS.push({id:"fiscal",ic:"relogio",nome:"Fiscal de prova",dica:"No modo prova, o relógio do topo esconde alguém. Toque nele cinco vezes seguidas."});
OVO_ABRE.fiscal=ovoFiscal;
document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;
 if(t.closest("#relogio")&&rota.tela==="quiz"&&sessao&&sessao.mp&&ovoConta("fiscal",5,2600)){ovoFiscal();return}
 const b=t.closest('[data-ovo="fiscal-cola"]');if(b){const c=b.closest(".festa");ovoReanima(c.querySelector(".of2-palco"),"pega");ovoSomDepois("carimbo",animOn()?700:30);
  const fr=c.querySelector(".frase");if(fr)setTimeout(()=>{fr.textContent="Peguei! A cola foi para o saco de provas, e a prova segue sem ela."},animOn()?700:0)}});

