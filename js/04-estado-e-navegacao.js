"use strict";
/* ---------- estado ---------- */
const CHAVE="simuladoOAB.v2";
function novoEstado(){return {v:2,atualizado:0,hist:[],stats:{},cfg:{corrFinal:false,migCorr:1},lidos:{}}}
let S=novoEstado();
function carregar(o){
  if(!o) return null;
  if(o.v===2) return Object.assign(novoEstado(),o);
  if(o.v===1){const n=novoEstado();n.stats=o.stats||{};n.cfg.corrFinal=false;n.atualizado=o.atualizado||0;return n}
  return null;
}
try{const a=localStorage.getItem(CHAVE)||localStorage.getItem("simuladoOAB.v1");if(a){const c=carregar(JSON.parse(a));if(c)S=c}}catch(e){}
let dbDoc=null,gravando=false,pendente=false,tSalvar=null,statusSinc="Progresso salvo neste aparelho";
function salvar(){S.atualizado=Date.now();try{localStorage.setItem(CHAVE,JSON.stringify(S))}catch(e){try{guardaFalhou()}catch(x){}}
  if(dbDoc){clearTimeout(tSalvar);tSalvar=setTimeout(gravarDb,900)}
  if(typeof lbAgendar=="function")lbAgendar()}
async function gravarDb(){if(!dbDoc)return;if(gravando){pendente=true;return}gravando=true;
  try{await dbDoc.set(JSON.parse(JSON.stringify(S)));statusSinc="Progresso sincronizado com sua conta"}catch(e){statusSinc="Progresso salvo neste aparelho (sincronização indisponível agora)"}
  gravando=false;if(pendente){pendente=false;gravarDb()}}
(async function conectar(){try{
  if(!window.claude||!window.claude.use)return;
  const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);if(!db||!user)return;
  const id=await user.id();if(!id)return;
  const ref=db.doc("data/users/"+id+"/progresso");const snap=await ref.get();dbDoc=ref;
  if(snap.exists){const d=carregar(JSON.parse(JSON.stringify(snap.data())));
    if(d&&!sessao&&(d.atualizado||0)>(S.atualizado||0)){S=d;try{localStorage.setItem(CHAVE,JSON.stringify(S))}catch(e){}}
    else if((S.atualizado||0)>((d&&d.atualizado)||0))gravarDb();}
  else if(S.hist.length||Object.keys(S.stats).length)gravarDb();
  statusSinc="Progresso sincronizado com sua conta";if(!sessao){if(perAtual()!==null)periodo=Math.min(9,perAtual());render()}
}catch(e){}})();

/* ---------- utilidades ---------- */
const $=s=>document.querySelector(s);
const LETRAS="ABCD";
function esc(t){return String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function mmss(s){s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;const p=n=>String(n).padStart(2,"0");return h?`${h}:${p(m)}:${p(x)}`:`${p(m)}:${p(x)}`}
function dur(s){s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;const p=n=>String(n).padStart(2,"0");return h?`${h}h ${p(m)}min`:`${p(m)}min ${p(x)}s`}
function quando(ts){const d=new Date(ts),h=new Date();const o=new Date(h);o.setDate(h.getDate()-1);
  const hr=d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
  if(d.toDateString()===h.toDateString())return "Hoje<br>"+hr;if(d.toDateString()===o.toDateString())return "Ontem<br>"+hr;
  return `${new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",year:"numeric"}).format(d).replace(/\s?de\s?/g," ")}<br>${hr}`}
function res(a){let ok=0,er=0,br=0;a.qids.forEach(id=>{const r=a.resp[id];if(r===undefined)br++;else if(r===0)ok++;else er++});return {ok,er,br,pct:a.qids.length?Math.round(ok*100/a.qids.length):0}}
function registrar(id,c,o){const s=S.stats[id]||{n:0,ok:0,u:0};s.n++;if(c)s.ok++;s.u=c?1:0;s.t=Date.now();S.stats[id]=s;agendarQ(id,c);cadAnota(id,c,o)}
/* questão errada volta amanhã; cada acerto na revisão adia a próxima (3, 7, 15 e 30 dias); depois de 5 acertos seguidos sai da revisão */
const PASSOS_Q=[1,3,7,15,30];
function agendarQ(id,c){S.qrev=S.qrev||{};const r=S.qrev[id];const d0=new Date();d0.setHours(0,0,0,0);const hoje=d0.getTime();
 if(!c){S.qrev[id]={n:0,due:hoje+864e5,lap:r?(r.lap||0)+1:0};return}
 if(r){r.n++;if(r.n>=PASSOS_Q.length){delete S.qrev[id];rvDominou()}else r.due=hoje+PASSOS_Q[r.n]*864e5}}
function errosHoje(){const q=S.qrev||{};const now=Date.now();return Object.keys(q).filter(id=>QMAP[id]&&q[id].due<=now)}
const ultima=key=>S.hist.find(a=>a.key===key);
const p2=n=>String(n).padStart(2,"0");
function tile(cor,icn,cls){const d=dinCoresOn&&DIN_POR_COR[cor],c2=d?d[2]:estiloAtual()==="premium"&&/^#[0-9a-f]{6}$/i.test(cor)?mixHex(cor,"#ffffff",.45):"";return `<span class="tile ${cls||""}${c2?" din":""}" style="--c:${cor}${c2?";--c2:"+c2:""}">${ic(icn)}</span>`}
function estado(key){const a=ultima(key);if(!a)return {st:"nao",a:null};if(a.status==="pausado")return {st:"pausa",a};const r=res(a);return {st:r.pct===100?"perf":r.pct>=50?"aprov":"reprov",a,r}}
const ROTULO={nao:"Não iniciado",pausa:"Pausado",aprov:"Aprovado",reprov:"Reprovado",perf:"Perfeito"};
const SELO={nao:"exc",pausa:"pausa",aprov:"ok",reprov:"x",perf:"estrela"};
function contagem(r){r=r||{ok:0,er:0,br:0};return `<span class="cont"><span title="Certas"><span class="ck ok">${ic("ok")}</span>${p2(r.ok)}<span class="sr"> certas</span></span><span title="Erradas"><span class="ck er">${ic("x")}</span>${p2(r.er)}<span class="sr"> erradas</span></span><span class="c-br" title="Em branco"><span class="ck br">${ic("exc")}</span>${p2(r.br)}<span class="sr"> em branco</span></span></span>`}
function itemSim(key,tituloOpc){const s=sim(key);if(!s||!s.qids.length)return "";const e=estado(key);const a=e.a;
  let sub;if(e.st==="nao")sub="[Toque para iniciar]";else if(e.st==="pausa")sub="[Toque para continuar]";else sub=`com ${e.r.pct}% em ${dur(a.tempo)}`;
  const r=a?(e.r||res(a)):null;
  return `<button class="item" data-acao="abrir" data-key="${key}"><span class="selo ${e.st}">${ic(SELO[e.st])}</span>
   <span style="min-width:0">${s.nivel?chipNivel(s.nivel)+"<br>":""}<span class="item-tit">${esc(tituloOpc||s.titulo)}: ${ROTULO[e.st]}</span><br><span class="item-sub">${sub} · ${s.qids.length} questões</span><br>${contagem(r)}</span>
   <span class="item-data">${a?quando(a.inicio):""}</span></button>`}

/* ---------- navegação ---------- */
let rota={tela:"hoje"}, pilha=[], gaveta=false, sessao=null, idx=0, folha=false, confirmar=null, pend=null, tAvanca=null, tick=null, ultimoTick=0, periodo=0;
function ir(r){pilha.push(rota);rota=r;render()}
function voltar(){rota=pilha.pop()||{tela:"hoje"};render()}
function raiz(r){pilha=[];rota=r;gaveta=false;render()}

function topo(titulo,sub,opt){opt=opt||{};
  const esq=opt.menu?`<button class="icone" data-acao="gaveta" aria-label="Abrir menu">${ic("menu")}</button>`:`<button class="icone" data-acao="${opt.voltarAcao||"voltar"}" aria-label="Voltar">${ic("voltar")}</button>`;
  return `<header class="topo"><div class="wrap"><div class="topo-linha">${esq}<h1${String(titulo).length>30?' class="longo"':""}>${esc(titulo)}${sub?`<small>${esc(sub)}</small>`:""}</h1>${opt.dir||""}</div>${opt.extra||""}</div></header>`}

function topoTela(){try{window.scrollTo(0,0);document.getElementById("app").scrollIntoView({block:"start"})}catch(e){}}
const CORES=[["dinamica","Dinâmica","Muda com a matéria","#b91c1c"],["azul","Azul","Padrão","#1d4f91"],["vinho","Vinho","","#7a1f33"],["verde","Verde","A cor original","#174d3e"],["roxo","Roxo","","#553088"],["petroleo","Azul petróleo","","#0f5e66"],["grafite","Grafite","Cinza escuro","#33363d"],["telha","Telha","Laranja queimado","#b2471c"],["ouro","Ouro","Mostarda","#8a6500"],["oliva","Oliva","Verde-oliva","#556b16"],["rosa","Rosa","Rosa antigo","#a3266a"]];
function corAtual(){const c=S.cfg&&S.cfg.cor;return CORES.some(x=>x[0]===c)?c:"azul"}
/* estilo visual: Premium na paleta Oceano (padrão) ou Clássico */
const ESTILOS=[["premium","Premium","Moderno, colorido e ilustrado, com leitura em fonte sem serifa"],["classico","Clássico","O visual original do app, refinado"]];
const PALETAS=[["dinamica","Dinâmica","Muda com a matéria","#b91c1c","#00733a"],["violeta","Violeta","Violeta e magenta","#7c3aed","#db2777"],["oceano","Oceano","Azul e ciano (padrão)","#2563eb","#06b6d4"],["floresta","Floresta","Verde e azul-petróleo","#059669","#0891b2"],["sol","Pôr do sol","Laranja e coral","#ea580c","#e11d48"],["noite","Noite","Índigo e azul-céu","#4f46e5","#0ea5e9"],["grafite","Grafite","Cinza e índigo","#334155","#6366f1"],["rosa","Rosa","Pink e coral","#db2777","#fb7185"],["mel","Mel","Amarelo e dourado","#a16207","#d9a406"],["lima","Lima","Verde-limão","#4d7c0f","#84cc16"],["carvao","Carvão","Preto e prata","#27272a","#8b8b94"]];
/* a lista de cores começa com as 6 primeiras (e a escolhida, se for uma das outras); "Mostrar mais" abre o resto */
let coresTodas=false;
function coresVisiveis(L,atual){return coresTodas?L:L.filter((x,i)=>i<6||x[0]===atual)}
function botaoMaisCores(L,atual){const f=L.length-coresVisiveis(L,atual).length;if(!f&&!coresTodas)return "";return `<button class="ver-mais mais-cores" data-acao="cores-mais" aria-expanded="${coresTodas}">${coresTodas?"Mostrar menos":`Mostrar mais ${f} ${f>1?"cores":"cor"}`} ${ic("prox")}</button>`}
function prevEstilo(k){if(k==="premium"){if(paletaAtual()==="dinamica")return ` data-din-prev`;const p=PALETAS.find(x=>x[0]===paletaAtual());return ` style="--g1:${p[3]};--g2:${p[4]}"`}
  const c=corAtual();return ` style="--g1:${c==="dinamica"?DIN_BASE.classico[0]:CORES.find(x=>x[0]===c)[3]}"`}
function paletaAtual(){const c=S.cfg&&S.cfg.paleta;return PALETAS.some(x=>x[0]===c)?c:"oceano"}
function estiloAtual(){return (S.cfg&&S.cfg.estilo)==="classico"?"classico":"premium"}
function aplicarCor(){const c=corAtual();const h=document.documentElement;if(c==="vinho")h.removeAttribute("data-cor");else h.setAttribute("data-cor",c);
  h.setAttribute("data-estilo",estiloAtual());h.setAttribute("data-paleta",paletaAtual());
  const dc=dinAplicar();
  try{iconeDoTema(estiloAtual()==="classico"?"c-"+corAtual():paletaAtual(),dc&&dc.k?"d-"+dc.k:null)}catch(e){}
  if(!document.getElementById("pg-defs"))document.body.insertAdjacentHTML("afterbegin",PG_DEFS);
  const t=S.cfg&&S.cfg.tema;if(t==="claro")h.setAttribute("data-theme","light");else if(t==="escuro")h.setAttribute("data-theme","dark");else h.removeAttribute("data-theme");
  /* a barra do sistema acompanha o topo do app */
  try{const m=document.querySelector('meta[name="theme-color"]');const cs=getComputedStyle(h);const v=dc?dc.c[0]:cs.getPropertyValue(estiloAtual()==="premium"?"--p1":"--toga").trim();if(m&&v)m.setAttribute("content",v)}catch(e){}}
/* no tema automático, a barra do sistema troca junto com o claro/escuro do celular */
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>aplicarCor())}catch(e){}
/* ---------- cor Dinâmica: o app veste as cores da matéria aberta ----------
   Cada matéria: [nome da cor, principal, segunda, terceira, por que essa cor]. A principal tem contraste
   de pelo menos 4,5:1 com o branco (texto dos botões e do topo); a segunda e a terceira aparecem nos
   degradês, na faixa do topo, nos ícones e nas ilustrações. Fora de uma matéria, vale a cor de base. */
const DIN={
 ied:["Lombada de código","#14532d","#16a34a","#ca8a04","O azul-marinho e o dourado das lombadas dos códigos na estante: a porta de entrada do curso de Direito."],
 tge:["Púrpura e coroa","#8b5a0b","#d97706","#6b21a8","A púrpura e o ouro das coroas antigas: do poder absoluto dos reis ao Estado de Direito, em que o próprio poder obedece à lei."],
 soc:["Praça cheia","#0e7490","#fb7185","#f59e0b","Cores misturadas, como uma praça cheia de gente: o Direito visto como fato social, nascido da vida em sociedade."],
 psc:["Debate de ideias","#9d174d","#fb923c","#7c3aed","Tons quentes de uma boa conversa: correntes de pensamento que dialogam, discordam e se completam."],
 filo:["Coruja ao entardecer","#3730a3","#f59e0b","#a5b4fc","No prefácio da Filosofia do Direito, Hegel escreveu que a coruja de Minerva só levanta voo ao cair do crepúsculo. Daí o azul do anoitecer com a luz da lamparina."],
 crim:["Luzes da viatura","#3f3f46","#dc2626","#2563eb","O grafite da rua à noite, com o vermelho e o azul das luzes da viatura: o crime, quem o pratica, a vítima e o controle social."],
 civil:["Vida em comum","#0f766e","#2dd4bf","#f59e0b","Verde-água, a cor do dia a dia: pessoas, contratos, bens e família, do nascimento à sucessão."],
 const:["Amarelo e verde","#9c7a00","#00733a","#002776","O verde, o amarelo e o azul da Bandeira Nacional: a Constituição dá forma ao país e está acima de todas as outras leis."],
 penal:["Vermelho-alerta","#b91c1c","#f43f5e","#1f2937","Vermelho de alerta: o Direito Penal protege os bens jurídicos mais importantes e só entra em cena como última opção, a ultima ratio."],
 pc:["Roxo do rito","#1e3a8a","#3b82f6","#cbd5e1","Roxo e lilás em degraus, como o próprio processo: cada ato no seu tempo, da petição inicial à sentença."],
 dh:["Azul da ONU","#0369a1","#e11d48","#7dd3fc","O azul das Nações Unidas, que aprovaram a Declaração Universal dos Direitos Humanos em 1948, com o vermelho do coração: dignidade para cada pessoa."],
 adm:["Prédios públicos","#1e40af","#0ea5e9","#94a3b8","O azul sóbrio das repartições e o cinza do concreto de Brasília: a máquina do Estado a serviço do interesse público."],
 emp:["Terno e ouro","#1e293b","#475569","#ca8a04","O azul-marinho das reuniões de negócio e o dourado dos resultados: empresário, sociedades, títulos de crédito e recuperação."],
 pp:["Bordô e grafite","#881337","#e11d48","#64748b","Bordô, parente do vermelho do Penal, com o grafite das investigações: provas, ritos e as garantias de quem é acusado."],
 trab:["Capacete de obra","#975c00","#d97706","#facc15","O amarelo do capacete e o laranja do colete de segurança: quem trabalha merece proteção, salário justo e descanso."],
 cdc:["Etiqueta de vitrine","#a21caf","#f472b6","#facc15","O magenta das etiquetas e das promoções: o consumidor é reconhecido como a parte vulnerável da relação de consumo."],
 inter:["Mares e continentes","#0b5e7a","#10b981","#1e3a8a","O azul dos oceanos e o verde da terra firme: tratados, Estados e pessoas que cruzam fronteiras."],
 pt:["Pauta de audiência","#713f12","#a16207","#1e293b","Mostarda e caramelo, tons quentes como a pauta da Justiça do Trabalho: oralidade, conciliação e rapidez."],
 trib:["Juba do Leão","#c2410c","#f59e0b","#7c2d12","O laranja e o âmbar da juba do leão, mascote que virou apelido da Receita Federal na época do Imposto de Renda."],
 eca:["Lápis de cor","#7c3aed","#38bdf8","#facc15","As cores primárias da primeira caixa de lápis de cor: criança e adolescente com proteção integral e prioridade absoluta."],
 amb:["Mata e rio","#2e7d32","#84cc16","#0891b2","O verde da mata e o azul do rio: o meio ambiente equilibrado é direito de todos, inclusive das futuras gerações."],
 fin:["Moedas e cofre","#8a5a1f","#d4a017","#3f6212","O dourado das moedas e o verde das contas em dia: orçamento, receita e despesa do dinheiro público."],
 prev:["Guarda-chuva","#075985","#38bdf8","#fbbf24","O azul de um guarda-chuva aberto: a previdência protege nos dias de chuva da vida, como doença, invalidez, idade avançada e morte."],
 eleit:["Teclas da urna","#334155","#16a34a","#f97316","O cinza da urna eletrônica com as teclas que todo eleitor conhece: o verde do CONFIRMA e o laranja do CORRIGE."],
 etica:["Bronze das balanças","#701a2e","#9f1239","#d4a017","O bronze e o ouro das balanças antigas: a ética é o contrapeso que mantém a advocacia de pé."],
 masc:["Ramo de oliveira","#4d6b12","#a3e635","#a5f3fc","Azul sereno e o verde do ramo de oliveira: conversa no lugar do conflito, com a solução construída pelas próprias partes."],
 prc:["Pasta cível","#115e59","#14b8a6","#f59e0b","Os tons do Civil e do Processo Civil juntos, prontos para a petição: a prática leva a teoria para o caso real."],
 prp:["Plantão criminal","#991b1b","#f97316","#1f2937","O vermelho do Penal com o laranja do plantão: peças, prazos e audiências da advocacia criminal."],
 prt:["Chão de fábrica","#92400e","#c2410c","#fbbf24","O amarelo e o laranja do Trabalho, agora na prática: reclamação, contestação e audiência."],
 prpub:["Esplanada","#0c4a6e","#00733a","#f2c500","O azul das repartições com o verde e o amarelo da Bandeira: Constitucional, Administrativo e Tributário na prática."],
 rev:["Todas as cores","#1e1b4b","#4338ca","#f59e0b","Todas as cores juntas: na revisão geral, as matérias da prova se encontram de uma vez."]
};
/* cor de base (fora das matérias): a do Oceano no Premium e a Azul no Clássico */
const DIN_BASE={premium:["#2563eb","#06b6d4","#7c3aed"],classico:["#1d4f91","#3a78c9","#c9821c"]};
const DIN_ARCO=["#b91c1c","#c2410c","#d4a017","#00733a","#0e7490","#1d4ed8","#5b21b6","#a21caf"];
const DIN_POR_COR={};Object.keys(DIN).forEach(k=>DIN_POR_COR[DIN[k][1]]=DIN[k]);
const dinArco=t=>t==="conic"?`conic-gradient(from 200deg,${DIN_ARCO.join(",")},${DIN_ARCO[0]})`:`linear-gradient(90deg,${DIN_ARCO.join(",")})`;
const dinOn=()=>estiloAtual()==="premium"?paletaAtual()==="dinamica":corAtual()==="dinamica";
/* escurece a cor até o texto branco por cima ter o contraste pedido (para o degradê do topo e dos botões) */
const lumHex=h=>{const c=[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
function seguraHex(h,cr){let t=0,x=h;while(1.05/(lumHex(x)+.05)<cr&&t<1){t+=.04;x=mixHex(h,"#000000",t)}return x}
/* degradê do topo: da cor principal até a segunda, passando pela roda de cores (verde + dourado dá verde-limão, e não
   um tom barrento). Quando as duas são opostas na roda (azul-marinho e âmbar), o degradê fica na família da principal
   e a segunda aparece só na faixa, nos ícones e nas ilustrações. As duas pontas são escurecidas até o texto branco ler bem. */
const hexHsl=h=>{const [r,g,b]=[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;let H=0,S=0;
  if(d){S=d/(1-Math.abs(2*l-1));H=mx===r?((g-b)/d+6)%6:mx===g?(b-r)/d+2:(r-g)/d+4}return [H*60,S,l]};
const hslHex=(H,S,L)=>{H=(H%360+360)%360;const C=(1-Math.abs(2*L-1))*S,X=C*(1-Math.abs(H/60%2-1)),m=L-C/2;
  const [r,g,b]=H<60?[C,X,0]:H<120?[X,C,0]:H<180?[0,C,X]:H<240?[0,X,C]:H<300?[X,0,C]:[C,0,X];
  return "#"+[r,g,b].map(v=>Math.round((v+m)*255).toString(16).padStart(2,"0")).join("")};
function dinDegrade(a,b){const [h1,s1,l1]=hexHsl(a),[h2,s2,l2]=hexHsl(b);
  if(s1<.25||s2<.25){const g=seguraHex(b,4);return [seguraHex(mixHex(a,g,.5),4),g]}
  let dh=h2-h1;if(dh>180)dh-=360;if(dh<-180)dh+=360;
  if(Math.abs(dh)>110){const g=seguraHex(hslHex(h1+Math.sign(dh)*30,Math.max(s1,.6),Math.min(l1+.12,.5)),4);return [seguraHex(hslHex(h1+Math.sign(dh)*15,Math.max(s1,.6),Math.min(l1+.06,.45)),4),g]}
  const g=seguraHex(b,4),[hg,sg,lg]=hexHsl(g);return [seguraHex(hslHex(h1+dh/2,(s1+sg)/2,(l1+lg)/2),4),g]}
const mixHex=(a,b,t)=>"#"+[1,3,5].map(i=>{const x=parseInt(a.substr(i,2),16),y=parseInt(b.substr(i,2),16);return Math.round(x+(y-x)*t).toString(16).padStart(2,"0")}).join("");
/* chave da matéria: as da OAB (META) e as práticas valem direto; as disciplinas da faculdade usam a matéria-base (Civil I a V → Civil) */
function dinDe(x){if(!x)return null;if(DIN[x])return x;const d=DISC[x];if(!d)return null;const b=d.base||(d.m&&d.m.length===1&&d.m[0]);return DIN[b]?b:null}
function dinNome(k){return (DISC[k]&&DISC[k].nome)||(META[k]&&META[k].nome)||k}
function dinDaChave(key){const p=String(key||"").split(":");return /^(mat|mtodas|fac|ftodas|faixa)$/.test(p[0])?dinDe(p[1]):null}
/* qual matéria está na tela: no simulado, a da questão (num simulado misto a cor acompanha cada questão) */
let dinPrev=null;
function dinTela(){const r=rota||{};if(r.tela!=="config")dinPrev=null;
  switch(r.tela){
    case "config":return dinPrev;
    case "materia":return dinDe(r.m);
    case "disc":case "ler":return dinDe(r.d);
    case "pre":return dinDaChave(r.key);
    case "quiz":{const s=sessao,q=s&&QMAP[s.qids[idx]];return q?dinDe(q.m):dinDaChave(s&&s.key)}
    case "res":{const a=(S.hist||[]).find(x=>x.id===r.id);return a?dinDaChave(a.key):null}
    case "cartao":{const c=deck&&deck.q[Math.min(deck.pos,deck.q.length-1)];return c?dinDe(c.d):null}
    case "ls-quiz":{const s=lsSess,it=s&&s.itens[s.i],x=it&&LSMAP[it.id];return x?dinDe(x.m):null}
    case "leiseca":return r.lsm&&r.lsm!=="todas"?dinDe(r.lsm):null}
  return null}
/* com a Dinâmica ligada, os ícones das matérias (listas, cartões, gráficos) usam a cor principal de cada uma */
const META_COR={},DISC_COR={};Object.keys(META).forEach(k=>META_COR[k]=META[k].cor);Object.keys(DISC).forEach(k=>{if(DISC[k].cor)DISC_COR[k]=DISC[k].cor});
let dinCoresOn=false;
function dinCores(on){if(dinCoresOn===on)return;dinCoresOn=on;Object.keys(META).forEach(k=>META[k].cor=on&&DIN[k]?DIN[k][1]:META_COR[k]);Object.keys(DISC_COR).forEach(k=>DISC[k].cor=on&&DIN[k]?DIN[k][1]:DISC_COR[k])}
let dinUlt=null,dinT=null;
/* o acabamento da Dinâmica (marca d'água no topo, brilho, halo, ícones em degradê) vale para todas as paletas do Premium,
   cada uma com as próprias cores; só a Dinâmica troca de cor por matéria e mostra a faixa de três cores */
function dinAplicar(){const h=document.documentElement,on=dinOn(),pr=!on&&estiloAtual()==="premium";dinCores(on);
  if(pr){const pl=PALETAS.find(x=>x[0]===paletaAtual())||PALETAS[0],k=dinTela(),id=k||"base";
    h.style.setProperty("--d1",pl[3]);h.style.setProperty("--d2",pl[4]);h.style.setProperty("--d3",pl[4]);h.style.setProperty("--dt",mixHex(pl[3],"#ffffff",.6));
    ["--d2g","--d2m"].forEach(v=>h.style.removeProperty(v));h.setAttribute("data-din",id);h.style.setProperty("--din-ic",dinMarca(k));
    if(dinUlt===null)setTimeout(()=>h.classList.add("din-suave"),60);
    else if(dinUlt!==id&&animOn()){h.classList.remove("din-muda");void h.offsetWidth;h.classList.add("din-muda");clearTimeout(dinT);dinT=setTimeout(()=>h.classList.remove("din-muda"),900)}
    dinUlt=id;return null}
  if(!on){if(h.hasAttribute("data-din")){h.removeAttribute("data-din");h.classList.remove("din-suave","din-muda");["--d1","--d2","--d3","--dt","--d2g","--d2m","--din-ic"].forEach(v=>h.style.removeProperty(v))}dinUlt=null;return null}
  const k=dinTela(),e=k&&DIN[k],c=e?e.slice(1,4):DIN_BASE[estiloAtual()],id=k||"base";
  h.style.setProperty("--d1",c[0]);h.style.setProperty("--d2",c[1]);h.style.setProperty("--d3",c[2]);h.style.setProperty("--dt",mixHex(c[0],"#ffffff",.6));const [gm,g]=dinDegrade(c[0],c[1]);h.style.setProperty("--d2g",g);h.style.setProperty("--d2m",gm);
  h.setAttribute("data-din",id);h.style.setProperty("--din-ic",dinMarca(k));
  /* a troca de cor desliza (sem animar na primeira pintura da página) e a faixa do topo se desenha de novo */
  if(dinUlt===null)setTimeout(()=>h.classList.add("din-suave"),60);
  else if(dinUlt!==id&&animOn()){h.classList.remove("din-muda");void h.offsetWidth;h.classList.add("din-muda");clearTimeout(dinT);dinT=setTimeout(()=>h.classList.remove("din-muda"),900)}
  dinUlt=id;return {k,c}}
/* marca d'água do topo: o ícone da matéria em traço branco fino, grande, à direita */
const DIN_MARCA={};
function dinIcone(k){const M=META[k]||{};return (DISC[k]&&DISC[k].ic)||M.ic||"balanca"}
function dinMarca(k){const n=k?dinIcone(k):"balanca";return DIN_MARCA[n]||(DIN_MARCA[n]=`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">${(P[n]||"").replace(/currentColor/g,"#fff")}</svg>`)}")`)}
/* selo da matéria: degradê da cor com o ícone dela (a de Constitucional é a própria bandeira) */
function dinSelo(k,cls){const e=DIN[k];if(!e)return "";const icn=dinIcone(k);
  if(k==="const")return `<span class="din-selo ${cls||""}" aria-hidden="true"><svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#00733a"/><path d="M20 7 35 20 20 33 5 20z" fill="#f2c500"/><circle cx="20" cy="20" r="7.5" fill="#002776"/><path d="M12.9 18.6c4.6-1.2 9.6-.6 14 1.7" stroke="#fff" stroke-width="1.3" fill="none"/></svg></span>`;
  return `<span class="din-selo ${cls||""}" aria-hidden="true" style="--t1:${e[1]};--t2:${e[2]};--t3:${e[3]}">${ic(icn)}</span>`}
/* galeria da Configuração: tocar numa matéria mostra a cor dela aqui mesmo, sem sair da tela */
function dinGaleria(){const ks=[];PERIODOS.forEach(l=>l.forEach(d=>{const k=dinDe(d);if(k&&!ks.includes(k))ks.push(k)}));
  return `<p class="nota">O app veste as cores da matéria que você abre. Toque numa matéria para ver as cores dela nesta tela.</p>
  <div class="secao" role="heading" aria-level="2">As cores de cada matéria</div>
  ${(()=>{const bt=(k,i)=>`<button data-acao="din-prev" data-k="${k}" aria-pressed="${dinPrev===k}" style="--i:${i}">${dinSelo(k,"mini")}<span>${esc(nomeCurto(dinNome(k)))}</span></button>`;
    if(dinPrev)dinGalAberta=true;
    return `<button class="ver-mais mais-cores din-gal-bt" data-acao="din-gal" aria-controls="din-gal-mais" aria-expanded="${dinGalAberta}" data-n="${ks.length}">${dinGalAberta?"Esconder as cores":`Ver as cores das ${ks.length} matérias`} ${ic("prox")}</button>
    <div class="din-gal-mais${dinGalAberta?" aberta":""}" id="din-gal-mais"${dinGalAberta?"":" inert"}><div><div class="din-galeria">${ks.map((k,i)=>bt(k,i)).join("")}</div></div></div>`})()}`}
let dinGalAberta=false;
const TEMAS=[["auto","Automático","Segue o celular","meio"],["claro","Claro","Fundo claro","sol"],["escuro","Escuro","Fundo escuro","lua"]];
const MODOS_Q=[["imediato","Tocar e responder","Ao tocar na alternativa, a resposta é registrada na hora (como era antes)","ok"],["avancar","Responder e avançar sozinho","Ao tocar na alternativa, o app registra a resposta e passa para a próxima questão","seta"],["confirmar","Marcar e confirmar","Toque para marcar, troque se quiser, e depois aperte \"Confirmar resposta\"","alvo"]];
/* avisos para leitores de tela */
function anunciar(t){const el=document.getElementById("aviso-vivo");if(!el)return;el.textContent="";setTimeout(()=>{el.textContent=t},30)}
function modoQ(){const m=S.cfg&&S.cfg.modoQ;return MODOS_Q.some(x=>x[0]===m)?m:"imediato"}
function setasAcima(){return !(S.cfg&&S.cfg.setas==="baixo")}
function render(){S.cfg=S.cfg||{};if(!S.cfg.mig38){S.cfg.mig38=1;S.cfg.cor="azul";S.cfg.setas="acima";try{salvar()}catch(e){}}
  /* a correção na hora passou a ser o padrão: quem estava no padrão antigo (no final) muda uma vez; depois, vale a escolha da pessoa */
  if(!S.cfg.migCorr){S.cfg.migCorr=1;S.cfg.corrFinal=false;try{salvar()}catch(e){}}
  if(!S.cfg.mig40){S.cfg.mig40=1;S.qrev=S.qrev||{};const h=inicioDia();Object.keys(S.stats||{}).forEach(k=>{if(S.stats[k].u===0&&!S.qrev[k])S.qrev[k]={n:0,due:h}});try{salvar()}catch(e){}}
  aplicarCor();
  pararRelogio();
  const app=$("#app");let h="";
  switch(rota.tela){
    case "oab":h=telaOab();break; case "materias":h=telaMaterias();break; case "materia":h=telaMateria();break;
    case "faculdade":h=telaFaculdade();break; case "disc":h=telaDisc();break; case "periodo":h=telaPeriodo();break; case "pre":h=telaPre();break;
    case "mprova":h=telaModoProva();break;
    case "quiz":h=telaQuiz();break; case "res":h=telaRes();break; case "sobre":h=telaSobre();break; case "quem":h=telaQuem();break;
    case "apost":h=telaApost();break; case "ler":h=telaLer();break; case "resumo":h=telaResumo();break; case "hoje":h=telaHoje();break; case "cartoes":h=telaCartoes();break; case "revisao":h=telaRevisao();break; case "cartao":h=telaCartao();break; case "busca":h=telaBusca();break; case "favs":h=telaFavs();break; case "config":h=telaConfig();break; case "backup":h=telaBackup();break; case "reportes":h=telaReportes();break; case "metas":h=telaMetas();break; case "progresso":h=telaProgresso();break; case "leiseca":h=telaLeiSeca();break; case "caderno":h=telaCaderno();break; case "ls-quiz":h=telaLsQuiz();break;
    case "foco":h=telaFoco();break;
    case "semanal":h=telaSemanal();break;
  }
  if(repQ)h+=telaRep();
  if(gaveta)h+=telaGaveta();
  const telaNova=!rota.manterScroll;
  /* menu lateral: desliza ao abrir e, ao fechar, a cópia antiga sai deslizando por cima da tela nova */
  const camadaAntes=app.querySelector(".camada");
  if(camadaAntes)camadaAntes.querySelectorAll(".abre").forEach(x=>x.classList.remove("abre"));
  app.innerHTML=`<a class="pular" href="#conteudo">Pular para o conteúdo</a>`+h;
  {const m=app.querySelector("main");if(m){m.id="conteudo";m.tabIndex=-1}}
  {const c=app.querySelector(".camada");if(c&&!camadaAntes){c.classList.add("abre");c.querySelectorAll(".gaveta nav>*").forEach((x,i)=>x.style.setProperty("--gi",i))}
   if(!c&&camadaAntes&&animOn()){camadaAntes.classList.remove("abre");camadaAntes.classList.add("sai");camadaAntes.setAttribute("aria-hidden","true");camadaAntes.style.pointerEvents="none";document.body.appendChild(camadaAntes);setTimeout(()=>camadaAntes.remove(),330)}}
  if(gaveta){const g=app.querySelector(".gaveta nav button");if(g&&document.activeElement&&!document.activeElement.closest(".gaveta"))try{g.focus({preventScroll:true})}catch(e){}}
  if(rota.tela==="quiz")iniciarRelogio();
  if(!rota.manterScroll)window.scrollTo(0,0);rota.manterScroll=false;
  acompanharLeitura();realcarPagina();animarTela(telaNova);syncVoltar();
  if(metaNova){metaNova=false;setTimeout(mostrarMeta,900)}
  if(ofensivaNova){ofensivaNova=false;setTimeout(()=>som("chama"),450)}
  if(rota.tela==="busca"&&telaNova)animarBusca();
  guardarTela();
}

/* ---------- recarregar sem perder o lugar ----------
   A cada tela, o app anota onde a pessoa está (tela, caminho de volta, questão, cartões). Ao recarregar a página,
   ou ao voltar ao app em até 30 minutos depois de o celular fechá-lo, ela continua exatamente dali. */
const TELA_CH="faculLab.tela",TELA_VALE=30*60*1000;
function guardarTela(){try{const j=JSON.stringify({t:Date.now(),rota,pilha,sid:sessao?sessao.id:null,idx,deck,ls:lsSess,y:Math.round(window.scrollY||0)});
  sessionStorage.setItem(TELA_CH,j);localStorage.setItem(TELA_CH,j)}catch(e){}}
function guardarRolagem(){try{const j=sessionStorage.getItem(TELA_CH)||localStorage.getItem(TELA_CH);if(!j)return;const o=JSON.parse(j);o.y=Math.round(window.scrollY||0);o.t=Date.now();const k=JSON.stringify(o);sessionStorage.setItem(TELA_CH,k);localStorage.setItem(TELA_CH,k)}catch(e){}}
window.addEventListener("pagehide",()=>{if(sessao&&rota.tela==="quiz"){pararRelogio();salvar()}guardarRolagem()});
document.addEventListener("visibilitychange",()=>{if(document.hidden)guardarRolagem()});
function restaurarTela(){let o=null;
  try{const a=sessionStorage.getItem(TELA_CH);if(a)o=JSON.parse(a);else{const b=localStorage.getItem(TELA_CH);const x=b&&JSON.parse(b);if(x&&Date.now()-(x.t||0)<TELA_VALE)o=x}}catch(e){o=null}
  if(!o||!o.rota||typeof o.rota.tela!=="string")return 0;
  const so=r=>r&&typeof r==="object"&&typeof r.tela==="string"&&!["quiz","cartao","ls-quiz"].includes(r.tela);
  let pl=Array.isArray(o.pilha)?o.pilha.filter(so):[],rt=o.rota;
  if(rt.tela==="quiz"){const x=o.sid&&S.hist.find(a=>a.id===o.sid&&a.status==="pausado");
    if(x){sessao=x;idx=Math.max(0,Math.min(+o.idx||0,x.qids.length-1));folha=false;confirmar=null}else rt=pl.pop()||{tela:"hoje"}}
  else if(rt.tela==="cartao"){if(o.deck&&Array.isArray(o.deck.q)&&o.deck.q.length)deck=o.deck;else rt={tela:"cartoes"}}
  else if(rt.tela==="ls-quiz"){if(o.ls&&Array.isArray(o.ls.itens))lsSess=o.ls}
  if(rt.tela==="hoje"&&!pl.length)return 0;
  rt.manterScroll=false;rota=rt;pilha=pl;return rt.tela==="quiz"?0:(+o.y||0)}
function voltarRolagem(y){if(!y)return;let n=0;const f=()=>{if(n++>6)return;const max=document.documentElement.scrollHeight-innerHeight;if(max>=y-4){window.scrollTo(0,y);return}window.scrollTo(0,Math.max(0,max));setTimeout(f,250)};requestAnimationFrame(f)}

/* ---------- botão voltar do celular ----------
   Enquanto houver para onde voltar (menu ou janela aberta, tela interna, ou outra aba que não seja Hoje),
   o app mantém uma entrada extra no histórico. O voltar do sistema consome essa entrada e o app volta
   um passo; em Hoje, sem nada aberto, a entrada some e o próximo voltar sai do app normalmente. */
let guardaVoltar=false;
function podeVoltar(){return !!(tourI>=0||gaveta||repQ||folha||document.querySelector(".festa")||pilha.length||rota.tela!=="hoje")}
function syncVoltar(){try{if(podeVoltar()){if(!guardaVoltar){history.pushState({fl:1},"");guardaVoltar=true}}else if(guardaVoltar){guardaVoltar=false;history.back()}}catch(e){}}
function voltarSistema(){
  if(tourI>=0){if(tourI>0)tourIr(tourI-1);else tourFechar();return}
  const fs=document.querySelector(".festa");if(fs){fs.remove();return}
  if(repQ){repQ=null;rota.manterScroll=true;render();return}
  if(gaveta){gaveta=false;rota.manterScroll=true;render();return}
  if(folha){folha=false;confirmar=null;rota.manterScroll=true;render();return}
  /* usa o mesmo botão de voltar do topo, que já sabe pausar o simulado, salvar a leitura etc. */
  const b=document.querySelector('.topo .topo-linha > button.icone:first-child');
  if(b&&b.dataset.acao!=="gaveta"){b.click();return}
  if(rota.tela!=="hoje"){raiz({tela:"hoje"});return}
}
window.addEventListener("popstate",()=>{if(!guardaVoltar)return;guardaVoltar=false;voltarSistema();syncVoltar()});

