"use strict";
/* ---------- segredos do app (easter eggs) ----------
   Oito segredos: cada um abre uma cena animada com um pouco de Direito. Os encontrados ficam em S.ovos ({id: dia})
   e aparecem em Sobre o Facul Lab, onde dá para rever. Cada descoberta toca um som (se ligado) e dispara o evento "fl-ovo" (detail: {id, novo}).
   Os gatilhos ficam em ouvintes próprios (toques, segurar, teclado, chacoalhar), sem mexer no clique principal. */
const OVOS=[
 {id:"balanca",ic:"balanca",nome:"Equilíbrio da Justiça",dica:"A balança do logo guarda um segredo. Toque nela várias vezes seguidas."},
 {id:"brocardo",ic:"livro",nome:"Brocardo secreto",dica:"A ilustração do Hoje fala latim quando recebe muitos toques rápidos."},
 {id:"martelo",ic:"martelo",nome:"Ordem no tribunal",dica:"Segure o dedo no título de qualquer tela."},
 {id:"chama",ic:"chama",nome:"Chama da Justiça",dica:"Atice a chama da ofensiva cinco vezes seguidas."},
 {id:"sacode",ic:"relogio",nome:"Chacoalhadas da semana",dica:"Chacoalhe o celular. Cada meio dia tem uma cena diferente."},
 {id:"habeas",ic:"escudo",nome:"Habeas corpus",dica:"Descubra as 14 chacoalhadas da semana para libertar a pombinha. No computador, digite habeas."},
 {id:"coruja",ic:"lua",nome:"Coruja da madrugada",dica:"Abra o Hoje entre meia-noite e cinco da manhã."},
 {id:"data",ic:"calendario",nome:"Datas do Direito",dica:"Abra o app numa data marcante do Direito ou da história do Brasil, como 15 de novembro."},
 {id:"fundo",ic:"pasta",nome:"Fim dos autos",dica:"Chegou ao fim de uma tela? Continue puxando para cima, com vontade."}
];
function ovosAchados(){return OVOS.filter(o=>(S.ovos||{})[o.id]).length}
function ovoAchou(id){S.ovos=S.ovos||{};const novo=!S.ovos[id];if(novo){S.ovos[id]=hojeStr();salvar()}
 try{document.dispatchEvent(new CustomEvent("fl-ovo",{detail:{id,novo}}))}catch(e){}return novo}
function ovoCena(id,cls,html,opt){opt=opt||{};const novo=opt.rever?false:ovoAchou(id);
 const velho=document.querySelector(".festa");if(velho)velho.remove();
 const el=document.createElement("div");el.className="festa ovo "+cls;el.dataset.acao="festa-fechar";el.setAttribute("role","dialog");el.setAttribute("aria-label",opt.titulo||"Segredo");
 const n=ovosAchados();
 el.innerHTML=`<canvas aria-hidden="true"></canvas><div class="festa-card"><span class="ovo-selo${novo?" novo":""}">${ic("estrela")} ${novo?"Segredo encontrado!":"Segredo"} · ${n} de ${OVOS.length}</span>${html}</div>`;
 document.body.appendChild(el);
 /* o menu fecha depois que a cena já está na página, para o voltar do celular continuar valendo para ela */
 if(gaveta)fecharGaveta()
 if(opt.confete&&animOn())confete(el.querySelector("canvas"));syncVoltar();ovoSom(novo?"segredo":"abre");return el}
function ovoSom(n){if(typeof som=="function")som(n)}
function ovoSomDepois(n,ms){setTimeout(()=>{if(document.querySelector(".festa.ovo"))ovoSom(n)},ms)}
function ovoConfete(){const c=document.querySelector(".festa.ovo canvas");if(c&&animOn())confete(c)}
const ovoBotoes=(extra)=>`<div class="botoes ovo-bts">${extra||""}<button class="botao${extra?"":" cheio"}" data-acao="festa-fechar">Fechar</button></div>`;

/* 1. Equilíbrio da Justiça: 7 toques na balança do logo (Sobre o Facul Lab ou topo do menu) */
let ovoBal=null;
const OB_SVG=`<svg class="ob-svg" viewBox="0 0 240 190" aria-hidden="true">
 <path class="ob-base" d="M92 182h56l-8-14h-40z"/><rect class="ob-base" x="116" y="40" width="8" height="130" rx="3"/>
 <g class="ob-prato ob-e"><path class="ob-fio" d="M40 40L18 110M40 40L62 110"/><g class="ob-carga"></g><path class="ob-prato-f" d="M10 110h60a30 11 0 0 1-60 0z"/></g>
 <g class="ob-prato ob-d"><path class="ob-fio" d="M200 40l-22 70M200 40l22 70"/><g class="ob-pilha"></g><path class="ob-prato-f" d="M170 110h60a30 11 0 0 1-60 0z"/></g>
 <g class="ob-braco"><rect class="ob-viga" x="28" y="36" width="184" height="8" rx="4"/><circle class="ob-ponta" cx="40" cy="40" r="5"/><circle class="ob-ponta" cx="200" cy="40" r="5"/></g>
 <circle class="ob-pino" cx="120" cy="40" r="10"/><path class="ob-brilho" d="M120 6v10M100 12l5 8M140 12l-5 8"/></svg>`;
function ovoBalanca(rever){ovoBal={L:6+Math.floor(Math.random()*9),R:[]};
 ovoCena("balanca","ovo-bal",`<h2>Equilíbrio da Justiça</h2><p class="frase">O prato da esquerda tem <b>${ovoBal.L} kg</b> de provas. Coloque pesos no da direita até a balança ficar reta.</p>
 <div class="ob-palco">${OB_SVG}</div><p class="ob-msg" aria-live="polite"></p>
 <div class="ob-pesos">${[1,2,3,5].map(p=>`<button class="botao" data-ovo="bal-p" data-v="${p}">${p} kg</button>`).join("")}<button class="botao" data-ovo="bal-tira" aria-label="Tirar o último peso">${ic("refazer")}</button></div>
 <div class="ob-fim" hidden><p class="ovo-nota"><b>Suum cuique tribuere</b>: dar a cada um o que é seu, na definição de justiça de Ulpiano. A balança, símbolo da Justiça, lembra que as duas partes devem ser pesadas com a mesma medida.</p></div>
 ${ovoBotoes(`<button class="botao" data-ovo="bal-de-novo">Jogar de novo</button>`)}`,{rever,titulo:"Equilíbrio da Justiça"});
 ovoBalAtualiza()}
function ovoBalAtualiza(){const el=document.querySelector(".ovo-bal");if(!el||!ovoBal)return;const L=ovoBal.L,R=ovoBal.R.reduce((s,x)=>s+x,0);
 const th=Math.max(-16,Math.min(16,(R-L)*2.4)),rad=th*Math.PI/180,dy=80*Math.sin(rad),dx=80*(1-Math.cos(rad));
 el.querySelector(".ob-braco").style.transform=`rotate(${th}deg)`;
 el.querySelector(".ob-e").style.transform=`translate(${dx}px,${-dy}px)`;el.querySelector(".ob-d").style.transform=`translate(${-dx}px,${dy}px)`;
 el.querySelector(".ob-carga").innerHTML=`<rect x="22" y="${110-26}" width="36" height="26" rx="4"/><text x="40" y="${110-9}">${L} kg</text>`;
 let y=110;el.querySelector(".ob-pilha").innerHTML=ovoBal.R.slice(0,9).map(p=>{const h=6+p*2.4,w=16+p*4;y-=h+1;return `<g class="ob-peso"><rect x="${200-w/2}" y="${y}" width="${w}" height="${h}" rx="2.5"/>${h>=10?`<text x="200" y="${y+h/2+3.4}">${p}</text>`:""}</g>`}).join("");
 const ok=R===L,msg=el.querySelector(".ob-msg");el.classList.toggle("certo",ok);
 msg.className="ob-msg"+(ok?" ok":R>L?" err":"");
 msg.textContent=ok?"Equilíbrio perfeito!":R>L?`Pesou demais: sobram ${R-L} kg. Tire um peso.`:R?`Faltam ${L-R} kg.`:"Toque nos pesos para colocar no prato.";
 el.querySelectorAll('[data-ovo="bal-p"]').forEach(b=>b.disabled=ok);el.querySelector('[data-ovo="bal-tira"]').disabled=ok||!R;
 el.querySelector(".ob-fim").hidden=!ok;if(ok)setTimeout(()=>{ovoConfete();ovoSom("gabarito")},350)}

/* 2. Brocardo secreto: 5 toques rápidos na ilustração do Hoje */
const BROCARDOS=[
 ["In dubio pro reo","Na dúvida, a favor do réu.","Se a prova não basta para condenar, o juiz absolve (art. 386, VII, do CPP)."],
 ["Nullum crimen, nulla poena sine praevia lege","Não há crime nem pena sem lei anterior.","É o princípio da legalidade penal: art. 5º, XXXIX, da CF e art. 1º do Código Penal."],
 ["Pacta sunt servanda","Os pactos devem ser cumpridos.","O contrato faz lei entre as partes, sempre temperado pela boa-fé e pela função social."],
 ["Ne bis in idem","Não duas vezes pela mesma coisa.","Ninguém pode ser processado nem punido duas vezes pelo mesmo fato."],
 ["Dormientibus non succurrit ius","O Direito não socorre aos que dormem.","É a ideia por trás da prescrição e da decadência: quem demora demais perde a chance."],
 ["Iura novit curia","O juiz conhece o Direito.","As partes provam os fatos; aplicar a norma certa é tarefa do juiz."],
 ["Da mihi factum, dabo tibi ius","Dá-me os fatos, e eu te darei o Direito.","Parente do iura novit curia: na petição, o que mais importa é narrar bem os fatos."],
 ["Tempus regit actum","O tempo rege o ato.","O ato segue a lei do seu tempo. No processo, a lei nova vale para os atos seguintes (art. 14 do CPC)."],
 ["Nemo potest venire contra factum proprium","Ninguém pode agir contra o próprio comportamento.","É a proibição do comportamento contraditório, uma das faces da boa-fé objetiva."],
 ["Lex posterior derogat priori","A lei posterior revoga a anterior.","Critério cronológico para resolver conflito de normas (art. 2º, § 1º, da LINDB)."],
 ["Lex specialis derogat generali","A lei especial prevalece sobre a geral.","Critério da especialidade: a regra feita para o caso específico vence a regra geral."],
 ["Nemo tenetur se detegere","Ninguém é obrigado a produzir prova contra si.","Daí o direito ao silêncio do preso e do acusado (art. 5º, LXIII, da CF)."],
 ["Ubi societas, ibi ius","Onde há sociedade, há Direito.","Toda convivência humana precisa de regras: o Direito nasce com a sociedade."],
 ["Ignorantia legis neminem excusat","A ignorância da lei não escusa ninguém.","Ninguém deixa de cumprir a lei alegando que não a conhece (art. 3º da LINDB)."],
 ["Dura lex, sed lex","A lei é dura, mas é a lei.","Mesmo quando severa, a lei vigente deve ser cumprida até ser mudada pelo caminho próprio."],
 ["Accessorium sequitur principale","O acessório segue o principal.","Regra clássica do Direito Civil: o destino do bem acessório acompanha o do principal."],
 ["Res iudicata pro veritate habetur","A coisa julgada é tida como verdade.","Decisão de mérito da qual não cabe mais recurso fica imutável, para dar segurança jurídica."]
];
let ovoBrocI=-1;
function ovoBrocHtml(){let i;do{i=Math.floor(Math.random()*BROCARDOS.length)}while(i===ovoBrocI&&BROCARDOS.length>1);ovoBrocI=i;const b=BROCARDOS[i];
 return `<button class="obr-carta" data-ovo="broc-vira" aria-label="Virar a carta: ${esc(b[0])}"><span class="obr-in"><span class="obr-f"><small>Latim jurídico</small><b>${esc(b[0])}</b><em>Toque para traduzir</em></span><span class="obr-v"><b>${esc(b[1])}</b><span>${esc(b[2])}</span></span></span></button>`}
function ovoBrocardo(rever){ovoCena("brocardo","ovo-broc",`<h2>Brocardo secreto</h2><p class="frase">Os brocardos são frases curtas, quase sempre em latim, que resumem princípios do Direito. Caem em prova e enfeitam qualquer petição.</p><div class="obr-palco">${ovoBrocHtml()}</div>${ovoBotoes(`<button class="botao" data-ovo="broc-outro">Outro brocardo</button>`)}`,{rever,titulo:"Brocardo secreto"});ovoSomDepois("vira",450)}

/* 3. Ordem no tribunal: segurar o título de qualquer tela */
function ovoMartelo(rever){ovoCena("martelo","ovo-mart",`<div class="om-palco" aria-hidden="true"><svg class="om-svg" viewBox="0 0 220 150"><ellipse class="om-sombra" cx="96" cy="136" rx="62" ry="7"/><path class="om-bloco" d="M44 118h104v14a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6z"/><ellipse class="om-bloco-t" cx="96" cy="118" rx="52" ry="7"/><g class="om-onda"><path d="M30 104q-10-12 0-24M162 104q10-12 0-24M18 110q-16-20 0-40M174 110q16-20 0-40"/></g>
 <g class="om-mart"><rect class="om-cabo" x="104" y="54" width="96" height="9" rx="4.5"/><rect class="om-cab" x="62" y="34" width="46" height="50" rx="9"/><rect class="om-faixa" x="62" y="44" width="46" height="6"/><rect class="om-faixa" x="62" y="68" width="46" height="6"/></g></svg><span class="om-carimbo">Ordem!</span></div>
 <h2>Ordem no tribunal!</h2><p class="frase">Silêncio no plenário: agora é hora de estudar.</p><p class="ovo-nota"><b>Curiosidade:</b> o martelo é tradição dos tribunais dos Estados Unidos. No Brasil ele é raro: os tribunais costumam pedir ordem com uma campainha, como a do presidente no plenário do STF.</p>${ovoBotoes(`<button class="botao" data-ovo="mart-bate">Bater de novo</button>`)}`,{rever,titulo:"Ordem no tribunal"});ovoSomDepois("martelo",animOn()?600:80)}

/* 4. Chama da Justiça: 5 toques seguidos na chama da ofensiva. Nos dias de marco, a chama ganha um brilho dourado no Hoje. */
const OVO_MARCOS=[3,7,15,30,50,100,180,365];
function ovoRecorde(){const D=S.dias||{};let best=0,run=0,prev=null;
 Object.keys(D).filter(k=>temAtiv(D[k])).sort().forEach(k=>{const t=new Date(k+"T12:00:00").getTime();run=prev!==null&&Math.round((t-prev)/864e5)===1?run+1:1;prev=t;if(run>best)best=run});
 return Math.max(best,sequencia())}
function ovoChama(rever){const seq=sequencia(),rec=ovoRecorde(),prox=OVO_MARCOS.find(m=>m>seq),marco=OVO_MARCOS.includes(seq);
 const [t,f]=seq===0?["Faísca guardada","A chama está apagada, mas a faísca é você. Uma questão hoje já acende tudo de novo."]:seq>=100?["Lenda da ofensiva",`${seq} dias seguidos. Pouca gente chega aqui: isso já é quem você é.`]:seq>=30?["Fogo de mês inteiro",`${seq} dias seguidos. Estudar virou parte do seu dia, como escovar os dentes.`]:seq>=7?["Semana de fogo",`${seq} dias seguidos. A chama já aguenta vento.`]:["Chama acesa",`${seq} ${seq===1?"dia":"dias seguidos"}. Cada dia de estudo joga mais lenha na fogueira.`];
 ovoCena("chama","ovo-chama"+(marco?" marco":""),`<div class="oc-palco">${chamaViva(seq)}<i></i><i></i><i></i><i></i><i></i><i></i></div>
 <h2>${marco?`Marco de ${seq} dias!`:t}</h2><p class="frase">${esc(f)}</p>
 <div class="oc-nums"><span><b>${seq}</b>agora</span><span><b>${rec}</b>seu recorde</span><span><b>${prox||"∞"}</b>${prox?`próximo marco · faltam ${prox-seq}`:"você passou de todos"}</span></div>
 <p class="ovo-nota"><b>Por que todo dia?</b> A memória fixa melhor o que é revisto aos poucos, em dias diferentes, do que numa maratona na véspera. É o efeito do espaçamento.</p>${ovoBotoes()}`,{rever,titulo:"Chama da Justiça",confete:marco});ovoSomDepois("fogo",300)}

/* 5. Habeas corpus: chacoalhar o celular (ou digitar "habeas" no computador) */
function ovoHabeas(rever){ovoCena("habeas","ovo-hc",`<div class="oh-palco" aria-hidden="true"><svg class="oh-svg" viewBox="0 0 220 160"><g class="oh-gaiola"><path class="oh-arco" d="M60 128V70a50 50 0 0 1 100 0v58"/><path class="oh-barra" d="M80 128V40M100 128V24M120 128V24M140 128V40"/><rect class="oh-aro" x="52" y="126" width="116" height="10" rx="4"/><circle class="oh-aro" cx="110" cy="16" r="6"/><g class="oh-porta"><rect x="60" y="62" width="40" height="64" rx="3"/><path d="M70 62v64M80 62v64M90 62v64"/></g></g>
 <g class="oh-pomba"><g class="oh-voa"><path class="oh-asa-t" d="M110 92c-8-14-22-18-30-16 8 6 14 14 16 22z"/><ellipse class="oh-corpo" cx="110" cy="100" rx="20" ry="11"/><circle class="oh-corpo" cx="128" cy="92" r="8"/><path class="oh-bico" d="M135 91l7 2-7 3z"/><circle class="oh-olho" cx="130" cy="90" r="1.6"/><path class="oh-corpo" d="M90 100l-14-6 4 10z"/><path class="oh-asa" d="M108 96c-6-18-20-26-30-26 6 10 12 22 14 32z"/><path class="oh-ramo" d="M136 98c6 4 12 4 16 2M142 99c1-4 4-5 6-5M147 100c1 3 4 4 6 3"/></g></g></svg></div>
 <h2>Habeas corpus concedido!</h2><p class="frase">A pombinha está livre. Ninguém fica preso por ilegalidade ou abuso de poder.</p><p class="ovo-nota"><b>Habeas corpus</b> (do latim, "que tenhas o corpo") protege a liberdade de locomoção (art. 5º, LXVIII, da CF). <b>Curiosidade:</b> qualquer pessoa pode impetrá-lo, mesmo sem advogado (art. 654 do CPP).</p>${ovoBotoes(`<button class="botao" data-ovo="hc-solta">Soltar de novo</button>`)}`,{rever,titulo:"Habeas corpus"});ovoSomDepois("pomba",animOn()?650:80)}

/* 6. Coruja da madrugada: aparece no Hoje entre 0h e 5h */
const OVO_CORUJA=`<svg viewBox="0 0 64 64" aria-hidden="true"><path class="ocj-orelha" d="M14 14l6 10M50 14l-6 10"/><ellipse class="ocj-corpo" cx="32" cy="38" rx="20" ry="22"/><ellipse class="ocj-barriga" cx="32" cy="44" rx="12" ry="13"/><circle class="ocj-olho" cx="23" cy="30" r="8"/><circle class="ocj-olho" cx="41" cy="30" r="8"/><circle class="ocj-pupila" cx="24" cy="30" r="3.4"/><circle class="ocj-pupila" cx="42" cy="30" r="3.4"/><g class="ocj-palp"><path d="M15 30a8 8 0 0 1 16 0z"/><path d="M33 30a8 8 0 0 1 16 0z"/></g><path class="ocj-bico" d="M29 36h6l-3 5z"/><path class="ocj-pe" d="M25 59v3M29 59v3M35 59v3M39 59v3"/></svg>`;
function ovoCoruja(rever){const h=new Date().getHours();
 ovoCena("coruja","ovo-coruja",`<div class="ocj-palco" aria-hidden="true"><span class="ocj-lua"></span><span class="ocj-est"></span><span class="ocj-est"></span><span class="ocj-est"></span>${OVO_CORUJA}</div>
 <h2>Corujão do Direito</h2><p class="frase">${h<5&&!rever?`Estudando a esta hora? Que dedicação!`:"Você encontrou a coruja da madrugada."}</p>
 <p class="ovo-nota"><b>Dica da coruja:</b> é durante o sono que o cérebro consolida o que você estudou. Feche com uns cartões de revisão e vá dormir: amanhã a matéria vai estar mais firme.</p>${ovoBotoes()}`,{rever,titulo:"Coruja da madrugada"});ovoSomDepois("coruja",700)}

/* 7. Datas do Direito: nos dias marcantes da Justiça e da história, uma cena ao abrir o app (uma vez por dia)
   e um recado no Hoje que só existe naquele dia, com uma lição da matéria ligada à data.
   Cada data: [dia, mês, nome, matéria, cena, história(ano), lição, fundamento]. Cenas: br, mg (bandeiras), corrente, livro, balanca, folha. */
const OVO_DATAS={
 "02-24":[24,"fev","Primeira Constituição da República","Direito Constitucional","livro",y=>`Em 24 de fevereiro de 1891 foi promulgada a primeira Constituição da República, ${y-1891} anos atrás.`,"Ela trouxe o federalismo (as antigas províncias viraram estados), o presidencialismo e separou o Estado da Igreja. Hoje a forma federativa é cláusula pétrea.","Art. 60, § 4º, I, da CF"],
 "03-08":[8,"mar","Dia Internacional da Mulher","Direito Constitucional","balanca",()=>"O 8 de março lembra a luta das mulheres por direitos políticos, trabalhistas e sociais.","A Constituição diz que homens e mulheres são iguais em direitos e obrigações. A igualdade é a regra; diferenças de tratamento só valem quando a própria Constituição ou uma razão legítima as justificam.","Art. 5º, I, da CF"],
 "03-15":[15,"mar","Dia do Consumidor","Direito do Consumidor","livro",()=>"15 de março é o Dia Mundial dos Direitos do Consumidor.","Comprou fora da loja (internet, telefone)? Você pode desistir em até 7 dias, contados da assinatura ou do recebimento do produto, e receber de volta tudo o que pagou, com correção.","Art. 49 do CDC"],
 "03-25":[25,"mar","Constituição do Império","História do Direito","livro",y=>`Em 25 de março de 1824, D. Pedro I outorgou a primeira Constituição do Brasil, ${y-1824} anos atrás.`,"Foi a nossa Constituição mais duradoura (65 anos). Além do Executivo, do Legislativo e do Judiciário, ela tinha um quarto poder, o Moderador, exercido pelo Imperador.","Constituição de 1824, art. 98"],
 "04-21":[21,"abr","Tiradentes","Direito Penal","mg",y=>`Em 21 de abril de 1792, Tiradentes, líder da Inconfidência Mineira, foi enforcado no Rio de Janeiro. Lá se vão ${y-1792} anos.`,"Hoje a Constituição proíbe a pena de morte, salvo em caso de guerra declarada. Também não pode haver pena perpétua, de trabalhos forçados, de banimento nem cruel.","Art. 5º, XLVII, da CF"],
 "05-01":[1,"mai","Dia do Trabalho","Direito do Trabalho","livro",y=>`Em 1º de maio de 1943, Getúlio Vargas assinou a CLT (Decreto-Lei nº 5.452). São ${y-1943} anos de Consolidação das Leis do Trabalho.`,"A jornada normal não pode passar de 8 horas por dia e 44 por semana. A hora extra vale, no mínimo, 50% a mais que a hora normal.","Art. 7º, XIII e XVI, da CF"],
 "05-13":[13,"mai","Lei Áurea","Direito Penal","corrente",y=>`Em 13 de maio de 1888, a Lei Áurea (Lei nº 3.353) declarou extinta a escravidão no Brasil, ${y-1888} anos atrás.`,"A Constituição de 1988 fez do racismo crime inafiançável e imprescritível, sujeito a reclusão. A Lei nº 7.716/1989 define esses crimes.","Art. 5º, XLII, da CF"],
 "06-05":[5,"jun","Dia do Meio Ambiente","Direito Ambiental","folha",()=>"5 de junho é o Dia Mundial do Meio Ambiente, criado pela ONU em 1972.","Todos têm direito ao meio ambiente ecologicamente equilibrado, e o dever de defendê-lo é do Poder Público e da coletividade, para as presentes e futuras gerações.","Art. 225 da CF"],
 "07-13":[13,"jul","Aniversário do ECA","Direito da Criança e do Adolescente","livro",y=>`Em 13 de julho de 1990 nasceu o Estatuto da Criança e do Adolescente (Lei nº 8.069). Hoje ele faz ${y-1990} anos.`,"Para o ECA, criança é quem tem até 12 anos incompletos; adolescente, quem tem entre 12 e 18 anos. A proteção é integral e com prioridade absoluta.","Art. 2º do ECA e art. 227 da CF"],
 "08-07":[7,"ago","Lei Maria da Penha","Direito Penal","balanca",y=>`Em 7 de agosto de 2006 foi sancionada a Lei Maria da Penha (Lei nº 11.340), ${y-2006} anos atrás.`,"A lei cria mecanismos contra a violência doméstica e familiar contra a mulher, que pode ser física, psicológica, sexual, patrimonial ou moral. As medidas protetivas de urgência podem ser concedidas pelo juiz.","Arts. 5º, 7º e 22 da Lei nº 11.340/2006"],
 "08-11":[11,"ago","Dia do Advogado","Ética Profissional","balanca",()=>"Em 11 de agosto de 1827 foram criados os dois primeiros cursos de Direito do Brasil, em São Paulo e em Olinda. Por isso hoje é o Dia do Advogado e do estudante de Direito. Parabéns pelo caminho que você escolheu!","O advogado é indispensável à administração da justiça e é inviolável por seus atos e manifestações no exercício da profissão, nos limites da lei.","Art. 133 da CF e art. 2º do Estatuto da Advocacia"],
 "09-07":[7,"set","Independência do Brasil","Direito Constitucional","br",y=>`Em 7 de setembro de 1822, o Brasil se declarou independente de Portugal. São ${y-1822} anos.`,"A soberania é o primeiro dos fundamentos da República: o Brasil não se submete a outro Estado e decide sozinho sobre seus assuntos internos.","Art. 1º, I, da CF"],
 "09-11":[11,"set","Aniversário do CDC","Direito do Consumidor","livro",y=>`Em 11 de setembro de 1990 foi sancionado o Código de Defesa do Consumidor (Lei nº 8.078). Hoje ele faz ${y-1990} anos.`,"Quando a alegação do consumidor é verossímil ou ele é hipossuficiente, o juiz pode inverter o ônus da prova a favor dele.","Art. 6º, VIII, do CDC"],
 "10-05":[5,"out","Aniversário da Constituição","Direito Constitucional","livro",y=>`Em 5 de outubro de 1988 foi promulgada a Constituição Federal, a "Constituição Cidadã", nas palavras de Ulysses Guimarães. Hoje ela completa ${y-1988} anos.`,"Nem emenda constitucional pode abolir as cláusulas pétreas: a forma federativa, o voto direto, secreto, universal e periódico, a separação dos Poderes e os direitos e garantias individuais.","Art. 60, § 4º, da CF"],
 "11-15":[15,"nov","Proclamação da República","Direito Constitucional","br",y=>`Em 15 de novembro de 1889, o Marechal Deodoro da Fonseca proclamou a República e o Império chegou ao fim. São ${y-1889} anos de República.`,"República é a forma de governo; presidencialismo, o sistema. Em 1993, um plebiscito previsto na própria Constituição perguntou ao povo se queria monarquia ou parlamentarismo, e venceram a República e o presidencialismo.","Art. 1º da CF e art. 2º do ADCT"],
 "11-20":[20,"nov","Dia da Consciência Negra","Direito Penal","corrente",()=>"20 de novembro lembra Zumbi dos Palmares, morto nesse dia em 1695. Desde 2024 a data é feriado nacional.","Desde a Lei nº 14.532/2023, a injúria racial é tratada como crime de racismo, com pena de reclusão de 2 a 5 anos, e também passou a ser inafiançável e imprescritível.","Art. 2º-A da Lei nº 7.716/1989"],
 "12-08":[8,"dez","Dia da Justiça","Organização do Judiciário","balanca",()=>"8 de dezembro é o Dia da Justiça, feriado forense na Justiça Federal.","O STF é o guardião da Constituição. Abaixo dele estão o STJ, que uniformiza a interpretação da lei federal, e os tribunais e juízes das justiças comum e especializadas.","Arts. 92, 102 e 105 da CF"],
 "12-10":[10,"dez","Dia dos Direitos Humanos","Direitos Humanos","balanca",()=>`Em 10 de dezembro de 1948, a ONU proclamou a Declaração Universal dos Direitos Humanos: "Todos os seres humanos nascem livres e iguais em dignidade e em direitos" (art. 1º).`,"Tratados de direitos humanos aprovados em cada Casa do Congresso, em dois turnos, por três quintos dos votos, equivalem a emendas constitucionais.","Art. 5º, § 3º, da CF"]
};
const DH_MES=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const dhChave=d=>p2(d.getMonth()+1)+"-"+p2(d.getDate());
function ovoDataHoje(){const k=dhChave(new Date());return OVO_DATAS[k]?k:null}
function ovoDataProx(){const ks=Object.keys(OVO_DATAS).sort(),hj=dhChave(new Date());return ks.find(x=>x>hj)||ks[0]}
const DH_CENA={
 br:`<g class="dh-mastro"><rect x="58" y="14" width="5" height="122" rx="2.5"/><circle cx="60.5" cy="13" r="5"/></g><g class="dh-pano"><rect x="63" y="20" width="110" height="74" rx="3" fill="#1f9a48"/><path d="M118 28l46 29-46 29-46-29z" fill="#f7d117"/><circle cx="118" cy="57" r="17" fill="#1d3f8f"/><path d="M101 54q17-6 34 4" stroke="#fff" stroke-width="3.2" fill="none"/></g>`,
 mg:`<g class="dh-mastro"><rect x="58" y="14" width="5" height="122" rx="2.5"/><circle cx="60.5" cy="13" r="5"/></g><g class="dh-pano"><rect x="63" y="20" width="110" height="74" rx="3" fill="#fff" stroke="#d9d9d9"/><path d="M118 34l20 34h-40z" fill="#c8102e"/><text x="118" y="86" text-anchor="middle" font-size="6.4" font-weight="700" fill="#555">LIBERTAS QUAE SERA TAMEN</text></g>`,
 corrente:`<g class="dh-elo-e"><ellipse cx="62" cy="76" rx="22" ry="13"/><ellipse cx="94" cy="76" rx="22" ry="13"/></g><g class="dh-elo-d"><ellipse cx="128" cy="76" rx="22" ry="13"/><ellipse cx="160" cy="76" rx="22" ry="13"/></g><g class="dh-raio"><path d="M111 40v14M111 98v14M90 48l6 10M132 48l-6 10M90 104l6-10M132 104l-6-10"/></g>`,
 livro:`<g class="dh-raio"><path d="M110 18v14M70 30l8 10M150 30l-8 10M50 62h14M156 62h14"/></g><path class="dh-capa" d="M44 120V58q33-8 66 6 33-14 66-6v62q-33-8-66 6-33-14-66-6z"/><g class="dh-pag-e"><path d="M50 116V60q30-6 58 6v56q-28-12-58-6z"/></g><g class="dh-pag-d"><path d="M170 116V60q-30-6-58 6v56q28-12 58-6z"/></g><path class="dh-linhas" d="M60 76q20-3 40 4M60 88q20-3 40 4M60 100q20-3 40 4M120 80q20-7 40-4M120 92q20-7 40-4M120 104q20-7 40-4"/>`,
 balanca:`<rect class="dh-base" x="107" y="34" width="6" height="88" rx="3"/><path class="dh-base" d="M86 128h48l-6-10h-36z"/><g class="dh-braco"><rect x="44" y="32" width="132" height="6" rx="3"/><g class="dh-prato"><path d="M54 38l-14 40M54 38l14 40" /><path class="dh-ouro" d="M32 78h44a22 9 0 0 1-44 0z"/></g><g class="dh-prato"><path d="M166 38l-14 40M166 38l14 40"/><path class="dh-ouro" d="M144 78h44a22 9 0 0 1-44 0z"/></g></g><circle class="dh-ouro" cx="110" cy="34" r="8"/>`,
 folha:`<path class="dh-chao" d="M40 126q70-14 140 0z"/><g class="dh-arvore"><rect x="106" y="70" width="8" height="54" rx="3" fill="#8a5a2b"/><circle cx="110" cy="58" r="30" fill="#3f9a52"/><circle cx="88" cy="70" r="18" fill="#4fb062"/><circle cx="132" cy="70" r="18" fill="#4fb062"/><circle cx="110" cy="40" r="16" fill="#5cc06f"/></g><g class="dh-raio"><path d="M170 30v10M165 35h10M48 40v8M44 44h8"/></g>`
};
function ovoData(rever){const d=new Date();let k=ovoDataHoje(),prox=false;if(!k){k=ovoDataProx();prox=true}
 const x=OVO_DATAS[k];
 ovoCena("data","ovo-data dh-"+x[4],`<div class="dh-palco" aria-hidden="true"><svg class="dh-svg" viewBox="0 0 220 140">${DH_CENA[x[4]]}</svg><div class="od-pag"><span class="od-mes">${x[1]}</span><span class="od-dia">${x[0]}</span></div></div>
 <h2>${prox?`Próxima data: ${esc(x[2])}`:esc(x[2])}</h2><p class="frase">${esc(x[5](d.getFullYear()))}</p>
 <div class="ovo-nota dh-licao"><small>${ic("livro")} Lição do dia · ${esc(x[3])}</small><p>${esc(x[6])}</p><em>${esc(x[7])}</em></div>${ovoBotoes()}`,{rever,titulo:x[2],confete:!prox})}
/* recado do dia no Hoje: some à meia-noite */
function dhBanner(k){const x=OVO_DATAS[k],d=new Date();
 return `<section class="dh-banner" aria-label="Hoje na história"><div class="dh-topo"><span class="dh-mini"><b>${x[0]}</b>${x[1]}</span><div><small>Hoje na história · ${d.getDate()} de ${DH_MES[d.getMonth()]}</small><h3>${esc(x[2])}</h3></div></div>
 <p>${esc(x[5](d.getFullYear()))}</p><div class="dh-licao"><small>${ic("livro")} Lição do dia · ${esc(x[3])}</small><p>${esc(x[6])}</p><em>${esc(x[7])}</em></div>
 <button class="botao dh-abre" data-ovo="data">${ic("estrela")} Ver a surpresa do dia</button><span class="dh-some">Este recado só aparece hoje</span></section>`}

/* 8. Fim dos autos: no fim de qualquer tela, puxar com força para cima (no computador, continuar rolando a roda do mouse) */
const OF_SVG=`<svg class="of-svg" viewBox="0 0 230 150" aria-hidden="true"><rect class="of-folha" x="52" y="14" width="128" height="124" rx="6" transform="rotate(5 116 76)"/><rect class="of-folha" x="48" y="12" width="128" height="124" rx="6" transform="rotate(-3 112 74)"/>
 <path class="of-capa2" d="M40 22h50l8 10h92v110H40z"/><path class="of-capa" d="M40 36h150v106H40z"/><rect class="of-etq" x="62" y="48" width="106" height="22" rx="4"/><path class="of-linha" d="M72 59h56M62 92h96M62 108h80M62 124h90"/></svg>`;
function ovoFundo(rever){ovoCena("fundo","ovo-fundo",`<div class="of-palco">${OF_SVG}<span class="of-carimbo">Transitado<br>em julgado</span></div>
 <h2>Fim dos autos!</h2><p class="frase">Você puxou até onde não dava mais. Daqui não cabe recurso: a decisão transitou em julgado.</p>
 <p class="ovo-nota"><b>Coisa julgada</b> é a autoridade que torna imutável e indiscutível a decisão de mérito da qual não cabe mais recurso (art. 502 do CPC). Nem lei nova pode prejudicá-la (art. 5º, XXXVI, da CF). <b>Mas atenção:</b> ainda existe a ação rescisória, em até 2 anos do trânsito em julgado (art. 975 do CPC), e no processo penal a revisão criminal a favor do condenado pode ser pedida a qualquer tempo (art. 622 do CPP).</p>${ovoBotoes(`<button class="botao" data-ovo="fundo-carimba">Carimbar de novo</button>`)}`,{rever,titulo:"Fim dos autos"});
 ovoSomDepois("carimbo",animOn()?420:60)}
const OVO_ABRE={balanca:ovoBalanca,brocardo:ovoBrocardo,martelo:ovoMartelo,chama:ovoChama,habeas:ovoHabeas,coruja:ovoCoruja,data:ovoData,fundo:ovoFundo};
/* lista em Sobre o Facul Lab: os achados podem ser revistos; os outros mostram só a dica */
/* a lista fica em "segredo de justiça": o app pergunta antes e, ao revelar, ela desce desdobrando como um processo aberto */
let ovosRevelados=false;
function ovosSecao(){const n=ovosAchados();
 const pergunta=`<div class="ovo-pergunta"${ovosRevelados?" hidden":""}><div class="ovo-lacre" aria-hidden="true">${ic("estrela")}<span>Segredo de justiça</span></div>
  <p><b>Quer revelar os segredos?</b> Estes autos correm em segredo de justiça. Se abrir, você vê as dicas de onde cada surpresa está escondida.</p>
  <button class="botao cheio" data-ovo="revelar" aria-expanded="false" aria-controls="ovo-revela">Revelar os segredos</button></div>`;
 return `<section class="sb-bloco ovo-lista"><h3>${ic("estrela")} Segredos do Facul Lab <small>${n} de ${OVOS.length}</small></h3>${pergunta}
 <div class="ovo-revela" id="ovo-revela"${ovosRevelados?"":" hidden"}><div><p>${n===OVOS.length?"Você achou todos! Toque em um segredo para rever.":n?"Ainda há segredos escondidos pelo app. As dicas estão abaixo.":"O app esconde alguns segredos interativos. Siga as dicas para encontrar."}</p>
 <ul>${OVOS.map(o=>{const ach=(S.ovos||{})[o.id];return ach?`<li><button class="ovo-item ach" data-ovo="rever" data-id="${o.id}"><span class="sb-ic">${ic(o.ic)}</span><span><b>${esc(o.nome)}</b><small>${o.id==="sacode"?`${sacoN()} de ${SACO.length} cenas · toque para rever`:"Encontrado · toque para rever"}</small></span></button></li>`:`<li><div class="ovo-item"><span class="sb-ic">?</span><span><b>???</b><small>${esc(o.dica)}</small></span></div></li>`}).join("")}</ul>
 <button class="ovo-esconde" data-ovo="esconder">Esconder os segredos de novo</button></div></div></section>`}

/* ações dentro das cenas e gatilhos por toque */
const ovoToques={};
function ovoConta(k,n,ms){const t=Date.now(),a=(ovoToques[k]||[]).filter(x=>t-x<ms);a.push(t);ovoToques[k]=a;if(a.length>=n){ovoToques[k]=[];return true}return false}
function ovoReanima(el,cls){if(!el)return;el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls)}
document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;
 const b=t.closest("[data-ovo]");
 if(b){const a=b.dataset.ovo,c=b.closest(".festa");
  if(a==="revelar"){const sec=b.closest(".ovo-lista"),r=sec&&sec.querySelector(".ovo-revela");if(!r)return;ovosRevelados=true;
   const pg=sec.querySelector(".ovo-pergunta");r.querySelectorAll("li").forEach((li,i)=>li.style.setProperty("--oi",i));
   if(animOn()){pg.classList.add("sai");setTimeout(()=>{pg.hidden=true;pg.classList.remove("sai");r.hidden=false;ovoReanima(r,"desce")},260)}else{pg.hidden=true;r.hidden=false}
   ovoSom("vira");return}
  if(a==="esconder"){const sec=b.closest(".ovo-lista");if(!sec)return;ovosRevelados=false;sec.querySelector(".ovo-revela").hidden=true;const pg=sec.querySelector(".ovo-pergunta");pg.hidden=false;ovoReanima(pg,"volta");return}
  if(a==="bal-p"&&ovoBal){ovoBal.R.push(+b.dataset.v);ovoSom("peso");ovoBalAtualiza()}
  else if(a==="bal-tira"&&ovoBal){ovoBal.R.pop();ovoSom("tira");ovoBalAtualiza()}
  else if(a==="bal-de-novo")ovoBalanca(true);
  else if(a==="broc-vira"){b.classList.toggle("virada");ovoSom("vira")}
  else if(a==="broc-outro"){const p=c.querySelector(".obr-palco");p.innerHTML=ovoBrocHtml();ovoReanima(p,"troca");ovoSom("vira")}
  else if(a==="mart-bate"){ovoReanima(c.querySelector(".om-palco"),"bate");ovoSomDepois("martelo",animOn()?600:30)}
  else if(a==="fundo-carimba"){ovoReanima(c.querySelector(".of-palco"),"bate");ovoSomDepois("carimbo",animOn()?420:30)}
  else if(a==="hc-solta"){ovoReanima(c.querySelector(".oh-palco"),"solta");ovoSomDepois("pomba",animOn()?650:30)}
  else if(a==="saco-pomba")ovoHabeas();
  else if(a==="rever"&&OVO_ABRE[b.dataset.id])OVO_ABRE[b.dataset.id](true);
  else if(a==="coruja")ovoCoruja();
  else if(a==="data")ovoData();
  return}
 if(t.closest(".festa,#tour"))return;
 const logo=t.closest(".sb-logo,.gaveta-topo .marca");
 if(logo){ovoReanima(logo,"ovo-tic");if(ovoConta("bal",7,4000))setTimeout(()=>ovoBalanca(),200);return}
 if(t.closest(".hoje-hero .ilu")){if(ovoConta("broc",5,3000))setTimeout(()=>ovoBrocardo(),350);return}
 if(t.closest(".chama-viva")&&ovoConta("chama",5,3500))setTimeout(()=>ovoChama(),400)});
/* segurar o título */
let tOvoSeg=null,ovoSegXY=null;
function ovoSoltou(){clearTimeout(tOvoSeg);tOvoSeg=null;document.querySelectorAll(".ovo-segura").forEach(x=>x.classList.remove("ovo-segura"))}
document.addEventListener("pointerdown",e=>{const h=e.target.closest&&e.target.closest(".topo h1");if(!h||document.querySelector(".festa,#tour"))return;
 ovoSoltou();ovoSegXY=[e.clientX,e.clientY];h.classList.add("ovo-segura");tOvoSeg=setTimeout(()=>{ovoSoltou();ovoMartelo()},800)});
document.addEventListener("pointermove",e=>{if(tOvoSeg&&ovoSegXY&&Math.hypot(e.clientX-ovoSegXY[0],e.clientY-ovoSegXY[1])>12)ovoSoltou()});
["pointerup","pointercancel","scroll"].forEach(ev=>document.addEventListener(ev,()=>{if(tOvoSeg)ovoSoltou()},true));
document.addEventListener("contextmenu",e=>{if(e.target.closest&&e.target.closest(".topo h1"))e.preventDefault()});
/* 9. Chacoalhadas da semana: chacoalhar o celular abre uma cena; cada meio dia (0h-12h e 12h-24h) tem a sua,
   e ela pode ser chamada no máximo 2 vezes no turno. São 14 cenas, uma por turno: a semana fecha o ciclo e ele recomeça.
   Quem descobre as 14 liberta a pombinha do habeas corpus. As cenas vistas ficam em S.sacode ({índice: dia}). */
const SACO=[
 {id:"dados",nome:"A sorte está lançada",som:"sc-dados",frase:"Os dados rolaram. Em alguns contratos, a sorte faz parte do negócio.",
  licao:"No contrato aleatório, uma das partes assume o risco de a coisa nem chegar a existir. Quem compra a safra futura paga o preço combinado mesmo que nada seja colhido, desde que o vendedor não tenha agido com dolo ou culpa.",ref:"Arts. 458 a 461 do Código Civil",
  svg:`<ellipse class="sc-sombra" cx="110" cy="128" rx="70" ry="7"/><g class="sc-dado sc-d1"><rect x="56" y="74" width="46" height="46" rx="10"/><circle cx="68" cy="86" r="4.2"/><circle cx="90" cy="86" r="4.2"/><circle cx="79" cy="97" r="4.2"/><circle cx="68" cy="108" r="4.2"/><circle cx="90" cy="108" r="4.2"/></g><g class="sc-dado sc-d2"><rect x="118" y="80" width="42" height="42" rx="9"/><circle cx="129" cy="91" r="4"/><circle cx="139" cy="101" r="4"/><circle cx="149" cy="111" r="4"/></g><text class="sc-latim" x="110" y="40">alea iacta est</text>`},
 {id:"urna",nome:"Voto confirmado",som:"sc-urna",frase:"Piii! A urna confirmou o seu voto.",
  licao:"O voto é direto, secreto, universal e periódico, e nem emenda constitucional pode mudar isso. É obrigatório dos 18 aos 70 anos e facultativo para quem tem 16 ou 17, para quem tem mais de 70 e para os analfabetos.",ref:"Art. 14, § 1º, e art. 60, § 4º, II, da CF",
  svg:`<rect class="sc-urna-c" x="40" y="34" width="140" height="94" rx="10"/><rect class="sc-tela" x="52" y="46" width="62" height="44" rx="4"/><text class="sc-fim" x="83" y="75">FIM</text><g class="sc-teclas">${[0,1,2,3].map(r=>[0,1,2].map(c=>`<rect class="sc-tec" style="--k:${r*3+c}" x="${126+c*16}" y="${46+r*13}" width="12" height="9" rx="2"/>`).join("")).join("")}</g><rect class="sc-conf" x="126" y="100" width="44" height="14" rx="3"/><text class="sc-conf-t" x="148" y="110">CONFIRMA</text><rect class="sc-urna-p" x="52" y="98" width="62" height="18" rx="3"/>`},
 {id:"cofre",nome:"Cofrinho do Fisco",som:"sc-moedas",frase:"Plim, plim! Cada moedinha que cai lembra um tributo.",
  licao:"Tributo é prestação em dinheiro, obrigatória, criada por lei, cobrada por atividade administrativa vinculada e que não é castigo por ato ilícito. Por isso a multa não é tributo: ela é sanção.",ref:"Art. 3º do CTN",
  svg:`<ellipse class="sc-sombra" cx="112" cy="132" rx="58" ry="6"/><g class="sc-porco"><rect class="sc-pele" x="72" y="112" width="12" height="18" rx="4"/><rect class="sc-pele" x="132" y="112" width="12" height="18" rx="4"/><ellipse class="sc-pele" cx="110" cy="96" rx="50" ry="34"/><path class="sc-pele" d="M84 70l-6-16 18 10z"/><ellipse class="sc-focinho" cx="158" cy="98" rx="10" ry="12"/><circle cx="156" cy="94" r="2" class="sc-olho2"/><circle cx="156" cy="102" r="2" class="sc-olho2"/><circle cx="140" cy="84" r="3.4" class="sc-olho"/><rect class="sc-fenda" x="98" y="63" width="26" height="5" rx="2.5"/></g>${[0,1,2].map(i=>`<g class="sc-moeda" style="--k:${i}"><circle cx="111" cy="40" r="11"/><text x="111" y="44">R$</text></g>`).join("")}`},
 {id:"arvore",nome:"Frutos do vizinho",som:"sc-arvore",frase:"A árvore balançou e as frutas caíram do outro lado da cerca. De quem são?",
  licao:"Os frutos caídos da árvore do vizinho pertencem ao dono do terreno onde caíram, se for propriedade particular. E galhos e raízes que invadem o seu terreno podem ser cortados por você, até a linha da divisa.",ref:"Arts. 1.283 e 1.284 do Código Civil",
  svg:`<path class="sc-grama" d="M10 128h200v16H10z"/><g class="sc-cerca"><path d="M134 92v40M150 92v40M166 92v40M182 92v40M198 92v40M128 104h76M128 120h76"/></g><text class="sc-placa" x="72" y="142">seu vizinho</text><text class="sc-placa" x="166" y="142">você</text><g class="sc-copa"><rect x="66" y="64" width="12" height="66" rx="4" class="sc-tronco"/><circle cx="72" cy="52" r="34" class="sc-folha"/><circle cx="104" cy="60" r="22" class="sc-folha2"/><circle cx="46" cy="62" r="20" class="sc-folha2"/></g>${[[96,58,0],[110,66,1],[84,44,2]].map(([x,y,i])=>`<circle class="sc-fruta" style="--k:${i}" cx="${x}" cy="${y}" r="6"/>`).join("")}`},
 {id:"globo",nome:"Neve no Supremo",som:"sc-neve",frase:"Uma nevasca de ideias sobre o STF.",
  licao:"O STF tem 11 ministros, brasileiros natos com mais de 35 e menos de 70 anos, de notável saber jurídico e reputação ilibada. O Presidente da República os nomeia depois que o Senado aprova a escolha por maioria absoluta.",ref:"Art. 101 e art. 12, § 3º, IV, da CF",
  svg:`<defs><clipPath id="sc-vidro"><circle cx="110" cy="70" r="52"/></clipPath></defs><circle class="sc-bola" cx="110" cy="70" r="52"/><g clip-path="url(#sc-vidro)"><path class="sc-chao" d="M50 100q60-12 120 0v30H50z"/><g class="sc-stf"><path d="M76 72h68l-34-16z"/><rect x="78" y="72" width="64" height="4"/><path d="M83 78v18M93 78v18M103 78v18M117 78v18M127 78v18M137 78v18"/><rect x="74" y="96" width="72" height="5"/></g>${Array.from({length:14},(_,i)=>`<circle class="sc-floco" style="--k:${i};--x:${62+((i*37)%96)}px" cx="0" cy="0" r="${1.6+(i%3)*.7}"/>`).join("")}</g><path class="sc-brilho-v" d="M80 36q-12 14-12 32"/><path class="sc-pe" d="M70 118h80l-8 18H78z"/>`},
 {id:"garrafa",nome:"Mensagem na garrafa",som:"sc-mar",frase:"Uma garrafa chegou à praia. Achou, é seu? Nem sempre!",
  licao:"Quem acha coisa alheia perdida deve devolvê-la ao dono. Quem devolve tem direito a recompensa de pelo menos 5% do valor da coisa, mais as despesas que teve para conservá-la e transportá-la.",ref:"Arts. 1.233 e 1.234 do Código Civil",
  svg:`<circle class="sc-sol" cx="176" cy="30" r="14"/><g class="sc-garrafa"><path class="sc-vidro-g" d="M78 86l52-30 10 4 10-6 6 10-8 6v10l-50 30a14 14 0 0 1-20-24z"/><path class="sc-rolha" d="M150 54l6 10 6-4-6-10z"/><rect class="sc-papel" x="92" y="84" width="34" height="14" rx="3" transform="rotate(-30 109 91)"/></g><path class="sc-onda sc-o1" d="M-20 110q20-10 40 0t40 0 40 0 40 0 40 0 40 0 40 0v40H-20z"/><path class="sc-onda sc-o2" d="M-40 122q20-10 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0v40H-40z"/>`},
 {id:"moeda",nome:"Cara ou coroa",som:"sc-giro",frase:"A moeda girou no ar. Mas aposta não vira dívida na Justiça.",
  licao:"Dívida de jogo ou de aposta não obriga a pagar: quem perde não pode ser cobrado em juízo. Mas quem pagou por vontade própria também não pode pedir o dinheiro de volta, salvo se houve dolo ou se quem perdeu é menor ou interdito.",ref:"Art. 814 do Código Civil",
  svg:`<ellipse class="sc-sombra sc-sombra-m" cx="110" cy="130" rx="26" ry="5"/><g class="sc-voo"><g class="sc-gira"><circle class="sc-moeda-f" cx="110" cy="70" r="26"/><circle class="sc-moeda-a" cx="110" cy="70" r="20"/><text class="sc-moeda-t" x="110" y="77">R$1</text></g></g><text class="sc-cc sc-cara" x="44" y="80">cara?</text><text class="sc-cc sc-coroa" x="176" y="80">coroa?</text>`},
 {id:"sino",nome:"Sineta do plenário",som:"sc-sino",frase:"Dlem, dlem! A sessão vai começar a votação.",
  licao:"Lei ordinária é aprovada por maioria simples, presente a maioria absoluta dos membros da Casa. Lei complementar exige maioria absoluta. Emenda à Constituição precisa de três quintos dos votos, em dois turnos, em cada Casa do Congresso.",ref:"Arts. 47, 69 e 60, § 2º, da CF",
  svg:`<g class="sc-ondas"><path d="M52 60q-10 14 0 28M40 52q-18 22 0 44M168 60q10 14 0 28M180 52q18 22 0 44"/></g><g class="sc-sino-g"><rect class="sc-cabo" x="104" y="14" width="12" height="22" rx="4"/><path class="sc-sino-c" d="M110 34c-22 0-32 18-32 40 0 14-6 22-12 28h88c-6-6-12-14-12-28 0-22-10-40-32-40z"/><rect class="sc-borda" x="62" y="100" width="96" height="8" rx="4"/><circle class="sc-badalo" cx="110" cy="114" r="7"/></g>`},
 {id:"bussola",nome:"Para onde vai a ação?",som:"sc-bussola",frase:"A bússola girou e apontou para a casa do réu.",
  licao:"Regra geral, a ação fundada em direito pessoal ou em direito real sobre bens móveis é proposta no foro do domicílio do réu. Se ele tiver mais de um domicílio, pode ser demandado em qualquer deles.",ref:"Art. 46 do CPC",
  svg:`<circle class="sc-bus-a" cx="96" cy="76" r="52"/><circle class="sc-bus-f" cx="96" cy="76" r="44"/><text class="sc-pt" x="96" y="44">N</text><text class="sc-pt" x="96" y="116">S</text><text class="sc-pt" x="60" y="80">O</text><text class="sc-pt" x="132" y="80">L</text><g class="sc-agulha"><path class="sc-ag-n" d="M96 76l-7 0 7-34 7 34z"/><path class="sc-ag-s" d="M96 76l-7 0 7 34 7-34z"/><circle cx="96" cy="76" r="4" class="sc-pino"/></g><g class="sc-casa"><path d="M160 46l20-16 20 16v24h-40z"/><rect x="175" y="56" width="10" height="14" class="sc-porta"/><text x="180" y="86">réu</text></g>`},
 {id:"ampulheta",nome:"Ampulheta da prescrição",som:"sc-areia",frase:"A areia não para de cair, e o prazo também não.",
  licao:"Quando a lei não fixa prazo menor, a prescrição ocorre em 10 anos. Já a pretensão de reparação civil, como pedir indenização por um dano, prescreve em 3 anos.",ref:"Arts. 205 e 206, § 3º, V, do Código Civil",
  svg:`<g class="sc-amp"><rect class="sc-amp-t" x="70" y="16" width="80" height="9" rx="4"/><rect class="sc-amp-t" x="70" y="125" width="80" height="9" rx="4"/><path class="sc-vidro-a" d="M80 25h60c0 30-22 38-22 50s22 20 22 50H80c0-30 22-38 22-50s-22-20-22-50z"/><path class="sc-areia-c" d="M86 32h48c-3 18-16 28-24 38-8-10-21-20-24-38z"/><path class="sc-areia-b" d="M84 125c4-16 14-22 26-24 12 2 22 8 26 24z"/><path class="sc-fio-a" d="M110 70v44"/></g><text class="sc-anos" x="178" y="62">10</text><text class="sc-anos-s" x="178" y="76">anos</text><text class="sc-anos sc-anos3" x="42" y="62">3</text><text class="sc-anos-s" x="42" y="76">anos</text>`},
 {id:"assinaturas",nome:"Lei de iniciativa popular",som:"sc-papel",frase:"As assinaturas não param de chegar!",
  licao:"O povo pode apresentar projeto de lei à Câmara com assinaturas de pelo menos 1% do eleitorado nacional, distribuídas por pelo menos 5 estados, com no mínimo 0,3% dos eleitores de cada um. A Lei da Ficha Limpa nasceu de um projeto assim.",ref:"Art. 61, § 2º, da CF",
  svg:`<rect class="sc-prancha" x="58" y="14" width="104" height="124" rx="8"/><rect class="sc-clip" x="92" y="8" width="36" height="14" rx="4"/><rect class="sc-folha-p" x="66" y="26" width="88" height="104" rx="4"/><text class="sc-tit-p" x="110" y="40">PROJETO DE LEI</text>${[0,1,2,3].map(i=>`<path class="sc-ass" style="--k:${i}" pathLength="100" d="M74 ${58+i*18}c6-8 10 6 16-2s8-6 12 0 10-8 14 0 8 2 14-4"/><path class="sc-linha-p" d="M74 ${62+i*18}h72"/>`).join("")}<g class="sc-selo-p"><circle cx="156" cy="116" r="18"/><text x="156" y="121">1%</text></g>`},
 {id:"cubo",nome:"Cubo dos Três Poderes",som:"sc-cubo",frase:"Girou, girou, e cada cor encontrou o seu lugar.",
  licao:"Legislativo, Executivo e Judiciário são Poderes da União independentes e harmônicos entre si. Cada um tem funções típicas e algumas atípicas: o Judiciário, por exemplo, também administra seus próprios servidores.",ref:"Art. 2º da CF",
  svg:`<g class="sc-cubo-g"><rect class="sc-cubo-b" x="66" y="18" width="88" height="88" rx="10"/>${Array.from({length:9},(_,i)=>{const r=Math.floor(i/3),c=i%3,ini=["#e94b3c","#f2b632","#2e86de","#3bb273","#f2b632","#e94b3c","#2e86de","#3bb273","#e94b3c"][i],fim=["#2e86de","#f2b632","#3bb273"][c];return `<rect class="sc-peca" style="--k:${i};--c0:${ini};--c1:${fim}" x="${72+c*28}" y="${24+r*28}" width="24" height="24" rx="4"/>`}).join("")}</g><text class="sc-pod" x="84" y="126">Legislativo</text><text class="sc-pod" x="110" y="140">Executivo</text><text class="sc-pod" x="136" y="126">Judiciário</text>`},
 {id:"algemas",nome:"Flagrante!",som:"sc-algema",frase:"Clac! As algemas se fecharam.",
  licao:"Qualquer pessoa do povo pode prender quem estiver em flagrante delito; já as autoridades policiais e seus agentes têm o dever de prender. As algemas só podem ser usadas em caso de resistência, receio de fuga ou perigo, com justificativa por escrito.",ref:"Art. 301 do CPP e Súmula Vinculante 11",
  svg:`<g class="sc-alg sc-alg-e"><circle cx="70" cy="80" r="30"/><rect x="94" y="74" width="12" height="12" rx="3" class="sc-alg-t"/></g><g class="sc-corrente"><circle cx="112" cy="80" r="5"/><circle cx="122" cy="80" r="5"/></g><g class="sc-alg sc-alg-d"><circle cx="164" cy="80" r="30"/><rect x="128" y="74" width="12" height="12" rx="3" class="sc-alg-t"/></g><text class="sc-clac" x="110" y="34">CLAC!</text>`},
 {id:"maracas",nome:"Batucada em domínio público",som:"sc-maracas",frase:"Chacoalhou, virou samba!",
  licao:"Os direitos patrimoniais do autor duram a vida inteira dele e mais 70 anos, contados de 1º de janeiro do ano seguinte à sua morte. Depois a obra cai em domínio público e pode ser usada livremente, mas o crédito ao autor continua obrigatório.",ref:"Arts. 24 e 41 da Lei nº 9.610/1998",
  svg:`<g class="sc-mar-e"><rect class="sc-mar-cabo" x="70" y="82" width="10" height="50" rx="4"/><ellipse class="sc-mar-cab sc-mc1" cx="75" cy="62" rx="22" ry="27"/><path class="sc-mar-faixa" d="M55 58q20 10 40 0"/></g><g class="sc-mar-d"><rect class="sc-mar-cabo" x="140" y="82" width="10" height="50" rx="4"/><ellipse class="sc-mar-cab sc-mc2" cx="145" cy="62" rx="22" ry="27"/><path class="sc-mar-faixa" d="M125 58q20 10 40 0"/></g>${[0,1,2].map(i=>`<text class="sc-nota" style="--k:${i}" x="${100+i*14}" y="60">${i===1?"♫":"♪"}</text>`).join("")}`}
];
/* sons das cenas, feitos com os mesmos instrumentos do app */
Object.assign(SONS,{
 "sc-dados":a=>{const t=a.currentTime+.01;[0,.13,.22,.4,.47].forEach((d,i)=>baque(a,t+d,180-i*10,.22));kalimba(a,t+.6,N.G5,.06,1)},
 "sc-urna":a=>{const t=a.currentTime+.01;[N.C6,N.D6,N.E6,N.D6,N.E6].forEach((f,i)=>kalimba(a,t+i*.09,f,.07,.4,.2));kalimba(a,t+.5,N.E6,.08,1.2)},
 "sc-moedas":a=>{const t=a.currentTime+.01;[0,.5,1].forEach(d=>{kalimba(a,t+.35+d,N.E6,.06,.6);kalimba(a,t+.39+d,N.A5,.05,.5);estalos(a,t+.35+d,3,.08,.06)})},
 "sc-arvore":a=>{const t=a.currentTime+.01;ruido(a,t,.9,{f1:2600,f2:900,Q:.6,vol:.16,pico:.3,eco:.3});[.55,.75,.95].forEach((d,i)=>baque(a,t+d,140+i*20,.24))},
 "sc-neve":a=>{const t=a.currentTime+.05;[N.E5,N.G5,N.C6,N.E6,N.D6,N.C6].forEach((f,i)=>kalimba(a,t+i*.18,f,.05,1.6,.7))},
 "sc-mar":a=>{const t=a.currentTime+.01;ruido(a,t,1.4,{tipo:"lowpass",f1:300,f2:900,Q:.6,vol:.24,pico:.5,eco:.4});bolha(a,t+.6,500,.2);bolha(a,t+.8,640,.18)},
 "sc-giro":a=>{const t=a.currentTime+.01;kalimba(a,t,N.A5,.07,.4);for(let i=0;i<6;i++)kalimba(a,t+.1+i*.08,N.E6,.03,.15,.1);baque(a,t+.8,160,.3);kalimba(a,t+.82,N.C6,.06,.9)},
 "sc-sino":a=>{const t=a.currentTime+.01;[0,.45,.9].forEach(d=>{kalimba(a,t+d,N.C6,.1,2,.6);kalimba(a,t+d,N.G5,.05,1.6,.6);marimba(a,t+d,N.C5,.06,1)})},
 "sc-bussola":a=>{const t=a.currentTime+.01;for(let i=0;i<10;i++)bolha(a,t+i*.07*(1+i*.12),700,.08);kalimba(a,t+1.2,N.G5,.07,1.2)},
 "sc-areia":a=>{const t=a.currentTime+.01;ruido(a,t+.3,1.6,{tipo:"highpass",f1:3000,f2:5000,Q:.5,vol:.07,pico:.3,eco:.2});marimba(a,t,N.E4,.12,.6)},
 "sc-papel":a=>{const t=a.currentTime+.01;[0,.35,.7,1.05].forEach(d=>papel(a,t+d,.18,.2));baque(a,t+1.45,100,.36)},
 "sc-cubo":a=>{const t=a.currentTime+.01;[0,.18,.36,.6,.78].forEach(d=>baque(a,t+d,260,.16));rolado(a,t+1.05,[N.C5,N.E5,N.G5],.08,.12,.9)},
 "sc-algema":a=>{const t=a.currentTime+.01;estalos(a,t,6,.35,.12);baque(a,t+.55,220,.3);ruido(a,t+.55,.06,{tipo:"highpass",f1:3500,Q:.8,vol:.25,pico:.05})},
 "sc-maracas":a=>{const t=a.currentTime+.01;[0,.18,.27,.45,.63,.72,.9,1.08].forEach(d=>ruido(a,t+d,.07,{tipo:"highpass",f1:4000,Q:.6,vol:.16,pico:.2,eco:.1}));[N.G4,N.C5,N.E5,N.G5].forEach((f,i)=>marimba(a,t+.2+i*.22,f,.12,.5))}
});
const SACO_CH="faculLab.sacode";
const sacoTurno=()=>{const d=new Date();return {dia:hojeStr(),tarde:d.getHours()>=12,i:((Math.round(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)*2+(d.getHours()>=12?1:0))%SACO.length+SACO.length)%SACO.length}};
function sacoN(){return Object.keys(S.sacode||{}).filter(k=>SACO[+k]).length}
function sacoUsos(){const t=sacoTurno(),p=t.dia+(t.tarde?"b":"a");let o={};try{o=JSON.parse(localStorage.getItem(SACO_CH)||"{}")}catch(e){}return o.p===p?o:{p,n:0}}
function sacoGuarda(o){try{localStorage.setItem(SACO_CH,JSON.stringify(o))}catch(e){}}
function ovoSacode(rever,idx){const t=sacoTurno(),i=idx===undefined?t.i:idx,x=SACO[i];
 S.sacode=S.sacode||{};const nova=!S.sacode[i];if(!rever&&nova){S.sacode[i]=hojeStr();salvar()}
 const n=sacoN(),usos=sacoUsos(),resta=Math.max(0,2-usos.n),todas=n>=SACO.length;
 const info=rever?`Cena ${i+1} de ${SACO.length}. Ela volta toda semana neste mesmo turno.`:resta?`Dá para chacoalhar mais 1 vez neste turno. ${t.tarde?"À meia-noite":"Ao meio-dia"} chega uma cena nova.`:`Esta foi a última chacoalhada deste turno. ${t.tarde?"À meia-noite":"Ao meio-dia"} chega uma cena nova.`;
 ovoCena("sacode","ovo-saco sc-c-"+x.id,`<span class="sc-turno">${ic("relogio")} Chacoalhada ${t.tarde&&!rever?"da tarde":!rever?"da manhã":"da semana"} · ${n} de ${SACO.length} descobertas${nova&&!rever?" · nova!":""}</span>
 <div class="sc-palco" aria-hidden="true"><svg class="sc-svg" viewBox="0 0 220 150">${x.svg}</svg></div>
 <h2>${esc(x.nome)}</h2><p class="frase">${esc(x.frase)}</p><div class="ovo-nota dh-licao"><small>${ic("livro")} Lição da chacoalhada</small><p>${esc(x.licao)}</p><em>${esc(x.ref)}</em></div>
 <p class="sc-info">${info}</p>${ovoBotoes(todas?`<button class="botao" data-ovo="saco-pomba">Libertar a pombinha</button>`:"")}`,{rever,titulo:x.nome,confete:nova&&!rever});
 ovoSomDepois(x.som,450)}
OVO_ABRE.sacode=r=>{const t=sacoTurno();if((S.sacode||{})[t.i])return ovoSacode(r,t.i);const ks=Object.keys(S.sacode||{}).filter(k=>SACO[+k]);ovoSacode(r,ks.length?+ks[Math.floor(Math.random()*ks.length)]:t.i)};
/* aviso discreto quando o turno já usou as duas chacoalhadas (aparece uma vez por turno) */
function sacoAviso(txt){const v=$("#sc-aviso");if(v)v.remove();const el=document.createElement("div");el.id="sc-aviso";el.setAttribute("role","status");el.innerHTML=`${ic("relogio")}<span>${esc(txt)}</span>`;document.body.appendChild(el);setTimeout(()=>el.classList.add("sai"),3200);setTimeout(()=>el.remove(),3700)}
function sacoChacoalhou(){const o=sacoUsos();
 if(o.n>=2){if(o.n===2){o.n=3;sacoGuarda(o);sacoAviso(`Você já viu a chacoalhada deste turno. ${sacoTurno().tarde?"À meia-noite":"Ao meio-dia"} tem cena nova!`)}return}
 o.n++;sacoGuarda(o);ovoSacode()}
/* digitar "habeas" fora de um campo de texto */
let ovoTec="";
document.addEventListener("keydown",e=>{if(e.ctrlKey||e.metaKey||e.altKey||!e.key||e.key.length!==1)return;const el=document.activeElement;if(el&&(el.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)))return;
 ovoTec=(ovoTec+e.key.toLowerCase()).slice(-12);if(ovoTec.endsWith("habeas")){ovoTec="";ovoHabeas()}});
/* chacoalhar o celular (chacoalhadas da semana): três trancos fortes em pouco mais de um segundo (fora da prova e de janelas abertas) */
let ovoSac=[];
window.addEventListener("devicemotion",e=>{const a=e.accelerationIncludingGravity;if(!a||a.x===null)return;if(Math.hypot(a.x||0,a.y||0,a.z||0)<27)return;
 const t=Date.now();if(ovoSac.length&&t-ovoSac[ovoSac.length-1]<180)return;ovoSac=ovoSac.filter(x=>t-x<1400);ovoSac.push(t);
 if(ovoSac.length>=3){ovoSac=[];if(rota.tela!=="quiz"&&tourI<0&&!document.querySelector(".festa"))sacoChacoalhou()}});
/* puxar para cima no fim da tela: uma aba sobe do rodapé acompanhando o dedo; passou do ponto, soltou, abre o segredo */
let ovoPx=null;
function ovoNoFim(){const d=document.documentElement;return window.innerHeight+window.scrollY>=d.scrollHeight-4}
function ovoPuxaEl(){let el=$("#ovo-puxa");if(!el){el=document.createElement("div");el.id="ovo-puxa";el.setAttribute("aria-hidden","true");document.body.appendChild(el)}return el}
function ovoPuxa(h){const el=ovoPuxaEl(),pronto=h>=96;el.classList.remove("solta");
 if(pronto!==el.classList.contains("pronto")||!el.innerHTML){el.classList.toggle("pronto",pronto);el.innerHTML=`<span class="op-ic">${ic("pasta")}</span><span>${pronto?"Solte para carimbar":"Fim dos autos…"}<small>${pronto?"Daqui não cabe recurso":"Continue puxando"}</small></span>`;if(pronto)som("puxa")}
 el.style.transform=`translate(-50%,calc(100% - ${Math.min(h,130)}px))`;return pronto}
function ovoPuxaSolta(abrir){const el=$("#ovo-puxa");if(!el)return;el.classList.add("solta");el.style.transform="";const pr=el.classList.contains("pronto");el.classList.remove("pronto");setTimeout(()=>{if(!el.classList.contains("pronto"))el.innerHTML=""},400);if(abrir&&pr)setTimeout(()=>ovoFundo(),120)}
const ovoPodePuxar=t=>!(t&&t.closest&&t.closest(".festa,#tour,.gaveta,.folha,.camada,.folha-camada,input,textarea,select"))&&!document.querySelector(".festa,#tour")&&!gaveta&&tourI<0;
document.addEventListener("touchstart",e=>{ovoPx=null;if(e.touches.length!==1||!ovoPodePuxar(e.target)||!ovoNoFim())return;ovoPx={y:e.touches[0].clientY,x:e.touches[0].clientX,h:0}},{passive:true});
document.addEventListener("touchmove",e=>{if(!ovoPx)return;const t=e.touches[0],dy=ovoPx.y-t.clientY;
 if(!ovoNoFim()||Math.abs(t.clientX-ovoPx.x)>Math.max(60,dy)){if(ovoPx.h)ovoPuxaSolta(false);ovoPx=null;return}
 const h=dy>30?(dy-30)*.42:0;if(h||ovoPx.h){ovoPx.h=h;ovoPuxa(h)}},{passive:true});
["touchend","touchcancel"].forEach(ev=>document.addEventListener(ev,e=>{if(!ovoPx)return;const ok=ev==="touchend"&&ovoPx.h>=96;if(ovoPx.h)ovoPuxaSolta(ok);ovoPx=null},{passive:true}));
/* no computador: continuar rolando para baixo quando a tela já acabou */
let ovoRoda=0,tOvoRoda=null;
window.addEventListener("wheel",e=>{if(e.deltaY<=0||e.ctrlKey||!ovoPodePuxar(e.target)||!ovoNoFim()){if(ovoRoda){ovoRoda=0;ovoPuxaSolta(false)}return}
 ovoRoda+=Math.min(e.deltaY*(e.deltaMode===1?16:1),120);const h=Math.max(0,ovoRoda-900)*.11;if(h)ovoPuxa(h);
 clearTimeout(tOvoRoda);tOvoRoda=setTimeout(()=>{const ok=h>=96;ovoRoda=0;ovoPuxaSolta(ok)},350)},{passive:true});
/* enfeites do Hoje depois de cada render: coruja de madrugada, recado das datas e brilho dourado nos marcos da ofensiva */
function ovoEnfeita(){if(rota.tela!=="hoje")return;const hero=document.querySelector(".hoje-hero");if(!hero||document.querySelector(".hoje .dh-banner,.hoje-hero .ovo-coruja,.hoje-hero .ovo-dt"))return;
 const k=ovoDataHoje();if(k)hero.insertAdjacentHTML("beforebegin",dhBanner(k));
 if(new Date().getHours()<5)hero.insertAdjacentHTML("beforeend",`<button class="ovo-coruja" data-ovo="coruja" aria-label="Uma coruja apareceu. Toque nela">${OVO_CORUJA}</button>`);
 const seq=sequencia(),cv=document.querySelector(".hoje .chama-viva");if(cv&&OVO_MARCOS.includes(seq))cv.classList.add("ovo-marco")}
try{new MutationObserver(ovoEnfeita).observe($("#app"),{childList:true})}catch(e){}

