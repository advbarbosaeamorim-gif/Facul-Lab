"use strict";
/* ---------- leveza ----------
   Os enfeites que se mexem sem parar (brilhos, ilustrações que flutuam, pulsos, faixas) dão vida quando a tela aparece,
   mas, rodando para sempre, faziam o celular redesenhar a tela a cada quadro mesmo com a pessoa parada: o processador
   ficava ocupado e tudo (rolar, abrir o ≡, tocar) engasgava. Agora, alguns segundos depois de a tela aparecer, ou assim
   que a pessoa rola, cada enfeite termina a volta em que está (os longos, como os brilhos que giram, param onde estão).
   Toda tela nova, ou toque que redesenha, traz os enfeites de volta. O que mostra algo em andamento continua: o modo
   foco, o relógio do modo prova, os carregamentos e as cenas dos segredos (que ficam fora de #app). */
const CALMA_MS=5000,CALMA_FICA=".foco,.esq,.gerando,.mp-tempo,.fc-eq,.abrindo,.camada,.ob-onda";
let tCalma=0;
function acalmar(){clearTimeout(tCalma);tCalma=0;if(!document.getAnimations)return;
  for(const a of document.getAnimations()){const ef=a.effect;const el=ef&&ef.target;
    if(!el||a.playState!=="running"||!el.closest||!el.closest("#app")||el.closest(CALMA_FICA))continue;
    try{const t=ef.getComputedTiming();if(t.iterations!==Infinity)continue;
      const falta=(1-(t.progress||0))*(+t.duration||0);
      if(t.currentIteration==null||falta>3000)a.pause();else ef.updateTiming({iterations:t.currentIteration+1})}catch(e){}}}
function calmaDepois(){clearTimeout(tCalma);tCalma=setTimeout(acalmar,CALMA_MS)}
{const r0=render;render=function(){const x=r0.apply(this,arguments);calmaDepois();return x}}
addEventListener("scroll",()=>{if(tCalma)acalmar()},{passive:true});
/* versão nova do app encontrada logo ao abrir, antes de a pessoa tocar em algo: recarrega sozinho, sem perguntar */
{let tocou=false;addEventListener("pointerdown",()=>{tocou=true},{once:true,capture:true});
 try{navigator.serviceWorker&&navigator.serviceWorker.addEventListener("message",e=>{
   if(e.data&&e.data.tipo==="conteudo-novo"&&!tocou&&performance.now()<6000&&!sessao){guardarRolagem();location.reload()}})}catch(e){}}
