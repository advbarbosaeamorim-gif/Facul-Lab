"use strict";
/* ---------- resultado guardado por simulado ----------
   O histórico (S.hist) guarda cada tentativa inteira, com todas as respostas, e por isso tem limite.
   S.res guarda, por simulado (chave), um resumo fixo que não se perde quando o histórico é podado:
   n tentativas, b melhor nota, pb melhor nota antes da última tentativa, u/t/i/tp/ok/er/br da última tentativa
   e ev com as últimas 12 notas [quando, %]. Listas de revisão e "refazer as que errei" não entram (chaves efêmeras).
   Cada tentativa concluída ganha rz=1 quando entra no resumo, para não contar duas vezes. */
const HIST_MAX=200,HIST_TETO=300,RES_EFEMERA=/^(rev:|errhoje|teim$|err$|cad:)/;
/* na poda, além das listas efêmeras, os treinos sob medida também não seguram lugar (cada um tem a sua chave);
   o resultado deles fica no resumo e a lista de questões em S.sob (js/19-sob-medida.js) */
const HIST_LIVRE=/^(rev:|errhoje|teim$|err$|cad:|sob:)/;
let resDoS=null;
function resGarante(){if(resDoS===S&&S.res)return;resDoS=S;if(!S.res||typeof S.res!=="object"||Array.isArray(S.res))S.res={};
 /* tentativas concluídas que ainda não entraram no resumo (progresso de versões antigas ou de um backup), das mais antigas às mais novas */
 (S.hist||[]).filter(a=>a&&a.status==="concluido"&&!a.rz).sort((x,y)=>(x.fim||x.inicio||0)-(y.fim||y.inicio||0)).forEach(resAnota)}
function resAnota(a){resGarante();if(!a||a.status!=="concluido"||a.rz)return;a.rz=1;
 if(!a.key||RES_EFEMERA.test(a.key)||!a.qids||!a.qids.length)return;
 const r=res(a),t=a.fim||a.inicio||Date.now(),R=S.res[a.key]||(S.res[a.key]={n:0,b:0,ev:[]});
 if(!R.t||t>=R.t){R.pb=R.b||0;Object.assign(R,{u:r.pct,t,i:a.inicio||t,tp:Math.round(a.tempo||0),ok:r.ok,er:r.er,br:r.br})}
 R.n=(R.n||0)+1;R.b=Math.max(R.b||0,r.pct);
 R.ev=(R.ev||[]).concat([[t,r.pct]]).sort((x,y)=>x[0]-y[0]).slice(-12)}
function resDe(key){resGarante();const R=S.res[key];return R&&R.n?R:null}
/* a última tentativa concluída de um simulado, venha do histórico ou do resumo */
function resumoKey(key){const a=S.hist.find(x=>x.key===key&&x.status==="concluido");
 if(a){const r=res(a);return {ok:r.ok,er:r.er,br:r.br,pct:r.pct,tempo:a.tempo||0}}
 const R=resDe(key);return R?{ok:R.ok||0,er:R.er||0,br:R.br||0,pct:R.u||0,tempo:R.tp||0}:null}
/* poda do histórico: ficam a tentativa em andamento, as pausadas, a última concluída de cada simulado
   e, até 200 no total, as mais recentes; nunca mais de 300. O que sai já está no resumo. */
function podarHist(){const H=S.hist||[];if(H.length<=HIST_MAX)return;resGarante();
 const fica=new Set(),visto=new Set();if(typeof sessao!=="undefined"&&sessao)fica.add(sessao);
 H.forEach(a=>{if(HIST_LIVRE.test(a.key||""))return;
  if(a.status==="pausado")fica.add(a);else if(a.status==="concluido"&&!visto.has(a.key)){visto.add(a.key);fica.add(a)}});
 let livres=Math.max(0,HIST_MAX-fica.size);
 let nova=H.filter(a=>fica.has(a)||livres-->0);
 if(nova.length>HIST_TETO)nova=nova.filter(a=>a===sessao).concat(nova.filter(a=>a!==sessao).slice(0,HIST_TETO-1));
 const ficou=new Set(nova);H.forEach(a=>{if(!ficou.has(a)&&a.status==="concluido")resAnota(a)});
 S.hist=nova}

/* ---------- nota de corte e regra de cada tipo de simulado ---------- */
const corteDe=key=>tipoNota(key)==="fac"?NOTA_REGRA.dir:50;
function corteInfo(key){const t=tipoNota(key);
 return `<div><strong>${corteDe(key)}%</strong><small>${t==="fac"?"para passar direto":t==="oab"?"para aprovação":"meta do treino"}</small></div>`}
function regraTexto(key,r){key=key||"";const t=tipoNota(key);
 if(t==="fac")return `<p>Vale ${fmtNota(r.pct/10)} de 10. Na faculdade (regra da Afya Unigranrio), 70 pontos em N1 + N2 aprovam direto e de 40 a 69 levam ao exame final.</p>`;
 if(/^oab:/.test(key))return `<p>Na 1ª fase, a aprovação exige 40 acertos em 80 (50%).</p>`;
 if(t==="oab")return `<p>Na 1ª fase da OAB, a aprovação exige 50% de acertos.</p>`;
 return `<p>Treino sem nota de corte oficial: a meta do app é acertar 50% ou mais.</p>`}

/* ---------- evolução: as últimas notas do simulado, a melhor marcada e a linha da nota de corte ---------- */
function resDataCurta(x){const h=inicioDia();return x>=h?"hoje":x>=h-DIA?"ontem":new Date(x).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}
function resEvolucao(key,a){const R=resDe(key);if(!R)return "";
 const naRes=!!a,e=naRes?null:estado(key),resumo=!!(e&&e.a&&e.a.resumo);
 if(R.n<2&&!resumo)return "";
 const ev=R.ev||[],corte=corteDe(key),tA=a?(a.fim||a.inicio):R.t,t=tipoNota(key);
 const pl=(n,s,p)=>`${n} ${n===1?s:p}`;
 const faixa=p=>p>=corte?"ok":t==="fac"&&p>=NOTA_REGRA.ex?"ex":"ab";
 const barras=ev.map(([x,p],i)=>`<li class="${faixa(p)}${p===R.b?" melhor":""}${x===tA?" atual":""}" style="--p:${p};--i:${i}"><b aria-hidden="true">${p}</b><span class="sr">${resDataCurta(x)}: ${p}%${p===R.b?", a sua melhor":""}</span></li>`).join("");
 let nota="";
 if(naRes){const p=res(a).pct,i=ev.findIndex(z=>z[0]===tA),ant=i>0?ev[i-1][1]:null;
  if(tA===R.t&&R.n>1&&p>(R.pb||0))nota=`<p class="ev-nota rec">${ic("estrela")}<span><b>Novo recorde neste simulado!</b> A sua melhor nota era ${R.pb||0}%.</span></p>`;
  else if(ant!==null)nota=p>ant?`<p class="ev-nota sobe">${ic("cima")}<span>Subiu ${pl(p-ant,"ponto","pontos")} desde a tentativa anterior.</span></p>`
   :p<ant?`<p class="ev-nota cai">${ic("baixo")}<span>Caiu ${pl(ant-p,"ponto","pontos")} desde a tentativa anterior. Revise as que errou e tente de novo: a nota volta a subir.</span></p>`
   :`<p class="ev-nota">${ic("setas")}<span>Mesma nota da tentativa anterior.</span></p>`}
 else if(resumo)nota=`<p class="ev-nota">${ic("info")}<span>A correção questão por questão desta tentativa já saiu do histórico; a nota fica guardada aqui.</span></p>`;
 const leg=t==="fac"?`${corte}% aprova direto`:t==="oab"?`${corte}% aprova`:`meta de ${corte}%`;
 return `<section class="ev" aria-label="Sua evolução neste simulado">
  <div class="ev-top"><b>Sua evolução</b><small>${pl(R.n,"tentativa","tentativas")} · melhor ${R.b}% · última ${R.u}%</small></div>
  ${ev.length>1?`<div class="ev-graf" style="--corte:${corte}"><span class="ev-linha" aria-hidden="true"></span><ol class="ev-barras">${barras}</ol></div>
  <div class="ev-leg" aria-hidden="true"><span class="ev-l-corte"></span>${leg}<span class="ev-l-melhor"></span>melhor nota${ev.length<R.n?`<span class="ev-l-ult">últimas ${ev.length}</span>`:""}</div>`:""}
  ${nota}</section>`}
