"use strict";
/* ---------- ícones ---------- */
const P={
 balanca:'<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
 lampada:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
 colunas:'<path d="M3 10h18L12 4zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
 coracao:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 urna:'<path d="M4 12h16v8H4zM8 12V4h8v8M10 8h4"/>',
 globo:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 moedas:'<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7M3 11v4c0 1.7 2.7 3 6 3 1 0 2-.1 2.8-.4"/><circle cx="17" cy="16" r="4"/>',
 recibo:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 15l6-6M9.5 9.5h.01M14.5 14.5h.01"/>',
 predio:'<path d="M4 21V9l8-5 8 5v12M3 21h18M9 21v-5h6v5M8 12h.01M12 12h.01M16 12h.01"/>',
 folha:'<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15zM5 19l8-8"/>',
 familia:'<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 21v-2a5 5 0 0 1 10 0v2M13.5 21v-1.5a3.5 3.5 0 0 1 7 0V21"/>',
 crianca:'<circle cx="12" cy="5" r="2.5"/><path d="M12 8v7M7 11l5-2 5 2M9 21l3-6 3 6"/>',
 carrinho:'<path d="M3 4h2l2.5 11h10L20 7H6.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
 maleta:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
 martelo:'<path d="M13 4l7 7M10.5 6.5l7 7M12 5l-3.5 3.5 7 7L19 12M10 10l-7 7 2 2 7-7M3 21h9"/>',
 algema:'<circle cx="7" cy="15" r="4"/><circle cx="17" cy="15" r="4"/><path d="M9.5 11.8l2.5-3.3 2.5 3.3"/>',
 lupa:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
 guardachuva:'<path d="M3 12a9 9 0 0 1 18 0zM12 12v6a2 2 0 0 0 4 0M12 3v0"/>',
 capacete:'<path d="M3 17h18M5 17v-3a7 7 0 0 1 14 0v3M10 7V5h4v2"/>',
 prancheta:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 12l2 2 4-4"/>',
 livro:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7"/>',
 coroa:'<path d="M3 18h18M4 18L3 7l5 4 4-6 4 6 5-4-1 11"/>',
 grupo:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M15 20a4 4 0 0 1 6-3.5"/>',
 balao:'<path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
 digital:'<path d="M12 4a7 7 0 0 0-7 7v3M12 8a3 3 0 0 0-3 3v4a5 5 0 0 0 2 4M12 12v3a7 7 0 0 0 3 5M15 11a3 3 0 0 0-3-3M19 11a7 7 0 0 0-7-7M19 14v-3"/>',
 aperto:'<path d="M2 12l4-4 4 2 3-2 4 1 5 3M6 8v6l5 5 2-2 2 2 3-3-5-5M10 10l3 3"/>',
 pasta:'<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
 escudo:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
 alvo:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>', voltar:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
 ant:'<path d="M15 6l-6 6 6 6"/>', prox:'<path d="M9 6l6 6-6 6"/>', tesoura:'<circle cx="6" cy="7" r="2.6"/><circle cx="6" cy="17" r="2.6"/><path d="M8.2 8.4L20 17M8.2 15.6L20 7"/>', setas:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
 grade:'<rect x="4" y="4" width="4" height="4" rx="1"/><rect x="10" y="4" width="4" height="4" rx="1"/><rect x="16" y="4" width="4" height="4" rx="1"/><rect x="4" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="16" y="10" width="4" height="4" rx="1"/><rect x="4" y="16" width="4" height="4" rx="1"/><rect x="10" y="16" width="4" height="4" rx="1"/><rect x="16" y="16" width="4" height="4" rx="1"/>',
 relogio:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
 pct:'<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
 barras:'<path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/>',
 ok:'<path d="M5 12.5l4.5 4.5L19 7.5"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>', exc:'<path d="M12 5v9M12 19h.01"/>',
 pausa:'<path d="M9 5v14M15 5v14"/>', estrela:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 mais:'<path d="M12 5v14M5 12h14"/>', carro:'<path d="M12 3l9 4-9 4-9-4zM7 9v5c0 1.5 2.2 3 5 3s5-1.5 5-3V9M21 7v6"/>',
 refazer:'<path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4"/>', info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
 eng:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 sol:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 lua:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 meio:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
 baixo:'<path d="M12 5v14M6 13l6 6 6-6"/>', cima:'<path d="M12 19V5M6 11l6-6 6 6"/>',
 chama:'<path d="M12 21c-4 0-7-2.8-7-6.6 0-3.1 2.2-5 3.6-6.8.4 1.5 1.3 2.6 2.4 3 0-3.2 1.4-6 4-7.6-.3 2.7.9 4.4 2.3 6.2 1 1.3 1.7 2.8 1.7 4.9C19 18.3 16 21 12 21z"/><path d="M12 21c-1.7 0-3-1.2-3-2.8 0-1.6 1.3-2.6 2.2-3.7.3 1 1 1.6 1.8 1.8.4-1 1-1.8 1.7-2.3.2 1.1.3 1.9.3 2.9 0 2.4-1.3 4.1-3 4.1z"/>',
 cartas:'<rect x="7" y="4" width="13" height="16" rx="2"/><path d="M4 7.5v10A2.5 2.5 0 0 0 6.5 20"/><path d="M11 10a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.6M13.5 16.5h.01"/>',
 marcador:'<path d="M6 3h12v18l-6-4-6 4z"/>',
 seta:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 som:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
 mudo:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9.5l5 5M22 9.5l-5 5"/>',
 nota:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
 vibra:'<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M4 8v8M20 8v8M11 17h2"/>',
 sino:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>',
 calendario:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'
};
const ic=(n,cls)=>`<svg class="i${cls?" "+cls:""}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||""}</svg>`;

/* ---------- matérias e grade ---------- */
const META={
 etica:{nome:"Ética Profissional",cor:"#8a5a1f",ic:"balanca"}, filo:{nome:"Filosofia do Direito",cor:"#7a4fb0",ic:"lampada"},
 const:{nome:"Direito Constitucional",cor:"#1f5fa8",ic:"colunas"}, dh:{nome:"Direitos Humanos",cor:"#c2416b",ic:"coracao"},
 eleit:{nome:"Direito Eleitoral",cor:"#3b6e8f",ic:"urna"}, inter:{nome:"Direito Internacional",cor:"#1c8585",ic:"globo"},
 fin:{nome:"Direito Financeiro",cor:"#8f7310",ic:"moedas"}, trib:{nome:"Direito Tributário",cor:"#b0532a",ic:"recibo"},
 adm:{nome:"Direito Administrativo",cor:"#44609c",ic:"predio"}, amb:{nome:"Direito Ambiental",cor:"#2f8a45",ic:"folha"},
 civil:{nome:"Direito Civil",cor:"#2a7a6a",ic:"familia"}, eca:{nome:"ECA",cor:"#cc6526",ic:"crianca"},
 cdc:{nome:"Direito do Consumidor",cor:"#a0367a",ic:"carrinho"}, emp:{nome:"Direito Empresarial",cor:"#55606e",ic:"maleta"},
 pc:{nome:"Processo Civil",cor:"#6b3fa0",ic:"martelo"}, penal:{nome:"Direito Penal",cor:"#b03030",ic:"algema"},
 pp:{nome:"Processo Penal",cor:"#8a3f3f",ic:"lupa"}, prev:{nome:"Direito Previdenciário",cor:"#2b7fb8",ic:"guardachuva"},
 trab:{nome:"Direito do Trabalho",cor:"#b07f0c",ic:"capacete"}, pt:{nome:"Processo do Trabalho",cor:"#866420",ic:"prancheta"},
 ied:{nome:"Introdução ao Estudo do Direito",cor:"#4d6b8a",ic:"livro"}, tge:{nome:"Teoria do Estado e Ciência Política",cor:"#8a6b2d",ic:"coroa"},
 soc:{nome:"Sociologia Jurídica",cor:"#3e8a6b",ic:"grupo"}, psc:{nome:"Pensamento Social Contemporâneo",cor:"#7b5ea8",ic:"balao"},
 crim:{nome:"Criminologia",cor:"#5f6b66",ic:"digital"}, masc:{nome:"Mediação e Arbitragem",cor:"#2e8b8b",ic:"aperto"}
};
/* ordem da prova e quantidade por matéria (80 questões) */
const DIST=[["etica",8],["filo",2],["const",6],["dh",2],["eleit",2],["inter",2],["fin",2],["trib",5],["adm",5],["amb",2],["civil",6],["eca",2],["cdc",2],["emp",4],["pc",6],["penal",6],["pp",6],["prev",2],["trab",5],["pt",5]];
const OAB=DIST.map(d=>d[0]);
const N_SIM=30;
/* disciplinas da faculdade: filtro por matéria (m) ou por tema (t) */
const DISC={
 ied:{m:["ied"]}, tge:{m:["tge"]}, soc:{m:["soc"]}, psc:{m:["psc"]}, filo:{m:["filo"]},
 civ1:{nome:"Direito Civil I — Parte Geral",t:["civ1"],base:"civil"}, con1:{nome:"Constitucional I — Teoria e Direitos Fundamentais",t:["con1"],base:"const"},
 pen1:{nome:"Direito Penal I — Teoria do Crime",t:["pen1"],base:"penal"}, tgp:{nome:"Teoria Geral do Processo",t:["tgp"],base:"pc"},
 civ2:{nome:"Direito Civil II — Obrigações e Responsabilidade",t:["civ2"],base:"civil"}, con2:{nome:"Constitucional II — Organização do Estado e Controle",t:["con2"],base:"const"},
 pen2:{nome:"Direito Penal II — Teoria da Pena",t:["pen2"],base:"penal"}, pc1:{nome:"Processo Civil I — Procedimento Comum",t:["pc1"],base:"pc"}, dh:{m:["dh"]},
 civ3:{nome:"Direito Civil III — Contratos",t:["civ3"],base:"civil"}, pen3:{nome:"Direito Penal III — Crimes em Espécie",t:["pen3"],base:"penal"},
 pc2:{nome:"Processo Civil II — Recursos e Execução",t:["pc2"],base:"pc"}, adm:{m:["adm"]}, emp:{m:["emp"]},
 civ4:{nome:"Direito Civil IV — Coisas",t:["civ4"],base:"civil"}, pp1:{nome:"Processo Penal I — Investigação, Ação e Provas",t:["pp1"],base:"pp"},
 trab:{m:["trab"]}, cdc:{m:["cdc"]}, inter:{m:["inter"]},
 civ5:{nome:"Direito Civil V — Família e Sucessões",t:["civ5"],base:"civil"}, pp2:{nome:"Processo Penal II — Prisões, Procedimentos e Recursos",t:["pp2"],base:"pp"},
 pt:{m:["pt"]}, trib:{m:["trib"]}, eca:{m:["eca"]},
 amb:{m:["amb"]}, fin:{m:["fin"]}, prev:{m:["prev"]}, eleit:{m:["eleit"]}, crim:{m:["crim"]},
 etica:{m:["etica"]}, masc:{m:["masc"]}, prc:{nome:"Prática Jurídica Cível",m:["civil","pc","cdc"],cor:"#2a6f7a",ic:"pasta"},
 prp:{nome:"Prática Jurídica Penal",m:["penal","pp"],cor:"#a03535",ic:"escudo"}, prt:{nome:"Prática Jurídica Trabalhista",m:["trab","pt"],cor:"#a8760c",ic:"capacete"},
 prpub:{nome:"Prática Jurídica Pública",m:["const","adm","trib"],cor:"#3a5f9e",ic:"colunas"},
 rev:{nome:"Revisão Geral para a OAB",m:OAB,cor:"#c06a1a",ic:"alvo"}
};
const PERIODOS=[
 ["ied","tge","soc","psc","filo","crim"], ["civ1","con1","pen1","tgp"], ["civ2","con2","pen2","pc1","dh"],
 ["civ3","pen3","pc2","adm","emp"], ["civ4","pp1","trab","cdc","inter"], ["civ5","pp2","pt","trib","eca"],
 ["amb","fin","prev","eleit"], ["etica","masc","prc"], ["prp","prt","prpub"], ["rev"]
];
function infoDisc(d){const x=DISC[d],b=META[x.base||(x.m&&x.m[0])]||{};return {nome:x.nome||META[d].nome,cor:x.cor||b.cor||"#555",ic:x.ic||b.ic||"livro"}}

/* ---------- banco ---------- */
const QS=window.QUESTOES||[]; const QMAP={}; QS.forEach(q=>QMAP[q.id]=q);
const TMAP={ci01:"civ1",ci02:"civ1",ci03:"civ1",ci04:"civ1",ci05:"civ2",ci06:"civ5",ci07:"civ4",ci08:"civ5",
 co01:"con1",co02:"con1",co03:"con1",co04:"con1",co05:"con2",co06:"con1",co07:"con1",co08:"con2",
 pe01:"pen1",pe02:"pen1",pe03:"pen1",pe04:"pen1",pe05:"pen2",pe06:"pen1",pe07:"pen1",
 pc01:"pc1",pc02:"pc1",pc03:"pc2",pc04:"pc2",pc05:"pc1",pc06:"pc1",pc07:"pc2",pc08:"pc1",
 pp01:"pp1",pp02:"pp1",pp03:"pp2",pp04:"pp2",pp05:"pp1",pp06:"pp2",pp07:"pp2"};
QS.forEach(q=>{if(!q.t)q.t=TMAP[q.id]||q.m});
const porM={}; QS.forEach(q=>(porM[q.m]=porM[q.m]||[]).push(q.id));
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function permFixa(ids,seed){const r=rng(hash(seed));const a=ids.slice().sort();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function emb(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const PERM={}; Object.keys(porM).forEach(m=>PERM[m]=permFixa(porM[m],"oab-"+m));
function idsDisc(d){const x=DISC[d];return QS.filter(q=>x.t?x.t.includes(q.t):x.m.includes(q.m)).map(q=>q.id)}
const TAM_MAT=20, TAM_FAC=10, TAM_PER=20;
/* ---------- níveis de dificuldade (faculdade) ---------- */
const NIV={}; (window.NIVEIS||[]).forEach((l,i)=>l.split(" ").forEach(id=>{if(id)NIV[id]=i+1}));
const nv=id=>NIV[id]||3;
const NIVEL_INFO=[
 {nome:"Básico",dica:"Conceitos centrais e definições da matéria. Bom ponto de partida para quem está começando."},
 {nome:"Regras",dica:"As regras principais da lei e seus requisitos, cobrados de forma direta."},
 {nome:"Detalhes",dica:"Prazos, números e diferenças entre institutos parecidos. Atenção aos detalhes de cada alternativa."},
 {nome:"Avançado",dica:"Exceções, regras específicas e alternativas parecidas entre si. Leia cada opção com calma."},
 {nome:"Desafio",dica:"Súmulas, teses dos tribunais e questões que pedem para juntar várias regras."}];
/* ordena do mais simples ao mais difícil; dentro do mesmo nível, ordem fixa sorteada */
function porNivel(ids,seed){return permFixa(ids,seed).map((id,i)=>[id,i]).sort((a,b)=>nv(a[0])-nv(b[0])||a[1]-b[1]).map(x=>x[0])}
/* divide em blocos de tamanho parecido, sem sobra no último */
function fatias(l,tam){const n=Math.max(1,Math.floor(l.length/tam));const out=[];let ini=0;for(let k=0;k<n;k++){const fim=Math.round((k+1)*l.length/n);out.push(l.slice(ini,fim));ini=fim}return out}
const CACHE_FAC={};
function blocosFac(d){return CACHE_FAC[d]||(CACHE_FAC[d]=fatias(porNivel(idsDisc(d),"fac-"+d),TAM_FAC))}
/* nível exibido do simulado: posição na sequência (1º = Fundamentos ... último = Desafio) */
function nivelPos(i,n){return n<2?0:Math.min(5,Math.floor(i*5/n)+1)}
/* até 5 simulados: um nível por simulado; acima disso, o nível médio das questões do bloco */
function nivelBloco(bs,i){const n=bs.length;if(n<2||!bs[i])return 0;if(n<=5)return nivelPos(i,n);const m=bs[i].reduce((a,id)=>a+nv(id),0)/bs[i].length;return Math.min(5,Math.max(1,Math.round(m)))}
function nivelDe(key){const p=key.split(":");if(p[0]==="fac")return nivelBloco(blocosFac(p[1]),+p[2]);if(p[0]==="per")return nivelBloco(blocosPer(+p[1]),+p[2]);return 0}
function barras(n){let h='<span class="barras" aria-hidden="true">';for(let k=1;k<=5;k++)h+=`<i${k<=n?' class="on"':""}></i>`;return h+"</span>"}
function chipNivel(n){return n?`<span class="nivel" style="--c:var(--nv${n})">${barras(n)}Nível ${n} · ${NIVEL_INFO[n-1].nome}</span>`:""}
function escada(){return `<div class="escada" aria-label="Escala de dificuldade">${NIVEL_INFO.map((x,i)=>`<span style="--c:var(--nv${i+1})"><b>${i+1}</b>${x.nome}</span>`).join("")}</div>`}
/* dentro do simulado: começa pelas mais simples; mesma dificuldade em ordem nova a cada tentativa */
function rampa(ids){return emb(ids).sort((a,b)=>nv(a)-nv(b))}
/* questões do período: intercala as disciplinas para que cada simulado misture todas */
const CACHE_PER={};
function idsPer(i){if(CACHE_PER[i])return CACHE_PER[i];
  const listas=PERIODOS[i].map(d=>porNivel(idsDisc(d),"per-"+i+"-"+d));const vistos=new Set(),out=[];
  let resta=true;for(let r=0;resta;r++){resta=false;listas.forEach(l=>{if(r<l.length){resta=true;const id=l[r];if(!vistos.has(id)){vistos.add(id);out.push(id)}}})}
  /* mantém a mistura das disciplinas, mas em ordem crescente de dificuldade */
  return CACHE_PER[i]=out.map((id,k)=>[id,k]).sort((a,b)=>nv(a[0])-nv(b[0])||a[1]-b[1]).map(x=>x[0])}
const CACHE_PB={};
function blocosPer(i){return CACHE_PB[i]||(CACHE_PB[i]=fatias(idsPer(i),TAM_PER))}

/* definição de cada simulado pela chave */
function sim(key){
  const p=key.split(":");
  if(p[0]==="oab"){const k=+p[1];const qids=[];DIST.forEach(([m,c])=>{const l=PERM[m]||[];if(!l.length)return;for(let j=0;j<c&&j<l.length;j++)qids.push(l[(k*c+j)%l.length])});
    return {key,tipo:"oab",titulo:"Simulado "+String(k+1).padStart(2,"0"),sub:"Prova completa · 80 questões",qids,limite:5*3600,fixa:true}}
  if(p[0]==="mat"){const m=p[1],i=+p[2],l=PERM[m]||[];const n=Math.min(TAM_MAT,l.length);const qids=[];for(let j=0;j<n;j++)qids.push(l[(i*TAM_MAT+j)%l.length]);
    return {key,tipo:"mat",titulo:"Simulado "+String(i+1).padStart(2,"0"),sub:META[m].nome,qids,limite:0}}
  if(p[0]==="mtodas"){const m=p[1];return {key,tipo:"mat",titulo:"Todas as questões",sub:META[m].nome,qids:(PERM[m]||[]).slice(),limite:0}}
  if(p[0]==="fac"){const d=p[1],i=+p[2],qids=(blocosFac(d)[i]||[]).slice();
    return {key,tipo:"fac",titulo:"Simulado "+String(i+1).padStart(2,"0"),sub:infoDisc(d).nome,qids,limite:0,rampa:true,nivel:nivelDe(key)}}
  if(p[0]==="faixa"){const d=p[1],[a,b]=p[2].split("-").map(Number),i=+p[3],qids=(blocosFaixa(d,a,b)[i]||[]).slice();
    return {key,tipo:"fac",titulo:"Simulado "+String(i+1).padStart(2,"0")+" · "+txtFaixa({ini:a,fim:b}),sub:infoDisc(d).nome,qids,limite:0,rampa:true}}
  if(p[0]==="ftodas"){const d=p[1];return {key,tipo:"fac",titulo:"Todas as questões",sub:infoDisc(d).nome,qids:idsDisc(d),limite:0}}
  if(p[0]==="per"){const i=+p[1],k=+p[2],qids=(blocosPer(i)[k]||[]).slice();
    return {key,tipo:"fac",titulo:"Simulado "+String(k+1).padStart(2,"0"),sub:`${i+1}º período · todas as disciplinas`,qids,limite:0,rampa:true,nivel:nivelDe(key)}}
  if(p[0]==="ptodas"){const i=+p[1];return {key,tipo:"fac",titulo:"Todas as questões",sub:`${i+1}º período · todas as disciplinas`,qids:idsPer(i).slice(),limite:0}}
  if(p[0]==="ass"){const sc=p[1],a=decodeURIComponent(p[2]||"");const qids=idsEscopo(sc).filter(id=>QMAP[id]&&grupoDe(QMAP[id])===a);
    return {key,tipo:"ass",titulo:"Treino: "+a,sub:nomeCurto(nomeEscopo(sc)),qids,limite:0}}
  if(p[0]==="errhoje"){return {key,tipo:"err",titulo:"Revisão espaçada",sub:"Questões erradas que chegaram no dia de revisão",qids:errosHoje(),limite:0}}
  if(p[0]==="teim"){return {key,tipo:"err",titulo:"Questões teimosas",sub:"As que você errou mais de uma vez",qids:rvTeimQ(),limite:0}}
  if(p[0]==="cad")return cadSim(key,p);
  if(p[0]==="err"){return {key,tipo:"err",titulo:"Refazer erradas",sub:"Questões que você errou na última tentativa",qids:Object.keys(S.stats).filter(k=>S.stats[k].u===0&&QMAP[k]),limite:0}}
  return null;
}
const nMat=m=>Math.max(1,Math.ceil((PERM[m]||[]).length/TAM_MAT));
const nFac=d=>blocosFac(d).length;
const nPer=i=>blocosPer(i).length;

/* ---------- apostilas ---------- */
const AP_DISC={ied:"livros",tge:"estado",soc:"rede",psc:"mente",filo:"balanca",crim:"lupa",civ1:"pessoa",con1:"escudo",pen1:"grade",tgp:"processo",
 civ2:"corrente",con2:"tribunal",pen2:"ampulheta",pc1:"processo",dh:"globo",civ3:"contrato",pen3:"martelo",pc2:"martelo",adm:"estado",emp:"moedas",
 civ4:"casa",pp1:"lupa",trab:"trabalho",cdc:"carrinho",inter:"globo",civ5:"familia",pp2:"martelo",pt:"trabalho",trib:"moedas",eca:"crianca",
 amb:"arvore",fin:"moedas",prev:"guarda",eleit:"urna",etica:"balanca",masc:"dialogo",prc:"contrato",prp:"grade",prt:"trabalho",prpub:"tribunal",rev:"livros"};
function moedasSvg(){let h="";for(let k=0;k<2;k++){const x=k?98:62;const n=k?3:5;for(let i=0;i<n;i++){const y=124-i*11;h+=`<rect x="${x-20}" y="${y-5}" width="40" height="10" class="f-b"/><ellipse cx="${x}" cy="${y+5}" rx="20" ry="5" class="f-b"/><ellipse cx="${x}" cy="${y-5}" rx="20" ry="5" class="f-b s-t" stroke-width="1.5"/>`}}
 return h+`<rect x="138" y="98" width="14" height="30" rx="2" class="f-a"/><rect x="158" y="82" width="14" height="46" rx="2" class="f-a"/><rect x="178" y="62" width="14" height="66" rx="2" class="f-t"/><path d="M134 90l22-20 14 10 28-28" class="s-b" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M186 50h14v14" class="s-b" fill="none" stroke-width="4" stroke-linecap="round"/>`}
function engrenagem(cx,cy,r){let h="";for(let i=0;i<8;i++)h+=`<rect x="${cx-5}" y="${cy-r-8}" width="10" height="14" rx="2" class="f-a" transform="rotate(${i*45} ${cx} ${cy})"/>`;return h+`<circle cx="${cx}" cy="${cy}" r="${r}" class="f-a"/><circle cx="${cx}" cy="${cy}" r="${r*0.4}" class="f-s"/>`}
const ILU={
 balanca:`<rect x="114" y="38" width="12" height="86" rx="4" class="f-t"/><path d="M94 128h52l-7-10h-38z" class="f-t"/><rect x="58" y="42" width="124" height="7" rx="3.5" class="f-a"/><circle cx="120" cy="38" r="9" class="f-b"/><path d="M66 49l-17 38M66 49l17 38M174 49l-17 38M174 49l17 38" class="s-t" stroke-width="2" fill="none" opacity=".7"/><path d="M42 87h48a24 12 0 0 1-48 0z" class="f-b"/><path d="M150 87h48a24 12 0 0 1-48 0z" class="f-b"/>`,
 livros:`<rect x="52" y="110" width="84" height="16" rx="3" class="f-t"/><rect x="60" y="94" width="72" height="16" rx="3" class="f-a"/><rect x="50" y="78" width="78" height="16" rx="3" class="f-b"/><path d="M62 118h56M70 102h48M60 86h52" class="s-w" stroke-width="2" opacity=".6"/><path d="M146 72q20-10 40 0v52q-20-10-40 0z" class="f-w s-t" stroke-width="2"/><path d="M186 72q20-10 40 0v52q-20-10-40 0z" class="f-w s-t" stroke-width="2"/><path d="M153 86q13-6 26 0M153 97q13-6 26 0M153 108q13-6 26 0M193 86q13-6 26 0M193 97q13-6 26 0" class="s-a" fill="none" stroke-width="2.5" stroke-linecap="round"/>`,
 estado:`<rect x="70" y="82" width="100" height="44" class="f-w s-t" stroke-width="2"/><path d="M88 82a32 28 0 0 1 64 0z" class="f-a"/><path d="M120 54V26" class="s-t" stroke-width="3"/><path d="M120 26h28l-7 7 7 7h-28z" class="f-b"/><path d="M84 90v30M100 90v30M116 90v30M132 90v30M148 90v30M160 90v30" class="s-a" stroke-width="6" opacity=".55"/><rect x="62" y="124" width="116" height="7" rx="2" class="f-t"/>`,
 rede:`<path d="M120 60L70 90M120 60L170 90M70 90L95 124M170 90L145 124M95 124h50M120 60L95 124M120 60L145 124M70 90h100" class="s-t" stroke-width="2.5" opacity=".45"/>`+[[120,60,"f-b"],[70,90,"f-a"],[170,90,"f-a"],[95,124,"f-t"],[145,124,"f-t"]].map(([x,y,c])=>`<circle cx="${x}" cy="${y-7}" r="7" class="${c}"/><path d="M${x-11} ${y+9}a11 10 0 0 1 22 0z" class="${c}"/>`).join(""),
 mente:`<path d="M90 132v-18c-13-7-20-20-20-35 0-25 21-44 48-44s46 19 46 42c0 7 6 13 8 17 1 3-2 5-5 5h-5v12c0 7-5 11-12 11h-12v10z" class="f-t"/><circle cx="118" cy="76" r="17" class="f-b"/><rect x="111" y="91" width="14" height="10" rx="2" class="f-w"/><path d="M118 50v-7M93 76h-7M143 76h7M100 58l-5-5M136 58l5-5" class="s-b" stroke-width="3" stroke-linecap="round"/>`,
 lupa:`<rect x="62" y="34" width="76" height="96" rx="6" class="f-w s-t" stroke-width="2"/><path d="M74 52h52M74 64h52M74 76h34" class="s-a" stroke-width="4" stroke-linecap="round" opacity=".6"/><circle cx="142" cy="96" r="26" class="f-s s-t" stroke-width="7"/><path d="M161 115l22 22" class="s-t" stroke-width="10" stroke-linecap="round"/><path d="M130 104c0-10 5-16 12-16s12 6 12 16M135 106c0-8 3-12 7-12s7 4 7 12M142 100v10" class="s-b" fill="none" stroke-width="2.5" stroke-linecap="round"/>`,
 pessoa:`<rect x="56" y="46" width="128" height="84" rx="10" class="f-w s-t" stroke-width="2"/><path d="M56 56a10 10 0 0 1 10-10h108a10 10 0 0 1 10 10v8H56z" class="f-a"/><rect x="68" y="76" width="38" height="44" rx="5" class="f-s"/><circle cx="87" cy="92" r="8" class="f-t"/><path d="M75 120a12 10 0 0 1 24 0z" class="f-t"/><path d="M116 84h54M116 97h40M116 110h48" class="s-a" stroke-width="4" stroke-linecap="round" opacity=".55"/><circle cx="170" cy="118" r="8" class="f-b"/>`,
 corrente:`<rect x="46" y="68" width="60" height="30" rx="15" class="s-a" fill="none" stroke-width="9"/><rect x="90" y="68" width="60" height="30" rx="15" class="s-b" fill="none" stroke-width="9"/><rect x="134" y="68" width="60" height="30" rx="15" class="s-t" fill="none" stroke-width="9"/><text x="76" y="124" class="t-m" text-anchor="middle">CREDOR</text><text x="164" y="124" class="t-m" text-anchor="middle">DEVEDOR</text><text x="120" y="50" class="t-m" text-anchor="middle">VÍNCULO</text>`,
 contrato:`<rect x="62" y="28" width="98" height="110" rx="6" class="f-w s-t" stroke-width="2"/><rect x="76" y="42" width="58" height="8" rx="4" class="f-a"/><path d="M76 62h70M76 74h70M76 86h54" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".35"/><path d="M78 118c8-12 14-12 12 0s10-10 16-4 8 6 18-2" class="s-t" fill="none" stroke-width="2.5" stroke-linecap="round"/><path d="M150 128l40-40 8 8-40 40-12 4z" class="f-b"/><path d="M190 88l6-6 8 8-6 6z" class="f-t"/>`,
 casa:`<rect x="74" y="78" width="92" height="54" class="f-w s-t" stroke-width="2"/><path d="M64 82l56-44 56 44z" class="f-a"/><rect x="142" y="46" width="10" height="20" class="f-a"/><rect x="108" y="100" width="24" height="32" rx="3" class="f-t"/><rect x="84" y="92" width="16" height="16" rx="2" class="f-s s-t"/><rect x="140" y="92" width="16" height="16" rx="2" class="f-s s-t"/><circle cx="194" cy="100" r="11" class="s-b" fill="none" stroke-width="6"/><path d="M194 111v22M194 124h8M194 131h6" class="s-b" stroke-width="5" stroke-linecap="round"/>`,
 familia:`<path d="M120 46c-6-8-18-4-16 6 2 8 16 16 16 16s14-8 16-16c2-10-10-14-16-6z" class="f-b"/><circle cx="86" cy="72" r="11" class="f-t"/><path d="M68 130v-30a18 18 0 0 1 36 0v30z" class="f-t"/><circle cx="154" cy="72" r="11" class="f-a"/><path d="M136 130v-30a18 18 0 0 1 36 0v30z" class="f-a"/><circle cx="120" cy="94" r="8" class="f-b"/><path d="M107 130v-18a13 13 0 0 1 26 0v18z" class="f-b"/>`,
 escudo:`<path d="M120 28l48 17v35c0 29-21 48-48 56-27-8-48-27-48-56V45z" class="f-a"/><path d="M120 41l35 12v27c0 21-15 36-35 42-20-6-35-21-35-42V53z" class="f-w" opacity=".22"/><path d="M99 84l15 15 29-31" class="s-w" fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
 tribunal:`<path d="M58 66l62-32 62 32z" class="f-a"/><rect x="62" y="66" width="116" height="8" class="f-t"/><path d="M76 78v40M98 78v40M120 78v40M142 78v40M164 78v40" class="s-t" stroke-width="10" opacity=".7"/><rect x="58" y="118" width="124" height="7" class="f-t"/><rect x="50" y="125" width="140" height="7" class="f-b"/>`,
 grade:`<rect x="70" y="26" width="100" height="82" rx="8" class="f-t"/><rect x="80" y="36" width="80" height="62" rx="4" class="f-s"/><path d="M96 36v62M112 36v62M128 36v62M144 36v62" class="s-t" stroke-width="5"/><circle cx="104" cy="124" r="9" class="s-b" fill="none" stroke-width="5"/><circle cx="136" cy="124" r="9" class="s-b" fill="none" stroke-width="5"/><path d="M113 124h14" class="s-b" stroke-width="4"/>`,
 ampulheta:`<rect x="84" y="28" width="72" height="9" rx="4" class="f-t"/><rect x="84" y="123" width="72" height="9" rx="4" class="f-t"/><path d="M94 37h52c0 22-20 31-20 43s20 21 20 43H94c0-22 20-31 20-43s-20-21-20-43z" class="f-w s-t" stroke-width="2"/><path d="M100 46h40c-3 12-14 19-20 25-6-6-17-13-20-25z" class="f-b"/><path d="M98 123c4-12 14-18 22-20 8 2 18 8 22 20z" class="f-b"/><path d="M120 72v30" class="s-b" stroke-width="2" stroke-dasharray="3 3"/>`,
 martelo:`<rect x="118" y="116" width="74" height="14" rx="4" class="f-t"/><g transform="rotate(-35 110 70)"><rect x="70" y="52" width="80" height="34" rx="8" class="f-a"/><rect x="62" y="48" width="12" height="42" rx="4" class="f-t"/><rect x="146" y="48" width="12" height="42" rx="4" class="f-t"/><rect x="104" y="86" width="12" height="62" rx="5" class="f-b"/></g><path d="M186 100l10-8M190 110h12" class="s-b" stroke-width="3" stroke-linecap="round"/>`,
 processo:[[40,64],[98,52],[156,40]].map(([x,y],i)=>`<rect x="${x}" y="${y}" width="44" height="58" rx="5" class="f-w s-t" stroke-width="2"/><rect x="${x+7}" y="${y+9}" width="30" height="6" rx="3" class="${i===2?"f-b":"f-a"}"/><path d="M${x+7} ${y+24}h30M${x+7} ${y+33}h30M${x+7} ${y+42}h20" class="s-t" stroke-width="3" stroke-linecap="round" opacity=".35"/>`).join("")+`<path d="M88 90h8M146 78h8" class="s-b" stroke-width="3"/><path d="M92 85l6 5-6 5M150 73l6 5-6 5" class="s-b" fill="none" stroke-width="3"/><circle cx="194" cy="100" r="13" class="f-b"/><path d="M188 100l4 4 8-8" class="s-w" fill="none" stroke-width="3" stroke-linecap="round"/>`,
 globo:`<circle cx="120" cy="76" r="46" class="f-a"/><path d="M74 76h92M120 30v92M120 30c-20 14-20 78 0 92M120 30c20 14 20 78 0 92M80 54h80M80 98h80" class="s-w" fill="none" stroke-width="2.5" opacity=".7"/><ellipse cx="120" cy="76" rx="72" ry="18" class="s-b" fill="none" stroke-width="3" transform="rotate(-18 120 76)"/><circle cx="172" cy="52" r="6" class="f-b"/><path d="M120 122v8M100 132h40" class="s-t" stroke-width="5" stroke-linecap="round"/>`,
 trabalho:`<path d="M52 104a36 34 0 0 1 72 0z" class="f-b"/><rect x="46" y="102" width="84" height="10" rx="5" class="f-b"/><rect x="82" y="68" width="12" height="36" rx="5" class="f-t"/>`+engrenagem(166,88,22)+`<path d="M60 126h80" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".4"/>`,
 carrinho:`<path d="M52 48h16l14 58h72l12-42H78" class="s-t" fill="none" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><path d="M82 70h80l-9 32H90z" class="f-a"/><circle cx="96" cy="120" r="8" class="f-t"/><circle cx="146" cy="120" r="8" class="f-t"/><path d="M190 36l18 6v13c0 11-8 18-18 21-10-3-18-10-18-21V42z" class="f-b"/><path d="M183 55l5 5 10-10" class="s-w" fill="none" stroke-width="3" stroke-linecap="round"/>`,
 crianca:`<circle cx="180" cy="44" r="12" class="f-a"/><circle cx="94" cy="58" r="12" class="f-t"/><path d="M76 132V90a18 18 0 0 1 36 0v42z" class="f-t"/><circle cx="146" cy="88" r="9" class="f-b"/><path d="M133 132v-22a13 13 0 0 1 26 0v22z" class="f-b"/><path d="M110 100q12 6 24 8" class="s-t" fill="none" stroke-width="5" stroke-linecap="round"/>`,
 arvore:`<circle cx="186" cy="40" r="12" class="f-b"/><rect x="112" y="84" width="16" height="48" rx="4" class="f-t"/><circle cx="120" cy="64" r="30" class="f-a"/><circle cx="92" cy="80" r="20" class="f-a"/><circle cx="148" cy="80" r="20" class="f-a"/><circle cx="110" cy="56" r="8" class="f-w" opacity=".3"/><path d="M70 132h100" class="s-a" stroke-width="5" stroke-linecap="round" opacity=".5"/>`,
 guarda:`<path d="M60 80a60 46 0 0 1 120 0q-10-8-20 0q-10-8-20 0q-10-8-20 0q-10-8-20 0q-10-8-20 0q-10-8-20 0z" class="f-a"/><path d="M120 34v4M120 80v12" class="s-t" stroke-width="4"/><circle cx="104" cy="100" r="8" class="f-t"/><path d="M92 132v-14a12 12 0 0 1 24 0v14z" class="f-t"/><circle cx="138" cy="102" r="7" class="f-b"/><path d="M127 132v-12a11 11 0 0 1 22 0v12z" class="f-b"/><path d="M46 44v8M60 32v8M186 34v8M200 46v8" class="s-t" stroke-width="3" stroke-linecap="round" opacity=".4"/>`,
 urna:`<rect x="106" y="28" width="28" height="44" rx="3" class="f-w s-t" stroke-width="2" transform="rotate(8 120 50)"/><path d="M112 48l5 5 9-10" class="s-b" fill="none" stroke-width="3" transform="rotate(8 120 50)"/><path d="M70 80h100l-10-14H80z" class="f-t"/><rect x="104" y="72" width="32" height="5" rx="2" class="f-s"/><rect x="76" y="80" width="88" height="52" rx="6" class="f-a"/><rect x="98" y="100" width="44" height="8" rx="4" class="f-w" opacity=".5"/>`,
 dialogo:`<path d="M60 32h52a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H82l-10 9v-9H60a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8z" class="f-w s-t" stroke-width="2"/><path d="M130 40h52a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8h-12v9l-10-9h-30a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8z" class="f-w s-t" stroke-width="2"/><path d="M64 46h40M64 54h28M142 54h40M142 62h28" class="s-a" stroke-width="3" stroke-linecap="round" opacity=".6"/><circle cx="76" cy="90" r="11" class="f-t"/><path d="M58 134v-20a18 18 0 0 1 36 0v20z" class="f-t"/><circle cx="164" cy="90" r="11" class="f-a"/><path d="M146 134v-20a18 18 0 0 1 36 0v20z" class="f-a"/><circle cx="120" cy="112" r="12" class="f-b"/><path d="M114 109h12M114 115h12" class="s-w" stroke-width="2.5" stroke-linecap="round"/>`
};
const seq=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join("");
Object.assign(ILU,{
 moedas:moedasSvg(),
 relogio:`<path d="M84 40l-12-10M156 40l12-10" class="s-t" stroke-width="7" stroke-linecap="round"/><circle cx="120" cy="82" r="46" class="f-a"/><circle cx="120" cy="82" r="37" class="f-w"/>`+seq(12,i=>`<rect x="118" y="49" width="4" height="${i%3?6:10}" rx="2" class="f-t" transform="rotate(${i*30} 120 82)"/>`)+`<path d="M120 82V58" class="s-t" stroke-width="5" stroke-linecap="round"/><path d="M120 82l20 12" class="s-b" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="82" r="5" class="f-b"/><path d="M104 132h32" class="s-t" stroke-width="5" stroke-linecap="round" opacity=".4"/>`,
 calendario:`<rect x="62" y="38" width="116" height="96" rx="10" class="f-w s-t" stroke-width="2"/><path d="M62 48a10 10 0 0 1 10-10h96a10 10 0 0 1 10 10v16H62z" class="f-a"/><rect x="86" y="28" width="8" height="20" rx="4" class="f-t"/><rect x="146" y="28" width="8" height="20" rx="4" class="f-t"/>`+seq(15,i=>{const x=72+(i%5)*20,y=74+Math.floor(i/5)*18;return `<rect x="${x}" y="${y}" width="15" height="12" rx="2" class="${i===8?"f-b":"f-s"}"/>`})+`<path d="M135 80l4 4 7-8" class="s-w" fill="none" stroke-width="2.5" stroke-linecap="round" transform="translate(0 12)"/>`,
 alianca:`<circle cx="102" cy="90" r="30" class="s-a" fill="none" stroke-width="10"/><circle cx="140" cy="90" r="30" class="s-b" fill="none" stroke-width="10"/><path d="M128 52l12-14 12 14-12 12z" class="f-w s-t" stroke-width="2.5"/><path d="M134 50h12" class="s-t" stroke-width="2"/><path d="M180 44c-3-5-11-3-10 3 1 5 10 10 10 10s9-5 10-10c1-6-7-8-10-3z" class="f-b"/>`,
 pergaminho:`<rect x="74" y="40" width="92" height="82" class="f-w s-t" stroke-width="2"/><rect x="64" y="30" width="112" height="16" rx="8" class="f-a"/><rect x="64" y="116" width="112" height="16" rx="8" class="f-a"/><path d="M88 60h64M88 72h64M88 84h50M88 96h40" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".35"/><path d="M146 110l-6 22 10-6 10 6-6-22" class="f-b"/><circle cx="150" cy="104" r="12" class="f-b"/><circle cx="150" cy="104" r="6" class="f-w" opacity=".35"/>`,
 aperto:`<path d="M34 108l56-34 8 28-46 28z" class="f-t"/><path d="M206 108l-56-34-8 28 46 28z" class="f-a"/><rect x="86" y="70" width="70" height="34" rx="17" class="f-b"/><path d="M104 74v26M118 72v30M132 72v30M146 74v24" class="s-w" stroke-width="2.5" opacity=".55"/><path d="M96 70q14-12 30-6" class="s-b" fill="none" stroke-width="8" stroke-linecap="round"/><path d="M120 40v-10M100 46l-6-8M140 46l6-8" class="s-b" stroke-width="3" stroke-linecap="round"/>`,
 fabrica:`<path d="M46 132V86l30 16V86l30 16V86l30 16V62h48v70z" class="f-a"/><rect x="164" y="34" width="14" height="30" class="f-t"/><circle cx="174" cy="26" r="7" class="f-s s-l" stroke-width="2"/><circle cx="188" cy="18" r="9" class="f-s s-l" stroke-width="2"/>`+seq(3,i=>`<rect x="${56+i*30}" y="110" width="14" height="12" rx="2" class="f-w" opacity=".8"/>`)+`<rect x="148" y="104" width="22" height="28" rx="2" class="f-t"/><path d="M40 132h160" class="s-t" stroke-width="4"/>`,
 saude:`<rect x="104" y="34" width="32" height="76" rx="6" class="f-b"/><rect x="82" y="56" width="76" height="32" rx="6" class="f-b"/><path d="M42 124h46l8-14 10 24 8-18h84" class="s-a" fill="none" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`,
 capelo:`<path d="M44 70l76-30 76 30-76 30z" class="f-t"/><path d="M82 84v26c0 12 76 12 76 0V84l-38 16z" class="f-a"/><path d="M190 72v36" class="s-b" stroke-width="3"/><path d="M184 108h12l-2 16h-8z" class="f-b"/><circle cx="120" cy="70" r="5" class="f-b"/>`,
 idoso:`<circle cx="106" cy="50" r="13" class="f-t"/><path d="M93 46a13 13 0 0 1 26 0" class="s-w" fill="none" stroke-width="4"/><path d="M84 134v-40a22 22 0 0 1 44 0v40z" class="f-t"/><path d="M124 96l20-14" class="s-t" stroke-width="7" stroke-linecap="round"/><path d="M146 80v54M146 80q0-12 12-12" class="s-b" fill="none" stroke-width="5" stroke-linecap="round"/><path d="M160 46a22 18 0 0 1 44 0z" class="f-a"/><path d="M182 46v20q0 6-6 6" class="s-a" fill="none" stroke-width="3"/>`,
 megafone:`<path d="M78 68h18l52-28v80l-52-28H78z" class="f-a"/><rect x="64" y="68" width="18" height="24" rx="4" class="f-t"/><path d="M98 92l8 32h14l-7-32" class="f-t"/><path d="M162 62q12 18 0 36M176 50q22 30 0 60" class="s-b" fill="none" stroke-width="5" stroke-linecap="round"/>`,
 cadeado:`<path d="M94 76V58a26 26 0 0 1 52 0v18" class="s-t" fill="none" stroke-width="11"/><rect x="76" y="72" width="88" height="62" rx="12" class="f-a"/><circle cx="120" cy="98" r="9" class="f-w"/><rect x="115" y="102" width="10" height="18" rx="4" class="f-w"/><circle cx="184" cy="54" r="10" class="f-b"/><path d="M180 54l3 3 6-6" class="s-w" fill="none" stroke-width="2.5"/>`,
 colunas:`<path d="M50 60l70-30 70 30z" class="f-t"/><rect x="54" y="60" width="132" height="8" class="f-t"/>`+[["f-a","L"],["f-b","E"],["f-a","J"]].map(([c,t],i)=>`<rect x="${70+i*40}" y="70" width="22" height="50" class="${c}"/><rect x="${66+i*40}" y="68" width="30" height="6" rx="2" class="${c}"/><text x="${81+i*40}" y="100" text-anchor="middle" style="font:700 14px var(--f-body);fill:var(--surface)">${t}</text>`).join("")+`<rect x="54" y="120" width="132" height="7" class="f-t"/><rect x="46" y="127" width="148" height="7" class="f-b"/>`,
 aviao:`<path d="M40 128q60-10 90-40" class="s-t" fill="none" stroke-width="3" stroke-dasharray="6 6" opacity=".5"/><g transform="rotate(-28 140 70)"><rect x="90" y="62" width="110" height="16" rx="8" class="f-a"/><path d="M136 64l-22-34h14l34 34z" class="f-t"/><path d="M136 76l-22 34h14l34-34z" class="f-t"/><path d="M98 64l-10-16h8l14 16z" class="f-b"/><path d="M98 76l-10 16h8l14-16z" class="f-b"/><circle cx="186" cy="70" r="3" class="f-w"/></g>`,
 gota:`<path d="M112 28c18 26 34 44 34 64a34 34 0 0 1-68 0c0-20 16-38 34-64z" class="f-a"/><path d="M96 96a17 17 0 0 0 14 18" class="s-w" fill="none" stroke-width="4" opacity=".7" stroke-linecap="round"/><path d="M160 124c0-24 14-38 36-40-2 24-14 38-36 40z" class="f-b"/><path d="M162 122l28-32" class="s-w" stroke-width="2"/><path d="M50 136q12-6 24 0t24 0 24 0 24 0" class="s-a" fill="none" stroke-width="3" opacity=".6"/>`,
 escada:`<path d="M44 132h40v-26h40V80h40V54h34v78z" class="f-a"/><path d="M60 102l44-28 40-2 30-28" class="s-b" fill="none" stroke-width="4" stroke-dasharray="7 6" stroke-linecap="round"/><path d="M168 38l14 4-6 14" class="s-b" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M168 54l15-9 15 9z" class="f-t"/>`,
 carimbo:`<rect x="54" y="38" width="90" height="98" rx="5" class="f-w s-t" stroke-width="2"/><path d="M66 54h60M66 66h66M66 78h48" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".35"/><g transform="rotate(-8 100 112)"><rect x="70" y="98" width="58" height="26" rx="4" class="s-b" fill="none" stroke-width="3"/><path d="M80 111l8 6 16-14" class="s-b" fill="none" stroke-width="3" stroke-linecap="round"/></g><rect x="160" y="30" width="22" height="32" rx="9" class="f-t"/><rect x="150" y="60" width="42" height="12" rx="3" class="f-t"/><rect x="146" y="72" width="50" height="9" rx="2" class="f-b"/>`,
 cedula:`<rect x="50" y="52" width="116" height="62" rx="7" class="f-a" transform="rotate(-9 108 83)"/><rect x="68" y="64" width="116" height="62" rx="7" class="f-b"/><rect x="76" y="72" width="100" height="46" rx="4" class="s-w" fill="none" stroke-width="2" opacity=".5"/><circle cx="126" cy="95" r="15" class="f-w" opacity=".3"/><text x="126" y="100" text-anchor="middle" style="font:700 14px var(--f-body);fill:var(--surface)">R$</text><ellipse cx="196" cy="122" rx="14" ry="5" class="f-t"/><ellipse cx="196" cy="114" rx="14" ry="5" class="f-t"/><ellipse cx="196" cy="106" rx="14" ry="5" class="f-a"/>`,
 cerca:`<path d="M30 130h180" class="s-a" stroke-width="5" stroke-linecap="round" opacity=".6"/>`+seq(8,i=>`<path d="M${46+i*20} 130V92l5-8 5 8v38z" class="f-w s-t" stroke-width="2"/>`)+`<rect x="40" y="98" width="170" height="6" rx="2" class="f-t"/><rect x="40" y="114" width="170" height="6" rx="2" class="f-t"/><path d="M190 130V44" class="s-t" stroke-width="5"/><path d="M190 46h30l-8 9 8 9h-30z" class="f-b"/><path d="M58 72a24 22 0 0 1 48 0z" class="f-a" opacity=".85"/>`,
 coracao:`<path d="M120 116c-30-20-50-38-50-58 0-14 10-24 24-24 10 0 20 6 26 16 6-10 16-16 26-16 14 0 24 10 24 24 0 20-20 38-50 58z" class="f-b"/><path d="M98 52q-8 4-8 14" class="s-w" fill="none" stroke-width="4" stroke-linecap="round" opacity=".6"/><path d="M50 112q34 30 70 26q36 4 70-26v22H50z" class="f-a"/>`,
 lampada:`<path d="M120 30a34 34 0 0 1 20 62v12h-40V92a34 34 0 0 1 20-62z" class="f-a"/><path d="M110 92l4-26 6 8 6-8 4 26" class="s-w" fill="none" stroke-width="3" stroke-linejoin="round"/><rect x="100" y="106" width="40" height="8" rx="3" class="f-t"/><rect x="104" y="116" width="32" height="8" rx="3" class="f-t"/><path d="M114 128h12" class="s-t" stroke-width="5" stroke-linecap="round"/><path d="M74 60h-12M178 60h-12M84 30l-8-8M156 30l8-8M120 18V8" class="s-b" stroke-width="4" stroke-linecap="round"/>`,
 alvo:`<circle cx="110" cy="86" r="46" class="f-alv1"/><circle cx="110" cy="86" r="33" class="f-alv2"/><circle cx="110" cy="86" r="20" class="f-alv1"/><circle cx="110" cy="86" r="8" class="f-alv2"/><path d="M110 86l72-48" class="s-t" stroke-width="5" stroke-linecap="round"/><path d="M182 38l-2-14 14 4zM182 38l12 6-14 4z" class="f-a"/>`,
 juri:`<rect x="44" y="104" width="152" height="28" rx="6" class="f-t"/><rect x="44" y="100" width="152" height="8" rx="3" class="f-b"/>`+seq(4,i=>`<circle cx="${66+i*36}" cy="64" r="11" class="${i%2?"f-a":"f-b"}"/><path d="M${52+i*36} 100v-8a14 14 0 0 1 28 0v8z" class="${i%2?"f-a":"f-b"}"/>`)+seq(3,i=>`<circle cx="${84+i*36}" cy="40" r="9" class="f-a" opacity=".75"/>`)+`<path d="M112 120h16" class="s-w" stroke-width="3" stroke-linecap="round"/>`,
 estudo:`<path d="M58 112q31-14 62 0V58q-31-14-62 0z" class="f-w s-t" stroke-width="2"/><path d="M182 112q-31-14-62 0V58q31-14 62 0z" class="f-w s-t" stroke-width="2"/><path d="M68 72q21-8 42 0M68 84q21-8 42 0M68 96q14-6 28 0" class="s-a" fill="none" stroke-width="3" stroke-linecap="round" opacity=".55"/><path d="M130 72q21-8 42 0M130 84q16-6 32 0" class="s-a" fill="none" stroke-width="3" stroke-linecap="round" opacity=".55"/><path d="M152 60v28l7-6 7 6V58" class="f-b"/><path d="M120 58v54" class="s-t" stroke-width="2"/><rect x="42" y="112" width="156" height="9" rx="4.5" class="f-t"/><g transform="rotate(-32 200 70)"><rect x="194" y="40" width="11" height="46" rx="2" class="f-b"/><path d="M194 86h11l-5.5 11z" class="f-t"/><rect x="194" y="40" width="11" height="8" rx="2" class="f-a"/></g><path d="M62 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" class="f-b"/><path d="M186 22l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" class="f-a" opacity=".7"/>`,
 chama:`<path d="M120 134c-27 0-46-18-46-42 0-20 13-32 23-44 3 10 9 17 16 19 0-21 9-38 26-49-2 18 6 29 15 41 7 9 12 19 12 33 0 24-19 42-46 42z" class="f-b"/><path d="M120 134c-13 0-21-9-21-20 0-11 8-17 14-25 2 7 6 11 12 12 2-7 6-12 12-15 1 7 2 13 2 19 0 17-8 29-19 29z" class="f-w" opacity=".6"/><path d="M60 136h120" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".35"/>`,
 cartas:`<rect x="66" y="42" width="80" height="94" rx="10" class="f-a" transform="rotate(-11 106 89)" opacity=".6"/><rect x="94" y="36" width="80" height="94" rx="10" class="f-t" transform="rotate(8 134 83)"/><rect x="80" y="30" width="80" height="100" rx="10" class="f-w s-t" stroke-width="2"/><path d="M108 70a12 12 0 1 1 17 11c-3 2-5 4-5 8" class="s-b" fill="none" stroke-width="7" stroke-linecap="round"/><circle cx="120" cy="102" r="4.5" class="f-b"/><path d="M98 118h44" class="s-a" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,
 marcador:`<rect x="70" y="34" width="98" height="104" rx="8" class="f-a"/><rect x="80" y="34" width="88" height="104" rx="6" class="f-w s-t" stroke-width="2"/><path d="M92 58h40M92 70h56M92 82h56M92 94h36" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".3"/><path d="M134 24h28v54l-14-11-14 11z" class="f-b"/><path d="M148 36l3.2 6.5 7 1-5.1 5 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5.1-5 7-1z" class="f-w"/>`,
 trofeu:`<path d="M92 34h56v30a28 28 0 0 1-56 0z" class="f-b"/><path d="M92 42H76a15 15 0 0 0 17 22M148 42h16a15 15 0 0 1-17 22" class="s-b" fill="none" stroke-width="6" stroke-linecap="round"/><rect x="114" y="90" width="12" height="16" class="f-t"/><rect x="96" y="104" width="48" height="12" rx="3" class="f-t"/><rect x="86" y="116" width="68" height="10" rx="3" class="f-a"/><path d="M108 52l8 8 15-16" class="s-w" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM182 70l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" class="f-a" opacity=".7"/>`,
 engrenagem:`<g class="f-t">${seq(8,i=>`<rect x="110" y="30" width="20" height="24" rx="4" transform="rotate(${i*45} 120 80)"/>`)}<circle cx="120" cy="80" r="40"/></g><circle cx="120" cy="80" r="17" class="f-w s-t" stroke-width="3"/><g class="f-a">${seq(6,i=>`<rect x="176" y="28" width="10" height="12" rx="2.5" transform="rotate(${i*60} 181 46)"/>`)}<circle cx="181" cy="46" r="14"/></g><circle cx="181" cy="46" r="5" class="f-w"/>`,
 checklist:`<rect x="72" y="34" width="96" height="104" rx="8" class="f-w s-t" stroke-width="2"/><rect x="98" y="26" width="44" height="16" rx="5" class="f-t"/>`+seq(3,i=>`<rect x="84" y="${56+i*24}" width="14" height="14" rx="3" class="${i<2?"f-b":"f-s s-t"}" stroke-width="2"/>${i<2?`<path d="M87 ${63+i*24}l3 3 6-7" class="s-w" fill="none" stroke-width="2.5" stroke-linecap="round"/>`:""}<path d="M106 ${63+i*24}h48" class="s-t" stroke-width="4" stroke-linecap="round" opacity=".35"/>`)+`<path d="M180 116l16-16 8 8-16 16-11 3z" class="f-a"/>`
});
/* escolhe a ilustração do tema pelo título */
const ILU_REGRAS=[
 [/propriedade industrial/,"fabrica"],[/bem de familia|locacao/,"casa"],[/hidric|residuo/,"gota"],[/florest|conservacao|meio ambiente|ambiental/,"arvore"],
 [/execucao: progress|medida de seguranca|prisao|prisoes|cautelar|pena\b|penas|punibilidade|reabilita/,"grade"],
 [/pena de multa|honorario|remuneracao|precatorio|titulos de credito|pagamento|receita/,"cedula"],
 [/prescri|decaden/,"ampulheta"],[/prazo|jornada/,"relogio"],[/vigencia|intertemporal|ferias|calendario|lei penal no tempo/,"calendario"],
 [/casamento|uniao estavel|regime de bens|dissolucao/,"alianca"],[/sucess|testament|inventario/,"pergaminho"],
 [/adocao|filiacao|poder familiar|alimentos|familia|convivencia/,"familia"],[/crianca|infancia|infracional|protecao integral|prevencao/,"crianca"],
 [/\bjuri\b/,"juri"],[/eficacia social|controle social/,"rede"],[/invalidade|nulidade|anulab/,"carimbo"],[/art\. 5/,"coracao"],[/fato tipico/,"lupa"],[/^erro$|erro de tipo/,"lampada"],[/ilicitude|prerrogativ/,"escudo"],[/culpabilidade|raciocinio/,"mente"],[/concurso de pessoas/,"rede"],[/solucao de conflitos/,"dialogo"],[/tutela provisoria/,"relogio"],[/agentes publicos/,"pessoa"],[/conselho tutelar|medidas de protecao/,"crianca"],[/acoes mais cobradas|2.? fase/,"checklist"],[/juizados/,"balanca"],[/pratica administrativa/,"estado"],[/negociac|acordo/,"aperto"],[/operacoes societarias|sociedades|sociedade limitada|sociedade anonima/,"rede"],
 [/conciliacao|mediacao|meios adequados|audiencia|tecnicas de/,"dialogo"],[/arbitragem|sentenca|julgamento|atos administrativos|decis/,"carimbo"],
 [/recurso|apelacao|agravo|embargos|tribunais superiores|rescisoria|impugnacao|revisao criminal/,"escada"],
 [/cumprimento|execucao/,"moedas"],[/habeas|remedios|mandado de seguranca|garantias/,"escudo"],
 [/lesoes|periclitacao|incapacidade|seguridade|acidente|saude/,"saude"],[/aposentadoria|previdencia complementar/,"idoso"],[/previdenc|segurado|beneficio|regimes/,"guarda"],
 [/tribut|fiscal|orcament|despesa|credito|financ|creditos adicionais|vedacoes|reparticao de receitas|o que e direito financeiro/,"moedas"],
 [/publicidade|propaganda|oferta/,"megafone"],[/sigilo|imunidade|privilegio|incompatib/,"cadeado"],
 [/poder legislativo|poder executivo|poder judiciario|separacao de poderes|organizacao do estado|federacao|reparticao de competencias|intervencao|estado de defesa|funcoes essenciais|organizacao administrativa|poderes administrativos|competencias ambientais/,"colunas"],
 [/controle de constitucionalidade|controle concentrado|justica eleitoral|justica do trabalho|justica da infancia|tribunal/,"tribunal"],
 [/eleit|partido|inelegib|direitos politicos|voto/,"urna"],[/espacos|migracao|nacionalidade/,"aviao"],[/internaciona|global|interamericano|tratado|imunidades|historica/,"globo"],
 [/constitui|lei|norma|fontes|ordenamento|codigo|politica nacional|principio/,"pergaminho"],
 [/posse|propriedade|usucapiao|vizinhanca|condominio|bens|coisas|reais/,"cerca"],
 [/empresa|estabelecimento|falencia|recuperacao|contratos empresariais/,"fabrica"],
 [/contrat(?!ualis)|negocio juridico|obrigac|adimplemento|inadimplemento|transmissao|compra e venda|doacao|servicos|mandato|atos unilaterais/,"contrato"],
 [/responsabilidade|ilicito|improbidade|infracoes|disciplinar/,"balanca"],[/consum|fornecedor|praticas abusivas/,"carrinho"],
 [/trabalh|emprego|reclamacao|sindic|coletivo|estabilidade|empregado/,"trabalho"],
 [/prova|inquerito|investiga|vitimolog|criminolog|escolas crimino|teorias sociologicas do crime|crime|resolver um caso/,"lupa"],
 [/peticao|peca|checklist|roteiro|resposta|contestacao|memoriais|queixa|inscricao|requisitos|como estudar/,"checklist"],
 [/direitos humanos|direitos fundamentais|personalidade|dignidade|direitos basicos|direitos sociais|desigualdade|grupos|reconhecimento/,"coracao"],
 [/pessoa natural|pessoa juridica|fim da pessoa|sujeitos|partes/,"pessoa"],
 [/estado|governo|democracia|regime|contratualist|maquiavel/,"estado"],
 [/filosof|kant|utilitar|positivismo|jusnatural|justica|hermeneutica|interpretacao|argumentacao|critica|antiga|ideia/,"lampada"],
 [/fundadores|autores|escolas|exame de ordem|2a fase|o que e|o que estuda|para que serve|por que/,"capelo"],
 [/estrategia|reta final|numeros|distribuicao|o que mais cai/,"alvo"],
 [/sociolog|controle social|pluralismo|acesso a justica|consumo, espetaculo|modernidade|pensamento|poder, disciplina|temas atuais/,"rede"],
 [/advoca|oab|deveres|ordem dos advogados/,"balanca"],
 [/processo|procedimento|ritos|jurisdicao|acao|competencia|litisconsorcio|atos processuais|formacao|citacao|nulidades|peca/,"processo"]
];
const semAcento=t=>String(t).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
function temaIlu(tit,d,k){const t=semAcento(tit);for(const [re,n] of ILU_REGRAS)if(re.test(t))return n;const alt=[AP_DISC[d]||"livros","lampada","checklist","livros"];return alt[k%alt.length]}
const CENA=`<svg class="cena" viewBox="0 0 74 56" aria-hidden="true"><circle cx="20" cy="30" r="8" class="f-t"/><path d="M8 56v-8a12 12 0 0 1 24 0v8z" class="f-t"/><circle cx="54" cy="30" r="8" class="f-a"/><path d="M42 56v-8a12 12 0 0 1 24 0v8z" class="f-a"/><path d="M28 2h22a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-9l-6 5v-5h-7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" class="f-w s-t" stroke-width="1.5"/><path d="M32 9h14M32 14h9" class="s-b" stroke-width="2" stroke-linecap="round"/></svg>`;
const PG_DEFS=`<svg id="pg-defs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="pg-t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--p1,var(--toga))"/><stop offset="1" style="stop-color:var(--p2,var(--toga))"/></linearGradient><linearGradient id="pg-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fcd34d"/><stop offset="1" stop-color="#f97316"/></linearGradient><linearGradient id="pg-s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb,var(--p1,#888) 20%,transparent)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--p2,#888) 16%,transparent)"/></linearGradient></defs></svg>`;
/* no Premium, a ilustração ganha mancha orgânica, anel e brilhos; os objetos usam o degradê da paleta (CSS) */
const BRILHO=(x,y,r)=>`<path class="p-brilho" d="M${x} ${y-r}Q${x+r*.18} ${y-r*.18} ${x+r} ${y}Q${x+r*.18} ${y+r*.18} ${x} ${y+r}Q${x-r*.18} ${y+r*.18} ${x-r} ${y}Q${x-r*.18} ${y-r*.18} ${x} ${y-r}z"/>`;
function ilustra(nome,cor){if(estiloAtual()==="premium"){const corpo=ILU[nome];if(!corpo)return "";
  return `<svg class="ilu" viewBox="0 0 240 150" aria-hidden="true" focusable="false" style="--c:${cor||"var(--toga)"}"><path class="p-mancha" d="M120 10c38-4 78 14 88 50s-10 74-46 84-86 4-110-24S30 52 52 32s40-20 68-22z"/><circle class="p-anel" cx="188" cy="34" r="16"/><circle class="p-anel" cx="40" cy="118" r="9"/>${BRILHO(30,34,9)}${BRILHO(212,112,7)}<circle class="p-ponto" cx="216" cy="70" r="3.5"/><circle class="p-ponto" cx="22" cy="80" r="2.5"/>${corpo}</svg>`}
 const corpo=ILU[nome];if(!corpo)return "";
 return `<svg class="ilu" viewBox="0 0 240 150" aria-hidden="true" focusable="false" style="--c:${cor||"var(--toga)"}"><circle cx="120" cy="80" r="64" class="f-s"/><ellipse cx="120" cy="138" rx="86" ry="6" class="f-s"/><circle cx="34" cy="40" r="4" class="f-b" opacity=".5"/><circle cx="206" cy="116" r="5" class="f-a" opacity=".4"/><circle cx="214" cy="30" r="3" class="f-t" opacity=".4"/>${corpo}</svg>`}

/* capa ilustrada das telas principais: só aparece no Premium */
function capaTela(ilu,tit,txt){return estiloAtual()==="premium"?`<div class="capa-tela"><div><b>${tit}</b><p>${txt}</p></div>${ilustra(ilu,"var(--p2)")}</div>`:""}
/* estado vazio: ilustração, o que aconteceu e o próximo passo */
function vazio(ilu,tit,txt,acoes,cor){return `<div class="vazio-ilu">${ilustra(ilu,cor||"var(--toga-txt)")}<p class="v-tit">${tit}</p>${txt?`<p class="v-txt">${txt}</p>`:""}${acoes?`<div class="vazio-acoes">${acoes}</div>`:""}</div>`}
/* simuladores interativos das apostilas: ::calc prd (cabe a substituição?), ::calc conv (conversão em prisão),
   ::calc dosi (dosimetria trifásica), ::calc reinc (é reincidente?) e ::calc antec (linha do tempo: reincidência ou maus antecedentes?) */
const CALC_DEF={
 prd:{a:2,m:0,d:0,tipo:"doloso",viol:"nao",reinc:"nao",circ:"sim"},
 conv:{pm:7,pd:0,cm:1,cd:0},
 dosi:{mina:4,maxa:10,circ:2,ag:1,at:1,aum:"1/3",dim:"0"},
 reinc:{ant:"doloso",quando:"depois",prazo:"ate5",novo:"doloso",mesmo:"nao"},
 antec:{fa:"2000-03-10",tj:"2002-03-31",ext:"",fn:"2003-05-30",sn:"2004-08-20"}};
const FRACAO={"0":0,"1/6":1/6,"1/5":1/5,"1/4":1/4,"1/3":1/3,"1/2":1/2,"2/3":2/3};
function calcDosimetria(v){
 const min=Math.max(0,+v.mina||0)*360,max=Math.max(0,+v.maxa||0)*360;
 if(!min||max<=min)return {ok:null,tit:"Informe a pena mínima e uma pena máxima maior que ela",it:[]};
 const nc=Math.min(8,Math.max(0,Math.floor(+v.circ||0))),ag=Math.max(0,Math.floor(+v.ag||0)),at=Math.max(0,Math.floor(+v.at||0));
 const base=Math.floor(min+nc*(max-min)/8),it=[];
 it.push(`**Ponto de partida:** o tipo prevê de ${calcTempo(min)} a ${calcTempo(max)}. Se houvesse qualificadora, os limites já seriam outros.`);
 it.push(nc?`**1ª fase (art. 59):** ${nc} circunstância${nc>1?"s desfavoráveis":" desfavorável"} × 1/8 do intervalo = pena-base de **${calcTempo(base)}**.`:`**1ª fase (art. 59):** nenhuma circunstância desfavorável, a pena-base fica no mínimo: **${calcTempo(base)}**.`);
 const saldo=ag-at;let inter=Math.floor(base+saldo*base/6),trava="";
 if(inter<min){inter=min;trava=" Mas a atenuante não leva a pena abaixo do mínimo (Súmula 231 do STJ): ela **para no mínimo**."}
 if(inter>max){inter=max;trava=" Mas a agravante não leva a pena acima do máximo: ela **para no máximo**."}
 const par=Math.min(ag,at),comp=par?(par>1?` ${par} agravantes e ${par} atenuantes se compensam (art. 67).`:" Uma agravante e uma atenuante se compensam (art. 67)."):"";
 it.push(saldo?`**2ª fase (arts. 61 a 66):** ${ag} agravante${ag!==1?"s":""} e ${at} atenuante${at!==1?"s":""}.${comp} ${Math.abs(saldo)>1?"Sobram":"Sobra"} ${Math.abs(saldo)} ${saldo>0?"agravante":"atenuante"}${Math.abs(saldo)>1?"s":""} × 1/6 = pena intermediária de **${calcTempo(inter)}**.${trava}`
  :`**2ª fase (arts. 61 a 66):** ${ag?(ag>1?`as ${ag} agravantes e as ${at} atenuantes se compensam (art. 67)`:"a agravante e a atenuante se compensam (art. 67)"):"sem agravantes ou atenuantes"}; a pena intermediária continua em **${calcTempo(inter)}**.`);
 const fa=FRACAO[v.aum]||0,fd=FRACAO[v.dim]||0;let fim=inter;
 if(fa)fim=Math.floor(fim+fim*fa);const aposAum=fim;
 if(fd)fim=Math.floor(fim-fim*fd);
 const passos=[];if(fa)passos.push(`aumento de ${v.aum} → ${calcTempo(aposAum)}`);if(fd)passos.push(`diminuição de ${v.dim} → ${calcTempo(fim)}`);
 it.push(passos.length?`**3ª fase (causas de aumento e de diminuição):** ${passos.join("; ")}.${fim>max?" Passou do máximo do tipo, e **pode**: na 3ª fase os limites ficam para trás.":fim<min?" Ficou abaixo do mínimo do tipo, e **pode**: na 3ª fase os limites ficam para trás.":""}`:"**3ª fase:** sem causas de aumento ou de diminuição.");
 it.push("As frações de dia são desprezadas (art. 11). As frações de 1/8 e de 1/6 são critérios da jurisprudência, não números da lei.");
 return {ok:null,tit:`Pena definitiva: ${calcTempo(fim)}`,it}}
function calcReincidencia(v){
 const ant=v.ant,novo=v.novo,nome={doloso:"crime doloso",culposo:"crime culposo",contr:"contravenção"};
 const base=`Condenação anterior por **${nome[ant]}**; novo fato: **${nome[novo]}**.`;
 if(v.quando==="antes")return {ok:true,tit:"Não é reincidente",it:[base,"O novo fato foi praticado **antes** do trânsito em julgado da condenação anterior. A reincidência exige que o novo fato venha **depois** (art. 63).","Quando a condenação anterior transitar, ela poderá pesar como **maus antecedentes** na 1ª fase (art. 59)."]};
 if(v.prazo==="mais5")return {ok:true,tit:"Não é reincidente",it:[base,"Entre o cumprimento ou a extinção da pena anterior e o novo fato passaram **mais de 5 anos**: é o **período depurador** (art. 64, I).","A condenação antiga ainda pode pesar como **maus antecedentes** (STF, Tema 150)."]};
 if(ant==="contr"&&novo!=="contr")return {ok:true,tit:"Não é reincidente",it:[base,"Contravenção antes e **crime** depois não gera reincidência: o art. 63 do CP fala em crime anterior, e o art. 7º da LCP só trata da contravenção posterior.","A condenação anterior pode pesar como **maus antecedentes** (art. 59)."]};
 const lei=novo==="contr"?"art. 7º da LCP":"art. 63 do CP";
 if(ant==="doloso"&&novo==="doloso"){const esp=v.mesmo==="sim";
  return {ok:false,tit:esp?"Reincidente em crime doloso, e específico":"Reincidente em crime doloso",it:[base,`Novo crime depois do trânsito em julgado e dentro de 5 anos: é **reincidente** (${lei}). Como os dois crimes são dolosos, é **reincidente em crime doloso** (dolo + dolo).`,
   "**Na dosimetria:** a reincidência agrava a pena na 2ª fase (art. 61, I) e é circunstância preponderante (art. 67).",
   esp?"**Na substituição:** em regra, impede (art. 44, II). E, por ser pelo **mesmo crime** (reincidência específica), nem a exceção do art. 44, §3º, salva: **não cabe** a restritiva.":"**Na substituição:** em regra, impede (art. 44, II). Mas como **não** é o mesmo crime, o juiz **pode** substituir se a medida for **socialmente recomendável** (art. 44, §3º).",
   "**No sursis:** a reincidência em crime doloso impede a suspensão condicional da pena (art. 77, I)."]}}
 return {ok:null,tit:"Reincidente, mas não em crime doloso",it:[base,`O novo fato veio depois do trânsito em julgado e dentro de 5 anos: é **reincidente** (${lei}).`,
  "**Na dosimetria:** continua sendo agravante na 2ª fase (art. 61, I).",
  novo==="contr"||ant==="contr"?"**Na substituição e no sursis:** não impede, porque não há dois crimes dolosos. Contravenção não é crime doloso (arts. 44, II, e 77, I).":"**Na substituição e no sursis:** não impede, porque só a reincidência em crime **doloso** (dolo + dolo) é obstáculo (arts. 44, II, e 77, I)."]}}
function calcAntecedentes(v){
 const d=x=>x?new Date(x+"T12:00:00"):null,br=x=>x.split("-").reverse().join("/");
 const fa=d(v.fa),tj=d(v.tj),ext=d(v.ext),fn=d(v.fn),sn=d(v.sn);
 if(!fa||!fn||!sn)return {ok:null,tit:"Preencha as datas dos dois fatos e a da nova sentença",it:[]};
 if(sn<fn)return {ok:null,tit:"A nova sentença não pode vir antes do novo fato",it:[]};
 const anos=(a,b)=>{const c=new Date(a);c.setFullYear(c.getFullYear()+b);return c};
 if(fa>=fn)return {ok:true,tit:"Não pesa contra o réu",it:["O fato anterior **não é anterior**: foi praticado no mesmo dia ou depois do novo fato.","Condenação por fato **posterior** não gera reincidência nem maus antecedentes. Ela só vai pesar no processo do outro fato."]};
 if(!tj||tj>sn)return {ok:true,tit:"Bons antecedentes",it:[tj?`O trânsito em julgado anterior (${br(v.tj)}) só vem **depois** da nova sentença (${br(v.sn)}).`:"A condenação anterior ainda **não transitou em julgado**.","Na data da sentença, é processo em curso, que não pode agravar a pena-base (Súmula 444 do STJ). O réu é tecnicamente **primário e de bons antecedentes**."]};
 if(ext&&ext<tj)return {ok:null,tit:"O fim da pena não pode vir antes do trânsito em julgado",it:[]};
 if(tj>=fn)return {ok:null,tit:"Maus antecedentes",it:[`O trânsito em julgado anterior (${br(v.tj)}) veio **depois** do novo fato (${br(v.fn)}), mas **antes** da sentença (${br(v.sn)}).`,"Não é reincidência, porque o novo fato não veio depois do trânsito (art. 63). Mas pesa como **maus antecedentes** na 1ª fase (art. 59)."]};
 const base=`O trânsito em julgado anterior (${br(v.tj)}) veio **antes** do novo fato (${br(v.fn)}): a 1ª regra da reincidência está cumprida (art. 63).`;
 if(!ext||anos(ext,5)>=fn)return {ok:false,tit:"Reincidente",it:[base,ext?`Do fim da pena (${br(v.ext)}) ao novo fato **não passaram mais de 5 anos**: o período depurador não salva (art. 64, I).`:"A pena anterior ainda não tinha sido cumprida ou extinta quando veio o novo fato, então o período depurador nem começou a correr (art. 64, I).",
  "**Na dosimetria:** agravante na 2ª fase (art. 61, I). A mesma condenação não pode pesar também como maus antecedentes (Súmula 241 do STJ).","Lembre: se o crime anterior fosse **militar próprio** ou **político**, ou uma **contravenção** seguida de crime, não haveria reincidência (art. 64, II; art. 7º da LCP)."]};
 if(anos(ext,10)>=fn)return {ok:null,tit:"Maus antecedentes, não reincidência",it:[base,`Mas do fim da pena (${br(v.ext)}) ao novo fato passaram **mais de 5 anos**: o **período depurador** apaga a reincidência (art. 64, I).`,"A condenação ainda pode pesar como **maus antecedentes** na 1ª fase (STF, Tema 150)."]};
 return {ok:true,tit:"Nem reincidência, nem maus antecedentes (STJ)",it:[base,`Do fim da pena (${br(v.ext)}) ao novo fato passaram **mais de 10 anos**: muito além do período depurador de 5 anos (art. 64, I).`,"Para o STJ (2025, Informativo 856), aplica-se o **direito ao esquecimento**: a condenação tão antiga não deve ser usada como maus antecedentes.","Atenção: o STF (Tema 150) admite usá-la, deixando ao juiz avaliar se é remota demais. Na prova, veja qual tribunal a questão pede."]}}
function calcTempo(dias){const a=Math.floor(dias/360),m=Math.floor(dias%360/30),d=dias%30;const p=[];if(a)p.push(a+(a>1?" anos":" ano"));if(m)p.push(m+(m>1?" meses":" mês"));if(d)p.push(d+(d>1?" dias":" dia"));return p.length?p.join(" e ").replace(/ e (?=.* e )/,", "):"0 dia"}
function calcResultado(tipo,v){
 if(tipo==="dosi")return calcDosimetria(v);
 if(tipo==="reinc")return calcReincidencia(v);
 if(tipo==="antec")return calcAntecedentes(v);
 if(tipo==="conv"){const pena=(+v.pm||0)*30+(+v.pd||0),cump=Math.min(pena,(+v.cm||0)*30+(+v.cd||0));
  if(!pena)return {ok:null,tit:"Informe a pena substituída",it:[]};
  const resto=pena-cump,final=Math.max(30,resto);
  return {ok:null,tit:`Ele cumprirá ${resto<30?"30 dias":calcTempo(final)} de prisão`,it:[
   `Pena substituída: **${calcTempo(pena)}**. Já cumprido da restritiva: **${calcTempo(cump)}**.`,
   `Desconta-se o tempo cumprido: ${calcTempo(pena)} − ${calcTempo(cump)} = **${calcTempo(resto)}**.`,
   resto<30?`Como o saldo ficou abaixo de 30 dias, vale o **saldo mínimo de 30 dias** de detenção ou reclusão (art. 44, §4º).`:`O saldo não ficou abaixo de 30 dias, então não é preciso arredondar para o mínimo (art. 44, §4º).`]}}
 const dias=(+v.a||0)*360+(+v.m||0)*30+(+v.d||0),culp=v.tipo==="culposo",it=[];let ok=true;
 if(!dias)return {ok:null,tit:"Informe a pena aplicada pelo juiz",it:[]};
 if(culp)it.push("✓ Crime **culposo**: cabe a substituição **qualquer que seja a pena** (art. 44, I).");
 else{if(dias>4*360){ok=false;it.push("✗ Crime doloso com pena **acima de 4 anos**: não cabe (art. 44, I).")}else it.push("✓ Crime doloso com pena **até 4 anos** (art. 44, I).");
  if(v.viol==="sim"){ok=false;it.push("✗ Crime doloso **com violência ou grave ameaça** à pessoa: não cabe (art. 44, I).")}else it.push("✓ Sem violência ou grave ameaça à pessoa.")}
 if(v.reinc==="nao")it.push("✓ Não é reincidente em crime doloso (art. 44, II).");
 else if(v.reinc==="mesmo"){ok=false;it.push("✗ Reincidente **específico** (mesmo crime): nem a exceção do art. 44, §3º, permite.")}
 else it.push("✓ Reincidente em crime doloso, mas **não no mesmo crime** e a medida é socialmente recomendável: cabe pela exceção (art. 44, §3º).");
 if(v.circ==="sim")it.push("✓ Circunstâncias favoráveis (art. 44, III).");else{ok=false;it.push("✗ Circunstâncias desfavoráveis: o juiz pode negar, fundamentando (art. 44, III).")}
 if(ok){it.push(dias<=360?"**Como substituir:** até 1 ano, por **multa** ou por **uma** restritiva (art. 44, §2º).":"**Como substituir:** acima de 1 ano, por **duas restritivas** ou por **uma restritiva + multa** (art. 44, §2º).");
  it.push(dias>180?"**Prestação de serviços:** cabe, porque a pena é superior a 6 meses (art. 46).":"**Prestação de serviços:** não cabe, porque a pena não passa de 6 meses (art. 46). Escolha outra restritiva.");
  if(dias>180)it.push(dias>360?`**Cumprir em menos tempo:** o réu pode, mas nunca em menos de **${calcTempo(Math.ceil(dias/2))}**, a metade (art. 46, §4º).`:"**Cumprir em menos tempo:** não pode, porque a pena não passa de 1 ano (art. 46, §4º).")}
 return {ok,tit:ok?`Cabe a substituição de ${calcTempo(dias)} de pena`:`Não cabe a substituição de ${calcTempo(dias)} de pena`,it}}
function calcSaida(tipo,v){const r=calcResultado(tipo,v);const cls=r.ok===null?"":r.ok?" ok":" nao";
 return `<div class="calc-out${cls}" aria-live="polite"><b>${inl(r.tit)}</b>${r.it.length?`<ul>${r.it.map(x=>`<li>${inl(x)}</li>`).join("")}</ul>`:""}</div>`}
function calcWidget(tipo,tit){const v=CALC_DEF[tipo];if(!v)return "";
 const num=(n,rot,max)=>`<label>${rot}<input type="number" inputmode="numeric" min="0" max="${max}" data-c="${n}" value="${v[n]}"></label>`;
 const dt=(n,rot)=>`<label>${rot}<input type="date" data-c="${n}" value="${v[n]}"></label>`;
 const sel=(n,rot,ops)=>`<label>${rot}<select data-c="${n}">${ops.map(([k,t])=>`<option value="${k}"${v[n]===k?" selected":""}>${t}</option>`).join("")}</select></label>`;
 const campos=tipo==="prd"?`<div class="calc-l3">${num("a","Anos",30)}${num("m","Meses",11)}${num("d","Dias",29)}</div>
  ${sel("tipo","O crime é",[["doloso","doloso"],["culposo","culposo"]])}
  ${sel("viol","Com violência ou grave ameaça à pessoa?",[["nao","não"],["sim","sim"]])}
  ${sel("reinc","Reincidente em crime doloso?",[["nao","não"],["outro","sim, por outro crime, e a medida é socialmente recomendável"],["mesmo","sim, pelo mesmo crime"]])}
  ${sel("circ","Circunstâncias judiciais favoráveis?",[["sim","sim"],["nao","não"]])}`
  :tipo==="dosi"?`<p class="calc-rot">Pena prevista no tipo (em anos)</p><div class="calc-l3">${num("mina","Mínima",30)}${num("maxa","Máxima",40)}</div>
  ${num("circ","Circunstâncias judiciais desfavoráveis (0 a 8)",8)}
  <div class="calc-l3">${num("ag","Agravantes",9)}${num("at","Atenuantes",9)}</div>
  ${sel("aum","Causa de aumento",[["0","nenhuma"],["1/6","1/6"],["1/3","1/3"],["1/2","metade"],["2/3","2/3"]])}
  ${sel("dim","Causa de diminuição",[["0","nenhuma"],["1/6","1/6"],["1/3","1/3"],["1/2","metade"],["2/3","2/3"]])}`
  :tipo==="antec"?`<p class="calc-rot">Condenação anterior</p>${dt("fa","Data do fato anterior")}${dt("tj","Trânsito em julgado (deixe vazio se ainda não houve)")}${dt("ext","Fim da pena: cumprimento ou extinção (vazio se ainda não acabou)")}
  <p class="calc-rot">Processo que está sendo julgado agora</p>${dt("fn","Data do novo fato")}${dt("sn","Data da sentença")}`
  :tipo==="reinc"?`${sel("ant","Condenação anterior, transitada em julgado, por",[["doloso","crime doloso"],["culposo","crime culposo"],["contr","contravenção penal"]])}
  ${sel("quando","O novo fato foi praticado",[["depois","depois do trânsito em julgado"],["antes","antes do trânsito em julgado"]])}
  ${sel("prazo","Do fim da pena anterior até o novo fato",[["ate5","até 5 anos"],["mais5","mais de 5 anos"]])}
  ${sel("novo","O novo fato é",[["doloso","crime doloso"],["culposo","crime culposo"],["contr","contravenção penal"]])}
  ${sel("mesmo","É o mesmo crime da condenação anterior?",[["nao","não"],["sim","sim"]])}`
  :`<p class="calc-rot">Pena substituída</p><div class="calc-l3">${num("pm","Meses",120)}${num("pd","Dias",29)}</div><p class="calc-rot">Tempo já cumprido da restritiva</p><div class="calc-l3">${num("cm","Meses",120)}${num("cd","Dias",29)}</div>`;
 return `<figure class="fig calc" data-calc="${tipo}"><figcaption>${ic("alvo")}${inl(tit)}</figcaption><p class="calc-dica">Mude os dados e veja a resposta mudar na hora.</p><div class="calc-in">${campos}</div>${calcSaida(tipo,v)}</figure>`}
function calcAtualiza(f){const v={};f.querySelectorAll("[data-c]").forEach(el=>v[el.dataset.c]=el.value);
 const o=f.querySelector(".calc-out");o.outerHTML=calcSaida(f.dataset.calc,v);
 if(animOn()){const n=f.querySelector(".calc-out");n.classList.add("calc-novo")}}
/* marcação simples das apostilas -> HTML */
function inl(t){return esc(t).replace(/\*\*(.+?)\*\*/g,(m,x)=>x.length<=2?`<strong>${x}</strong>`:`<strong class="${(x.match(/\S+/g)||[]).length<=7?"mk":"lg"}">${x}</strong>`).replace(/==(.+?)==/g,"<mark>$1</mark>").replace(/(^|[\s(])_(.+?)_(?=[\s.,;:!?)]|$)/g,"$1<em>$2</em>")}
const CALL={exemplo:["Exemplo","ex","lampada"],"atenção":["Atenção","at","exc"],dica:["Dica","di","estrela"],"na prova":["Na prova","pr","alvo"],lembre:["Lembre","le","refazer"],"caso":["Caso prático","ex","balao"]};
const CORES_MAPA=["var(--nv1)","var(--nv2)","var(--nv3)","var(--nv4)","var(--nv5)","var(--nv6)","var(--nv7)"];
function diagrama(tipo,partes){const tit=partes.shift()||"";let h="";
 if(tipo==="piramide"){const n=partes.length;h=`<div class="pir">${partes.map((p,i)=>`<div style="width:${40+60*i/Math.max(1,n-1)}%;--o:${0.55+0.45*i/Math.max(1,n-1)}"><span>${inl(p)}</span></div>`).join("")}</div>`}
 else if(tipo==="linha"){h=`<ol class="tl">${partes.map((p,i)=>{const [a,b]=p.split(" — ");return `<li><span class="tl-n">${i+1}</span><div><b>${inl(a)}</b>${b?`<p>${inl(b)}</p>`:""}</div></li>`}).join("")}</ol>`}
 else if(tipo==="fluxo"){h=`<div class="fx">${partes.map((p,i)=>`${i?'<span class="fx-s" aria-hidden="true">'+ic("prox")+"</span>":""}<div class="fx-c" style="--c:${CORES_MAPA[i%CORES_MAPA.length]}">${inl(p)}</div>`).join("")}</div>`}
 else if(tipo==="compara"){h=`<div class="cp">${partes.map((p,i)=>{const k=p.indexOf(":");const t=p.slice(0,k),it=p.slice(k+1).replace(/;(?![^()]*\))/g,"\u0001").split("\u0001").map(x=>x.trim()).filter(Boolean);return `<div style="--c:${CORES_MAPA[(i*2)%CORES_MAPA.length]}"><b>${inl(t)}</b><ul>${it.map(x=>`<li>${inl(x)}</li>`).join("")}</ul></div>`}).join("")}</div>`}
 return `<figure class="fig"><figcaption>${ic("barras")}${inl(tit)}</figcaption>${h}</figure>`}
function mapaMental(centro,ramos){
 return `<figure class="mapa"><figcaption>${ic("grade")}Mapa mental</figcaption><div class="mapa-in"><div class="mapa-c" style="grid-row:1/span ${Math.max(1,Math.ceil(ramos.length/2))}">${inl(centro)}</div><div class="mapa-r">${ramos.map((r,i)=>{const k=r.indexOf(":");const t=r.slice(0,k),it=r.slice(k+1).replace(/;(?![^()]*\))/g,"\u0001").split("\u0001").map(x=>x.trim()).filter(Boolean);
  return `<div class="ramo${i%2?" dir":" esq"}" style="--c:${CORES_MAPA[i%CORES_MAPA.length]}"><b>${inl(t)}</b><ul>${it.map(x=>`<li>${inl(x)}</li>`).join("")}</ul></div>`}).join("")}</div></div></figure>`}
function md(txt,cor){const L=String(txt).replace(/\r/g,"").split("\n");let h="",i=0;const toc=[];
 const tipoLista=l=>/^- /.test(l)?"ul":/^\d+\. /.test(l)?"ol":null;
 while(i<L.length){const l=L[i].trim();
  if(!l){i++;continue}
  if(l.startsWith("### ")){h+=`<h5>${inl(l.slice(4))}</h5>`;i++;continue}
  if(l.startsWith("## ")){h+=`<h4>${inl(l.slice(3))}</h4>`;i++;continue}
  if(l.startsWith("# ")){const id="s"+toc.length;toc.push(l.slice(2));h+=`<h3 id="${id}">${inl(l.slice(2))}</h3>`;i++;continue}
  if(l.startsWith("::mapa ")){const c=l.slice(7);const rs=[];i++;while(i<L.length&&L[i].trim().startsWith("* ")){rs.push(L[i].trim().slice(2));i++}h+=mapaMental(c,rs);continue}
  if(l.startsWith("::ilus ")){const p=l.slice(7).split("|");h+=`<figure class="fig ilus">${ilustra(p[0].trim(),cor)}${p[1]?`<figcaption class="leg">${inl(p[1].trim())}</figcaption>`:""}</figure>`;i++;continue}
  if(l.startsWith("::calc ")){const p=l.slice(7).split("|");h+=calcWidget(p[0].trim(),(p[1]||"").trim());i++;continue}
  if(l.startsWith("::")){const sp=l.indexOf(" ");h+=diagrama(l.slice(2,sp),l.slice(sp+1).split("|").map(x=>x.trim()));i++;continue}
  if(l.startsWith("!! ")){let it=[];while(i<L.length&&L[i].trim().startsWith("!! ")){it.push(L[i].trim().slice(3));i++}
   h+=`<aside class="memo">${ilustra("mente",cor)}<b>${ic("lampada")}Para memorizar</b>${it.map(x=>`<p>${inl(x)}</p>`).join("")}</aside>`;continue}
  if(l.startsWith("?? ")){let it=[];while(i<L.length&&L[i].trim().startsWith("?? ")){const s=L[i].trim().slice(3);const k=s.indexOf(" | ");it.push(k<0?[s,""]:[s.slice(0,k),s.slice(k+3)]);i++}
   h+=`<aside class="teste">${ilustra("checklist",cor)}<b>${ic("alvo")}Teste-se</b><p class="tdica">Tente responder sozinho antes de tocar na pergunta para ver a resposta.</p>${it.map(([q,r])=>`<details><summary>${inl(q)}</summary><p>${inl(r)}</p></details>`).join("")}</aside>`;continue}
  if(l.startsWith("> ")){let it=[];while(i<L.length&&L[i].trim().startsWith("> ")){it.push(L[i].trim().slice(2));i++}
   const m=it[0].match(/^([^:]{2,12}):\s*/);let k=m&&CALL[m[1].toLowerCase()];if(k){it[0]=it[0].slice(m[0].length);it[0]=it[0].charAt(0).toUpperCase()+it[0].slice(1)}else k=CALL.dica;
   h+=`<aside class="call ${k[1]}">${k[1]==="ex"?CENA:""}<b>${ic(k[2])}${k[0]}</b>${it.map(x=>`<p>${inl(x)}</p>`).join("")}</aside>`;continue}
  if(l.startsWith("|")){const rows=[];while(i<L.length&&L[i].trim().startsWith("|")){rows.push(L[i].trim().replace(/^\||\|$/g,"").split("|").map(x=>x.trim()));i++}
   /* 3 colunas ou mais viram cartões no celular (classe "cartoes"); cada célula leva o nome da coluna em data-l */
   {const cab=rows[0].map(c=>esc(String(c).replace(/\*\*|__|`/g,"").trim())),n=cab.length;
   h+=`<div class="tab${n>=3?" cartoes":""}" role="region" aria-label="Tabela: ${cab.join(", ")}" tabindex="0"><table><thead><tr>${rows[0].map(c=>`<th>${inl(c)}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map(r=>`<tr>${r.map((c,k)=>`<td data-l="${cab[k]||""}">${inl(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}continue}
  const tl=tipoLista(l);if(tl){let it=[];while(i<L.length&&tipoLista(L[i].trim())===tl){it.push(L[i].trim().replace(/^(- |\d+\. )/,""));i++}h+=`<${tl}>${it.map(x=>`<li>${inl(x)}</li>`).join("")}</${tl}>`;continue}
  let p=[];while(i<L.length&&L[i].trim()&&!/^(#|::|!! |\?\? |> |\||- |\d+\. )/.test(L[i].trim())){p.push(L[i].trim());i++}
  if(p.length)h+=`<p>${inl(p.join(" "))}</p>`;else i++;
 }
 return {html:h,toc}}
const METODO=`# Como usar esta apostila
Cada matéria segue o mesmo caminho: primeiro a visão geral, depois os temas em ordem lógica, com exemplos, quadros de atenção e o que costuma cair na prova. No fim vêm as técnicas de memorização e um mapa mental para revisar em poucos minutos.
# Técnicas de memorização que funcionam
- **Leitura ativa:** ao terminar cada tema, feche a tela e explique em voz alta, com suas palavras, o que leu. O que você não conseguir explicar é o que precisa reler.
- **Recuperação (testar-se):** logo depois de ler, faça o simulado de nível 1 da matéria. Errar cedo é útil: o cérebro grava melhor a resposta certa quando a corrige.
- **Repetição espaçada:** revise o mapa mental no dia seguinte, depois de 3 dias, de 7 dias e de 15 dias. Cada revisão leva poucos minutos e segura o conteúdo por muito mais tempo.
- **Siglas e frases-chave:** as siglas da apostila (como LIMPE) servem de gancho. Monte também as suas: quanto mais estranha e pessoal a frase, mais fácil de lembrar.
- **Associação com casos:** ligue cada regra a uma história concreta (o vizinho, o contrato de aluguel, a notícia do jornal). Regra ligada a um caso é lembrada; regra solta é esquecida.
- **Palácio da memória:** imagine um caminho conhecido (sua casa, o trajeto até a faculdade) e "guarde" uma regra em cada cômodo ou ponto do caminho. Para lembrar, percorra o caminho mentalmente.
- **Intercalar matérias:** estude dois ou três temas diferentes na mesma sessão. Parece mais difícil, mas melhora a memória e prepara para provas que misturam assuntos, como a OAB.
> Dica: sessões de 25 a 40 minutos com pausas curtas rendem mais do que horas seguidas. Termine sempre com o mapa mental da matéria.`;

const AP_CARREGADO={};
function apOk(i){return !!(window.APOSTILA&&window.APOSTILA[i])}
function carregarAp(i){if(apOk(i)||AP_CARREGADO[i])return;AP_CARREGADO[i]="carregando";
 carregarApP(i).then(ok=>{AP_CARREGADO[i]=ok?"ok":"erro";reRenderSe(...TELAS_AP)})}
function periodoDe(d){return PERIODOS.findIndex(l=>l.includes(d))}
function temAp(d){const i=periodoDe(d);return i>=0}
function palavras(t){return (String(t).match(/\S+/g)||[]).length}
function aguardandoAp(i,titulo){carregarAp(i);const erro=AP_CARREGADO[i]==="erro";
 return topo(titulo,"",{})+`<main class="wrap">${erro?vazio("livros","Não foi possível abrir a apostila","Verifique a conexão e tente de novo. Depois de aberta uma vez, ela fica disponível sem internet.",`<button class="botao cheio" data-acao="voltar">Voltar</button>`):`<div class="carregando" role="status"><span class="esq l1"></span><span class="esq l2"></span><span class="esq l3"></span><span class="sr">Abrindo a apostila…</span></div>`}</main>`}
/* versículos (Nova Versão Internacional) por matéria */
const VERSOS={
 etica:["A boa reputação vale mais que grandes riquezas; desfrutar de boa estima vale mais que prata e ouro.","Provérbios 22:1"],
 filo:["O conselho da sabedoria é: procure obter sabedoria; use tudo que você possui para adquirir entendimento.","Provérbios 4:7"],
 ied:["O coração do que tem discernimento adquire conhecimento; os ouvidos dos sábios saem à sua procura.","Provérbios 18:15"],
 tge:["Quando os justos florescem, o povo se alegra; quando os ímpios governam, o povo geme.","Provérbios 29:2"],
 soc:["É melhor ter companhia do que estar sozinho, porque maior é a recompensa do trabalho de duas pessoas. Se um cair, o amigo pode ajudá-lo a levantar-se.","Eclesiastes 4:9-10"],
 psc:["Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da sua mente.","Romanos 12:2"],
 crim:["Não se deixem vencer pelo mal, mas vençam o mal com o bem.","Romanos 12:21"],
 civ1:["Com sabedoria se constrói a casa, e com discernimento se consolida. Pelo conhecimento os seus cômodos se enchem do que é precioso e agradável.","Provérbios 24:3-4"],
 con1:["Garantam justiça para os fracos e para os órfãos; mantenham os direitos dos necessitados e dos oprimidos.","Salmos 82:3"],
 con2:["O rei que exerce a justiça dá estabilidade ao país, mas o que gosta de subornos o leva à ruína.","Provérbios 29:4"],
 const:["Ele mostrou a você, ó homem, o que é bom e o que o Senhor exige: Pratique a justiça, ame a fidelidade e ande humildemente com o seu Deus.","Miquéias 6:8"],
 pen1:["Quando se faz justiça, o justo se alegra, mas os malfeitores se apavoram.","Provérbios 21:15"],
 pen2:["Aquele que pecar é que morrerá. O filho não levará a culpa do pai, nem o pai levará a culpa do filho.","Ezequiel 18:20"],
 pen3:["Não matarás. Não adulterarás. Não furtarás.","Êxodo 20:13-15"],
 penal:["Não cometam injustiça num julgamento; não favoreçam os pobres, nem procurem agradar os grandes, mas julguem o seu próximo com justiça.","Levítico 19:15"],
 tgp:["O primeiro a apresentar a sua causa parece ter razão, até que outro venha à frente e o questione.","Provérbios 18:17"],
 pc1:["Não sejam parciais no julgamento! Atendam tanto o pequeno como o grande. Não se deixem intimidar por ninguém, pois o veredicto pertence a Deus.","Deuteronômio 1:17"],
 pc:["Administrem a verdadeira justiça, mostrem misericórdia e compaixão uns para com os outros.","Zacarias 7:9"],
 pc2:["E não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desanimarmos.","Gálatas 6:9"],
 pp1:["Uma só testemunha não é suficiente para condenar alguém de algum crime ou delito. Qualquer acusação precisa ser confirmada pelo depoimento de duas ou três testemunhas.","Deuteronômio 19:15"],
 pp2:["A nossa lei condena alguém, sem primeiro ouvi-lo para saber o que ele está fazendo?","João 7:51"],
 pp:["Siga única e exclusivamente a justiça, para que tenham vida e tomem posse da terra que o Senhor, o seu Deus, lhes dá.","Deuteronômio 16:20"],
 civ2:["Não devam nada a ninguém, a não ser o amor de uns pelos outros, pois aquele que ama seu próximo tem cumprido a lei.","Romanos 13:8"],
 civ3:["Seja o seu ‘sim’, ‘sim’, e o seu ‘não’, ‘não’.","Mateus 5:37"],
 civ4:["Não mudem os marcos de divisa da propriedade do seu vizinho.","Deuteronômio 19:14"],
 civ5:["Acima de tudo, porém, revistam-se do amor, que é o elo perfeito.","Colossenses 3:14"],
 civil:["É melhor não fazer voto do que fazer e não cumprir.","Eclesiastes 5:5"],
 dh:["Criou Deus o homem à sua imagem, à imagem de Deus o criou; homem e mulher os criou.","Gênesis 1:27"],
 adm:["Quem é fiel no pouco, também é fiel no muito, e quem é desonesto no pouco, também é desonesto no muito.","Lucas 16:10"],
 emp:["Você já observou um homem habilidoso em seu trabalho? Será promovido ao serviço real; não trabalhará para gente obscura.","Provérbios 22:29"],
 trab:["Paguem-lhe o seu salário diariamente, antes do pôr-do-sol, pois ele é necessitado e depende disso.","Deuteronômio 24:15"],
 pt:["O trabalhador merece o seu salário.","Lucas 10:7"],
 cdc:["O Senhor repudia balanças desonestas, mas os pesos exatos lhe dão prazer.","Provérbios 11:1"],
 inter:["O estrangeiro residente que viver com vocês será tratado como o natural da terra. Amem-no como a si mesmos, pois vocês foram estrangeiros no Egito.","Levítico 19:34"],
 trib:["Dêem a cada um o que lhe é devido: Se imposto, imposto; se tributo, tributo.","Romanos 13:7"],
 fin:["Qual de vocês, se quiser construir uma torre, primeiro não se assenta e calcula o preço, para ver se tem dinheiro suficiente para completá-la?","Lucas 14:28"],
 eca:["Deixem vir a mim as crianças e não as impeçam; pois o Reino dos céus pertence aos que são semelhantes a elas.","Mateus 19:14"],
 amb:["O Senhor Deus colocou o homem no jardim do Éden para cuidar dele e cultivá-lo.","Gênesis 2:15"],
 prev:["Não me rejeites na minha velhice; não me abandones quando se vão as minhas forças.","Salmos 71:9"],
 eleit:["Escolha dentre todo o povo homens capazes, tementes a Deus, dignos de confiança e inimigos de ganho desonesto.","Êxodo 18:21"],
 masc:["Bem-aventurados os pacificadores, pois serão chamados filhos de Deus.","Mateus 5:9"],
 prc:["Aprendam a fazer o bem! Busquem a justiça, acabem com a opressão. Lutem pelos direitos do órfão, defendam a causa da viúva.","Isaías 1:17"],
 prp:["Erga a voz em favor dos que não podem defender-se, seja o defensor de todos os desamparados.","Provérbios 31:8"],
 prt:["Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens.","Colossenses 3:23"],
 prpub:["Corra a retidão como um rio, a justiça como um ribeiro perene!","Amós 5:24"],
 rev:["Procure apresentar-se a Deus aprovado, como obreiro que não tem do que se envergonhar, que maneja corretamente a palavra da verdade.","2 Timóteo 2:15"]
};
const VERSOS_GERAIS=[
 ["Seja forte e corajoso! Não se apavore, nem se desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.","Josué 1:9"],
 ["Aqueles que esperam no Senhor renovam as suas forças. Voam bem alto como águias; correm e não ficam exaustos, andam e não se cansam.","Isaías 40:31"],
 ["Tudo posso naquele que me fortalece.","Filipenses 4:13"],
 ["Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.","Provérbios 16:3"],
 ["Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de lhes causar dano, planos de dar-lhes esperança e um futuro.","Jeremias 29:11"],
 ["Corramos com perseverança a corrida que nos é proposta.","Hebreus 12:1"],
 ["Entregue o seu caminho ao Senhor; confie nele, e ele agirá.","Salmos 37:5"],
 ["Não tema, pois estou com você; não tenha medo, pois sou o seu Deus. Eu o fortalecerei e o ajudarei.","Isaías 41:10"],
 ["Os planos bem elaborados levam à fartura; mas o apressado sempre acaba na miséria.","Provérbios 21:5"],
 ["A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho.","Salmos 119:105"],
 ["Procure apresentar-se a Deus aprovado, como obreiro que não tem do que se envergonhar, que maneja corretamente a palavra da verdade.","2 Timóteo 2:15"]
];
const MOTIVA=["Gabarito perfeito! Esse é o ritmo de quem vai passar.","100% de acerto: o estudo de hoje já virou ponto na prova.","Nenhum erro! Continue assim, um simulado de cada vez.","Perfeito! A sua constância está fazendo a diferença.","Você dominou este conteúdo. Bora para o próximo desafio!"];
function versoCard(v,rot){return `<aside class="verso"><small>${esc(rot||"Uma palavra para a sua caminhada")}</small><p>“${esc(v[0])}”</p><cite>${esc(v[1])} (NVI)</cite></aside>`}
function versoGeral(n){return VERSOS_GERAIS[((n%VERSOS_GERAIS.length)+VERSOS_GERAIS.length)%VERSOS_GERAIS.length]}
function versoDaChave(key){const p=String(key).split(":");const m=/^(mat|mtodas|fac|ftodas)$/.test(p[0])?p[1]:null;
 if(m&&VERSOS[m])return VERSOS[m];return versoGeral([...String(key)].reduce((s,c)=>s+c.charCodeAt(0),0)+new Date().getDate())}

/* ---------- apostila em páginas (um tema por página) ---------- */
const PAG_CACHE={};
function paginas(d){const i=periodoDe(d);const t=window.APOSTILA[i].mat[d];if(PAG_CACHE[d]&&PAG_CACHE[d].t===t)return PAG_CACHE[d];
 const partes=String(t).replace(/\r/g,"").split(/\n(?=# )/);let pre="";const secs=[];
 partes.forEach(p=>{if(!p.startsWith("# ")){pre+=p+"\n";return}const nl=p.indexOf("\n");secs.push({tit:(nl<0?p.slice(2):p.slice(2,nl)).trim(),corpo:nl<0?"":p.slice(nl+1)})});
 let mapa="";if(secs.length){const u=secs[secs.length-1];const k=u.corpo.search(/^::mapa /m);if(k>=0){mapa=u.corpo.slice(k);u.corpo=u.corpo.slice(0,k)}}
 const cs=[infoDisc(d).cor,"var(--nv2)","var(--nv5)","var(--nv3)"];secs.forEach((s,k)=>{s.ilu=temaIlu(s.tit,d,k);s.cor=cs[k%cs.length]});
 return PAG_CACHE[d]={t,pre,secs,mapa}}
const minLeitura=t=>Math.max(1,Math.round(palavras(t)/180));
function btnLida(d){const l=S.lidos&&S.lidos[d];
 return `<button class="btn-lida${l?" on":""}" data-acao="lida" data-d="${d}">${tile(l?"var(--ok)":"var(--muted)",l?"ok":"livro")}<span><b>${l?"Apostila marcada como lida":"Marcar como lida"}</b><small>${l?"Toque para desmarcar":"Toque quando terminar de estudar esta matéria"}</small></span></button>`}
function telaApost(){const i=rota.p;if(!apOk(i))return aguardandoAp(i,`Apostila do ${i+1}º período`);
 const A=window.APOSTILA[i];const ds=PERIODOS[i];const met=md(METODO);
 return topo(`Apostila do ${i+1}º período`,`${ds.length} matéria${ds.length>1?"s":""}`,{})+
 `<main class="wrap leitura"><div class="ap-hero">${ilustra("livros","var(--toga)")}<div><h2>${i+1}º período</h2><p class="nota">${esc(ds.map(d=>infoDisc(d).nome).join(" · "))}</p></div></div>
 ${A.intro?`<div class="texto">${md(A.intro).html}</div>`:""}
 <button class="card resumo" data-acao="resumo" data-p="${i}" style="width:100%;margin:12px 0 4px">${tile("var(--lacre)","recibo")}<b>Resumo do ${i+1}º período</b><small>Versão curta, com todas as matérias juntas em um só arquivo, para revisar antes da prova</small></button>
 <details class="metodo"><summary>${ic("lampada")}Como estudar e técnicas de memorização</summary><div class="texto">${met.html}</div></details>
 <div class="secao" role="heading" aria-level="2">Matérias</div>
 <div class="lista">${ds.map(d=>{const f=infoDisc(d),t=A.mat&&A.mat[d];const lido=S.lidos&&S.lidos[d];let sub="Em preparação";
  if(t){const P=paginas(d);const vis=Math.min((S.apPg&&S.apPg[d])||0,P.secs.length);sub=`${minLeitura(t)} min de leitura · ${P.secs.length} temas${vis?` · ${vis} lido${vis>1?"s":""}`:""}`}
  return `<button class="item ap-item" data-acao="ler" data-d="${d}" ${t?"":"disabled"}>${tile(f.cor,f.ic)}<span style="min-width:0"><span class="item-tit">${esc(f.nome)}</span><br><span class="item-sub">${sub}</span></span><span class="item-data">${lido?`<span class="lido">${ic("ok")}Lida</span>`:ic("prox")}</span></button>`}).join("")}</div></main>`}
/* ---------- apostila: páginas, leitura contínua, favoritos e anotações ---------- */
/* subtítulos do tema, para o leitor saber o caminho antes de começar (o texto da apostila não muda) */
function nesteTema(s){const subs=[];s.corpo.split("\n").forEach(l=>{l=l.trim();if(l.startsWith("## "))subs.push(l.slice(3))});
 const temMemo=/^!! /m.test(s.corpo),temTeste=/^\?\? /m.test(s.corpo),temMapa=/^::/m.test(s.corpo);
 const extras=[temMemo?"técnica de memorização":"",temMapa?"esquema visual":"",temTeste?"teste-se no fim":""].filter(Boolean);
 if(subs.length<2&&!extras.length)return "";
 return `<nav class="neste" aria-label="Neste tema"><p class="neste-t">${ic("grade")}Neste tema</p>${subs.length>=2?`<ol>${subs.map(x=>`<li>${inl(x)}</li>`).join("")}</ol>`:""}${extras.length?`<p class="neste-x">Inclui ${extras.join(", ")}.</p>`:""}</nav>`}
function blocoTema(d,f,P,k){const s=P.secs[k-1];
 return `<div class="tema-ban" style="--c:${s.cor||f.cor}">${ilustra(s.ilu,s.cor||f.cor)}<div><span class="tn">Tema ${k} de ${P.secs.length} · ${minLeitura(s.corpo)} min</span><h3>${inl(s.tit)}</h3></div></div>
 ${nesteTema(s)}${ouvirBtn(d+":"+k)}<article class="texto" style="--c:${f.cor}">${md(s.corpo,f.cor).html}</article>`}
function trilhaTemas(d,P,pg){const N=P.secs.length;const vis=(S.apPg&&S.apPg[d])||0;
 return `<ol class="trilha" aria-label="Progresso na apostila">${P.secs.map((x,k)=>`<li class="${k+1===pg?"atual":k+1<=vis?"lido":""}"><button data-acao="pag" data-pg="${k+1}" aria-label="Tema ${k+1}: ${esc(limpo(x.tit))}${k+1===pg?" (atual)":""}"${k+1===pg?' aria-current="step"':""}></button></li>`).join("")}<li class="${pg>N?"atual":vis>N?"lido":""}"><button data-acao="pag" data-pg="${N+1}" aria-label="Mapa mental e revisão"${pg>N?' aria-current="step"':""}></button></li></ol>`}
function extrasTema(d,k){const key=d+":"+k;const fav=S.fav&&S.fav[key];const nota=(S.notas&&S.notas[key])||"";
 return `${treinoTema(d,k)}<div class="extras-tema"><button class="btn-fav${fav?" on":""}" data-acao="fav" data-key="${key}" aria-pressed="${!!fav}">${ic("estrela")}<span>${fav?"Tema favoritado":"Favoritar este tema"}</span></button>
 <details class="notas"${nota?" open":""}><summary>${ic("balao")}Minhas anotações deste tema</summary><textarea data-nota="${key}" rows="4" placeholder="Escreva aqui seus resumos, dúvidas ou exemplos. Fica salvo automaticamente.">${esc(nota)}</textarea></details></div>`}
function btnModo(){const t=S.cfg&&S.cfg.apTudo;
 return `<div class="modo-ap" role="group" aria-label="Modo de leitura"><button data-acao="modo-ap" data-v="0" aria-pressed="${!t}">Um tema por página</button><button data-acao="modo-ap" data-v="1" aria-pressed="${!!t}">Ver tudo de uma vez</button></div>`}
function capaAp(d,f,P){const N=P.secs.length;const vis=(S.apPg&&S.apPg[d])||0;
 const cont=vis>N?"Ver o mapa mental e a conclusão":vis>0?`Continuar do tema ${vis}: ${P.secs[vis-1].tit}`:"Começar a leitura";
 const alvo=vis>0?Math.min(vis,N+1):1;
 const pct=Math.round(Math.min(vis,N)*100/Math.max(1,N));
 return `<div class="ap-hero">${ilustra(AP_DISC[d]||"livros",f.cor)}<div><h2>${esc(f.nome)}</h2><p class="nota">${minLeitura(P.t)} min de leitura · ${N} temas</p>${vis?`<div class="ap-prog"><span class="trilho"><i class="f-ok" style="width:${pct}%"></i></span><small>${Math.min(vis,N)} de ${N} temas lidos</small></div>`:""}</div></div>
 ${P.pre.trim()?`<div class="texto" style="--c:${f.cor}">${md(P.pre,f.cor).html}</div>`:""}
 ${btnModo()}
 <div class="capa-acoes"><button class="botao cheio" data-acao="pag" data-pg="${alvo}">${ic("livro")} ${esc(cont)}</button>${btnLida(d)}</div>
 <div class="secao" role="heading" aria-level="2">Temas desta apostila</div>
 <div class="indice-temas">${P.secs.map((s,k)=>`<button data-acao="pag" data-pg="${k+1}">${ilustra(s.ilu,s.cor||f.cor)}<span><small>Tema ${k+1}${S.fav&&S.fav[d+":"+(k+1)]?" · favorito":""}</small><b>${inl(s.tit)}</b></span><span class="vis">${vis>=k+1?ic("ok"):ic("prox")}</span></button>`).join("")}
 <button data-acao="pag" data-pg="${N+1}">${ilustra("mente",f.cor)}<span><small>Conclusão</small><b>Mapa mental e revisão</b></span><span class="vis">${vis>N?ic("ok"):ic("prox")}</span></button></div>`}
function paginaTema(d,f,P,pg){const N=P.secs.length;
 const ant=pg>1?P.secs[pg-2].tit:"Índice dos temas";const prx=pg<N?P.secs[pg].tit:"Mapa mental e revisão";
 return `${trilhaTemas(d,P,pg)}<div class="pager"><span>Tema <b>${pg}</b> de ${N}</span><span class="pager-b"><button class="indice" data-acao="modo-ap" data-v="1">${ic("livro")}Ver tudo</button><button class="indice" data-acao="pag" data-pg="0">${ic("grade")}Temas</button></span></div>
 ${blocoTema(d,f,P,pg)}${extrasTema(d,pg)}
 <nav class="navtema"><button data-acao="pag" data-pg="${pg-1}"><small>${ic("ant")}${pg>1?"Tema anterior":"Voltar"}</small><span>${inl(ant)}</span></button><button class="prox" data-acao="pag" data-pg="${pg+1}"><small>${pg<N?"Próximo tema":"Concluir"}${ic("prox")}</small><span>${inl(prx)}</span></button></nav>`}
function conclusaoAp(d,f,P,i){const A=window.APOSTILA[i];const ds=PERIODOS[i].filter(x=>A.mat&&A.mat[x]);const k=ds.indexOf(d);const ant=ds[k-1],prox=ds[k+1];
 return `<div class="tema-ban" style="--c:${f.cor}">${ilustra("mente",f.cor)}<div><span class="tn">Revisão final</span><h3>Mapa mental</h3></div></div>
 ${P.mapa?`<article class="texto" style="--c:${f.cor}">${md(P.mapa,f.cor).html}</article>`:""}
 ${versoCard(VERSOS[d]||versoGeral(i),"Uma palavra para a sua caminhada")}
 <div class="capa-acoes">${btnLida(d)}</div>
 <div class="ap-fim" style="margin-top:12px"><button class="botao cheio" data-acao="disc" data-d="${d}">${ic("alvo")} Treinar com os simulados desta matéria</button>
 <button class="botao linha" data-acao="cards-disc" data-d="${d}">${ic("refazer")} Cartões de memorização desta matéria</button>
 <button class="botao linha" data-acao="resumo" data-p="${i}">${ic("recibo")} Resumo do ${i+1}º período</button>
 <div class="lado">${ant?`<button class="botao linha" data-acao="ler-troca" data-d="${ant}">${ic("ant")} ${esc(infoDisc(ant).nome)}</button>`:""}${prox?`<button class="botao linha" data-acao="ler-troca" data-d="${prox}">${esc(infoDisc(prox).nome)} ${ic("prox")}</button>`:""}</div>
 <button class="botao linha" data-acao="imprimir">${ic("recibo")} Imprimir ou salvar a apostila inteira em PDF</button></div>`}
function fimAp(d,f,P,i){const N=P.secs.length;
 return `${trilhaTemas(d,P,N+1)}<div class="pager"><span><b>Conclusão</b></span><span class="pager-b"><button class="indice" data-acao="modo-ap" data-v="1">${ic("livro")}Ver tudo</button><button class="indice" data-acao="pag" data-pg="0">${ic("grade")}Temas</button></span></div>
 ${conclusaoAp(d,f,P,i)}
 <nav class="navtema"><button class="so" data-acao="pag" data-pg="${N}"><small>${ic("ant")}Tema anterior</small><span>${inl(P.secs[N-1]?P.secs[N-1].tit:"")}</span></button></nav>`}
function tudoAp(d,f,P,i){const N=P.secs.length;
 return `<div id="indice-ap" class="ap-hero">${ilustra(AP_DISC[d]||"livros",f.cor)}<div><h2>${esc(f.nome)}</h2><p class="nota">${minLeitura(P.t)} min de leitura · ${N} temas · todos nesta página</p></div></div>
 ${btnModo()}<div class="capa-acoes">${btnLida(d)}</div>
 <details class="sumario-tudo"><summary>${ic("grade")}Índice dos temas</summary><div class="indice-mini">${P.secs.map((s,k)=>`<button data-acao="ir-ancora" data-id="t${k+1}"><span>${k+1}</span>${inl(s.tit)}</button>`).join("")}<button data-acao="ir-ancora" data-id="t-fim"><span>${ic("grade")}</span>Mapa mental e revisão</button></div></details>
 ${P.pre.trim()?`<div class="texto" style="--c:${f.cor}">${md(P.pre,f.cor).html}</div>`:""}
 ${P.secs.map((s,k)=>`<section class="secao-tema" id="t${k+1}"><p class="tema-cont">Tema ${k+1} de ${N}</p>${blocoTema(d,f,P,k+1)}${extrasTema(d,k+1)}<button class="topo-link" data-acao="ir-ancora" data-id="indice-ap">${ic("grade")}Voltar ao início</button></section>`).join("")}
 <section class="secao-tema" id="t-fim">${conclusaoAp(d,f,P,i)}</section>`}
function telaLer(){const d=rota.d,i=periodoDe(d),f=infoDisc(d);if(!apOk(i))return aguardandoAp(i,f.nome);
 const A=window.APOSTILA[i],t=A.mat&&A.mat[d];if(!t)return topo(f.nome,"",{})+`<main class="wrap">${vazio("livros","Apostila em preparação","Enquanto o texto não fica pronto, treine com os simulados desta matéria: cada questão traz comentário e fundamento legal.",`<button class="botao cheio" data-acao="disc" data-d="${d}">Ver os simulados</button>`,f.cor)}</main>`;
 const P=paginas(d);const N=P.secs.length;const tudo=S.cfg&&S.cfg.apTudo&&!rota.pagina;
 const pg=Math.max(0,Math.min(N+1,rota.pg||0));rota.pg=pg;
 if(!tudo&&pg>0){S.apPg=S.apPg||{};S.apT=S.apT||{};const ad=(S.apPg[d]||0)<pg,nd=S.apT[d]!==hojeStr();if(ad)S.apPg[d]=pg;if(nd)S.apT[d]=hojeStr();if(ad||nd)salvar()}
 const fonte=(S.cfg&&S.cfg.fonte)||0;
 const dir=`<button class="icone" data-acao="fonte" data-v="-1" aria-label="Diminuir letra">A−</button><button class="icone" data-acao="fonte" data-v="1" aria-label="Aumentar letra">A+</button>`;
 const corpo=tudo?tudoAp(d,f,P,i):pg===0?capaAp(d,f,P):pg<=N?paginaTema(d,f,P,pg):fimAp(d,f,P,i);
 return topo(f.nome,`Apostila do ${i+1}º período`,{dir,extra:`<div class="progresso-leitura"><i ${tudo?'id="prog-l"':""} style="width:${tudo?0:Math.round(pg*100/(N+1))}%"></i></div>`})+
 `<main class="wrap leitura" style="--fs:${[1,1.08,1.17,0.94][(fonte+4)%4]}">${corpo}</main>`}
let leituraOuvinte=null;
function acompanharLeitura(){if(leituraOuvinte)window.removeEventListener("scroll",leituraOuvinte);leituraOuvinte=null;if(rota.tela!=="ler"||!document.getElementById("prog-l"))return;
 leituraOuvinte=()=>{const h=document.documentElement;const max=h.scrollHeight-h.clientHeight;const b=document.getElementById("prog-l");if(b)b.style.width=(max>0?h.scrollTop*100/max:100)+"%"};
 window.addEventListener("scroll",leituraOuvinte,{passive:true});leituraOuvinte()}

/* ---------- resumo de uma folha por período ---------- */
const nomeCurto=n=>String(n).split(" — ")[0];
function folhaResumo(i){const R=(window.RESUMOS||[])[i]||{};const ds=PERIODOS[i].filter(d=>R[d]);const v=versoGeral(i);
 return `<header class="rf-cab"><b>Resumo do ${i+1}º período</b><span>${esc(ds.map(d=>nomeCurto(infoDisc(d).nome)).join(" · "))}</span></header>
 ${ds.map(d=>{const f=infoDisc(d);const x=R[d];const corpo=typeof x==="string"?md(x,f.cor).html:`<ul>${x.map(y=>`<li>${inl(y)}</li>`).join("")}</ul>`;
  return `<section class="rf-mat texto" style="--c:${f.cor}"><div class="rf-tit">${ilustra(AP_DISC[d]||"livros",f.cor)}<h3>${esc(f.nome)}</h3></div>${corpo}</section>`}).join("")}
 ${versoCard(v,"Uma palavra para a sua caminhada")}`}
function telaResumo(){const i=rota.p;const R=(window.RESUMOS||[])[i];
 if(!R)return topo(`Resumo do ${i+1}º período`,"",{})+`<main class="wrap">${vazio("recibo","Resumo em preparação","O resumo deste período ainda está sendo escrito. A apostila completa já traz toda a matéria, com mapas mentais no fim de cada disciplina.",`<button class="botao cheio" data-acao="ap" data-p="${i}">Abrir a apostila</button>`)}</main>`;
 return topo(`Resumo do ${i+1}º período`,"Todas as matérias explicadas em um só documento",{})+
 `<main class="wrap"><article class="resumo-folha">${folhaResumo(i)}</article>
 <div class="ap-fim"><button class="botao cheio" data-acao="imprimir">${ic("recibo")} Imprimir ou salvar o resumo em PDF</button><button class="botao linha" data-acao="ap" data-p="${i}">${ic("livro")} Abrir a apostila completa</button></div></main>`}

/* impressão: monta o documento inteiro */
function imprimir(){const box=document.getElementById("impressao");if(!box)return;let h="";document.body.classList.remove("imp-folha");
 if(rota.tela==="ler"){const d=rota.d,f=infoDisc(d),P=paginas(d),i=periodoDe(d);
  h=`<div class="ap-hero">${ilustra(AP_DISC[d]||"livros",f.cor)}<div><h2>${esc(f.nome)}</h2><p class="nota">Apostila do ${i+1}º período</p></div></div>`+
   (P.pre.trim()?`<div class="texto">${md(P.pre,f.cor).html}</div>`:"")+
   P.secs.map((s,k)=>blocoTema(d,f,P,k+1)+((S.notas&&S.notas[d+":"+(k+1)])?`<aside class="call le"><b>${ic("balao")}Minhas anotações</b><p>${esc(S.notas[d+":"+(k+1)])}</p></aside>`:"")).join("")+
   (P.mapa?`<article class="texto" style="--c:${f.cor}">${md(P.mapa,f.cor).html}</article>`:"")+versoCard(VERSOS[d]||versoGeral(i))}
 else if(rota.tela==="resumo"){h=`<article class="resumo-folha">${folhaResumo(rota.p)}</article>`;document.body.classList.add("imp-folha")}
 else return;
 box.innerHTML=h;box.querySelectorAll("details").forEach(x=>x.open=true);try{window.print()}catch(e){}}

/* ---------- carregamento das apostilas sob demanda ---------- */
const AP_PROM={};
function carregarApP(i){if(apOk(i))return Promise.resolve(true);if(AP_PROM[i])return AP_PROM[i];
 return AP_PROM[i]=new Promise(res=>{const s=document.createElement("script");s.src=`ap${i+1}.js`;s.onload=()=>{AP_CARREGADO[i]="ok";res(true)};s.onerror=()=>{delete AP_PROM[i];res(false)};document.head.appendChild(s)})}
function carregarTodas(){return Promise.all(PERIODOS.map((_,i)=>carregarApP(i)))}
const TELAS_AP=["apost","ler","busca","cartoes","cartao","favs","hoje"];
function reRenderSe(...t){if(t.includes(rota.tela)){rota.manterScroll=true;render()}}


