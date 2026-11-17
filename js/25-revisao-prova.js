"use strict";
/* ---------- revisão para a prova: simulados só com os temas que vão cair (Penal II: pena e execução) ----------
   Cada revisão junta questões já existentes (pelos assuntos) e as do lote próprio. Chave "rvp:<id>:<n>" ou "rvp:<id>:todas". */
const REV_PROVA={
 pena:{d:"pen2",titulo:"Revisão para a prova",sub:"Penal II · pena e execução",
  temas:["Agravantes","Atenuantes","Primário, reincidente e maus antecedentes","Regime inicial","Progressão: quanto cumprir","Progressão: exame criminológico","Saída temporária","PRD","PPL","Princípios da pena"],
  ass:["Agravantes","Atenuantes","Concurso de circunstâncias","Dosimetria","Ordem de preponderância","Reincidência","Maus antecedentes","Caso Maria",
   "Regimes","Penas privativas de liberdade","Espécies de pena","Progressão de regime","Exame criminológico","Saída temporária","Execução",
   "Penas restritivas","Requisitos da substituição","Prestação pecuniária","Perda de bens e valores","Prestação de serviços","Limitação de fim de semana","Conversão","Falta grave",
   "Princípios da pena"],
  fora:["p206"],ate:"2026-12-20"}};
const REV_TAM=15,CACHE_REV={};
/* intercala os assuntos para que cada simulado misture todos os temas */
function idsRev(id){if(CACHE_REV[id])return CACHE_REV[id];const R=REV_PROVA[id];if(!R)return [];
 const grupos=R.ass.map(a=>QS.filter(q=>q.t===R.d&&q.a===a&&!R.fora.includes(q.id)).map(q=>q.id)).filter(l=>l.length);
 const out=[];for(let r=0,resta=true;resta;r++){resta=false;grupos.forEach(l=>{if(r<l.length){resta=true;out.push(l[r])}})}
 return CACHE_REV[id]=out}
const blocosRev=id=>fatias(idsRev(id),REV_TAM);
{const s0=sim;sim=function(key){const p=String(key).split(":");if(p[0]!=="rvp")return s0(key);const R=REV_PROVA[p[1]];if(!R)return null;
 if(p[2]==="todas")return {key,tipo:"fac",titulo:"Todas as questões da revisão",sub:R.sub,qids:idsRev(p[1]).slice(),limite:0};
 const i=+p[2],qids=(blocosRev(p[1])[i]||[]).slice();
 return {key,tipo:"fac",titulo:`Revisão ${String(i+1).padStart(2,"0")}`,sub:R.sub,qids,limite:0,rampa:true}}}
/* nota de faculdade (70 aprova, 40 vai ao exame final), como os outros simulados da disciplina */
{const t0=tipoNota;tipoNota=function(key){return /^rvp:/.test(key||"")?"fac":t0(key)}}
function blocoRevProva(d){const ids=Object.keys(REV_PROVA).filter(k=>REV_PROVA[k].d===d);if(!ids.length)return "";
 return ids.map(id=>{const R=REV_PROVA[id],n=blocosRev(id).length,tot=idsRev(id).length;if(!tot)return "";const ks=[];for(let i=0;i<n;i++)ks.push(`rvp:${id}:${i}`);
  return `<section class="rvp" aria-label="${esc(R.titulo)}"><div class="rvp-cab">${tile("var(--lacre)","alvo")}<div><b>${esc(R.titulo)}</b><small>${tot} questões só com o que cai na prova · ${n} simulados de ${REV_TAM}</small></div></div>
  <ul class="rvp-temas">${R.temas.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
  <p class="nota" style="margin:0 0 10px">Cada simulado mistura todos os temas e começa pelas mais simples. Termine com o simulado de todas as questões.</p>
  <div class="lista">${ks.map(k=>itemSim(k)).join("")}${itemSim(`rvp:${id}:todas`)}</div></section>`}).join("")}
{const t0=telaDisc;telaDisc=function(){const h=t0(),b=blocoRevProva(rota.d);if(!b)return h;
 const marca=`<div class="secao" role="heading" aria-level="2">Simulados</div>`,i=h.indexOf(marca);
 return i<0?h:h.slice(0,i)+`<div class="secao" role="heading" aria-level="2">Revisão para a prova</div>`+b+h.slice(i)}}
/* atalhos para achar a revisão: cartão no Hoje (até a data "ate") e na tela Faculdade do período da disciplina */
function cartaoRevProva(){return Object.keys(REV_PROVA).map(id=>{const R=REV_PROVA[id],tot=idsRev(id).length;if(!tot||(R.ate&&hojeStr()>R.ate))return "";
 return `<button class="card destaque rvp-card" data-acao="disc" data-d="${R.d}">${tile("var(--lacre)","alvo")}<b>${esc(R.titulo)}: ${esc(R.sub)}</b><small>${tot} questões só com o que cai na prova: ${esc(R.temas.slice(0,4).join(", "))} e mais</small></button>`}).join("")}
{const t0=telaHoje;telaHoje=function(){const h=t0(),c=cartaoRevProva(),m=`<main class="wrap hoje">`,i=h.indexOf(m);return !c||i<0?h:h.slice(0,i+m.length)+c+h.slice(i+m.length)}}
{const t0=telaFaculdade;telaFaculdade=function(){const h=t0(),ds=PERIODOS[periodo]||[];const c=Object.keys(REV_PROVA).some(id=>ds.includes(REV_PROVA[id].d))?cartaoRevProva():"";
 const m=`<div class="secao" role="heading" aria-level="2">Apostila do período</div>`,i=h.indexOf(m);return !c||i<0?h:h.slice(0,i)+c+h.slice(i)}}
