"use strict";
/* ---------- ajustes da análise de 30/10: período no Hoje, Configurações em grupos, busca, progresso protegido e instalar ---------- */
/* Hoje sem período escolhido: a pergunta vem no topo e responde com um toque (quem pulou o tour não a perde lá embaixo) */
function perRapido(){return `<section class="per-rapido" aria-labelledby="pr-tit">${ilustra("capelo","var(--toga)")}<div class="pr-txt"><h2 id="pr-tit">Em que período você está?</h2><p>Um toque e o plano de hoje passa a sugerir as matérias, os cartões e os simulados do seu momento.</p></div>
 <div class="opcoes">${PERIODOS.slice(0,9).map((_,i)=>`<button data-acao="cfg-per" data-v="${i}">${i+1}º</button>`).join("")}<button class="pr-oab" data-acao="cfg-per" data-v="9">10º período ou formado: foco na OAB</button></div></section>`}

/* Configurações em grupos que abrem e fecham; "Meu estudo" começa aberto */
const cfgAbre={estudo:true};
function cfgG(id,ilu,tit,resumo,corpo){if(rota.grupo){cfgAbre[rota.grupo]=true;delete rota.grupo}const on=!!cfgAbre[id];
 return `<section class="cfg-g${on?" aberto":""}"><button class="cfg-g-cab" data-acao="cfg-grupo" data-v="${id}" aria-expanded="${on}" aria-controls="cfg-${id}"><span class="cfg-g-ilu">${ilustra(ilu,"var(--toga)")||tile("var(--toga)",ilu==="capelo"?"livro":ilu==="carimbo"?"recibo":ilu==="engrenagem"?"eng":ilu)}</span><span class="cfg-g-txt"><b>${tit}</b><small>${esc(resumo)}</small></span><span class="cfg-g-seta" aria-hidden="true">${ic("prox")}</span></button>
 ${on?`<div class="cfg-g-corpo" id="cfg-${id}">${corpo}</div>`:""}</section>`}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('[data-acao="cfg-grupo"]');if(!b)return;e.stopImmediatePropagation();
 const id=b.dataset.v;cfgAbre[id]=!cfgAbre[id];rota.manterScroll=true;render();
 const sec=document.querySelector(`[data-acao="cfg-grupo"][data-v="${id}"]`);if(sec){try{sec.focus({preventScroll:true})}catch(x){}
  if(cfgAbre[id]){const r=sec.getBoundingClientRect();if(r.top<70||r.top>innerHeight*.5)try{sec.scrollIntoView({block:"start",behavior:animOn()?"smooth":"auto"})}catch(x){}}}},true);

/* Do tema para as questões: no fim de cada tema, o assunto do banco de questões que mais combina com o título */
const PAL_VAZIAS=new Set("para pela pelo pelas pelos como sobre entre com sem dos das nos nas uma umas uns que qual quais seus suas sua seu esse essa este esta isso tema direito geral parte".split(" "));
const palavrasDe=t=>semAcento(limpo(String(t||""))).toLowerCase().split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!PAL_VAZIAS.has(w)).map(w=>w.replace(/(oes|aes|ais|eis|is|es|s)$/,""));
function assuntoDoTema(d,k){try{const P=paginas(d),x=P.secs[k-1];if(!x)return null;const pw=palavrasDe(x.tit);if(!pw.length)return null;
 const g={};idsEscopo(d).forEach(id=>{const q=QMAP[id];if(q){const a=grupoDe(q);g[a]=(g[a]||0)+1}});
 let best=null;Object.keys(g).forEach(a=>{if(g[a]<3)return;const aw=palavrasDe(a);const n=aw.filter(w=>pw.includes(w)).length;if(!n)return;
  const nota=n/Math.max(aw.length,1);if(!best||nota>best.nota||(nota===best.nota&&g[a]>best.n))best={a,n:g[a],nota}});
 return best}catch(e){return null}}
function treinoTema(d,k){const b=assuntoDoTema(d,k);const f=infoDisc(d);
 if(b)return `<button class="treino-tema" data-acao="treinar-ass" data-sc="${d}" data-a="${esc(encodeURIComponent(b.a))}">${ilustra("alvo","var(--toga)")}<span><small>Agora, pratique</small><b>Treinar questões: ${esc(b.a)}</b><em>${b.n} questões deste assunto, com explicação de cada alternativa</em></span>${ic("prox")}</button>`;
 if(!idsEscopo(d).length)return "";
 return `<button class="treino-tema" data-acao="abrir-disc" data-d="${d}">${ilustra("alvo","var(--toga)")}<span><small>Agora, pratique</small><b>Questões de ${esc(nomeCurto(f.nome))}</b><em>Simulados e treino por assunto desta matéria</em></span>${ic("prox")}</button>`}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('.treino-tema[data-acao="abrir-disc"]');if(!b)return;e.stopImmediatePropagation();ir({tela:"disc",d:b.dataset.d})},true);

/* Ouvir a apostila: a voz do próprio celular lê o tema, parágrafo por parágrafo, com o trecho em destaque.
   Funciona sem internet. Pula os simuladores, as respostas do Teste-se e as tabelas. */
const ouvirOk=()=>{try{return "speechSynthesis" in window&&typeof SpeechSynthesisUtterance=="function"}catch(e){return false}};
let ouv=null;
function ouvirBtn(k){if(!ouvirOk())return "";const on=ouv&&ouv.k===k;
 return `<button class="ouvir${on?" on":""}" data-ouvir="tocar" data-ouvir-k="${k}" aria-pressed="${!!on}">${ic(on?"pausa":"som")}<span>${on?(ouv.pausa?"Continuar ouvindo":"Pausar a leitura"):"Ouvir este tema"}</span></button>`}
function ouvirTrechos(btn){const art=btn&&btn.nextElementSibling;if(!art||!art.matches("article.texto"))return [];
 return [...art.querySelectorAll("h2,h3,h4,h5,p,li,blockquote")].filter(el=>!el.closest("details,.calc,.ilus,figure,.tab,button,table")&&!(el.matches("li")&&el.querySelector("p"))&&!(el.matches("blockquote")&&el.querySelector("p"))&&el.innerText.trim().length>1)}
function ouvirVoz(){const v=speechSynthesis.getVoices();return v.find(x=>/^pt[-_]BR/i.test(x.lang)&&/google|natural|neural/i.test(x.name))||v.find(x=>/^pt[-_]BR/i.test(x.lang))||v.find(x=>/^pt/i.test(x.lang))||null}
function ouvirFalar(){if(!ouv)return;const el=ouv.els[ouv.i];if(!el){ouvirParar(true);return}
 document.querySelectorAll(".ouvindo").forEach(x=>x.classList.remove("ouvindo"));el.classList.add("ouvindo");
 if(ouv.segue){const r=el.getBoundingClientRect();if(r.top<90||r.bottom>innerHeight-110)try{el.scrollIntoView({block:"center",behavior:animOn()?"smooth":"auto"})}catch(e){}}
 const u=new SpeechSynthesisUtterance(el.innerText.replace(/\s+/g," ").replace(/§/g,"parágrafo ").trim());u.lang="pt-BR";u.rate=ouv.vel;const v=ouvirVoz();if(v)u.voice=v;
 const id=ouv.id;u.onend=()=>{if(!ouv||ouv.id!==id||ouv.pausa)return;ouv.i++;ouvirFalar()};u.onerror=e=>{if(!ouv||ouv.id!==id)return;if(e.error!=="interrupted"&&e.error!=="canceled"){const k=ouv.k;ouvirParar();const x=document.querySelector(`[data-ouvir-k="${k}"] span`);if(x)x.textContent="A voz do celular não respondeu. Confira a leitura em voz alta nas configurações do aparelho.";anunciar("A leitura em voz alta não funcionou neste aparelho.")}};
 speechSynthesis.speak(u);ouvirBarra()}
function ouvirBarra(){let b=document.getElementById("ouvir-barra");if(!ouv){if(b)b.remove();return}
 if(!b){b=document.createElement("div");b.id="ouvir-barra";b.className="ouvir-barra";b.setAttribute("role","region");b.setAttribute("aria-label","Leitura em voz alta");document.body.appendChild(b)}
 const pct=Math.round(100*ouv.i/Math.max(ouv.els.length,1));
 b.innerHTML=`<span class="ob-onda${ouv.pausa?"":" tocando"}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="ob-txt"><b>${ouv.pausa?"Leitura pausada":"Ouvindo o tema"}</b><small>Trecho ${Math.min(ouv.i+1,ouv.els.length)} de ${ouv.els.length}</small><span class="ob-prog"><i style="width:${pct}%"></i></span></span>
 <button class="ob-b" data-ouvir="vel" aria-label="Velocidade ${String(ouv.vel).replace(".",",")} vezes">${String(ouv.vel).replace(".",",")}×</button>
 <button class="ob-b" data-ouvir="${ouv.pausa?"continuar":"pausar"}" aria-label="${ouv.pausa?"Continuar":"Pausar"}">${ic(ouv.pausa?"prox":"pausa")}</button>
 <button class="ob-b" data-ouvir="parar" aria-label="Parar a leitura">${ic("x")}</button>`;
 document.querySelectorAll("[data-ouvir-k]").forEach(x=>{const on=x.dataset.ouvirK===ouv.k;x.classList.toggle("on",on);x.setAttribute("aria-pressed",on);x.innerHTML=`${ic(on&&!ouv.pausa?"pausa":"som")}<span>${on?(ouv.pausa?"Continuar ouvindo":"Pausar a leitura"):"Ouvir este tema"}</span>`})}
function ouvirParar(fim){try{speechSynthesis.cancel()}catch(e){}document.querySelectorAll(".ouvindo").forEach(x=>x.classList.remove("ouvindo"));
 const k=ouv&&ouv.k;ouv=null;ouvirBarra();document.querySelectorAll("[data-ouvir-k]").forEach(x=>{x.classList.remove("on");x.setAttribute("aria-pressed","false");x.innerHTML=`${ic("som")}<span>Ouvir este tema</span>`});
 if(fim&&k)anunciar("Fim do tema. Que tal o Teste-se?")}
function ouvirComecar(btn){const els=ouvirTrechos(btn);if(!els.length)return;try{speechSynthesis.cancel()}catch(e){}
 ouv={k:btn.dataset.ouvirK,els,i:0,vel:(S.cfg&&S.cfg.ouvVel)||1,pausa:false,segue:true,id:Date.now()};ouvirFalar()}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-ouvir]");if(!b)return;e.stopImmediatePropagation();const a=b.dataset.ouvir;
 if(a==="tocar"){if(ouv&&ouv.k===b.dataset.ouvirK){if(ouv.pausa){ouv.pausa=false;ouv.id=Date.now();ouvirFalar()}else{ouv.pausa=true;try{speechSynthesis.cancel()}catch(x){}ouvirBarra()}}else ouvirComecar(b)}
 else if(a==="pausar"&&ouv){ouv.pausa=true;try{speechSynthesis.cancel()}catch(x){}ouvirBarra()}
 else if(a==="continuar"&&ouv){ouv.pausa=false;ouv.id=Date.now();ouvirFalar()}
 else if(a==="parar")ouvirParar();
 else if(a==="vel"&&ouv){const V=[1,1.25,1.5,1.75,0.75],n=V[(V.indexOf(ouv.vel)+1)%V.length];ouv.vel=n;S.cfg=S.cfg||{};S.cfg.ouvVel=n;salvar();if(!ouv.pausa){ouv.id=Date.now();try{speechSynthesis.cancel()}catch(x){}ouvirFalar()}else ouvirBarra()}},true);
/* se a pessoa rolar a tela, a leitura para de puxar a rolagem até o próximo toque em continuar */
window.addEventListener("touchmove",()=>{if(ouv)ouv.segue=false},{passive:true});
/* depois de cada render: mesma página, a leitura segue (só reencontra os trechos); outra tela, ela para */
{const r0=render;render=function(){const x=r0.apply(this,arguments);if(ouv){const b=document.querySelector(`[data-ouvir-k="${ouv.k}"]`);if(!b)ouvirParar();else{ouv.els=ouvirTrechos(b);const el=ouv.els[ouv.i];if(el)el.classList.add("ouvindo");ouvirBarra()}}return x}}
window.addEventListener("pagehide",()=>{if(ouv)ouvirParar()});
try{if(ouvirOk())speechSynthesis.getVoices()}catch(e){}

/* Busca vazia: buscas recentes e sugestões no lugar de uma segunda ilustração */
const BUSCAS_CH="faculLab.buscas",BUSCA_SUG=["legítima defesa","art. 5º","usucapião","prescrição","habeas corpus","dosimetria","responsabilidade civil","contrato de trabalho"];
function buscasRecentes(){try{const a=JSON.parse(localStorage.getItem(BUSCAS_CH)||"[]");return Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,6):[]}catch(e){return []}}
function buscaGuardar(q){q=String(q||"").trim();if(semAcento(q).length<3)return;let a=buscasRecentes();const n=semAcento(q);
 /* enquanto a pessoa digita, "legi" vira "legitima": fica só a versão mais nova */
 a=a.filter(x=>{const m=semAcento(x);return m!==n&&!n.startsWith(m)&&!m.startsWith(n)});a.unshift(q);try{localStorage.setItem(BUSCAS_CH,JSON.stringify(a.slice(0,6)))}catch(e){}}
function buscaInicio(){const r=buscasRecentes();const chip=t=>`<button class="bs-chip" data-acao="busca-sug" data-v="${esc(t)}">${esc(t)}</button>`;
 return `<div class="busca-ini">${r.length?`<div class="bs-cab"><p class="bs-tit">Buscas recentes</p><button class="link-inline" data-acao="busca-limpar">Limpar</button></div><div class="bs-chips">${r.map(t=>`<button class="bs-chip rec" data-acao="busca-sug" data-v="${esc(t)}">${ic("relogio")}${esc(t)}</button>`).join("")}</div>`:""}
 <p class="bs-tit">Experimente buscar</p><div class="bs-chips">${BUSCA_SUG.filter(t=>!r.some(x=>semAcento(x)===semAcento(t))).map(chip).join("")}</div>
 <p class="nota">Digite pelo menos 3 letras. A busca ignora acentos e maiúsculas e procura nas apostilas, nas questões (enunciado, alternativas e comentário), nos resumos e na lei seca.</p></div>`}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('[data-acao="busca-sug"],[data-acao="busca-limpar"]');if(!b)return;
 if(b.dataset.acao==="busca-sug"){buscaGuardar(b.dataset.v);return}
 e.stopImmediatePropagation();try{localStorage.removeItem(BUSCAS_CH)}catch(x){}const r=document.getElementById("res-busca");if(r)r.innerHTML=resultadosBusca("",rota.bf)},true);

/* Progresso protegido: o celular guarda os dados de forma persistente, e o app avisa se não conseguir salvar */
function guardaPersistir(){try{const st=navigator.storage;if(!st||!st.persist)return;st.persisted().then(ok=>{if(!ok)return st.persist()}).catch(()=>{})}catch(e){}}
let guardaAvisou=false;
function guardaFalhou(){if(guardaAvisou||document.getElementById("guarda-falha"))return;guardaAvisou=true;
 const d=document.createElement("div");d.id="guarda-falha";d.className="guarda-falha";d.setAttribute("role","alert");
 d.innerHTML=`${ilustra("cadeado","var(--erro)")}<div><b>Não consegui salvar seu progresso</b><p>O espaço do navegador neste celular pode estar cheio. Faça um backup agora para não perder nada.</p>
 <div class="gf-botoes"><button class="botao cheio" data-gu="backup">Fazer backup</button><button class="botao linha" data-gu="fechar">Agora não</button></div></div>`;document.body.appendChild(d)}
/* lembrete de backup no Hoje: depois de algum estudo, se o último backup passou de 30 dias (ou nunca houve), uma vez por mês */
function guardaLembrete(){const n=Object.keys(S.stats||{}).length;if(n<40)return "";const a=bkIdade();if(a.cls!=="nunca"&&a.d<=30)return "";
 const mes=hojeStr().slice(0,7);if(S.cfg&&S.cfg.bkLemb===mes)return "";
 return `<section class="guarda-lemb" aria-labelledby="gl-tit">${ilustra("carimbo","var(--lacre)")}<div><h2 id="gl-tit">Guarde seu progresso</h2><p>São ${n.toLocaleString("pt-BR")} questões respondidas, e elas ficam só neste celular. ${a.cls==="nunca"?"Você ainda não fez nenhum backup.":`Seu último backup foi ${a.q}.`} Leva um minuto.</p>
 <div class="gf-botoes"><button class="botao cheio" data-gu="backup">Fazer backup</button><button class="botao linha" data-gu="adiar">Lembrar mês que vem</button></div></div></section>`}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-gu]");if(!b)return;const a=b.dataset.gu;const f=document.getElementById("guarda-falha");
 if(a==="backup"){if(f)f.remove();ir({tela:"backup"})}
 else if(a==="fechar"){if(f)f.remove()}
 else if(a==="adiar"){S.cfg=S.cfg||{};S.cfg.bkLemb=hojeStr().slice(0,7);salvar();rota.manterScroll=true;render();anunciar("Tudo bem. Lembro de novo no mês que vem.")}});

/* Instalar o app: botão próprio no Android (o navegador guarda o pedido de instalação até a pessoa tocar) */
let pedidoInstalar=null;
const appInstalado=()=>{try{return matchMedia("(display-mode: standalone)").matches||navigator.standalone===true}catch(e){return false}};
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();pedidoInstalar=e;if(rota.tela==="config")reRenderSe("config")});
window.addEventListener("appinstalled",()=>{pedidoInstalar=null;guardaPersistir();anunciar("Facul Lab instalado! Ele agora abre direto da tela inicial.");if(rota.tela==="config")reRenderSe("config")});
function instalarCta(){if(appInstalado()||!pedidoInstalar)return "";
 return `<button class="tour-cta inst-cta" data-acao="instalar">${ilustra("estudo","var(--toga)")}<span><b>Instalar o Facul Lab</b><small>Ganha um ícone na tela inicial, abre em tela cheia e funciona sem internet. Segure o ícone para ir direto ao plano de hoje, aos cartões ou ao modo foco.</small></span>${ic("prox")}</button>`}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('[data-acao="instalar"]');if(!b||!pedidoInstalar)return;e.stopImmediatePropagation();
 const p=pedidoInstalar;pedidoInstalar=null;p.prompt();(p.userChoice||Promise.resolve({})).then(()=>{if(rota.tela==="config")reRenderSe("config")}).catch(()=>{})},true);
/* atalhos do ícone instalado: o manifest abre ./?ir=hoje|cartoes|foco */
try{const v=new URLSearchParams(location.search).get("ir");if(["hoje","cartoes","foco"].includes(v)){sessionStorage.removeItem(TELA_CH);localStorage.removeItem(TELA_CH);history.replaceState(null,"",location.pathname);pilha=[];rota={tela:v}}}catch(e){}
guardaPersistir();
/* conteúdo novo: o service worker abre os arquivos da cópia guardada e avisa quando chegou versão nova */
let novoAvisado=false;
try{navigator.serviceWorker&&navigator.serviceWorker.addEventListener("message",e=>{if(!e.data||e.data.tipo!=="conteudo-novo"||novoAvisado)return;novoAvisado=true;
 const d=document.createElement("div");d.className="conteudo-novo";d.setAttribute("role","status");
 d.innerHTML=`${ic("estrela")}<span><b>Chegou conteúdo novo</b><small>Questões e apostilas atualizadas.</small></span><button class="botao cheio" data-cn="atualizar">Atualizar</button><button class="icone" data-cn="fechar" aria-label="Fechar">${ic("x")}</button>`;
 document.body.appendChild(d)})}catch(e){}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-cn]");if(!b)return;
 if(b.dataset.cn==="atualizar"){if(sessao&&rota.tela==="quiz"){pararRelogio();salvar()}guardarRolagem();location.reload()}else{const d=b.closest(".conteudo-novo");if(d)d.remove()}});

