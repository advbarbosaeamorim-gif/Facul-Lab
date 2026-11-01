"use strict";
/* ---------- acabamento das telas ----------
   O botão "+" do Simulado OAB (.fab) se recolhe enquanto a lista rola para baixo, para não cobrir a %
   das matérias, e volta ao rolar para cima, perto do topo ou no fim da página. Um só ouvinte de rolagem,
   passivo e no máximo uma vez por quadro; como a tela é redesenhada a cada render(), o botão é procurado de novo. */
(()=>{let y0=scrollY,pendente=false;
 addEventListener("scroll",()=>{if(pendente)return;pendente=true;
  requestAnimationFrame(()=>{pendente=false;const y=scrollY,f=document.querySelector(".fab");
   if(f){const fim=y+innerHeight>=document.documentElement.scrollHeight-60;
    if(y>y0+4&&y>120&&!fim)f.classList.add("recolhe");else if(y<y0-4||fim||y<=120)f.classList.remove("recolhe")}
   y0=y})},{passive:true})})();
