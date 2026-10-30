"use strict";
/* ---------- motivação quando a ofensiva se perde ----------
   Aparece ao abrir o app (uma vez por dia neste aparelho) e no topo de Hoje, até a pessoa estudar algo hoje. */
function ofensivaPerdida(){const D=S.dias||{};if(temAtiv(D[hojeStr()]))return null;
 const d=new Date();d.setDate(d.getDate()-1);let fora=0;
 while(fora<400&&!temAtiv(D[hojeStr(d.getTime())])){fora++;d.setDate(d.getDate()-1)}
 if(!fora||fora>=400)return null;let seq=0;while(temAtiv(D[hojeStr(d.getTime())])){seq++;d.setDate(d.getDate()-1)}
 return {fora,seq}}
const nDias=n=>n===1?"1 dia":n+" dias";
const MOTIVA_VOLTA=[
 o=>["A chama apagou, mas a lenha continua aí",`Você ficou ${nDias(o.fora)} sem estudar. Tudo bem: uma questão hoje já reacende a ofensiva.`],
 o=>["Recomeçar também é avançar",`Sua sequência de ${nDias(o.seq)} mostrou do que você é capaz. Vamos construir uma maior, começando hoje.`],
 o=>["O que você aprendeu não foi embora",`Os ${nDias(o.seq)} de estudo continuam com você. Dez minutos hoje bastam para retomar o ritmo.`],
 o=>["Todo aprovado já recomeçou um dia","Faltar alguns dias faz parte do caminho. Voltar é o que separa quem passa de quem desiste."],
 o=>["Um dia de cada vez",`Não precisa compensar ${o.fora===1?"o dia que passou":`os ${o.fora} dias que passaram`}. Só precisa do dia de hoje.`],
 o=>["A OAB premia a constância, não a perfeição","Uma pausa não apaga o caminho. Cinco questões agora e a chama volta a brilhar."],
 o=>["Bem-vindo de volta!","Sentimos sua falta por aqui. Que tal um cartão de memorização para aquecer?"],
 o=>["Seu eu do futuro agradece","Cada questão de hoje é um ponto a mais no dia da prova. Bora reacender essa chama?"],
 o=>["Pequenos passos levam longe","Comece leve: uma questão, um cartão ou uma página da apostila. O importante é voltar."],
 o=>["Hoje é um ótimo dia para recomeçar",`Sua melhor fase pode começar agora. ${o.seq>1?`Bata os ${o.seq} dias da última ofensiva!`:"Faça dois dias seguidos e veja a chama crescer."}`]
];
const CHAMA_P="M32 78C16 78 6 67 6 53c0-12 7-20 13-27 1 6 4 10 8 11-1-13 5-25 17-33-2 11 3 18 9 26 4 6 7 12 7 21 0 16-12 27-28 27z";
const MOTIVA_ANIM=[
 viva=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><ellipse cx="80" cy="113" rx="34" ry="5" fill="currentColor" opacity=".12"/><g transform="translate(48 32)">${viva?"":`<path class="mv-cinza" d="${CHAMA_P}"/>`}<g class="mv-fogo"><g class="mv-d"><path fill="#ff7a1a" d="${CHAMA_P}"/><path fill="#ffc53d" d="M32 78c-10 0-17-7-17-16 0-8 5-13 9-18 1 4 3 7 6 8 0-7 3-13 9-17-1 7 2 11 5 16 3 4 5 8 5 13 0 8-7 14-17 14z"/><path fill="#fff4c2" d="M32 78c-5 0-9-4-9-9 0-5 3-8 6-11 1 3 2 4 4 5 1-3 2-6 5-8 0 4 1 6 2 9 1 2 1 4 1 6 0 5-4 8-9 8z"/></g></g></g><circle class="mv-fisco" cx="66" cy="60" r="3"/><circle class="mv-fisco" cx="94" cy="54" r="2.5"/><circle class="mv-fisco" cx="80" cy="44" r="2"/></svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><defs><clipPath id="mv-ceu"><rect width="160" height="87"/></clipPath></defs><g clip-path="url(#mv-ceu)"><g class="mv-sol"><g class="mv-raios" stroke="#ffb52e" stroke-width="5" stroke-linecap="round">${seq(8,i=>`<path d="M80 42v-14" transform="rotate(${i*45} 80 72)"/>`)}</g><circle cx="80" cy="72" r="22" fill="#ffc53d"/><circle cx="80" cy="72" r="15" fill="#ffd96a"/></g></g><path d="M4 88h152" stroke="var(--m1)" stroke-width="4" stroke-linecap="round"/><path d="M34 100h40M92 100h26M58 110h46" stroke="var(--m1)" stroke-width="3" stroke-linecap="round" opacity=".35"/><g class="mv-nuvem" fill="var(--surface)" stroke="var(--line)" stroke-width="2"><path d="M18 40h30a8 8 0 0 0-6-13 11 11 0 0 0-20 2 6 6 0 0 0-4 11z"/></g></svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><circle class="mv-fumaca" cx="80" cy="96" r="9" fill="var(--line)"/><circle class="mv-fumaca" cx="70" cy="100" r="7" fill="var(--line)"/><circle class="mv-fumaca" cx="90" cy="100" r="7" fill="var(--line)"/><g class="mv-foguete"><path d="M80 10c14 10 20 28 18 52H62c-2-24 4-42 18-52z" fill="var(--m1)"/><circle cx="80" cy="38" r="8" fill="var(--surface)" stroke="#ffc53d" stroke-width="3"/><path d="M62 50l-12 18h13zM98 50l12 18H97z" fill="var(--m2)"/><path d="M70 62h20l-4 10h-12z" fill="#ff7a1a"/><path d="M74 72h12l-6 14z" fill="#ffc53d"/></g><g fill="#ffc53d"><circle cx="24" cy="24" r="2.5"/><circle cx="134" cy="36" r="2"/><circle cx="122" cy="14" r="1.6"/><circle cx="36" cy="58" r="1.6"/></g></svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><path d="M52 92h56l-6 22H58z" fill="var(--m2)"/><rect x="48" y="86" width="64" height="9" rx="4" fill="var(--m1)"/><path class="mv-caule" d="M80 88C80 70 78 56 80 34" stroke="#3bb273" stroke-width="5" fill="none" stroke-linecap="round"/><path class="mv-folha" d="M80 66c-6-12-20-14-28-10 4 10 16 16 28 10z" fill="#3bb273"/><path class="mv-folha f2" d="M80 54c6-12 20-14 28-10-4 10-16 16-28 10z" fill="#5fd08f"/><g class="mv-flor"><circle cx="80" cy="30" r="7" fill="#ffc53d"/>${seq(6,i=>`<circle cx="80" cy="19" r="6" fill="#ff8fab" transform="rotate(${i*60} 80 30)"/>`)}<circle cx="80" cy="30" r="5" fill="#ffc53d"/></g></svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><g fill="var(--m1)"><rect class="mv-degrau" x="30" y="94" width="26" height="18" rx="3" opacity=".55"/><rect class="mv-degrau" x="56" y="80" width="26" height="32" rx="3" opacity=".7"/><rect class="mv-degrau" x="82" y="62" width="26" height="50" rx="3" opacity=".85"/><rect class="mv-degrau" x="108" y="46" width="26" height="66" rx="3"/></g><path d="M131 46V18" stroke="var(--fg)" stroke-width="2.5" stroke-linecap="round"/><path class="mv-bandeira" d="M132 18h18l-5 6 5 6h-18z" fill="#e5484d"/><g class="mv-estrela"><path d="M121 2l3.5 7 7.7 1.1-5.6 5.4 1.3 7.7-6.9-3.6-6.9 3.6 1.3-7.7-5.6-5.4 7.7-1.1z" fill="#ffc53d" transform="translate(-6 26)"/></g></svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><g class="mv-brilhos" stroke="#ffc53d" stroke-width="4" stroke-linecap="round">${seq(10,i=>`<path d="M80 14v-10" transform="rotate(${i*36} 80 52)"/>`)}</g><g class="mv-trofeu"><path d="M56 24h48v22a24 24 0 0 1-48 0z" fill="#f2b632"/><path d="M56 30H44a12 12 0 0 0 14 16M104 30h12a12 12 0 0 1-14 16" stroke="#f2b632" stroke-width="5" fill="none"/><path d="M74 68h12v14H74z" fill="#d99a12"/><rect x="62" y="82" width="36" height="10" rx="3" fill="var(--m1)"/><path d="M71 40l6 6 12-13" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g><g fill="#ffc53d"><path class="mv-cint" d="M30 70l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path class="mv-cint c2" d="M130 76l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5z"/></g></svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><path d="M80 100c-14-8-34-10-52-6V40c18-4 38-2 52 6 14-8 34-10 52-6v54c-18-4-38-2-52 6z" fill="var(--surface)" stroke="var(--m1)" stroke-width="3" stroke-linejoin="round"/><path d="M80 46v54" stroke="var(--m1)" stroke-width="3"/><path d="M38 54c10-2 22-1 32 3M38 64c10-2 22-1 32 3M38 74c10-2 22-1 32 3M90 57c10-4 22-5 32-3M90 67c10-4 22-5 32-3" stroke="var(--m1)" stroke-width="2.5" stroke-linecap="round" opacity=".35"/><path class="mv-pagina" d="M80 46c10-6 24-8 36-6v54c-12-2-26 0-36 6z" fill="color-mix(in srgb,var(--m2) 22%,var(--surface))" stroke="var(--m2)" stroke-width="2.5"/><g class="mv-letras" fill="var(--m2)" font-family="Georgia,serif" font-weight="700" font-size="16"><text x="58" y="30">§</text><text x="84" y="22">A</text><text x="104" y="32">✓</text></g></svg>`
];
function motivaVariante(o){const k=semente(o.seq)+o.fora;
 return {msg:MOTIVA_VOLTA[k%MOTIVA_VOLTA.length](o),anim:MOTIVA_ANIM[(k>>>3)%MOTIVA_ANIM.length]()}}
/* com a ofensiva ativa (ou na primeira vez no app), um recado para continuar; também some quando a pessoa estuda hoje */
const MOTIVA_SEGUE=[
 n=>["Sua chama está acesa",`São ${nDias(n)} seguidos. Uma questão hoje e ela continua brilhando.`],
 n=>["Vai valer a pena",`Cada um desses ${n} dias é um passo a mais rumo à aprovação. Continue firme!`],
 n=>["Constância vence talento",`Você já provou que consegue: ${nDias(n)} de estudo. Hoje é mais um tijolo na sua construção.`],
 n=>["Não quebre a corrente",`${nDias(n)} de ofensiva é coisa séria. Mantenha o ritmo e veja até onde você chega.`],
 n=>["O esforço de hoje é a carteira da OAB amanhã","Ninguém vê as horas de estudo, mas todo mundo vê o resultado. Bora para o plano de hoje?"],
 n=>[n>=7?"Uma semana ou mais, que orgulho!":"Você está pegando o ritmo",n>=7?`Com ${n} dias seguidos, estudar já virou hábito. Continue assim!`:`Faltam ${7-n} para completar uma semana inteira de ofensiva.`],
 n=>["Quem planta hoje colhe na aprovação","Alguns minutos agora valem mais do que horas na véspera. Seu futuro agradece."],
 n=>["Siga em frente, você está indo bem","Faça o plano de hoje e mantenha a chama acesa. Cada dia conta!"]
];
const MOTIVA_INICIO=[
 ()=>["Bem-vindo ao Facul Lab!","Toda aprovação começa com uma primeira questão. Faça a sua hoje e acenda sua primeira chama."],
 ()=>["Que bom ter você aqui","Estudar um pouco todo dia vale mais que maratonas. Comece pelo plano de hoje logo abaixo."],
 ()=>["O primeiro passo é o mais importante","Responda uma questão, vire um cartão ou leia uma página da apostila. A ofensiva começa hoje!"],
 ()=>["A jornada até a OAB começa agora","Vai valer a pena. Um dia de cada vez, e a gente acompanha seu progresso aqui."]
];
function semente(n){return [...hojeStr()].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7)+n*13}
function recadoSegue(){const D=S.dias||{};if(temAtiv(D[hojeStr()]))return null;
 const sq=sequencia();const algum=Object.keys(D).some(k=>temAtiv(D[k]));if(sq<1&&algum)return null;
 const k=semente(sq);const msg=sq?MOTIVA_SEGUE[k%MOTIVA_SEGUE.length](sq):MOTIVA_INICIO[k%MOTIVA_INICIO.length]();
 const anim=MOTIVA_ANIM[(k>>>3)%MOTIVA_ANIM.length](true);
 return `<section class="motiva-banner segue" aria-label="Recado para você">${anim}<div><b>${esc(msg[0])}</b><p>${esc(msg[1])}</p><small>Este recado some quando você estudar hoje</small></div></section>`}
function motivaBanner(){const o=ofensivaPerdida();if(!o)return recadoSegue()||"";const v=motivaVariante(o);
 return `<section class="motiva-banner" aria-label="Recado para você">${v.anim}<div><b>${esc(v.msg[0])}</b><p>${esc(v.msg[1])}</p><small>Este recado some quando você estudar hoje${o.seq>1?` · última ofensiva: ${o.seq} dias`:""}</small></div></section>`}
function mostrarMotiva(){const o=ofensivaPerdida();if(!o)return;const v=motivaVariante(o);
 const velho=document.querySelector(".festa");if(velho)velho.remove();
 const el=document.createElement("div");el.className="festa motiva";el.dataset.acao="festa-fechar";el.setAttribute("role","dialog");el.setAttribute("aria-label",v.msg[0]);
 el.innerHTML=`<div class="festa-card">${v.anim}<h2>${esc(v.msg[0])}</h2><p class="frase">${esc(v.msg[1])}</p><p class="mv-info">${o.seq>1?`Sua última ofensiva foi de ${o.seq} dias. `:""}Faz ${nDias(o.fora)} que você não estuda.</p><div class="botoes"><button class="botao cheio" data-acao="motiva-ir">Reacender a chama</button><button class="botao" data-acao="festa-fechar">Agora não</button></div></div>`;
 document.body.appendChild(el);syncVoltar();try{el.querySelector('[data-acao="motiva-ir"]').focus({preventScroll:true})}catch(e){}}

/* ---------- comemoração da meta diária de questões ---------- */
let metaNova=false;
const nQ=n=>n===1?"1 questão":n+" questões";
const MOTIVA_META=[
 m=>["Meta do dia batida!",`${nQ(m)} hoje. É assim, um dia de cada vez, que a aprovação chega.`],
 m=>["Na mosca!",`Você acertou em cheio a meta de ${nQ(m)}. Pode comemorar!`],
 m=>["Dever cumprido","A meta de hoje está garantida. O que vier agora é bônus para a sua nota."],
 m=>["Você é fera!",`${nQ(m)} hoje, missão cumprida. Seu eu do dia da prova vai agradecer.`],
 m=>["Mais um degrau rumo à OAB","Meta batida! Quem estuda todo dia chega mais longe do que quem estuda muito de vez em quando."],
 m=>["Mandou bem demais!","Meta diária cumprida. Se quiser ir além, revise as que errou: é onde mais se aprende."],
 m=>["Esse é o ritmo de quem passa",`Hoje você fez ${m===1?"a questão":`as ${m} questões`} da meta. Amanhã tem mais, e a chama agradece.`],
 m=>["Disciplina gera resultado","Você se comprometeu e cumpriu. Sinta orgulho disso e descanse a cabeça um pouco."]
];
const META_ANIM=[
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><g class="mt-alvo"><circle cx="70" cy="62" r="40" fill="#e5484d"/><circle cx="70" cy="62" r="30" fill="#fff"/><circle cx="70" cy="62" r="20" fill="#e5484d"/><circle cx="70" cy="62" r="10" fill="#ffc53d"/></g><g class="mt-flecha"><path d="M72 60l64-34" stroke="var(--fg)" stroke-width="4" stroke-linecap="round"/><path d="M128 22l14-4-4 14-6-2z" fill="#3bb273"/><path d="M134 24l8-10M138 28l10-6" stroke="#3bb273" stroke-width="4" stroke-linecap="round"/></g><g class="mt-onda" fill="none" stroke="#ffc53d" stroke-width="3"><circle cx="70" cy="62" r="46"/></g></svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><g class="mt-medalha"><path d="M62 2h14l12 40H74zM98 2H84L72 42h14z" fill="var(--m1)"/><path d="M76 2h8l-4 40z" fill="var(--m2)"/><circle cx="80" cy="72" r="30" fill="#f2b632"/><circle cx="80" cy="72" r="22" fill="#ffd96a" stroke="#d99a12" stroke-width="3"/><path d="M80 58l4.2 8.6 9.4 1.4-6.8 6.6 1.6 9.4L80 79.6l-8.4 4.4 1.6-9.4-6.8-6.6 9.4-1.4z" fill="#d99a12"/></g><path class="mt-reflexo" d="M64 60l10-10" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/></svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true">${[[46,44,"#e5484d"],[112,36,"#3bb273"],[82,70,"var(--m1)"],[126,84,"#ffc53d"],[34,90,"var(--m2)"]].map(([x,y,c],i)=>`<g class="mt-fogo" style="animation-delay:${i*.35}s" transform="translate(${x} ${y})"><g stroke="${c}" stroke-width="3.5" stroke-linecap="round">${seq(8,j=>`<path d="M0 -9v-9" transform="rotate(${j*45})"/>`)}</g><circle r="4" fill="${c}"/></g>`).join("")}</svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><circle class="mt-circ" cx="80" cy="60" r="44" fill="none" stroke="#3bb273" stroke-width="8" stroke-linecap="round" transform="rotate(-90 80 60)"/><path class="mt-check" d="M60 61l14 14 28-30" fill="none" stroke="#3bb273" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><g fill="#ffc53d"><path class="mv-cint" d="M24 26l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path class="mv-cint c2" d="M136 86l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5z"/></g></svg>`,
 ()=>`<svg class="mv" viewBox="0 0 160 120" aria-hidden="true"><path d="M8 112l52-70 20 26 18-22 54 66z" fill="var(--m1)" opacity=".9"/><path d="M60 42l-10 14h8l6-6 6 8 6-8z" fill="#fff"/><path d="M98 46l-8 10h6l4-4 4 5 4-5z" fill="#fff" opacity=".9"/><g class="mt-escalador"><circle cx="60" cy="18" r="5" fill="var(--fg)"/><path d="M60 23v12M60 27l-7 5M60 27l7-6M60 35l-5 7M60 35l5 7" stroke="var(--fg)" stroke-width="3" stroke-linecap="round"/></g><path d="M74 44V14" stroke="var(--fg)" stroke-width="2.5"/><path class="mv-bandeira" d="M75 14h22l-6 7 6 7H75z" fill="#e5484d"/></svg>`
];
function metaVariante(m){const k=semente(m)+((S.dias&&S.dias[hojeStr()]&&S.dias[hojeStr()].q)||0)%3;return {msg:MOTIVA_META[k%MOTIVA_META.length](m),anim:META_ANIM[(k>>>2)%META_ANIM.length]()}}
function mostrarMeta(){const m=metaDia();const v=metaVariante(m);
 const velho=document.querySelector(".festa");if(velho)velho.remove();
 const el=document.createElement("div");el.className="festa motiva meta-festa";el.dataset.acao="festa-fechar";el.setAttribute("role","dialog");el.setAttribute("aria-label",v.msg[0]);
 el.innerHTML=`<canvas aria-hidden="true"></canvas><div class="festa-card"><span class="mt-selo">Meta diária</span>${v.anim}<h2>${esc(v.msg[0])}</h2><p class="frase">${esc(v.msg[1])}</p><p class="mv-info">Sua sequência e o histórico estão em Metas e desempenho.</p><div class="botoes"><button class="botao cheio" data-acao="festa-fechar">Continuar</button><button class="botao" data-acao="meta-ver">Ver minhas metas</button></div></div>`;
 document.body.appendChild(el);if(animOn())confete(el.querySelector("canvas"));som("meta");syncVoltar();anunciar(v.msg[0])}
function metaBanner(){const m=metaDia();const q=((S.dias||{})[hojeStr()]||{}).q||0;if(q<m)return "";const v=metaVariante(m);
 return `<section class="motiva-banner meta" aria-label="Meta de hoje cumprida">${v.anim}<div><b>${esc(v.msg[0])}</b><p>${esc(v.msg[1])}</p><small>Meta de hoje: ${q} de ${nQ(m)}</small></div></section>`}

/* ---------- modo avançado: provas da faculdade ----------
   Cada prova = uma matéria da faculdade + uma ou mais datas (P1, P2, substitutiva…).
   O app mede o preparo de cada uma (questões feitas, acerto e leitura da apostila) e
   distribui o estudo até cada data, dando prioridade à prova mais próxima e menos preparada. */
const ROTULOS_PROVA=["N1","N2","Substitutiva (por falta)","Exame final","Trabalho","Outra"];
const avOn=()=>!!(S.cfg&&S.cfg.av);
const provasFac=()=>((S.cfg&&S.cfg.provasFac)||[]).filter(x=>DISC[x.d]);
const diasAte=dt=>Math.round((inicioDia(new Date(dt+"T12:00:00").getTime())-inicioDia())/864e5);
const dataCurta=dt=>{const d=new Date(dt+"T12:00:00");return new Intl.DateTimeFormat("pt-BR",{weekday:"short",day:"numeric",month:"short"}).format(d).replace(/\./g,"")};
const quandoTxt=n=>n===0?"é hoje":n===1?"amanhã":n<0?"já passou":`em ${n} dias`;
function etapaProva(n){return n===0?{k:"hoje",nome:"Dia da prova",txt:"Revisão leve: resumo e as questões que você errou. Nada de conteúdo novo."}
 :n<=3?{k:"reta",nome:"Reta final",txt:"Refaça as erradas e leia o resumo. Questões novas só para manter o ritmo."}
 :n<=14?{k:"treino",nome:"Treino",txt:"Muitas questões e revisão dos pontos fracos. Termine a leitura dos temas que faltam."}
 :{k:"base",nome:"Base",txt:"Leia os temas da apostila com calma e fixe com os cartões. Questões em ritmo leve."}}
/* ---------- o que cai em cada prova: a N1 vai até um tema da apostila e a N2 segue dali em diante ----------
   Sem escolha da pessoa, a matéria é dividida ao meio. Quem tem N2 cumulativa marca "a N2 cai a matéria toda".
   Substitutiva, exame final, trabalho e outras provas cobram a matéria inteira.
   Cada questão entra no tema da apostila que mais fala do seu assunto (palavras do assunto, do enunciado e do comentário). */
const PARA_TEMA=new Set("para pela pelo pelos pelas como mais quando entre sobre seus suas qual quais deve pode podem esta este essa esse isso aquele ainda apenas cada outro outra outros outras mesmo muito sendo sera serao foram fica ficar caso contra desde depois antes onde tambem porque assim todo toda todos todas nunca sempre segundo conforme alternativa correta incorreta afirmar afirmativa assinale".split(" "));
const raizesTema=t=>semAcento(t).split(/[^a-z0-9]+/).filter(x=>x.length>=4&&!PARA_TEMA.has(x)).map(x=>x.replace(/(oes|aes|ais|eis|es|s)$/,""));
const TEMA_ASS={};
function temaDoAss(d){const P=paginas(d);if(TEMA_ASS[d]&&TEMA_ASS[d].P===P)return TEMA_ASS[d].m;
 const TF=P.secs.map(s=>{const m={};raizesTema(s.corpo).forEach(k=>m[k]=(m[k]||0)+1);raizesTema(s.tit).forEach(k=>m[k]=(m[k]||0)+8);let tot=0;for(const k in m)tot+=m[k];return {m,tot}});
 const N=TF.length,df={};TF.forEach(x=>Object.keys(x.m).forEach(k=>df[k]=(df[k]||0)+1));
 const G={};idsDisc(d).forEach(id=>{const q=QMAP[id];if(q)(G[q.a]=G[q.a]||[]).push(q)});const m={};
 Object.keys(G).forEach(a=>{const Pf={};const add=(s,w)=>raizesTema(s).forEach(k=>Pf[k]=(Pf[k]||0)+w);add(a,6);G[a].forEach(q=>{add(q.q,1);add(q.o[0],1);add(q.e||"",1)});
  let best=0,bs=-1;TF.forEach((x,k)=>{let sc=0;for(const t in Pf){if(x.m[t])sc+=Math.min(Pf[t],6)*Math.log(1+x.m[t])*Math.log(1+N/df[t])}sc/=Math.sqrt(1+x.tot/400);if(sc>bs){bs=sc;best=k}});m[a]=best+1});
 return (TEMA_ASS[d]={P,m}).m}
const temaDaQ=(d,id)=>{const q=QMAP[id];return q?temaDoAss(d)[q.a]||0:0};
const temOk=d=>{const i=periodoDe(d);return i>=0&&apOk(i)&&!!window.APOSTILA[i].mat[d]};
/* a apostila chega sob demanda: quando faltar, carrega e redesenha a tela das provas */
const AP_PV={};
function apDaProva(d){const i=periodoDe(d);if(i<0||apOk(i)||AP_PV[i])return;AP_PV[i]=1;carregarApP(i).then(ok=>{if(ok)reRenderSe("hoje","metas","config","pre")})}
function divisaoProva(p){if(!temOk(p.d)){apDaProva(p.d);return null}const N=paginas(p.d).secs.length;if(N<2)return null;
 const meio=Math.ceil(N/2),esc1=p.corte>=1&&p.corte<N;return {N,corte:esc1?+p.corte:meio,meio,auto:!esc1,n2tudo:!!p.n2tudo}}
/* faixa de temas que a prova cobra; null = a matéria toda */
function faixaProva(p,r){const D=divisaoProva(p);if(!D)return null;
 if(r==="N1")return {ini:1,fim:D.corte,N:D.N,r};if(r==="N2"&&!D.n2tudo)return {ini:D.corte+1,fim:D.N,N:D.N,r};return null}
const idsFaixa=(d,a,b)=>idsDisc(d).filter(id=>{const k=temaDaQ(d,id);return k>=a&&k<=b});
const CACHE_FX={};
function blocosFaixa(d,a,b){if(!temOk(d))return [];const k=d+":"+a+"-"+b,P=paginas(d);if(CACHE_FX[k]&&CACHE_FX[k].P===P)return CACHE_FX[k].b;
 return (CACHE_FX[k]={P,b:fatias(porNivel(idsFaixa(d,a,b),"fx-"+k),TAM_FAC)}).b}
function proxSimFaixa(d,fx){const B=blocosFaixa(d,fx.ini,fx.fim);for(let i=0;i<B.length;i++){const k=`faixa:${d}:${fx.ini}-${fx.fim}:${i}`;if(livreSim(k))return k}return null}
/* simulado da prova: só os temas que caem nela, ou a matéria toda */
const simDaProva=x=>x.fx?proxSimFaixa(x.p.d,x.fx):proxSimDisc(x.p.d);
const txtFaixa=fx=>fx.ini===fx.fim?`tema ${fx.ini}`:`temas ${fx.ini} a ${fx.fim}`;
function estadoProva(p){const datas=(p.datas||[]).map(x=>({...x,n:diasAte(x.dt)})).sort((a,b)=>a.n-b.n);const prox=datas.find(x=>x.n>=0)||null;
 const fx=prox?faixaProva(p,prox.r):null;const tudo=idsDisc(p.d);let ids=fx?tudo.filter(id=>{const k=temaDaQ(p.d,id);return k>=fx.ini&&k<=fx.fim}):tudo;if(!ids.length)ids=tudo;
 let o=0,e=0,hoje=0,ult=0;const h0=inicioDia();
 ids.forEach(id=>{const s=S.stats[id];if(!s)return;if(s.u)o++;else e++;if(s.t&&s.t>=h0)hoje++;if(s.t>ult)ult=s.t});
 const feitas=o+e,n=ids.length;const i=periodoDe(p.d);let temas=0,lidos=0;
 if(i>=0&&apOk(i)&&window.APOSTILA[i].mat[p.d]){const vis=(S.apPg&&S.apPg[p.d])||0;const lidaToda=!!(S.lidos&&S.lidos[p.d]);
  if(fx){temas=fx.fim-fx.ini+1;lidos=lidaToda?temas:Math.max(0,Math.min(temas,vis-fx.ini+1))}
  else{temas=paginas(p.d).secs.length;lidos=lidaToda?temas:Math.min(temas,vis)}}
 else if(S.lidos&&S.lidos[p.d]){temas=1;lidos=1}
 const cob=n?feitas/n:0,ac=feitas?o/feitas:0,lei=temas?lidos/temas:0;
 const preparo=Math.round(100*(.35*cob+.35*(feitas>=5?ac:ac*feitas/5)+.30*lei));
 let alvo=0;if(prox){const falta=Math.max(0,n-feitas)+e;alvo=prox.n===0?Math.min(10,Math.max(e,5)):Math.min(40,Math.max(5,Math.ceil(falta/Math.max(1,prox.n))))}
 if(alvo)alvo=Math.max(3,Math.round(alvo*fatorRitmo()));
 const urg=prox?(100-preparo+10)/(prox.n+1):0;
 return {p,ids,n,o,e,feitas,hoje,ult,acerto:feitas?Math.round(ac*100):null,temas,lidos,preparo,datas,prox,fx,alvo,urg,etapa:prox?etapaProva(prox.n):null}}
function provasAtivas(){return provasFac().map(estadoProva).filter(x=>x.prox).sort((a,b)=>b.urg-a.urg)}
function proxSimDisc(d){const n=nFac(d);for(let i=0;i<n;i++){const k=`fac:${d}:${i}`;if(livreSim(k))return k}return null}
/* ---------- notas no formato Afya Unigranrio ----------
   N1 + N2 somam até 100 pontos. Com 70 ou mais, aprovação direta. De 40 a 69,9 a pessoa
   vai para o exame final (toda a matéria, de 0 a 100) e passa se (N1 + N2 + exame) ÷ 2 for 50 ou mais.
   Abaixo de 40, reprovação. A substitutiva é só para quem faltou: entra no lugar da N1 ou da N2 que ficou sem nota. */
const NOTA_REGRA={dir:70,ex:40,fim:50};
const notasOn=()=>!!(S.cfg&&S.cfg.notas);
const fmtNota=v=>(Math.round(v*10)/10).toLocaleString("pt-BR");
function situacaoNotas(p){const N=p.notas||{};const le=k=>N[k]===""||N[k]==null||isNaN(+N[k])?null:+N[k];
 const v1=le("v1")||50,v2=le("v2")||(100-v1>0?100-v1:50);const lim=(x,m)=>x===null?null:Math.max(0,Math.min(m,x));
 let n1=lim(le("n1"),v1),n2=lim(le("n2"),v2),sub=le("sub"),ex=lim(le("ex"),100),usouSub=null;
 if(sub!==null){if(n1===null){n1=lim(sub,v1);usouSub="N1"}else if(n2===null){n2=lim(sub,v2);usouSub="N2"}}
 const R=NOTA_REGRA,base={n1,n2,ex,v1,v2,usouSub,ignorouSub:sub!==null&&!usouSub};
 if(n1===null&&n2===null)return {...base,est:"vazio",soma:null};
 if(n1===null||n2===null){const tem=n1!==null?n1:n2,falta=n1!==null?"N2":"N1",max=n1!==null?v2:v1;const pDir=R.dir-tem,pEx=R.ex-tem;
  if(pDir<=0)return {...base,est:"aprovado",soma:tem,titulo:"Aprovação garantida",msg:`Você já somou ${fmtNota(tem)} pontos. Mesmo com zero na ${falta}, passa direto. Agora é estudar para aprender de verdade.`};
  if(pDir<=max)return {...base,est:"parcial",soma:tem,falta:pDir,titulo:`Mire em ${fmtNota(pDir)} na ${falta}`,msg:`Com ${fmtNota(tem)} pontos até aqui, você precisa de ${fmtNota(pDir)} de ${fmtNota(max)} na ${falta} para passar direto (70). ${pEx>0?`Com ${fmtNota(pEx)} já garante o exame final.`:"O exame final já está garantido como rede de segurança."}`};
  if(pEx<=max)return {...base,est:"parcial",soma:tem,falta:pEx,titulo:`Mire em ${fmtNota(pEx)} na ${falta}`,msg:`A ${falta} vale ${fmtNota(max)}, então os 70 direto ficaram fora de alcance. Com ${fmtNota(pEx)} você chega aos 40 e ganha a chance do exame final. Dá para virar.`};
  return {...base,est:"parcial",soma:tem,titulo:`Capriche na ${falta}`,msg:`Nem a nota máxima na ${falta} leva aos 40. Converse com a coordenação sobre as opções e use a ${falta} para aprender o máximo.`}}
 const soma=n1+n2;
 if(soma>=R.dir)return {...base,est:"aprovado",soma,titulo:"Aprovado direto!",msg:`N1 + N2 = ${fmtNota(soma)} pontos. Passou sem exame final. Parabéns, o esforço valeu.`};
 if(soma<R.ex)return {...base,est:"reprovado",soma,titulo:"Abaixo de 40",msg:`N1 + N2 = ${fmtNota(soma)} pontos, menos que os 40 do exame final. Confira com a coordenação e use o app para chegar mais forte na próxima vez.`};
 const preciso=Math.max(0,2*R.fim-soma);
 if(ex===null)return {...base,est:"exame",soma,falta:preciso,titulo:`Exame final: precisa de ${fmtNota(preciso)}`,msg:`N1 + N2 = ${fmtNota(soma)} pontos. No exame final (toda a matéria, de 0 a 100) você precisa de ${fmtNota(preciso)} para a média (soma + exame) ÷ 2 chegar a 50.`};
 const media=(soma+ex)/2;
 return media>=R.fim?{...base,est:"aprovado",soma,media,titulo:"Aprovado no exame final!",msg:`Média final ${fmtNota(media)} (${fmtNota(soma)} + ${fmtNota(ex)}) ÷ 2. Você virou o jogo.`}
  :{...base,est:"reprovado",soma,media,titulo:`Média final ${fmtNota(media)}`,msg:`Faltaram ${fmtNota(R.fim-media)} pontos na média. Procure a coordenação e não desanime: cada questão que você faz aqui conta para a próxima.`}}
/* régua de 0 a 100 com as marcas do exame (40) e da aprovação direta (70) */
function resultadoNotas(p){const s=situacaoNotas(p);const id="pv-res-"+p.id;
 if(s.est==="vazio")return `<div class="pv-res vazio" id="${id}"><p>Lance as notas quando saírem. O app mostra quanto falta para passar.</p></div>`;
 const pct=Math.max(0,Math.min(100,s.soma));const st={aprovado:"ok",exame:"ex",parcial:"pa",reprovado:"rp"}[s.est];
 return `<div class="pv-res ${st}" id="${id}" role="status">
  <div class="pv-regua" role="img" aria-label="N1 mais N2: ${fmtNota(s.soma)} de 100 pontos. Exame final a partir de 40, aprovação direta com 70."><i class="pv-regua-v" style="width:${pct}%"></i><i class="pv-marca" style="left:40%"><span>40</span></i><i class="pv-marca m70" style="left:70%"><span>70</span></i>${s.falta&&s.est==="parcial"?`<i class="pv-alvo" style="left:${Math.min(100,pct+s.falta)}%"></i>`:""}</div>
  <div class="pv-res-t">${s.est==="aprovado"?`<span class="pv-selo" aria-hidden="true">${ic("ok")}</span>`:""}<div><b>${esc(s.titulo)}</b><p>${esc(s.msg)}</p>${s.usouSub?`<small>A substitutiva entrou no lugar da ${s.usouSub}.</small>`:""}${s.ignorouSub?`<small>A substitutiva só vale para quem faltou à N1 ou à N2. Como as duas têm nota, ela não entrou na conta.</small>`:""}</div></div></div>`}
function blocoNotas(p){const N=p.notas||{};const s=situacaoNotas(p);const camp=(k,rot,max,dica)=>`<label class="pv-nt"><span>${rot}</span><input type="text" inputmode="decimal" autocomplete="off" placeholder="—" value="${N[k]==null?"":esc(fmtNota(N[k]))}" data-nota="${k}" data-id="${p.id}" aria-label="${rot} de ${esc(infoDisc(p.d).nome)}"><small>${dica}</small></label>`;
 return `<details class="pv-notas"${N.n1!=null||N.n2!=null||N.sub!=null?" open":""}><summary>${ic("alvo")} Notas e média</summary>
  <div class="pv-nts">${camp("n1","N1",s.v1,`de ${fmtNota(s.v1)}`)}${camp("n2","N2",s.v2,`de ${fmtNota(s.v2)}`)}${camp("sub","Substitutiva",Math.max(s.v1,s.v2),"se faltou")}${camp("ex","Exame final",100,"de 100")}</div>
  ${resultadoNotas(p)}
  <p class="pv-vale">Quanto vale cada prova: N1 <input type="number" inputmode="decimal" min="1" max="99" step="1" value="${fmtNota(s.v1).replace(",",".")}" data-nota="v1" data-id="${p.id}" aria-label="Pontos da N1"> · N2 <input type="number" inputmode="decimal" min="1" max="99" step="1" value="${fmtNota(s.v2).replace(",",".")}" data-nota="v2" data-id="${p.id}" aria-label="Pontos da N2"> <small>(somam 100)</small></p></details>`}
/* cartão de uma prova (Hoje e Metas) */
function cartaoProva(x,completo){const f=infoDisc(x.p.d);const urg=x.prox&&x.prox.n<=3;const k=simDaProva(x);const alvo=x.alvoHoje===undefined?x.alvo:x.alvoHoje;const ok=x.hoje>=alvo&&alvo>0;
 return `<article class="pv${urg?" pv-urg":""}${x.prox?"":" pv-passou"}" style="--c:${f.cor}">
  <div class="pv-topo">${tile(f.cor,f.ic)}<div style="min-width:0"><b>${esc(nomeCurto(f.nome))}</b><span class="pv-quando">${x.prox?`${esc(x.prox.r||"Prova")} ${quandoTxt(x.prox.n)} · ${dataCurta(x.prox.dt)}`:"Todas as datas já passaram"}</span>${x.fx?`<span class="pv-faixa">${ic("livro")}Cai: ${txtFaixa(x.fx)} de ${x.fx.N}</span>`:""}</div>
   <div class="pv-anel">${anel(x.preparo,100,`Preparo de ${x.preparo}%`)}<span><b>${x.preparo}%</b><small>preparo</small></span></div></div>
  ${x.prox&&x.prox.n<=99?`<div class="pv-contagem" aria-hidden="true">${String(Math.max(0,x.prox.n)).padStart(2,"0").split("").map((c,i)=>`<span style="--i:${i}">${c}</span>`).join("")}<em>${x.prox.n===1?"dia":"dias"}</em></div>`:""}
  ${x.etapa?`<p class="pv-etapa"><span class="pv-chip ${x.etapa.k}">${x.etapa.nome}</span>${esc(x.etapa.txt)}${/exame final/i.test(x.prox.r||"")?" O exame final cobre toda a matéria.":""}</p>`:""}
  ${!completo&&x.prox&&notasOn()?(()=>{const s=situacaoNotas(x.p);return s.est==="parcial"||s.est==="exame"?`<p class="pv-meta-nota">${ic("alvo")} ${esc(s.titulo)}</p>`:""})():""}
  ${completo?`<div class="pv-barras">
   <div><span>Questões feitas</span><b>${x.feitas} de ${x.n}</b><i class="pv-bar"><i style="width:${x.n?x.feitas*100/x.n:0}%"></i></i></div>
   <div><span>Acerto</span><b>${x.acerto===null?"—":x.acerto+"%"}</b><i class="pv-bar ok"><i style="width:${x.acerto||0}%"></i></i></div>
   <div><span>Leitura da apostila</span><b>${x.temas?`${x.lidos} de ${x.temas} temas`:"—"}</b><i class="pv-bar lei"><i style="width:${x.temas?x.lidos*100/x.temas:0}%"></i></i></div></div>
   ${notasOn()&&situacaoNotas(x.p).est!=="vazio"?resultadoNotas({...x.p,id:x.p.id+"-m"}):""}
   ${x.datas.length>1?`<ol class="pv-datas">${x.datas.map(dd=>`<li class="${dd.n<0?"passou":dd.n===0?"hoje":""}"><b>${esc(dd.r||"Prova")}</b> ${dataCurta(dd.dt)} <small>${quandoTxt(dd.n)}</small></li>`).join("")}</ol>`:""}`:""}
  ${x.prox?`<div class="pv-acoes"><button class="botao cheio pv-ir" data-acao="${k?"abrir":"disc"}" ${k?`data-key="${k}"`:`data-d="${x.p.d}"`}>${ok?`${ic("ok")} Meta da prova feita · treinar mais`:!alvo?"Descansa hoje no rodízio · treinar mesmo assim":`Hoje: ${alvo} ${alvo===1?"questão":"questões"}${x.hoje?` (${x.hoje} feita${x.hoje>1?"s":""})`:""}`}</button>${completo?`<button class="botao pv-sec" data-acao="disc" data-d="${x.p.d}">Estudar a matéria</button>`:""}<button class="botao pv-sec pv-mp" data-mp="abrir" data-d="${x.p.d}" data-r="${mpRDaProva(x)}">${ic("relogio")} Modo prova${x.prox.r==="N1"||x.prox.r==="N2"?` da ${esc(x.prox.r)}`:""}</button></div>`:""}
 </article>`}
function blocoProvasHoje(P){if(!avOn())return "";const L=P?P.L:provasAtivas();
 if(!L.length)return `<div class="secao" role="heading" aria-level="2">Suas provas</div><button class="card pv-vazio" data-acao="ir-raiz" data-tela="config">${tile("var(--lacre)","calendario")}<b>Cadastre suas provas da faculdade</b><small>Escolha a matéria e o dia de cada prova. O plano de hoje passa a se organizar por elas.</small></button>`;
 return `<div class="secao-linha"><div class="secao" role="heading" aria-level="2">Suas provas</div><span class="contador">${L.length} pela frente</span></div>
  <p class="nota" style="margin-top:0">Em ordem de prioridade: a mais próxima e menos preparada vem primeiro.</p><div class="pv-lista">${L.slice(0,3).map(x=>cartaoProva(x,false)).join("")}</div>`}
/* ---------- plano das provas: quais provas entram no estudo de hoje ----------
   Cada ritmo tem "vagas" por dia (leve 1, automático e moderado 2, intenso 3). Se as provas cabem nas vagas,
   todas entram todo dia. Se não cabem, o app reveza: simula os próximos dias dando a cada prova um crédito
   que cresce com a falta de preparo e com a proximidade da data; a cada dia entram as de maior crédito
   (e o crédito delas zera). Prova em até 2 dias entra sempre. A primeira que ficou de fora entra "um pouco",
   só com algumas questões, para a matéria não esfriar. A escolha de hoje fica guardada até virar o dia. */
const vagasProvas=()=>({leve:1,intenso:3}[S.cfg&&S.cfg.ritmo]||2);
const siglaDisc=d=>d.charAt(0).toUpperCase()+d.slice(1);
function planoProvas(){if(!avOn())return null;const L=provasAtivas();if(!L.length)return null;
 const K=vagasProvas(),H=Math.min(60,Math.max(...L.map(x=>x.prox.n))+1),h0=inicioDia();
 const sig=L.map(x=>x.p.id+"@"+x.prox.dt).sort().join(",")+"|"+K;const memo=S.planoPv&&S.planoPv.dia===hojeStr()&&S.planoPv.sig===sig?S.planoPv:null;
 const cred={};L.forEach(x=>{const sem=x.ult?Math.round((h0-inicioDia(x.ult))/864e5):7;cred[x.p.id]=Math.min(7,Math.max(0,sem))*.15});
 const D=[];
 for(let t=0;t<H;t++){const V=L.filter(x=>x.prox.n>=t);if(!V.length){D.push({t,ch:[],leve:[],provas:[]});continue}
  V.forEach(x=>{cred[x.p.id]+=(110-x.preparo)/100*(1+3/(x.prox.n-t+1))});
  let ch,leve;
  if(t===0&&memo){ch=V.filter(x=>memo.ch.includes(x.p.id));leve=V.filter(x=>memo.leve.includes(x.p.id))}
  else{const obrig=V.filter(x=>x.prox.n-t<=2);const resto=V.filter(x=>!obrig.includes(x)).sort((a,b)=>cred[b.p.id]-cred[a.p.id]||a.prox.n-b.prox.n);
   ch=obrig.concat(resto).slice(0,Math.max(K,obrig.length));leve=V.filter(x=>!ch.includes(x)).sort((a,b)=>cred[b.p.id]-cred[a.p.id]).slice(0,1)}
  ch.forEach(x=>cred[x.p.id]=0);leve.forEach(x=>cred[x.p.id]/=2);
  D.push({t,ch:ch.map(x=>x.p.id),leve:leve.map(x=>x.p.id),provas:V.filter(x=>x.prox.n===t).map(x=>x.p.id)})}
 if(!memo)S.planoPv={dia:hojeStr(),sig,ch:D[0].ch,leve:D[0].leve};
 /* com rodízio, cada prova estuda menos dias: as questões e os temas de cada dia sobem na mesma proporção */
 L.forEach(x=>{const dias=D.slice(0,x.prox.n+1).filter(d=>d.ch.includes(x.p.id)).length;x.diasEst=Math.max(1,dias);
  x.modo=D[0].ch.includes(x.p.id)?"cheio":D[0].leve.includes(x.p.id)?"leve":"";
  x.alvoHoje=x.modo==="cheio"?Math.min(40,Math.max(x.alvo,Math.ceil(x.alvo*(x.prox.n+1)/x.diasEst))):x.modo==="leve"?Math.min(5,x.alvo):0;
  x.temasDia=x.temas>x.lidos?Math.ceil((x.temas-x.lidos)/Math.max(1,x.diasEst-(D[x.prox.n]&&D[x.prox.n].ch.includes(x.p.id)?1:0))):0});
 const hoje=L.filter(x=>x.modo==="cheio").sort((a,b)=>a.prox.n-b.prox.n||b.urg-a.urg);
 return {L,K,D,hoje,leve:L.filter(x=>x.modo==="leve"),fora:L.filter(x=>!x.modo)}}
/* meta diária: soma as questões das provas que entram hoje, sem baixar da meta normal */
function metaProvas(){const P=planoProvas();return P?Math.min(100,P.L.reduce((s,x)=>s+(x.prox.n<=21?x.alvoHoje:0),0)):0}
const listaE=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+" e "+a[a.length-1];
const leuHoje=d=>!!(S.apT&&S.apT[d]===hojeStr());
function cartoesHojeDisc(d){const i=periodoDe(d);if(i<0||!apOk(i))return null;const x=infoDeck(d);if(!x.cs.length)return null;const h0=inicioDia();
 const fez=x.cs.some(c=>{const s=estC(c.id);return s&&s.t>=h0});return {...x,fez,ok:!x.venc&&(fez||!x.novos)}}
/* bloco de uma prova no plano de hoje: questões, cartões e leitura da mesma matéria */
function grupoProva(x){const f=infoDisc(x.p.d),d=x.p.d,nome=esc(nomeCurto(f.nome)),k=simDaProva(x),n=x.prox.n,rot=esc(x.prox.r||"Prova");
 const pz=n===0?`${rot} é hoje`:`${rot} ${quandoTxt(n)}`;let h="";
 h+=itemPlano(x.hoje>=x.alvoHoje,k?"abrir":"disc",k?`data-key="${k}"`:`data-d="${d}"`,f.cor,"alvo",`Questões: ${Math.min(x.hoje,x.alvoHoje)} de ${x.alvoHoje}`,n===0?"Só para aquecer: nada de conteúdo novo hoje":x.diasEst<n+1?`Você estuda ${nome} em ${x.diasEst} dos ${n+1} dias até a ${rot}, então hoje rende mais`:x.fx?`Só dos ${txtFaixa(x.fx)}, que caem na ${rot}`:"Todo dia um pouco: você chega com a matéria inteira treinada");
 const C=cartoesHojeDisc(d);
 if(C&&n>0)h+=itemPlano(C.ok,"cards-disc",`data-d="${d}"`,"var(--lacre)","cartas",C.venc?`Cartões para revisar: ${C.venc}`:C.novos&&!C.fez?`Cartões novos: ${Math.min(C.novos,novosFase())}`:"Cartões da matéria",C.venc?"Chegaram no dia de revisão. Depois vêm os novos":C.fez?"Você já revisou cartões desta matéria hoje":C.novos?`Perguntas da apostila de ${nome} · fixam o que você leu`:"Todos em dia. Volte quando chegarem na revisão",!C.venc&&!C.novos&&!C.fez);
 if(n<=3){const i=periodoDe(d);if(i>=0)h+=itemPlano(false,"resumo",`data-p="${i}"`,f.cor,"recibo",`Ler o resumo de ${nome}`,n===0?"Uma passada leve no essencial antes de sair de casa":"Reta final: revise o essencial em vez de conteúdo novo")}
 else{const t=x.fx?proximoTemaFaixa(d,x.fx):proximoTema([d]);const lido=leuHoje(d);
  if(t)h+=itemPlano(lido,"abrir-tema",`data-d="${t.d}" data-k="${t.pg}"`,f.cor,"livro",`Ler: ${esc(t.tit)}`,`Tema ${t.pg} de ${x.fx?x.fx.N:x.temas||"?"}${lido?" · você já leu hoje, continue se quiser":x.temasDia>1?` · ${x.temasDia} temas por dia para terminar antes da ${rot}`:" · da apostila desta matéria"}`);
  else if(x.temas)h+=itemPlano(true,"ap",`data-p="${periodoDe(d)}"`,"var(--ok)","livro",x.fx?`Temas da ${rot} lidos`:"Apostila lida até o fim","Agora é treinar com questões e cartões")}
 const fr=n<=14?(x.fx?fracoDaFaixa(d,x.fx):assuntoMaisFraco([d])):null;
 if(fr)h+=itemPlano(false,"treinar-ass",`data-sc="${fr.sc}" data-a="${esc(encodeURIComponent(fr.a))}"`,"var(--erro)","exc",`Ponto fraco: ${esc(fr.a)}`,`${fr.pct}% de acerto em ${fr.v} questões`);
 return `<div class="lista plano-lista pp-grupo" style="--c:${f.cor}"><div class="pp-cab">${tile(f.cor,f.ic)}<div style="min-width:0"><b>${nome}</b><small><span class="pv-chip ${x.etapa.k}">${x.etapa.nome}</span>${pz} · ${dataCurta(x.prox.dt)}${x.fx?` · ${txtFaixa(x.fx)}`:""}</small></div><span class="pp-prep" title="Preparo">${x.preparo}%</span></div>${h}</div>`}
/* agenda dos próximos dias: mostra como o app reveza as provas */
function agendaPP(P){const nd=Math.min(7,P.D.length);const sel=Math.min(nd-1,rota.ppDia||0);const M={};P.L.forEach(x=>M[x.p.id]=x);
 const fmt=new Intl.DateTimeFormat("pt-BR",{weekday:"short"});
 const dias=P.D.slice(0,nd).map(d=>{const dt=new Date(inicioDia()+d.t*864e5+12*36e5);
  const bolas=d.ch.map(id=>`<i class="pp-bola" style="--c:${infoDisc(M[id].p.d).cor}">${siglaDisc(M[id].p.d)}</i>`).join("")+d.leve.map(id=>`<i class="pp-bola leve" style="--c:${infoDisc(M[id].p.d).cor}">${siglaDisc(M[id].p.d)}</i>`).join("");
  return `<button class="pp-dia${d.t===0?" hoje":""}${d.provas.length?" tem-prova":""}" data-acao="pp-dia" data-v="${d.t}" aria-pressed="${d.t===sel}" style="--i:${d.t}"><span class="pp-dsem">${d.t===0?"hoje":d.t===1?"amanhã":fmt.format(dt).replace(".","")}</span><span class="pp-dnum">${dt.getDate()}</span><span class="pp-bolas">${bolas||`<i class="pp-folga">livre</i>`}</span>${d.provas.length?`<span class="pp-flag">${ic("alvo")}prova</span>`:""}</button>`}).join("");
 const d=P.D[sel];const nm=id=>nomeCurto(infoDisc(M[id].p.d).nome);
 const det=d.provas.length?`Dia de ${listaE(d.provas.map(id=>`${M[id].prox.r||"prova"} de ${nm(id)}`))}. Boa prova!`+(d.ch.filter(id=>!d.provas.includes(id)).length?` Depois, ${listaE(d.ch.filter(id=>!d.provas.includes(id)).map(nm))}.`:""):
  d.ch.length?`${d.t===0?"Hoje":d.t===1?"Amanhã":"Neste dia"}: ${listaE(d.ch.map(nm))} com tudo${d.leve.length?`, e ${listaE(d.leve.map(nm))} só um pouco`:""}.`:"Sem prova pela frente neste dia: só as matérias do período.";
 return `<div class="pp-agenda" role="group" aria-label="Como o app reparte as provas nos próximos dias">${dias}</div><p class="pp-det" aria-live="polite">${esc(det)}</p>`}
function explicaPP(P){const n=P.L.length,K=P.K,nm=x=>nomeCurto(infoDisc(x.p.d).nome);const r=ritmoAtual()[1].toLowerCase();
 if(n===1)return `Com uma prova só pela frente, ela vem primeiro todos os dias. Depois, as outras matérias do período.`;
 if(!P.fora.length&&!P.leve.length)return `Com ${n} provas pela frente, dá para estudar ${n===2?"as duas":"todas"} hoje. A mais próxima vem primeiro e, depois, as outras matérias do período.`;
 return `Com ${n} provas, estudar tudo todo dia cansa e rende pouco. No ritmo ${r} cabem ${K} por dia, então o app reveza: hoje ${listaE(P.hoje.map(nm))} com tudo${P.leve.length?`, ${listaE(P.leve.map(nm))} só um pouco`:""}, e ${P.fora.length===1?"a outra volta":"as outras voltam"} nos próximos dias. Prova a 2 dias ou menos entra sempre.`}
function itensProvaLeve(x){const f=infoDisc(x.p.d),k=simDaProva(x);
 return itemPlano(x.hoje>=x.alvoHoje,k?"abrir":"disc",k?`data-key="${k}"`:`data-d="${x.p.d}"`,f.cor,"alvo",`Um pouco de ${esc(nomeCurto(f.nome))}: ${x.alvoHoje} questões`,`${esc(x.prox.r||"Prova")} ${quandoTxt(x.prox.n)} · só para a matéria não esfriar`)}
/* Configurações: cadastro das provas */
/* configuração "o que cai em cada prova": trilha com os temas da apostila e um marcador que se arrasta entre a N1 e a N2 */
function resumoDiv(p,D){return D.n2tudo?`N1 até o tema ${D.corte} · N2 cai a matéria toda`:`N1: temas 1 a ${D.corte} · N2: temas ${D.corte+1} a ${D.N}`+(D.auto?" · metade automática":"")}
function ladosDiv(p,D){const P=paginas(p.d),t=k=>esc(limpo(P.secs[k-1].tit));const q1=idsFaixa(p.d,1,D.corte).length,q2=D.n2tudo?idsDisc(p.d).length:idsFaixa(p.d,D.corte+1,D.N).length;
 const lado=(cls,tag,a,b,q,extra)=>`<div class="dv-lado ${cls}"><span class="dv-tag">${tag}</span><b>${a===b?`Tema ${a}`:`Temas ${a} a ${b}`}${extra||""}</b><small>${t(a)}${a===b?"":` → ${t(b)}`}</small><small class="dv-q">${ic("alvo")}${q} ${q===1?"questão":"questões"} para treinar</small></div>`;
 return lado("n1","N1",1,D.corte,q1)+(D.n2tudo?lado("n2 tudo","N2",1,D.N,q2," · a matéria toda"):lado("n2","N2",D.corte+1,D.N,q2))}
function blocoDivisao(p){if(!(p.datas||[]).some(x=>x.r==="N1"||x.r==="N2"))return "";
 const D=divisaoProva(p);if(!D)return temOk(p.d)?"":`<p class="nota dv-carrega">${ic("livro")} Carregando os temas da apostila…</p>`;
 const P=paginas(p.d),nome=esc(nomeCurto(infoDisc(p.d).nome)),novo=rota.abreDv===p.id?"":" dv-novo";
 const corte=`<li class="dv-corte" aria-hidden="true"><span>${ic("tesoura")}Aqui termina a N1 · daqui para baixo é N2</span></li>`;
 return `<details class="dv" id="dv-${p.id}"${rota.abreDv===p.id?" open":""}><summary>${ic("livro")}<span><b>O que cai na N1 e na N2</b><small class="dv-res">${resumoDiv(p,D)}</small></span></summary>
  <div class="dv-in${D.n2tudo?" n2tudo":""}${novo}" style="--n:${D.N};--k:${D.corte}">
   <p class="nota dv-dica">Cada bloco é um tema da apostila de ${nome}. <b>Arraste a bolinha</b> na barra ou <b>toque no tema</b> em que a N1 termina. O resto fica para a N2.${D.auto?" Por enquanto, o app dividiu a matéria ao meio.":""}</p>
   <div class="dv-barra">
    <span class="dv-segs" aria-hidden="true">${P.secs.map((_,k)=>`<i class="${k+1<=D.corte?"n1":""}" style="--i:${k}"></i>`).join("")}</span>
    <input type="range" class="dv-range" min="0" max="${D.N}" step="1" value="${D.corte}" data-corte="${p.id}" aria-label="A N1 de ${nome} vai até o tema" aria-valuetext="A N1 vai até o tema ${D.corte}: ${esc(limpo(P.secs[D.corte-1].tit))}">
    <span class="dv-alca" aria-hidden="true">${ic("setas")}</span>
   </div>
   <div class="dv-rot" aria-hidden="true"><b class="n1">N1</b><b class="n2">${D.n2tudo?"N2 = tudo":"N2"}</b></div>
   <ol class="dv-lista">${P.secs.map((x,k)=>`<li><button class="dv-tema${k+1<=D.corte?" n1":""}" style="--i:${k}" data-acao="dv-tema" data-id="${p.id}" data-k="${k+1}" aria-label="Tema ${k+1}: ${esc(limpo(x.tit))}. Toque para a N1 ir até aqui"><span class="dv-num">${k+1}</span><span class="dv-tit">${esc(limpo(x.tit))}</span><span class="dv-qual"></span></button></li>${k+1===D.corte?corte:""}`).join("")}</ol>
   <div class="dv-lados" id="dv-lados-${p.id}">${ladosDiv(p,D)}</div>
   <div class="chave dv-cum"><p><b>A N2 cai a matéria toda</b><small>Ligue se o professor faz a N2 cumulativa, com tudo desde o tema 1</small></p>
    <label class="switch"><input type="checkbox" data-n2tudo="${p.id}" ${D.n2tudo?"checked":""} aria-label="A N2 de ${nome} cai a matéria toda"><span></span></label></div>
   <div class="dv-rodape">${D.auto?`<span class="dv-auto">${ic("ok")} Metade automática</span>`:`<button class="botao linha dv-meio" data-acao="dv-meio" data-id="${p.id}">Voltar para a metade</button>`}
    <span class="nota">O app treina só os temas da prova que vem. Substitutiva e exame final cobram tudo.</span></div>
  </div></details>`}
/* arrastar a bolinha: pinta a barra e a lista na hora e salva quando a pessoa solta */
function corteVivo(el,salva){const p=(S.cfg.provasFac||[]).find(x=>x.id===el.dataset.corte);if(!p)return;const N=+el.max;const v=Math.max(1,Math.min(N-1,+el.value));if(+el.value!==v)el.value=v;
 const box=el.closest(".dv-in");box.style.setProperty("--k",v);box.querySelectorAll(".dv-segs i").forEach((b,k)=>b.classList.toggle("n1",k<v));
 const T=[...box.querySelectorAll(".dv-tema")];T.forEach((b,k)=>b.classList.toggle("n1",k<v));const c=box.querySelector(".dv-corte");if(c&&T[v-1])T[v-1].parentNode.after(c);
 const ant=p.corte;p.corte=v===Math.ceil(N/2)&&!p.corte?undefined:v;const D=divisaoProva(p);if(!D){p.corte=ant;return}
 el.setAttribute("aria-valuetext",`A N1 vai até o tema ${v}: ${limpo(paginas(p.d).secs[v-1].tit)}`);
 const L=document.getElementById("dv-lados-"+p.id);if(L&&ant!==p.corte)L.innerHTML=ladosDiv(p,D);
 const r=el.closest(".dv").querySelector(".dv-res");if(r)r.textContent=resumoDiv(p,D);
 if(ant!==p.corte&&!salva){som("toque");if(c&&animOn()){c.classList.remove("pula");void c.offsetWidth;c.classList.add("pula")}}
 if(salva){salvar();rota.abreDv=p.id;rota.manterScroll=true;render();anunciar(`N1 até o tema ${v}`)}}
function blocoProvasConfig(destaque){const on=avOn();const L=provasFac();const per=perAtual();
 const opts=PERIODOS.slice(0,9).map((ds,i)=>`<optgroup label="${i+1}º período">${ds.map(d=>`<option value="${d}"${per===i&&d===PERIODOS[i][0]?" selected":""}>${esc(infoDisc(d).nome)}</option>`).join("")}</optgroup>`).join("");
 return `<section id="sec-av" class="av-sec${destaque&&!on?" av-destaque":""}${rota.abreAv?" av-abre":""}"><div class="secao" role="heading" aria-level="2">Modo avançado: provas da faculdade</div>
 <p class="nota" style="margin-top:0">Cadastre cada prova com a matéria e o dia (pode ter mais de um, como N1 e N2). O app mede seu preparo em cada uma e monta o plano de hoje para chegar bem em todas.</p>
 <div class="opcoes"><button data-acao="av-modo" data-v="0" aria-pressed="${!on}">Desligado</button><button data-acao="av-modo" data-v="1" aria-pressed="${on}">Ligado</button></div>
 ${on?`<div class="pv-notas-tg"><b>Notas e média</b><span class="nota">Opcional. Lance N1, N2, substitutiva e exame final para o app calcular quanto falta para passar.</span>
  <div class="opcoes"><button data-acao="av-notas" data-v="0" aria-pressed="${!notasOn()}">Desligado</button><button data-acao="av-notas" data-v="1" aria-pressed="${notasOn()}">Ligado</button></div></div>`:""}
 ${on?`<div class="pv-config">${L.length?L.map(p=>{const f=infoDisc(p.d);const ds=(p.datas||[]).slice().sort((a,b)=>a.dt.localeCompare(b.dt));
   return `<div class="pv-cfg${rota.novaProva===p.id?" pv-nova":""}" style="--c:${f.cor}">${tile(f.cor,f.ic)}<div class="pv-cfg-in"><b>${esc(f.nome)}</b>
    <ul class="pv-chips">${ds.map(dd=>`<li${rota.novaData===p.id+dd.dt?' class="pv-chip-novo"':""}><svg class="pv-ok" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9"/><path d="M5.5 10.4l3 3 6-6.3"/></svg><span>${esc(dd.r||"Prova")} · ${dataCurta(dd.dt)}</span><button class="icone mini" data-acao="av-del-data" data-id="${p.id}" data-dt="${dd.dt}" data-r="${esc(dd.r||"")}" aria-label="Remover a data ${dataCurta(dd.dt)}">${ic("x")}</button></li>`).join("")}</ul>
    <details class="pv-mais"${rota.abreData===p.id?" open":""}><summary>${ic("mais")} Outra prova desta matéria</summary><div class="pv-add-data"><input type="date" id="av-dt-${p.id}" aria-label="Outra data para ${esc(f.nome)}"><select id="av-r-${p.id}" aria-label="Tipo da prova">${(()=>{const sug=ROTULOS_PROVA.find(r=>!ds.some(dd=>dd.r===r))||"Outra";return ROTULOS_PROVA.map(r=>`<option${r===sug?" selected":""}>${r}</option>`).join("")})()}</select><button class="botao" data-acao="av-add-data" data-id="${p.id}">${ic("mais")} Adicionar data</button></div></details>${notasOn()?blocoNotas(p):""}</div>
    <button class="icone pv-del" data-acao="av-del" data-id="${p.id}" aria-label="Remover a prova de ${esc(f.nome)}">${ic("x")}</button>${blocoDivisao(p)}</div>`}).join(""):`<p class="nota">Nenhuma prova cadastrada ainda.</p>`}
  <div class="pv-form"><b>Adicionar prova</b>
   <label class="campo"><span>Matéria</span><select id="av-d">${opts}</select></label>
   <div class="pv-form-l"><label class="campo"><span>Dia</span><input type="date" id="av-dt"></label><label class="campo"><span>Tipo</span><select id="av-r">${ROTULOS_PROVA.map(r=>`<option>${r}</option>`).join("")}</select></label></div>
   <button class="botao cheio" data-acao="av-add">${ic("mais")} Adicionar prova</button><p class="nota pv-erro" id="av-erro" role="alert"></p></div>
  <details class="pv-como"><summary>Como o app organiza o estudo</summary><ul>
   <li><b>Preparo</b> de cada prova = questões feitas da matéria (35%), seu acerto nelas (35%) e temas lidos na apostila (30%).</li>
   <li><b>Prioridade</b>: quanto mais perto a prova e menor o preparo, mais ela aparece no plano de hoje.</li>
   <li><b>Questões por dia</b>: o que falta resolver (mais as erradas) dividido pelos dias até a prova. A meta diária soma as provas das próximas 3 semanas.</li>
   <li><b>Notas (Afya Unigranrio, opcional)</b>: N1 + N2 somam até 100. Com 70 ou mais, aprovação direta. De 40 a 69,9, exame final (toda a matéria), e passa quem tiver (N1 + N2 + exame) ÷ 2 de 50 ou mais. A substitutiva é para quem faltou e entra no lugar da N1 ou da N2 sem nota. Confira sempre o manual do aluno da sua unidade.</li>
   <li><b>O que cai em cada prova</b>: a N1 cobre os primeiros temas da apostila e a N2 o resto. O app começa dividindo a matéria ao meio, e você ajusta em cada matéria (ou liga a N2 cumulativa). Substitutiva e exame final cobram a matéria toda.</li>
   <li><b>Etapas</b>: base (mais de 14 dias), treino (até 14), reta final (até 3) e dia da prova. Cada etapa muda o tipo de tarefa sugerida.</li></ul></details></div>`:""}</section>`}
/* ---------- dias de estudo, metas e prova ---------- */
const hojeStr=t=>{const d=t?new Date(t):new Date();return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate())};
const inicioDia=t=>{const d=new Date(t||Date.now());d.setHours(0,0,0,0);return d.getTime()};
const temAtiv=x=>!!x&&((x.q||0)+(x.c||0)+(x.p||0)+(x.f||0))>0;
function marcarDia(campo,n){S.dias=S.dias||{};const k=hojeStr();const x=S.dias[k]=S.dias[k]||{q:0,c:0,p:0};const antes=x.q||0;if(!temAtiv(x))ofensivaNova=true;x[campo]=(x[campo]||0)+(n||1);
 if(campo==="q"){const m=metaDia();if(antes<m&&x.q>=m)metaNova=true}
 const ks=Object.keys(S.dias).sort();if(ks.length>400)ks.slice(0,ks.length-400).forEach(z=>delete S.dias[z])}
function sequencia(){const D=S.dias||{};let n=0;const d=new Date();if(!temAtiv(D[hojeStr(d)]))d.setDate(d.getDate()-1);while(temAtiv(D[hojeStr(d.getTime())])){n++;d.setDate(d.getDate()-1)}return n}
/* configurações do estudante: período atual, data da prova (opcional) e ritmo */
function perAtual(){const p=S.cfg&&S.cfg.per;return (p===undefined||p===null||p==="")?null:+p}
function diasProva(){const p=S.cfg&&S.cfg.prova;if(!p)return null;const t=new Date(p+"T12:00:00").getTime();if(isNaN(t))return null;return Math.ceil((inicioDia(t)-inicioDia())/864e5)}
function fase(){const f=diasProva();if(f===null)return "livre";if(f<0)return "passou";if(f<=30)return "reta";if(f<=120)return "revisao";return "base"}
const FASES={
 livre:{nome:"Sem data de prova",txt:"Ritmo constante: leia a apostila do seu período, faça os cartões e treine questões todos os dias.",meta:20,novos:10},
 base:{nome:"Fase de base",txt:"Ainda há tempo. Priorize entender a matéria lendo as apostilas e fixe com os cartões.",meta:20,novos:15},
 revisao:{nome:"Fase de revisão",txt:"Hora de treinar mais questões e atacar as matérias em que você mais erra.",meta:40,novos:10},
 reta:{nome:"Reta final",txt:"Simulados completos, revisão dos erros e resumos. Evite começar conteúdo novo e pesado.",meta:60,novos:5},
 passou:{nome:"A data da prova já passou",txt:"Atualize a data nas Configurações ou escolha estudar sem data definida.",meta:20,novos:10}};
/* ritmo de estudo até a prova: multiplica a meta automática, as questões das provas da faculdade e os cartões novos */
const RITMOS=[["auto","Automático","O app decide: mais leve longe da prova e mais forte perto dela.",1,-60],["leve","Leve","Para semanas puxadas de trabalho. Cerca de 40% menos questões e cartões novos.",.6,-55],["moderado","Moderado","Passo firme e constante, um pouco abaixo do automático.",.85,0],["intenso","Intenso","Para quem tem tempo e quer acelerar. Cerca de 40% a mais.",1.4,55]];
const ritmoAtual=()=>RITMOS.find(r=>r[0]===(S.cfg&&S.cfg.ritmo))||RITMOS[0];
const fatorRitmo=()=>ritmoAtual()[3];
const metaFase=()=>Math.max(5,Math.round(FASES[fase()].meta*fatorRitmo()));
const novosFase=()=>Math.max(3,Math.round(FASES[fase()].novos*fatorRitmo()));
function metaDia(){const m=S.cfg&&S.cfg.meta;const base=m?+m:metaFase();return Math.max(base,metaProvas())}
/* prova mais próxima para o calendário: a data manual (Configurações) e, com o modo avançado,
   cada data das provas da faculdade. Quando uma passa, entra a seguinte. */
function provaProx(){const L=[];const p=S.cfg&&S.cfg.prova;const n0=diasProva();if(p&&n0!==null)L.push({dt:p,n:n0,nome:"",manual:true});
 if(avOn())provasFac().forEach(x=>(x.datas||[]).forEach(d=>{const n=diasAte(d.dt);if(n>=0)L.push({dt:d.dt,n,nome:`${d.r||"Prova"} de ${nomeCurto(infoDisc(x.d).nome)}`})}));
 const fut=L.filter(x=>x.n>=0).sort((a,b)=>a.n-b.n||(a.manual?-1:1));return fut[0]||L[0]||null}
const textoProva=()=>{const x=provaProx();const f=x?x.n:null;return f===null?"Sem data de prova":f<0?"Data da prova já passou":f===0?`${x.nome||"A prova"} é hoje`:`${f} dia${f>1?"s":""} para ${x.nome?"a "+x.nome:"a prova"}`};
const nomePer=p=>p===null?"Período não definido":p===9?"Foco no Exame de Ordem":`${p+1}º período`;
function discsDaMateria(m){return Object.keys(DISC).filter(d=>d!=="rev"&&(DISC[d].base===m||(DISC[d].m&&DISC[d].m.length===1&&DISC[d].m[0]===m)||(!DISC[d].base&&d===m)))}
function materiaMaisFraca(){let pior=null,pp=101;OAB.forEach(m=>{const s=statMat(porM[m]||[]);if(s.v<5)return;const p=Math.round(s.o*100/s.v);if(p<pp){pp=p;pior=m}});
 if(pior)return {m:pior,pct:pp};const nao=DIST.find(([m])=>statMat(porM[m]||[]).v===0);return nao?{m:nao[0],pct:null}:{m:"etica",pct:null}}
const livreSim=k=>{const s=sim(k);if(!s||!s.qids.length)return false;const st=estado(k).st;return st==="nao"||st==="pausa"};
function proxOab(){for(let i=0;i<N_SIM;i++)if(estado("oab:"+i).st==="pausa")return "oab:"+i;for(let i=0;i<N_SIM;i++)if(estado("oab:"+i).st==="nao")return "oab:"+i;return null}
function simSugerido(){const per=perAtual(),fs=fase();
 if((per===9||per===null)&&fs==="reta"){const k=proxOab();if(k)return {key:k,tit:`Simulado OAB ${p2(+k.split(":")[1]+1)} completo`,sub:"80 questões, como no dia da prova"}}
 if(per===null||per===9){const w=materiaMaisFraca();const n=nMat(w.m);for(let i=0;i<n;i++){const k=`mat:${w.m}:${i}`;if(livreSim(k))return {key:k,tit:`Simulado de ${META[w.m].nome}`,sub:w.pct===null?"Matéria que você ainda não treinou":`Sua matéria mais fraca (${w.pct}% de acerto)`}}
  const k=proxOab();if(k)return {key:k,tit:`Simulado OAB ${p2(+k.split(":")[1]+1)}`,sub:"Prova completa de 80 questões"};return null}
 for(const d of PERIODOS[per]){const n=nFac(d);for(let i=0;i<n;i++){const k=`fac:${d}:${i}`;if(livreSim(k))return {key:k,tit:`${nomeCurto(infoDisc(d).nome)}: simulado ${i+1}`,sub:`Próximo simulado do ${per+1}º período`}}}
 const n=nPer(per);for(let i=0;i<n;i++){const k=`per:${per}:${i}`;if(livreSim(k))return {key:k,tit:`Simulado do ${per+1}º período`,sub:"Mistura todas as matérias do período"}}
 return null}
function discsFoco(){const per=perAtual();if(per===null)return [];if(per===9)return discsDaMateria(materiaMaisFraca().m);return PERIODOS[per].slice()}
function proximoTema(ds){for(const d of ds){const i=periodoDe(d);if(i<0||!apOk(i))continue;const A=window.APOSTILA[i];if(!(A.mat&&A.mat[d])||(S.lidos&&S.lidos[d]))continue;
  const P=paginas(d);if(!P.secs.length)continue;const pg=Math.min(((S.apPg&&S.apPg[d])||0)+1,P.secs.length);return {d,pg,tit:P.secs[pg-1].tit}}return null}
/* próximo tema dentro da faixa da prova: começa no primeiro tema dela que ainda não foi lido */
function proximoTemaFaixa(d,fx){if(!temOk(d)||(S.lidos&&S.lidos[d]))return null;const P=paginas(d);const pg=Math.max(fx.ini,((S.apPg&&S.apPg[d])||0)+1);
 return pg<=fx.fim&&P.secs[pg-1]?{d,pg,tit:P.secs[pg-1].tit}:null}
function fracoDaFaixa(d,fx){const g={};idsFaixa(d,fx.ini,fx.fim).forEach(id=>{const q=QMAP[id],s=S.stats[id];if(!s)return;const k=grupoDe(q);const x=g[k]=g[k]||{a:k,o:0,e:0};if(s.u)x.o++;else x.e++});
 const L=Object.values(g).map(x=>({a:x.a,v:x.o+x.e,pct:Math.round(x.o*100/(x.o+x.e))})).filter(ehFraco).sort((a,b)=>a.pct-b.pct||b.v-a.v);return L[0]?{sc:d,...L[0]}:null}
function novosDoFoco(ds){let n=0;ds.forEach(d=>{const i=periodoDe(d);if(i>=0&&apOk(i))cartoesDe(d).forEach(c=>{if(!estC(c.id))n++})});return Math.min(n,novosFase())}
function blocoRitmo(){const r=ritmoAtual();const m=S.cfg&&S.cfg.meta;
 return `<div class="secao" role="heading" aria-level="2">Ritmo de estudo até a prova</div>
 <div class="ritmo"><svg class="rt-vel" viewBox="0 0 120 70" aria-hidden="true"><path class="rt-arco" d="M12 62a48 48 0 0 1 96 0"/><path class="rt-z rt-z1" d="M12 62a48 48 0 0 1 14-34"/><path class="rt-z rt-z2" d="M30 22a48 48 0 0 1 60 0"/><path class="rt-z rt-z3" d="M94 28a48 48 0 0 1 14 34"/><g class="rt-ag" style="transform:rotate(${r[0]==="auto"?({base:-35,revisao:10,reta:50}[fase()]||-20):r[4]}deg)"><path d="M60 62L57 60 60 20 63 60z"/></g><circle cx="60" cy="62" r="6" class="rt-eixo"/></svg>
  <div class="rt-txt"><b>${r[1]}</b><p>${r[2]}</p><small>Hoje isso dá <b>${metaDia()} questões</b>${m?" (sua meta fixa)":""}${avOn()&&metaProvas()?`, sendo ${metaProvas()} para as provas da faculdade,`:""} e até <b>${novosFase()} cartões novos</b>.</small></div></div>
 <div class="opcoes ritmos">${RITMOS.map(([k,n])=>`<button data-acao="cfg-ritmo" data-v="${k}" aria-pressed="${r[0]===k}">${n}</button>`).join("")}</div>
 <p class="nota">O ritmo vale para a meta automática, para os cartões novos e para as questões de cada prova da faculdade no modo avançado.${m?" Como você fixou a meta diária abaixo, ela continua valendo; volte para Automática para o ritmo ajustar as questões também.":""}</p>`}
/* ---------- lembretes no celular (Web Push) ----------
   Uma vez por dia, num horário-surpresa entre 9h e 21h, o servidor (Netlify Functions) escolhe um recado.
   Ele não conhece o progresso: o app manda só o fuso, o último dia com estudo, a ofensiva, as questões desse dia,
   a meta e as próximas provas. */
const LB_API="/api/lembretes";
let lbStatus="",lbUlt="",tLb=null,lbTeste="";
const lbCfg=()=>({on:!!(S.cfg&&S.cfg.notif&&S.cfg.notif.on)});
const lbIos=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)&&!(window.navigator.standalone||(window.matchMedia&&matchMedia("(display-mode: standalone)").matches));
function lbSuporte(){if("serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window)return "";return lbIos()?"ios":"sem-suporte"}
function lbEstado(){const D=S.dias||{};const ks=Object.keys(D).filter(k=>temAtiv(D[k])).sort();const ult=ks[ks.length-1]||"";const L=[];
 const p=S.cfg&&S.cfg.prova;if(p&&diasAte(p)>=0)L.push({dt:p,nome:"a 1ª fase da OAB"});
 if(avOn())provasFac().forEach(x=>(x.datas||[]).forEach(d=>{if(diasAte(d.dt)>=0)L.push({dt:d.dt,nome:`${d.r||"prova"} de ${nomeCurto(infoDisc(x.d).nome)}`})}));
 return {ult,seq:sequencia(),q:ult?(D[ult].q||0):0,meta:metaDia(),provas:L.sort((a,b)=>a.dt<b.dt?-1:a.dt>b.dt?1:0).slice(0,20)}}
function lbChave(b64){const pad="=".repeat((4-b64.length%4)%4);const r=atob((b64+pad).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(r,c=>c.charCodeAt(0))}
async function lbInscricao(criar){const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
 if(!sub&&criar){let k;try{const r=await fetch(LB_API,{cache:"no-store"});k=r.ok&&(await r.json()).publicKey}catch(e){}if(!k)throw new Error("sem-servidor");
  sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:lbChave(k)})}
 return sub}
async function lbEnviar(acao,forcar){const c=lbCfg();if(!c.on)return;const sub=await lbInscricao(false);if(!sub)return;
 let tz="America/Sao_Paulo";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||tz}catch(e){}
 const corpo=JSON.stringify({acao,sub:sub.toJSON(),tz,estado:lbEstado()});
 if(acao==="salvar"&&!forcar&&corpo===lbUlt)return;
 const r=await fetch(LB_API,{method:"POST",headers:{"content-type":"application/json"},body:corpo,keepalive:corpo.length<60000});
 if(!r.ok)throw new Error(r.status===410?"inscricao":"servidor");if(acao==="salvar")lbUlt=corpo}
/* chamado a cada salvar(): manda o estado novo alguns segundos depois, só se mudou */
function lbAgendar(){if(!lbCfg().on)return;clearTimeout(tLb);tLb=setTimeout(()=>lbEnviar("salvar").catch(()=>{}),3000)}
function lbGuardar(o){S.cfg=S.cfg||{};S.cfg.notif=Object.assign(lbCfg(),o);salvar()}
async function lbLigar(){const sup=lbSuporte();if(sup){lbStatus=sup;rota.manterScroll=true;render();return}
 let perm=Notification.permission;if(perm==="default"){try{perm=await Notification.requestPermission()}catch(e){perm="denied"}}
 if(perm!=="granted"){lbStatus="negado";rota.manterScroll=true;render();return}
 lbStatus="ligando";rota.manterScroll=true;render();
 try{await lbInscricao(true);lbGuardar({on:true});await lbEnviar("salvar",true);lbStatus="";
  rota.manterScroll=true;render();const el=document.querySelector(".lb-card");if(el&&animOn()){el.classList.add("lb-novo");estouro(el.querySelector(".lb-sino"),["#ffc53d","#ff8a1f","#3bb273","#ffffff"])}
  anunciar("Lembretes ligados");lbTestar(true)}
 catch(e){lbGuardar({on:false});lbStatus=e.message==="sem-servidor"?"sem-servidor":"erro";rota.manterScroll=true;render()}}
async function lbDesligar(){lbGuardar({on:false});lbStatus="";lbTeste="";rota.manterScroll=true;render();anunciar("Lembretes desligados");
 try{const sub=await lbInscricao(false);if(sub){const endpoint=sub.endpoint;await sub.unsubscribe();await fetch(LB_API,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({acao:"remover",endpoint})})}}catch(e){}}
async function lbTestar(boasVindas){lbTeste=boasVindas?"":"enviando";if(!boasVindas){rota.manterScroll=true;render()}
 try{await lbEnviar("teste");lbTeste=boasVindas?"":"ok"}catch(e){lbTeste=e.message==="inscricao"?"inscricao":"erro";if(lbTeste==="inscricao")lbGuardar({on:false})}rota.manterScroll=true;render()}
const LB_AVISOS={
 "sem-suporte":"Este navegador não aceita lembretes. No Android, use o Chrome; no computador, Chrome, Edge ou Firefox.",
 ios:"No iPhone, os lembretes só funcionam com o app instalado: toque em Compartilhar, depois em Adicionar à Tela de Início, e abra o Facul Lab pelo ícone.",
 negado:"As notificações estão bloqueadas para o Facul Lab. Libere nas configurações do navegador (toque no cadeado ao lado do endereço, depois em Notificações) e tente de novo.",
 "sem-servidor":"Os lembretes precisam do servidor do app, que fica no endereço simuladolab8.netlify.app. Abra o Facul Lab por lá (e instale na tela inicial) para ativar.",
 erro:"Não deu para ativar agora. Confira a internet e tente de novo em instantes.",
 ligando:"Preparando seus lembretes…"};
const LB_TESTE={enviando:"Enviando um lembrete de exemplo…",ok:"Lembrete enviado! Confira a barra de notificações do aparelho.",erro:"O teste não saiu. Confira a internet e tente de novo.",inscricao:"Este aparelho perdeu a inscrição. Ligue os lembretes de novo."};
const LB_SINO=`<svg class="lb-sino" viewBox="0 0 64 64" aria-hidden="true"><g class="lb-ondas"><path d="M10 26a22 22 0 0 1 7-13"/><path d="M54 26a22 22 0 0 0-7-13"/></g><g class="lb-corpo"><path d="M32 7a4 4 0 0 1 4 4v1.6c7 1.8 11 7.8 11 15v9.4l5 7H12l5-7v-9.4c0-7.2 4-13.2 11-15V11a4 4 0 0 1 4-4z"/><circle class="lb-badalo" cx="32" cy="50" r="5" stroke="none"/></g><text class="lb-zz" x="46" y="14">z</text><text class="lb-zz" x="53" y="7" style="animation-delay:.6s">z</text></svg>`;
/* exemplos que giram no cartão: o mesmo tipo de recado que chega no celular */
const LB_EXEMPLOS=[["chama","#ff8a1f","Não perca seu foguinho!","Uma questão hoje mantém a chama acesa."],["alvo","#e5484d","Faltam 6 questões para a meta","Termine e veja a comemoração!"],["calendario","#4b3f99","A N1 é daqui a 3 dias","Reta final: questões e revisão das erradas."],["cartas","#2a9d6a","Uma pausa que vale ponto","Vire uns cartões entre uma tarefa e outra."],["livro","#d9922c","Uma palavra para os seus estudos","“Tudo posso naquele que me fortalece.” (Filipenses 4:13)"]];
const lbExemplos=()=>`<div class="lb-exemplos" aria-hidden="true">${LB_EXEMPLOS.map(([i,c,t,d],k)=>`<div class="lb-ex" style="--k:${k}"><span class="lb-ex-ic" style="background:${c}">${ic(i)}</span><span><b>${t}</b><small>${d}</small></span></div>`).join("")}</div>`;
function blocoLembretes(){const on=lbCfg().on;
 const tit=on?"Lembretes ligados":"Quer uma ajudinha para não esquecer?";
 const txt=on?"Uma vez por dia, num horário-surpresa entre 9h e 21h, o Facul Lab te chama, mesmo com o app fechado: a ofensiva, a meta, a prova chegando, uma motivação ou um versículo para os estudos.":"Ative os lembretes e o app te chama uma vez por dia, num horário-surpresa, com recados e ilustrações diferentes: ofensiva, meta, provas chegando, motivação e versículos.";
 return `<div class="secao" role="heading" aria-level="2">Lembretes no celular</div>
 <div class="lb-card ${on?"lb-on":"lb-off"}">${LB_SINO}<div class="lb-txt"><b>${tit}</b><p>${txt}</p></div></div>
 ${lbExemplos()}
 <div class="cores">${[["1","Ligados","Um recado por dia","sino"],["0","Desligados","Nenhuma notificação","pausa"]].map(([k,n,d,i])=>`<button data-acao="notif" data-v="${k}" aria-pressed="${(on?"1":"0")===k}"${lbStatus==="ligando"?" disabled":""}><span class="ico-op">${ic(i)}</span><span>${n}<small>${d}</small></span></button>`).join("")}</div>
 ${lbStatus&&LB_AVISOS[lbStatus]?`<p class="lb-aviso" role="status">${LB_AVISOS[lbStatus]}</p>`:""}
 ${on?`<div class="botoes lb-teste"><button class="botao linha" data-acao="notif-teste"${lbTeste==="enviando"?" disabled":""}>${ic("sino")} Ver um exemplo agora</button></div>
  ${lbTeste?`<p class="nota lb-res" role="status">${LB_TESTE[lbTeste]}</p>`:""}`:""}
 <p class="nota">Seu progresso continua só neste aparelho. Para escolher o recado, o app envia ao servidor apenas o último dia em que você estudou, a ofensiva, a meta e as datas das provas.</p>`}
/* convite para ligar os lembretes: na primeira entrada no app (uma vez por aparelho) e,
   se existir, ao fim do tour de boas-vindas, que pode chamar window.lbConvite() */
function lbPodeConvidar(){return !/github\.io$/.test(location.hostname)&&!lbCfg().on&&!lbSuporte()&&window.Notification&&Notification.permission!=="denied"}
function lbConvite(){try{localStorage.setItem("faculLab.lbConvite","1")}catch(e){}if(!lbPodeConvidar()||document.querySelector(".festa"))return false;
 const el=document.createElement("div");el.className="festa lb-convite";el.setAttribute("role","dialog");el.setAttribute("aria-label","Ativar lembretes");
 el.innerHTML=`<div class="festa-card"><div class="lb-card lb-on lb-grande">${LB_SINO}</div><h2>Posso te lembrar de estudar?</h2><p class="frase">Uma vez por dia, num horário-surpresa, um recado diferente: a ofensiva, a meta, a prova chegando, uma motivação ou um versículo. Mesmo com o app fechado.</p>${lbExemplos()}<div class="botoes"><button class="botao cheio" data-acao="lb-convite-sim">Ativar lembretes</button><button class="botao" data-acao="festa-fechar">Agora não</button></div><p class="nota" style="margin:10px 0 0">Dá para mudar quando quiser em Configurações.</p></div>`;
 document.body.appendChild(el);syncVoltar();return true}
window.lbConvite=lbConvite;
function telaConfig(){const per=perAtual();const p=(S.cfg&&S.cfg.prova)||"";const m=(S.cfg&&S.cfg.meta)||0;const f=fase();const mostra=!!p||rota.escolherData||!!rota.tipoData;
 const ambos=per!==null&&per>=8;const tipo=rota.tipoData||(p?(ambos&&avOn()?"ambas":"oab"):(avOn()&&provasFac().length?"fac":null));
 const comOab=tipo==="oab"||tipo==="ambas",comFac=tipo==="fac"||tipo==="ambas";
 return topo("Configurações","Seu período, a prova, as questões e a aparência do app",{menu:true})+
 `<main class="wrap">${capaTela("checklist","Do seu jeito","Período, data da prova, meta diária e a aparência do app.")}
 ${cfgG("estudo","capelo","Meu estudo",`${nomePer(per)} · meta de ${metaDia()} por dia`,`<div class="secao" role="heading" aria-level="2">Em que momento você está?</div>
 <p class="nota" style="margin-top:0">A tela Hoje usa essa escolha para sugerir os temas, os cartões e os simulados certos para você.</p>
 <div class="opcoes">${PERIODOS.slice(0,9).map((_,i)=>`<button data-acao="cfg-per" data-v="${i}" aria-pressed="${per===i}">${i+1}º</button>`).join("")}</div>
 <div class="opcoes" style="margin-top:8px"><button data-acao="cfg-per" data-v="9" aria-pressed="${per===9}">10º período ou formado: foco no Exame de Ordem</button></div>
 <div class="secao" role="heading" aria-level="2">Data da prova</div>
 <div class="opcoes"><button data-acao="cfg-prova" data-v="" aria-pressed="${!mostra}">Sem data definida</button><button data-acao="cfg-prova-data" aria-pressed="${mostra}">Escolher uma data</button></div>
 ${mostra?`<div class="dp-tipo"><p class="nota" style="margin:12px 0 6px"><b>Que prova é essa?</b></p>
  <div class="opcoes"><button data-acao="cfg-tipo-prova" data-v="fac" aria-pressed="${tipo==="fac"}">${ic("livro")} Faculdade</button><button data-acao="cfg-tipo-prova" data-v="oab" aria-pressed="${tipo==="oab"}">${ic("balanca")} OAB</button>${ambos?`<button data-acao="cfg-tipo-prova" data-v="ambas" aria-pressed="${tipo==="ambas"}">${ic("livro")}${ic("balanca")} Faculdade e OAB</button>`:""}</div>
  ${ambos?"":`<p class="nota" style="margin-top:6px">No 9º e no 10º período (ou já formado) dá para definir a OAB e as provas da faculdade juntas.</p>`}</div>
 ${comOab?`<label class="campo dp-campo" style="margin-top:12px"><span>Data da 1ª fase do Exame de Ordem</span><input type="date" id="data-prova" value="${esc(p)}"></label>
 <p class="nota">Previsão divulgada para a 1ª fase do 48º Exame de Ordem: 10 de janeiro de 2027. Confira no edital antes de usar.</p>`:""}
 ${comFac?`<button class="dp-fac" data-acao="ir-avancado">${ic("baixo")}<span><b>${avOn()?"Suas provas da faculdade estão logo abaixo":"Provas da faculdade ficam no modo avançado"}</b><small>${avOn()?"Cadastre cada matéria e o dia de cada prova.":"Logo abaixo. Ligue se quiser cadastrar cada matéria e o dia de cada prova."}</small></span></button>`:""}`:`<p class="nota">Sem data, o app mantém um ritmo constante, sem contagem regressiva.</p>`}
 <p class="nota">Com a data definida, o ritmo muda sozinho: <b>fase de base</b> (mais de 120 dias), <b>revisão</b> (até 120 dias) e <b>reta final</b> (últimos 30 dias).</p>
 ${blocoProvasConfig(comFac)}
 ${blocoRitmo()}
 <div class="secao" role="heading" aria-level="2">Meta diária de questões</div>
 <div class="opcoes"><button data-acao="meta" data-v="0" aria-pressed="${!m}">Automática (${metaFase()})</button>${[10,20,40,80].map(n=>`<button data-acao="meta" data-v="${n}" aria-pressed="${n===m}">${n}</button>`).join("")}</div>
 <p class="nota">Na meta automática, o número de questões aumenta conforme a prova se aproxima.${avOn()&&metaProvas()?` Com o modo avançado, suas provas pedem <b>${metaProvas()} questões por dia</b>; a meta usa o maior dos dois valores.`:""}</p>
 `)}
 ${cfgG("aparencia","engrenagem","Aparência e sons",`${estiloAtual()==="premium"?"Premium":"Clássico"} · ${(TEMAS.find(t=>t[0]===((S.cfg&&S.cfg.tema)||"auto"))||TEMAS[0])[1].toLowerCase()} · animações ${(S.cfg&&S.cfg.anim)==="off"?"desligadas":"ligadas"}`,`<div class="secao" role="heading" aria-level="2">Estilo visual</div>
 <div class="estilos">${ESTILOS.map(([k,n,d])=>`<button data-acao="cfg-estilo" data-v="${k}" aria-pressed="${estiloAtual()===k}"><span class="prev prev-${k}" aria-hidden="true"${prevEstilo(k)}><i></i><i></i><i></i><i></i></span><span><b>${n}</b>${k==="premium"?" <em>Padrão</em>":""}<small>${d}</small></span></button>`).join("")}</div>
 <p class="nota">Os dois estilos funcionam nos modos claro e escuro e mantêm todas as funções.</p>
 ${estiloAtual()==="premium"?`<div class="secao" role="heading" aria-level="2">Paleta do Premium</div>
 <div class="paletas">${coresVisiveis(PALETAS,paletaAtual()).map(([k,n,d,c1,c2])=>`<button data-acao="cfg-paleta" data-v="${k}" aria-pressed="${paletaAtual()===k}"><span class="amostra-g${k==="dinamica"?" din-amostra":""}" style="background:${k==="dinamica"?dinArco("conic"):`linear-gradient(135deg,${c1},${c2})`}"></span><span>${n}${k==="dinamica"?` <em class="din-novo">Novo</em>`:""}<small>${d}</small></span></button>`).join("")}</div>${botaoMaisCores(PALETAS,paletaAtual())}
 ${dinOn()?dinGaleria():`<p class="nota">A primeira cor aparece nos botões, na seleção e no progresso; a segunda só no degradê dos destaques e das ilustrações. As cores das matérias, de acerto e de erro não mudam.</p>`}`:`<div class="secao" role="heading" aria-level="2">Cor do app</div>
 <div class="cores">${coresVisiveis(CORES,corAtual()).map(([k,n,d,hex])=>`<button data-acao="cfg-cor" data-v="${k}" aria-pressed="${corAtual()===k}"><span class="amostra${k==="dinamica"?" din-amostra":""}" style="background:${k==="dinamica"?dinArco("conic"):hex}"></span><span>${n}${k==="dinamica"?` <em class="din-novo">Novo</em>`:""}${d?`<small>${d}</small>`:""}</span></button>`).join("")}</div>${botaoMaisCores(CORES,corAtual())}
 ${dinOn()?dinGaleria():`<p class="nota">No estilo Clássico, a cor pinta a barra do topo e os destaques. Vale nos modos claro e escuro.</p>`}`}
 <div class="secao" role="heading" aria-level="2">Modo claro ou escuro</div>
 <div class="cores tres">${TEMAS.map(([k,n,d,i])=>`<button data-acao="cfg-tema" data-v="${k}" aria-pressed="${((S.cfg&&S.cfg.tema)||"auto")===k}"><span class="ico-op">${ic(i)}</span><span>${n}<small>${d}</small></span></button>`).join("")}</div>
 <div class="secao" role="heading" aria-level="2">Animações</div>
 <div class="cores">${[["on","Ligadas","Movimento nas telas, na chama e nas respostas","chama"],["off","Desligadas","Tudo parado, para foco ou bateria","pausa"]].map(([k,n,d,i])=>`<button data-acao="cfg-anim" data-v="${k}" aria-pressed="${((S.cfg&&S.cfg.anim)||"on")===k}"><span class="ico-op">${ic(i)}</span><span>${n}<small>${d}</small></span></button>`).join("")}</div>
 <p class="nota">Se o sistema estiver com movimento reduzido, o app respeita essa escolha.</p>
 <div class="secao" role="heading" aria-level="2">Sons e vibração</div>
 <div class="cores tres quatro">${SOM_OP.map(([k,n,d,i])=>`<button data-acao="cfg-som" data-v="${k}" aria-pressed="${somModo()===k}"><span class="ico-op">${ic(i)}</span><span>${n}<small>${d}</small></span></button>`).join("")}</div>
 <p class="nota">Os sons seguem o volume de mídia do aparelho, e no iPhone o modo silencioso também os cala. A vibração funciona em celulares Android. Toque em uma opção para ouvir como fica.</p>
 `)}
 ${cfgG("questoes","alvo","Questões",`${(MODOS_Q.find(x=>x[0]===modoQ())||MODOS_Q[0])[1]} · correção ${S.cfg&&S.cfg.corrFinal?"no final":"na hora"}`,`<div class="secao" role="heading" aria-level="2">Como responder as questões</div>
 <div class="cores uma">${MODOS_Q.map(([k,n,d,i])=>`<button data-acao="cfg-modoq" data-v="${k}" aria-pressed="${modoQ()===k}"><span class="ico-op">${ic(i)}</span><span>${n}<small>${esc(d)}</small></span></button>`).join("")}</div>
 <div class="secao" role="heading" aria-level="2">Quando ver a correção</div>
 <div class="cores">${[["0","Na hora","Padrão · comentário logo após responder"],["1","No final","Correção só no resultado"]].map(([k,n,d])=>`<button data-acao="cfg-corr" data-v="${k}" aria-pressed="${(S.cfg&&S.cfg.corrFinal?"1":"0")===k}"><span class="ico-op">${ic(k==="0"?"ok":"relogio")}</span><span>${n}<small>${d}</small></span></button>`).join("")}</div>
 <div class="secao" role="heading" aria-level="2">Setas para passar as questões</div>
 <div class="cores">${[["baixo","Embaixo","Barra fixa no rodapé","baixo"],["acima","Acima","Abaixo das alternativas e da correção","cima"]].map(([k,n,d,i])=>`<button data-acao="cfg-setas" data-v="${k}" aria-pressed="${(setasAcima()?"acima":"baixo")===k}"><span class="ico-op">${ic(i)}</span><span>${n}<small>${d}</small></span></button>`).join("")}</div>
 <p class="nota">Essas escolhas valem para todos os simulados e listas de questões. A correção também pode ser trocada na tela de início de cada simulado.</p>
 `)}
 ${cfgG("dados","carimbo","Lembretes, backup e ajuda",`${lbCfg().on?"Lembretes ligados":"Lembretes desligados"} · ${bkIdade().cls==="nunca"?"nenhum backup ainda":"último backup "+bkIdade().q}`,`${blocoLembretes()}
 <div class="secao" role="heading" aria-level="2">Seu progresso</div>
 ${bkCta()}
 <div class="secao" role="heading" aria-level="2">Ajuda</div>
 ${tourCta()}${instalarCta()}`)}
 <div class="dica" style="margin-top:18px"><p style="margin:0"><b>${esc(nomePer(per))} · ${esc(FASES[f].nome)}.</b> ${esc(FASES[f].txt)}</p></div>
 <div class="botoes"><button class="botao cheio" data-acao="ir-raiz" data-tela="hoje">Ver o plano de hoje</button></div></main>`}
function telaMetas(){const meta=metaDia();const D=S.dias||{};const hoje=D[hojeStr()]||{q:0,c:0,p:0};const seq=sequencia();const falta=diasProva();
 const fmt=new Intl.DateTimeFormat("pt-BR",{weekday:"short"});
 const dias=[];for(let k=6;k>=0;k--){const d=new Date();d.setDate(d.getDate()-k);const x=D[hojeStr(d.getTime())]||{q:0,c:0,p:0};dias.push({r:fmt.format(d).replace(".",""),x,hoje:k===0})}
 const mx=Math.max(meta,...dias.map(z=>z.x.q||0));let ativos=0;Object.keys(D).forEach(k=>{if(temAtiv(D[k]))ativos++});
 const tot7=dias.reduce((s,z)=>s+(z.x.q||0),0);const bateu=dias.filter(z=>(z.x.q||0)>=meta).length;
 /* acerto geral: última resposta de cada questão */
 let o=0,e=0;Object.keys(S.stats||{}).forEach(k=>{if(!QMAP[k])return;if(S.stats[k].u)o++;else e++});const pctG=o+e?Math.round(o*100/(o+e)):null;
 const pm=OAB.concat(["ied","tge","soc","psc","crim","masc"]).map(m=>{const st=statMat(porM[m]||[]);return {m,st,p:st.v?Math.round(st.o*100/st.v):null}}).filter(x=>x.st.v).sort((a,b)=>a.p-b.p);
 const L=[];Object.keys(porM).forEach(m=>fracos(m).forEach(x=>L.push([m,x])));L.sort((a,b)=>a[1].pct-b[1].pct||b[1].v-a[1].v);
 return topo("Metas e desempenho","Sequência, meta diária, acertos e pontos fracos",{menu:true})+
 `<main class="wrap">${metaBanner()}${capaTela("trofeu","Seu progresso","Cada dia de estudo conta. Veja onde você mais acerta e o que treinar.")}
 <div class="hoje-stats">
  <div class="hs hs-meta">${anel(hoje.q||0,meta,`${hoje.q||0} de ${meta} questões hoje`)}<div><b>${hoje.q||0}<small>/${meta}</small></b><span>questões hoje</span></div></div>
  <div class="hs hs-seq">${chamaViva(seq)}<div><b>${seq}</b><span>dia${seq===1?"":"s"} seguido${seq===1?"":"s"}</span></div>${semana()}</div>
  <div class="hs hs-prova">${anel(o,o+e,pctG===null?"Sem questões respondidas":`${pctG}% de acerto`)}<div><b>${pctG===null?"—":pctG+"%"}</b><span>${pctG===null?"responda questões para medir":`de acerto em ${(o+e).toLocaleString("pt-BR")} questões`}</span></div></div>
 </div>
 <p class="nota">Hoje: ${hoje.q||0} questões, ${hoje.c||0} cartões revisados e ${hoje.p||0} temas lidos. Dias com estudo registrados: ${ativos}.</p>
 ${avOn()?(()=>{const T=provasFac().map(estadoProva).sort((a,b)=>(a.prox?a.prox.n:9999)-(b.prox?b.prox.n:9999));
  return `<div class="secao-linha"><div class="secao" role="heading" aria-level="2">Provas da faculdade</div><span class="contador">${T.filter(x=>x.prox).length} pela frente</span></div>
  ${T.length?`<p class="nota" style="margin-top:0">Preparo = questões feitas (35%), acerto (35%) e leitura da apostila (30%). A prova mais próxima vem primeiro.</p><div class="pv-lista">${T.map(x=>cartaoProva(x,true)).join("")}</div>`
  :`<button class="card pv-vazio" data-acao="ir-raiz" data-tela="config">${tile("var(--lacre)","calendario")}<b>Cadastre suas provas</b><small>Em Configurações, no modo avançado, escolha a matéria e o dia de cada prova.</small></button>`}`})():""}
 <button class="card destaque sem-atalho" data-acao="ir-raiz" data-tela="semanal" style="width:100%;margin:18px 0 0">${tile("var(--lacre)","calendario")}<b>Resumo da semana</b><small>Seu cartão de segunda a domingo: o que evoluiu, o que reforçar e uma imagem para compartilhar.</small></button>
 <div class="secao-linha"><div class="secao" role="heading" aria-level="2">Últimos 7 dias</div><span class="contador">${tot7} no total · meta batida em ${bateu} de 7</span></div>
 <figure class="grafico"><div class="barras7" role="img" aria-label="Questões por dia nos últimos 7 dias: ${dias.map(z=>`${z.r} ${z.x.q||0}`).join(", ")}. Meta diária: ${meta}.">${dias.map(z=>`<div${z.hoje?' class="hoje"':""}><b>${z.x.q||0}</b><span class="b7${(z.x.q||0)>=meta?" ok":""}" style="height:${Math.max(3,Math.round((z.x.q||0)*110/mx))}px"></span><small>${z.r}</small></div>`).join("")}<i class="linha-meta" aria-hidden="true" style="bottom:${22+Math.round(meta*110/mx)}px"><span>meta ${meta}</span></i></div></figure>
 <div class="secao" role="heading" aria-level="2">Acerto por matéria</div>
 ${pm.length?`<p class="nota" style="margin-top:0">Da matéria com menor acerto para a maior, considerando a última resposta de cada questão.</p><div class="lista">${pm.map(x=>`<button class="item ass" data-acao="materia" data-m="${x.m}"><span class="ass-l"><span class="item-tit">${esc(META[x.m].nome)}</span><span class="trilho"><i class="f-ok" style="width:${x.st.o*100/x.st.n}%"></i><i class="f-er" style="width:${x.st.e*100/x.st.n}%"></i></span><span class="item-sub">${x.p}% de acerto em ${x.st.v} de ${x.st.n} questões</span></span><span class="item-data">${x.p<50?`<span class="tag-fraco">Abaixo de 50%</span>`:""}${ic("prox")}</span></button>`).join("")}</div>`
  :vazio("barras","Seu desempenho aparece aqui","Responda um simulado ou algumas questões de qualquer matéria. O app mostra o acerto de cada uma e aponta onde vale a pena reforçar.",`<button class="botao cheio" data-acao="ir-raiz" data-tela="hoje">Ver o plano de hoje</button>`)}
 <div class="secao" role="heading" aria-level="2">Seus pontos fracos</div>
 ${L.length?`<p class="nota" style="margin-top:0">Assuntos com menos de 70% de acerto (a partir de 3 questões respondidas). Toque para treinar só aquele assunto.</p><div class="lista">${L.slice(0,6).map(([m,x])=>itemAss(m,x,true)).join("")}</div>`:`<p class="nota" style="margin-top:0">Ainda não há assunto com menos de 70% de acerto. Eles aparecem aqui depois de 3 questões respondidas no mesmo assunto.</p>`}
  <button class="btn-lida" data-acao="ir-raiz" data-tela="config" style="margin-top:18px">${tile("var(--toga)","eng")}<span><b>${esc(nomePer(perAtual()))} · ${esc(textoProva())}</b><small>Meta de ${meta} questões por dia${(S.cfg&&S.cfg.meta)?"":" (automática)"} · toque para alterar nas Configurações</small></span></button></main>`}

