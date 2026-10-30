"use strict";
/* ---------- casos de prova: questões em forma de caso concreto, como a FGV cobra na 1ª fase da OAB (casos.js, marcadas com k:1) ---------- */
const casosDe=m=>QS.filter(q=>q.k&&(m==="todas"||q.m===m)).map(q=>q.id);
{const s0=sim;sim=function(key){const p=String(key).split(":");if(p[0]!=="casos")return s0(key);const m=p[1]||"todas";
 return {key,tipo:"casos",titulo:"Casos de prova",sub:m==="todas"?"Todas as matérias · estilo FGV":META[m]?META[m].nome:"",qids:casosDe(m),limite:0}}}
/* selo na questão: avisa que é para ler a situação com calma antes de olhar as alternativas */
const seloCaso=q=>q&&q.k?`<span class="q-caso" title="Questão em forma de caso concreto, no estilo da prova">${ic("balanca")}Caso de prova</span>`:"";
/* bloco na tela do Simulado OAB: treina só os casos, de todas as matérias */
function blocoCasos(){const n=casosDe("todas").length;if(!n)return "";
 return `<div class="secao" role="heading" aria-level="2">Casos de prova</div><p class="nota" style="margin-top:0">A FGV cobra muitas questões assim: uma situação concreta e a pergunta sobre o que fazer. Treine ler o caso, achar o instituto e só então olhar as alternativas.</p>
 <div class="lista">${itemSim("casos:todas")}</div>`}
