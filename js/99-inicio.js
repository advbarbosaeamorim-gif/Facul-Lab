"use strict";
if(perAtual()!==null)periodo=Math.min(9,perAtual());
{let y=0;try{y=restaurarTela()}catch(e){y=0}
 try{render()}catch(e){rota={tela:"hoje"};pilha=[];sessao=null;deck=null;y=0;render()}
 voltarRolagem(y)}
/* nas prévias do Netlify, espaço para o selo que fica no rodapé */
if(/netlify\.app$/.test(location.hostname))document.documentElement.classList.add("np");
/* na primeira entrada, o tour "Como funciona" (com opção de pular) */
if(!(S.cfg&&S.cfg.tour))tourAbrir();
/* datas do Direito: na primeira abertura do dia, a cena da data (no lugar do recado de motivação, que continua no Hoje) */
let dhAbriu=false;try{if(tourI<0&&ovoDataHoje()&&localStorage.getItem("faculLab.data")!==hojeStr()){localStorage.setItem("faculLab.data",hojeStr());dhAbriu=true;setTimeout(()=>{if(!document.querySelector(".festa,#tour"))ovoData()},700)}}catch(e){}
/* recado de motivação na primeira abertura do dia, se a ofensiva se perdeu */
try{if(tourI<0&&!dhAbriu&&ofensivaPerdida()&&localStorage.getItem("faculLab.motiva")!==hojeStr()){localStorage.setItem("faculLab.motiva",hojeStr());setTimeout(mostrarMotiva,500)}}catch(e){}
/* primeira entrada sem o tour: convite para os lembretes (com o tour, ele aparece quando o tour termina ou é pulado) */
try{if(tourI<0&&!localStorage.getItem("faculLab.lbConvite")&&lbPodeConvidar())setTimeout(()=>{if(tourI<0&&!document.querySelector(".festa,#tour"))lbConvite()},1500)}catch(e){}
