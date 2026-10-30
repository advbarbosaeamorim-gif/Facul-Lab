"use strict";
/* ---------- modo foco (Pomodoro) ----------
   Blocos de foco com hora para acabar e pausas curtas, e a cada 4 pomodoros uma pausa longa. Enquanto o foco corre, a chama
   cresce no centro do relógio; cada pomodoro concluído joga uma lenha na fogueira e conta como dia de estudo na ofensiva.
   O tempo é guardado como horário de término (localStorage faculLab.foco), então o timer segue certo com a tela apagada,
   em outra tela do app ou com o app fechado. Som ambiente gerado na hora pelo Web Audio (lareira, chuva, mar, floresta,
   biblioteca), sem arquivo para baixar. Preferências em S.cfg.foco; minutos e pomodoros de cada dia em S.foco. */
const FC_CH="faculLab.foco";
const FC_PRE=[["classico","Clássico","25 de foco, 5 de pausa",25,5,15],["leve","Aquecimento","15 de foco, 3 de pausa",15,3,10],["imersao","Imersão","50 de foco, 10 de pausa",50,10,20]];
const FC_AMB=[["lareira","Lareira","Lenha estalando","chama"],["chuva","Chuva","Chuva na janela","chuva"],["mar","Mar","Ondas indo e vindo","onda"],["floresta","Floresta","Vento e passarinhos","folha"],["biblioteca","Biblioteca","Silêncio com páginas","livro"],["silencio","Silêncio","Só o relógio, sem som","mudo"]];
const FC_TAR=[["questoes","Questões","alvo","materias"],["cartoes","Cartões","cartas","cartoes"],["apostila","Apostila","livro","faculdade"],["leiseca","Lei seca","recibo","leiseca"],["plano","Plano de hoje","refazer","hoje"],["livre","Outro estudo","lampada",null]];
const FC_DICAS=["Levante e alongue o pescoço, os ombros e as costas. Eles seguraram o estudo até aqui.","Beba um copo de água. Cabeça hidratada rende mais.","Olhe para algo bem longe por uns 20 segundos. A vista descansa da tela.","Respire fundo: 4 segundos puxando o ar, 4 segurando e 6 soltando. Repita três vezes.","Sem olhar, tente lembrar os 3 pontos principais do que acabou de estudar. Lembrar ativamente fixa mais do que reler.","Deixe as redes sociais para depois: elas prendem a atenção e a volta ao estudo fica mais difícil.","Explique em voz alta, como se fosse para um cliente, o que acabou de aprender. Se travar, é ali que vale revisar.","Abra a janela, caminhe até a cozinha, mexa o corpo. A pausa é para o cérebro sair da cadeira também."];
const FC_DICAS_LONGA=["Pausa longa: hora de um lanche, uma caminhada curta ou deitar uns minutos. Você fechou um ciclo inteiro!","Pausa longa merecida. Que tal contar para alguém o que você estudou? Ensinar é a melhor revisão."];
const FC_FESTA=[["Pomodoro concluído!","Mais uma lenha na fogueira. Sua chama cresceu com você."],["Foco de juiz!","Atenção total do começo ao fim. É assim que a matéria entra."],["Mais um bloco na conta","Cada pomodoro é um tijolo da sua aprovação."],["Que concentração!","Você segurou o foco até o fim. Agora, descanso de verdade."],["A chama agradece","Você alimentou o fogo sem se distrair. Bora descansar um pouco."]];
let FC=(()=>{try{const o=JSON.parse(localStorage.getItem(FC_CH)||"{}");return o&&typeof o==="object"?o:{}}catch(e){return {}}})();
const fcGuarda=()=>{try{localStorage.setItem(FC_CH,JSON.stringify(FC))}catch(e){}};
function fcCfg(){S.cfg=S.cfg||{};const c=S.cfg.foco=S.cfg.foco||{};if(!FC_PRE.some(x=>x[0]===c.p))c.p="classico";if(!FC_AMB.some(x=>x[0]===c.amb))c.amb=somTocaSom()?"lareira":"silencio";if(typeof c.vol!=="number")c.vol=.6;return c}
const fcPre=()=>FC_PRE.find(x=>x[0]===fcCfg().p);
const fcMinFoco=()=>fcCfg().min||fcPre()[3];
const fcRodando=()=>!!FC.f&&FC.pausa==null;
const fcResta=()=>!FC.f?fcMinFoco()*6e4:FC.pausa!=null?FC.pausa:Math.max(0,FC.fim-Date.now());
const fcProg=()=>FC.f?Math.min(1,1-fcResta()/FC.dur):0;
const fcMMSS=ms=>{const s=Math.ceil(ms/1e3);return p2(Math.floor(s/60))+":"+p2(s%60)};
const fcNomeFase=f=>f==="foco"?"Foco":f==="longa"?"Pausa longa":f==="pausa"?"Pausa curta":"Pronto";
function fcDia(k){const d=(S.foco&&S.foco.d)||{};return d[k||hojeStr()]||{n:0,m:0}}
function fcConta(n,min){S.foco=S.foco||{d:{},n:0,m:0};const k=hojeStr(),x=S.foco.d[k]=S.foco.d[k]||{n:0,m:0};x.n+=n;x.m+=min;S.foco.n+=n;S.foco.m+=min;
 const ks=Object.keys(S.foco.d).sort();if(ks.length>90)ks.slice(0,ks.length-90).forEach(z=>delete S.foco.d[z])}

/* ---------- ícones e ilustração ---------- */
Object.assign(P,{
 play:'<path d="M8 5.5v13l11-6.5z"/>',
 tomate:'<path d="M12 7c-4.6 0-8 3-8 6.8S7.4 21 12 21s8-3.4 8-7.2S16.6 7 12 7z"/><path d="M12 7c-1-1.7-3-2.4-4.5-2M12 7c1-1.7 3-2.4 4.5-2M12 7V3.5"/>',
 chuva:'<path d="M7 15a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8a3.5 3.5 0 0 1 .5 7z"/><path d="M8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5"/>',
 onda:'<path d="M3 9c2.2 0 2.2-2 4.5-2S9.8 9 12 9s2.3-2 4.5-2S18.8 9 21 9M3 14c2.2 0 2.2-2 4.5-2s2.3 2 4.5 2 2.3-2 4.5-2 2.3 2 4.5 2M3 19c2.2 0 2.2-2 4.5-2s2.3 2 4.5 2 2.3-2 4.5-2 2.3 2 4.5 2"/>',
 parar:'<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>',
 pular:'<path d="M6 6l8 6-8 6zM18 6v12"/>'
});
ILU.foco=`<path d="M120 50c-33 0-58 21-58 48s25 42 58 42 58-15 58-42-25-48-58-48z" class="f-a"/><path d="M98 62c-14 5-24 16-25 30" class="s-w" fill="none" stroke-width="6" stroke-linecap="round" opacity=".45"/>
 <circle cx="120" cy="98" r="28" class="f-w"/>${seq(12,i=>`<rect x="119" y="73" width="2.5" height="${i%3?4:7}" rx="1.2" class="f-t" transform="rotate(${i*30} 120 98)"/>`)}<path d="M120 98V80" class="s-t" stroke-width="4" stroke-linecap="round"/><path d="M120 98l11 7" class="s-b" stroke-width="4" stroke-linecap="round"/><circle cx="120" cy="98" r="4" class="f-b"/>
 <path d="M120 52c-6-9-17-12-26-8 8 1 14 6 17 12zM120 52c6-9 17-12 26-8-8 1-14 6-17 12zM120 52c-2-8 1-14 6-18" fill="#3a9d5d" stroke="#2f7f4b" stroke-width="2.5" stroke-linejoin="round"/>
 <path d="M190 40c-8 0-13-5-13-11 0-5 3-8 6-11 1 3 2 4 4 5 0-5 2-9 6-12-1 5 1 8 3 11 2 2 3 5 3 8 0 6-4 10-9 10z" class="f-b"/><path d="M48 112l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" class="f-b" opacity=".8"/>`;

/* ---------- sons do modo foco ---------- */
Object.assign(SONS,{
 "fc-comeca":a=>{const t=a.currentTime+.01;ruido(a,t,.5,{tipo:"lowpass",f1:200,f2:1200,Q:.8,vol:.18,pico:.5,eco:.3});estalos(a,t+.1,4,.4,.07);kalimba(a,t+.18,N.G5,.07,1.1);kalimba(a,t+.3,N.C6,.07,1.4)},
 "fc-fim":a=>{const t=a.currentTime+.01;[N.C6,N.G5,N.E6].forEach((f,i)=>{kalimba(a,t+i*.28,f,.1,2.2,.6);marimba(a,t+i*.28,f/2,.06,1.2)});coral(a,t+.35,[N.C4,N.E4,N.G4],2.4,.03)},
 "fc-volta":a=>{const t=a.currentTime+.01;rolado(a,t,[N.E4,N.G4,N.C5,N.E5],.12,.14,.9)},
 "fc-tomate":a=>{const t=a.currentTime+.01;for(let i=0;i<12;i++)ruido(a,t+i*.11,.02,{tipo:"highpass",f1:i%2?2600:3400,Q:.9,vol:.16,pico:.05,eco:.1});
  for(let i=0;i<10;i++)kalimba(a,t+1.42+i*.06,i%2?N.E6:N.C6,.06,.5,.3);kalimba(a,t+2.05,N.G5,.06,1.6)}
});
Object.assign(VIBRA,{"fc-comeca":15,"fc-fim":[60,80,60,80,160],"fc-volta":[40,60,40],"fc-tomate":[10,100,10,100,10,100,200]});
/* com a tela apagada o som() fica quieto; o fim de uma fase toca mesmo assim (o usuário pediu o alarme) */
function fcToca(n){if(!document.hidden)return som(n);if(!somTocaSom())return;const a=audio();if(!a)return;try{if(a.state==="suspended")a.resume();SONS[n](a)}catch(e){}}

/* ---------- som ambiente ---------- */
let AMB=null;
function ambBuf(a,tipo){a.fcBuf=a.fcBuf||{};if(a.fcBuf[tipo])return a.fcBuf[tipo];const sr=a.sampleRate,n=sr*6,b=a.createBuffer(2,n,sr);
 for(let c=0;c<2;c++){const d=b.getChannelData(c);let y=0,b0=0,b1=0,b2=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;
  if(tipo==="marrom"){y=(y+.02*w)/1.02;d[i]=y*3.5}else{b0=.99765*b0+w*.099;b1=.963*b1+w*.2965;b2=.57*b2+w*1.0526;d[i]=(b0+b1+b2+w*.1848)*.16}}
  /* emenda suave do fim com o começo, para o loop não estalar */
  const z=Math.floor(sr*.05);for(let i=0;i<z;i++){const k=i/z;d[n-z+i]=d[n-z+i]*(1-k)+d[i]*k}}
 return a.fcBuf[tipo]=b}
function ambFonte(a,tipo,dest,filtros,vol){const s=a.createBufferSource();s.buffer=ambBuf(a,tipo);s.loop=true;let no=s;
 (filtros||[]).forEach(([t,f,q])=>{const fl=a.createBiquadFilter();fl.type=t;fl.frequency.value=f;fl.Q.value=q||.7;no.connect(fl);no=fl});
 const g=a.createGain();g.gain.value=vol;no.connect(g);g.connect(dest);s.start(a.currentTime,Math.random()*5);AMB.nos.push(s);return {s,g,ultimo:no}}
function ambLfo(a,hz,prof,alvo){const o=a.createOscillator(),g=a.createGain();o.frequency.value=hz;g.gain.value=prof;o.connect(g);g.connect(alvo);o.start();AMB.nos.push(o)}
function ambVez(ms1,ms2,fn){const v=()=>{if(!AMB)return;fn(AMB.a,AMB.a.currentTime+.02);AMB.tm=AMB.tm.filter(x=>x!==id);id=setTimeout(v,ms1+Math.random()*(ms2-ms1));AMB.tm.push(id)};let id=setTimeout(v,Math.random()*ms1);AMB.tm.push(id)}
function ambPan(a,dest,p){if(!a.createStereoPanner)return dest;const s=a.createStereoPanner();s.pan.value=p;s.connect(dest);return s}
const AMB_MONTA={
 lareira:(a,g)=>{const f=ambFonte(a,"marrom",g,[["lowpass",420]],.9);ambLfo(a,.23,.18,f.g.gain);ambLfo(a,.61,.1,f.g.gain);
  ambVez(90,520,(a,t)=>ruido(a,t,.012+Math.random()*.03,{tipo:"highpass",f1:1800+Math.random()*2600,Q:.7,vol:.04+Math.random()*.14,pico:.05,dest:ambPan(a,g,Math.random()*.8-.4)}));
  ambVez(2500,7000,(a,t)=>{for(let i=0;i<3+Math.random()*4;i++)ruido(a,t+i*.03+Math.random()*.05,.02,{tipo:"bandpass",f1:900+Math.random()*900,Q:1,vol:.12,pico:.05,dest:g})})},
 chuva:(a,g)=>{const f=ambFonte(a,"rosa",g,[["highpass",500],["lowpass",6500]],.55);ambLfo(a,.07,.08,f.g.gain);ambFonte(a,"marrom",g,[["lowpass",180]],.5);
  ambVez(30,140,(a,t)=>ruido(a,t,.008+Math.random()*.012,{tipo:"bandpass",f1:2200+Math.random()*4500,Q:2,vol:.015+Math.random()*.04,pico:.1,dest:ambPan(a,g,Math.random()*1.4-.7)}));
  ambVez(9000,22000,(a,t)=>ruido(a,t,3.5,{tipo:"lowpass",f1:90,f2:60,Q:.7,vol:.22,pico:.25,dest:g}))},
 mar:(a,g)=>{const f=ambFonte(a,"marrom",g,[["lowpass",520]],.5);ambLfo(a,.09,.42,f.g.gain);
  const e=ambFonte(a,"rosa",g,[["bandpass",1400,.5]],.05);ambLfo(a,.09,.05,e.g.gain);
  ambVez(5000,12000,(a,t)=>ruido(a,t,2.4,{tipo:"bandpass",f1:2500,f2:900,Q:.6,vol:.05,pico:.35,dest:ambPan(a,g,Math.random()*.6-.3)}))},
 floresta:(a,g)=>{const f=ambFonte(a,"rosa",g,[["bandpass",650,.4]],.22);ambLfo(a,.05,.12,f.g.gain);
  ambVez(1400,5200,(a,t)=>{const d=ambPan(a,g,Math.random()*1.6-.8),f0=2600+Math.random()*1800,n=2+Math.floor(Math.random()*4),dt=.08+Math.random()*.07;
   for(let i=0;i<n;i++){const o=a.createOscillator(),gg=a.createGain(),t0=t+i*dt*1.6;o.type="sine";o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(f0*(1.25+Math.random()*.3),t0+dt*.6);o.frequency.exponentialRampToValueAtTime(f0*.9,t0+dt);
    gg.gain.setValueAtTime(.0001,t0);gg.gain.linearRampToValueAtTime(.02+Math.random()*.02,t0+.01);gg.gain.exponentialRampToValueAtTime(.0001,t0+dt);o.connect(gg);gg.connect(d);o.start(t0);o.stop(t0+dt+.02)}})},
 biblioteca:(a,g)=>{ambFonte(a,"marrom",g,[["lowpass",260]],.5);ambFonte(a,"rosa",g,[["lowpass",900]],.05);
  ambVez(7000,18000,(a,t)=>{ruido(a,t,.22,{f1:3000,f2:1100,Q:.9,vol:.06,pico:.35,dest:g});ruido(a,t+.1,.16,{f1:1800,f2:700,Q:1.2,vol:.04,pico:.2,dest:g})});
  ambVez(9000,25000,(a,t)=>{for(let i=0;i<5+Math.random()*6;i++)ruido(a,t+i*.13+Math.random()*.05,.06+Math.random()*.05,{f1:3800+Math.random()*900,Q:2.5,vol:.012,pico:.4,dest:g})})}
};
function ambVolume(){return Math.pow(fcCfg().vol,1.6)*.9}
function ambTocar(tipo,previa){ambParar(.3);if(!tipo||tipo==="silencio"||!AMB_MONTA[tipo])return;const a=audio();if(!a)return;try{if(a.state==="suspended")a.resume()}catch(e){}
 try{const g=a.createGain();g.gain.setValueAtTime(.0001,a.currentTime);g.gain.linearRampToValueAtTime(ambVolume()+.0001,a.currentTime+1.4);g.connect(a.saida);
  AMB={a,g,tipo,nos:[],tm:[],previa:!!previa};AMB_MONTA[tipo](a,g);
  if(previa){const id=setTimeout(()=>{if(AMB&&AMB.g===g&&!fcRodando()){ambParar(1.2);fcMarcaAmb()}},5200);AMB.tm.push(id)}}catch(e){AMB=null}fcMarcaAmb()}
function ambParar(fade){if(!AMB)return;const x=AMB;AMB=null;x.tm.forEach(clearTimeout);const t=x.a.currentTime,f=fade||.6;
 try{x.g.gain.cancelScheduledValues(t);x.g.gain.setValueAtTime(x.g.gain.value,t);x.g.gain.linearRampToValueAtTime(.0001,t+f)}catch(e){}
 setTimeout(()=>{x.nos.forEach(n=>{try{n.stop()}catch(e){}});try{x.g.disconnect()}catch(e){}},f*1e3+80);fcMarcaAmb()}
function ambSync(){const tipo=fcCfg().amb;if(FC.f==="foco"&&FC.pausa==null){if(!AMB||AMB.tipo!==tipo)ambTocar(tipo);else AMB.previa=false}else if(AMB&&!AMB.previa)ambParar(1.2)}
function fcMarcaAmb(){document.querySelectorAll(".fc-amb button").forEach(b=>b.classList.toggle("tocando",!!AMB&&AMB.tipo===b.dataset.v))}

/* ---------- tela acesa durante o foco ---------- */
let fcWake=null;
async function fcAcesa(on){try{if(on&&!fcWake&&navigator.wakeLock&&fcCfg().acesa!==false&&!document.hidden){fcWake=await navigator.wakeLock.request("screen");fcWake.addEventListener("release",()=>{fcWake=null})}
 else if(!on&&fcWake){const w=fcWake;fcWake=null;await w.release()}}catch(e){}}

/* ---------- o relógio ---------- */
function fcIniciar(){const now=Date.now();if(FC.f&&FC.pausa!=null){FC.fim=now+FC.pausa;FC.pausa=null}
 else{const dur=fcMinFoco()*6e4;FC={f:"foco",ini:now,fim:now+dur,dur,pausa:null,ciclo:FC.ciclo||0,tar:fcCfg().tar||""}}
 fcGuarda();fcAcesa(true);ambSync();som("fc-comeca");fcRedesenha();anunciar(`Foco começou: ${fcMMSS(fcResta())}`)}
function fcPausar(){if(!fcRodando())return;FC.pausa=Math.max(0,FC.fim-Date.now());fcGuarda();fcAcesa(false);ambSync();som("toque");fcRedesenha();anunciar("Timer pausado")}
function fcEncerrar(){if(!FC.f)return;const era=FC.f;if(era==="foco"){const min=Math.floor((FC.dur-fcResta())/6e4);if(min>=1){fcConta(0,min);salvar()}}
 FC={ciclo:era==="foco"?FC.ciclo||0:era==="longa"?0:FC.ciclo||0};fcGuarda();fcAcesa(false);ambSync();som("toque");fcRedesenha();
 anunciar(era==="foco"?"Pomodoro encerrado. A chama apagou desta vez, mas os minutos estudados contam.":"Pausa encerrada")}
function fcPularPausa(){if(FC.f!=="pausa"&&FC.f!=="longa")return;FC={ciclo:FC.f==="longa"?0:FC.ciclo||0};fcGuarda();fcIniciar()}
/* fecha as fases que já acabaram (inclusive com o app fechado) e começa a próxima */
function fcAvanca(){let mudou=false,festa=null,volta=false;const now=Date.now();
 while(FC.f&&FC.pausa==null&&now>=FC.fim){mudou=true;const p=FC_PRE.find(x=>x[0]===fcCfg().p);
  if(FC.f==="foco"){const min=Math.round(FC.dur/6e4),ciclo=(FC.ciclo||0)+1,longa=ciclo%4===0,dur=(longa?p[5]:p[4])*6e4;
   fcConta(1,min);marcarDia("f");if(now-FC.fim<9e4)festa={min,longa,pausa:longa?p[5]:p[4]};
   FC={f:longa?"longa":"pausa",ini:FC.fim,fim:FC.fim+dur,dur,pausa:null,ciclo,tar:FC.tar,dica:Math.floor(Math.random()*(longa?FC_DICAS_LONGA:FC_DICAS).length)}}
  else{if(now-FC.fim<9e4)volta=true;FC={ciclo:FC.f==="longa"?0:FC.ciclo||0,volta:1}}}
 if(!mudou)return;salvar();fcGuarda();ambSync();fcAcesa(fcRodando());
 if(festa){fcToca("fc-fim");fcAvisa("Pomodoro concluído!",`${festa.min} minutos de foco. Agora, ${festa.pausa} de pausa.`);if(!document.hidden)setTimeout(()=>fcFesta(festa),rota.tela==="foco"?350:0)}
 else if(volta){fcToca("fc-volta");fcAvisa("A pausa acabou","Bora para o próximo pomodoro?");anunciar("A pausa acabou. Bora para o próximo pomodoro?")}
 fcRedesenha()}
function fcAvisa(t,b){if(!document.hidden||!("Notification" in window)||Notification.permission!=="granted"||!navigator.serviceWorker)return;
 navigator.serviceWorker.getRegistration().then(r=>{if(r)r.showNotification(t,{body:b,icon:"lembretes/ic-chama.png",badge:"lembretes/selo.png",tag:"facul-lab-foco",renotify:true,data:{url:"./"}})}).catch(()=>{})}
function fcRedesenha(){if(rota.tela==="foco"){rota.manterScroll=true;render()}else fcPinta()}
function fcFesta(x){if(document.querySelector(".festa,#tour"))return;const v=FC_FESTA[Math.floor(Math.random()*FC_FESTA.length)];const n=fcDia().n;
 const el=document.createElement("div");el.className="festa fc-festa";el.dataset.acao="festa-fechar";el.setAttribute("role","dialog");el.setAttribute("aria-label",v[0]);
 el.innerHTML=`<canvas aria-hidden="true"></canvas><div class="festa-card"><span class="mt-selo">${ic("tomate")} ${n}º pomodoro de hoje</span><div class="fc-festa-fogo" aria-hidden="true">${fcChamaSvg()}${fcLenha(Math.min(n,8))}</div>
 <h2>${esc(v[0])}</h2><p class="frase">${esc(v[1])}</p><p class="mv-info">${x.longa?`Você fechou um ciclo de 4! Pausa longa de ${x.pausa} minutos.`:`Pausa de ${x.pausa} minutos. ${esc(FC_DICAS[FC.dica||0])}`}</p>
 <div class="botoes"><button class="botao cheio" data-acao="festa-fechar">Começar a pausa</button><button class="botao" data-fc="pular">Pular a pausa</button></div></div>`;
 document.body.appendChild(el);if(animOn())confete(el.querySelector("canvas"));syncVoltar();anunciar(v[0])}

/* ---------- desenho: chama, lenha e relógio ---------- */
function fcChamaSvg(){return `<svg class="fc-svg" viewBox="0 0 64 80" aria-hidden="true" focusable="false"><defs><linearGradient id="fc-g1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e3321b"/><stop offset=".55" stop-color="#ff7a1a"/><stop offset="1" stop-color="#ffb52e"/></linearGradient><linearGradient id="fc-g2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff951f"/><stop offset="1" stop-color="#ffd84a"/></linearGradient><radialGradient id="fc-g3" cx=".5" cy=".78" r=".65"><stop offset="0" stop-color="#fffbea"/><stop offset="1" stop-color="#ffe26a"/></radialGradient></defs>
 <g class="fc-ext"><path fill="url(#fc-g1)" d="M32 78C16 78 6 67 6 53c0-12 7-20 13-27 1 6 4 10 8 11-1-13 5-25 17-33-2 11 3 18 9 26 4 6 7 12 7 21 0 16-12 27-28 27z"/></g>
 <g class="fc-mei"><path fill="url(#fc-g2)" d="M32 78c-10 0-17-7-17-16 0-8 5-13 9-18 1 4 3 7 6 8 0-7 3-13 9-17-1 7 2 11 5 16 3 4 5 8 5 13 0 8-7 14-17 14z"/></g>
 <g class="fc-int"><path fill="url(#fc-g3)" d="M32 78c-5 0-9-4-9-9 0-5 3-8 6-11 1 3 2 4 4 5 1-3 2-6 5-8 0 4 1 6 2 9 1 2 1 4 1 6 0 5-4 8-9 8z"/></g></svg>`}
/* uma lenha por pomodoro do dia (até 8), cruzadas embaixo do fogo */
function fcLenha(n){const L=[[-1,0],[1,0],[0,-1],[-2,-1],[2,-1],[-1,-2],[1,-2],[0,-3]].slice(0,Math.max(1,n));
 return `<svg class="fc-lenha${n?"":" vazia"}" viewBox="0 0 120 46" aria-hidden="true" focusable="false">${L.map(([x,y],i)=>`<g transform="translate(${60+x*15} ${36+y*7}) rotate(${(i%2?-1:1)*(8+i*2)})" ><g><rect x="-26" y="-5" width="52" height="10" rx="5" fill="#8a5632"/><path d="M-18 -1h20M-6 2h16" stroke="#6b3f22" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="25" cy="0" rx="3.4" ry="5" fill="#d8a26f"/><ellipse cx="25" cy="0" rx="1.6" ry="2.6" fill="none" stroke="#a8713f" stroke-width="1"/></g></g>`).join("")}</svg>`}
const FC_C=2*Math.PI*104;
function fcEstagio(){if(FC.f==="pausa"||FC.f==="longa")return "descansa";if(FC.f!=="foco")return "brasa";const p=fcProg();return p<.25?"acesa":p<.6?"viva":p<.9?"alta":"fogueira"}
function fcFrase(){const e=fcEstagio(),pz=FC.f==="foco"&&FC.pausa!=null;
 if(pz)return "Timer pausado. A chama espera por você.";
 return {brasa:FC.volta?"Pausa encerrada. Bora acender de novo?":"Escolha o tempo e acenda a chama.",acesa:"A chama está pegando. Celular longe, foco na tarefa.",viva:"Chama acesa! Siga firme, você está no embalo.",alta:"Fogo alto! Falta pouco para fechar o pomodoro.",fogueira:"Reta final: termine o raciocínio, a fogueira está no auge.",descansa:"A chama descansa com você. Nada de estudar agora!"}[e]}
function fcEscala(){const e=fcEstagio();if(e==="brasa")return .3;if(e==="descansa")return .5;return .4+.6*fcProg()}
/* atualiza só o que muda a cada segundo, sem refazer a tela */
function fcPinta(){const m=document.querySelector("main.foco");
 if(m){const r=fcResta(),p=fcProg(),e=fcEstagio();m.dataset.est=e;
  const t=$("#fc-tempo");if(t&&t.firstChild)t.firstChild.nodeValue=fcMMSS(r);
  const c=$("#fc-prog");if(c)c.style.strokeDashoffset=(FC_C*(FC.f?1-p:1)).toFixed(1);
  const ch=$("#fc-chama");if(ch)ch.style.setProperty("--s",fcEscala().toFixed(3));m.style.setProperty("--p",FC.f==="foco"?p.toFixed(3):e==="descansa"?".25":"0");
  const fr=$("#fc-frase");if(fr&&fr.textContent!==fcFrase())fr.textContent=fcFrase();
  if(FC.f&&FC.pausa==null){const s=Math.ceil(r/1e3);document.title=`${fcMMSS(r)} · ${fcNomeFase(FC.f)} · Facul Lab`;if(s!==fcPinta.s){fcPinta.s=s;if(s%60===0&&s)anunciar(`${s/60} minuto${s===60?"":"s"} restante${s===60?"":"s"}`)}}else if(document.title!=="Facul Lab")document.title="Facul Lab"}
 else if(/· Facul Lab$/.test(document.title))document.title="Facul Lab";
 fcPilula()}
/* pílula flutuante: o timer continua à vista enquanto se estuda em outras telas */
function fcPilula(){let el=$("#foco-pill");const ver=!!FC.f&&rota.tela!=="foco";
 if(!ver){if(el)el.remove();return}
 const dentro=/^(quiz|ls-quiz|cartao)$/.test(rota.tela);
 if(!el||el.dataset.dentro!==String(dentro)){if(el)el.remove();el=document.createElement(dentro?"div":"button");el.id="foco-pill";el.dataset.dentro=String(dentro);if(!dentro)el.dataset.fc="abrir";
  el.innerHTML=`<span class="fp-fogo" aria-hidden="true">${fcChamaSvg().replace(/fc-g/g,"fp-g")}</span><span class="fp-t"></span>`;document.body.appendChild(el)}
 el.dataset.f=FC.f;el.classList.toggle("parado",FC.pausa!=null);const r=fcMMSS(fcResta());el.querySelector(".fp-t").textContent=r;
 el.style.setProperty("--s",(FC.f==="foco"?.55+.45*fcProg():.5).toFixed(3));
 el.setAttribute("aria-label",`${fcNomeFase(FC.f)}: faltam ${r}${dentro?"":". Toque para abrir o modo foco"}`)}
function fcFaisca(n,forte){const box=$("#fc-palco");if(!box||!animOn())return;for(let k=0;k<n;k++){const s=document.createElement("span");s.className="fc-faisca"+(forte?" forte":"");
 s.style.left=(50+(Math.random()-.5)*(forte?18:12)*(.5+fcEscala()))+"%";s.style.setProperty("--dx",((Math.random()-.5)*(forte?90:46)).toFixed(0)+"px");s.style.setProperty("--h",(forte?70:60+fcEscala()*60).toFixed(0)+"px");
 s.style.animationDelay=(Math.random()*.2).toFixed(2)+"s";box.appendChild(s);setTimeout(()=>s.remove(),1900)}}
setInterval(()=>{if(!FC.f)return;fcAvanca();fcPinta();if(fcRodando()&&FC.f==="foco"&&rota.tela==="foco"&&!document.hidden&&Math.random()<.15+fcProg()*.45)fcFaisca(1)},500);
document.addEventListener("visibilitychange",()=>{if(document.hidden)return;fcAvanca();fcPinta();if(fcRodando())fcAcesa(true)});
try{new MutationObserver(()=>{fcPinta();fcMarcaAmb()}).observe($("#app"),{childList:true})}catch(e){}

/* ---------- a tela ---------- */
function fcSemana(){const L=[];for(let k=6;k>=0;k--){const d=new Date();d.setDate(d.getDate()-k);const x=fcDia(hojeStr(d.getTime()));L.push({d,m:x.m,n:x.n,hoje:!k})}
 const mx=Math.max(25,...L.map(x=>x.m)),f=new Intl.DateTimeFormat("pt-BR",{weekday:"short"});
 return `<ol class="fc-semana" aria-label="Minutos de foco nos últimos 7 dias">${L.map((x,i)=>`<li class="${x.hoje?"hoje":""}" style="--h:${(x.m*100/mx).toFixed(0)}%;--i:${i}"><span class="fs-v">${x.m?x.m:""}</span><i></i><span class="fs-d">${f.format(x.d).slice(0,1).toUpperCase()}</span><span class="sr">${f.format(x.d)}: ${x.m} minutos, ${x.n} pomodoros</span></li>`).join("")}</ol>`}
function telaFoco(){const C=fcCfg(),pr=fcPre(),F=FC,ativo=!!F.f,pz=F.f==="foco"&&F.pausa!=null,dHoje=fcDia(),tot=(S.foco&&S.foco.n)||0,totM=(S.foco&&S.foco.m)||0;
 const pausaF=F.f==="pausa"||F.f==="longa";const tar=FC_TAR.find(x=>x[0]===(F.tar||C.tar));
 const ciclo=pausaF&&F.f==="longa"?4:(F.ciclo||0)%4;
 const dica=pausaF?(F.f==="longa"?FC_DICAS_LONGA:FC_DICAS)[(F.dica||0)%(F.f==="longa"?FC_DICAS_LONGA:FC_DICAS).length]:"";
 const bts=!ativo?`<button class="fc-play" data-fc="ini" aria-label="Começar o foco de ${fcMinFoco()} minutos">${ic("play")}</button>`
  :F.f==="foco"?`<button class="fc-bt" data-fc="fim" aria-label="Encerrar o pomodoro">${ic("parar")}<small>Encerrar</small></button><button class="fc-play${pz?"":" pausa"}" data-fc="${pz?"ini":"pausa"}" aria-label="${pz?"Continuar":"Pausar"}">${ic(pz?"play":"pausa")}</button><span class="fc-bt-vazio"></span>`
  :`<span class="fc-bt-vazio"></span><button class="fc-play pausa-bt" data-fc="pular" aria-label="Pular a pausa e começar o próximo foco">${ic("pular")}</button><span class="fc-bt-vazio"></span>`;
 return topo("Modo foco","Pomodoro com a chama da ofensiva",{menu:true})+
 `<main class="wrap foco" data-f="${F.f||""}" data-est="${fcEstagio()}">
 <section class="fc-hero" aria-labelledby="fc-tit">
  <p class="fc-fase" id="fc-tit">${ic(F.f==="foco"?"chama":pausaF?"lua":"tomate")} ${pz?"Foco pausado":fcNomeFase(F.f)}${F.f==="foco"&&tar?` · ${esc(tar[1])}`:""}</p>
  <div class="fc-palco" id="fc-palco">
   <svg class="fc-anel" viewBox="0 0 240 240" aria-hidden="true" focusable="false"><defs><linearGradient id="fc-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--fc1)"/><stop offset="1" style="stop-color:var(--fc2)"/></linearGradient></defs>
    <g class="fc-marcas">${seq(60,i=>`<line x1="120" y1="${i%5?6:4}" x2="120" y2="${i%5?10:14}" transform="rotate(${i*6} 120 120)"/>`)}</g>
    <circle class="fc-trilho" cx="120" cy="120" r="104"/><circle class="fc-prog" id="fc-prog" cx="120" cy="120" r="104" stroke-dasharray="${FC_C.toFixed(1)}" stroke-dashoffset="${FC_C.toFixed(1)}"/></svg>
   <div class="fc-brilho" aria-hidden="true"></div>
   <button class="fc-chama" id="fc-chama" data-fc="atica" aria-label="Atiçar a chama">${fcChamaSvg()}</button>
   ${fcLenha(Math.min(dHoje.n,8))}
  </div>
  <p class="fc-tempo" id="fc-tempo" role="timer" aria-label="Tempo restante">${fcMMSS(fcResta())}</p>
  ${!ativo?`<div class="fc-ajuste"><button class="fc-mm" data-fc="menos" aria-label="Menos 5 minutos" ${fcMinFoco()<=5?"disabled":""}>−</button><span>${fcMinFoco()} min de foco</span><button class="fc-mm" data-fc="mais" aria-label="Mais 5 minutos" ${fcMinFoco()>=90?"disabled":""}>+</button></div>`:""}
  <p class="fc-frase" id="fc-frase" aria-live="polite">${fcFrase()}</p>
  <ol class="fc-ciclo" aria-label="${ciclo} de 4 pomodoros neste ciclo">${seq(4,i=>`<li class="${i<ciclo?"on":""}${i===ciclo&&F.f==="foco"?" agora":""}">${ic("tomate")}</li>`)}<li class="fc-ciclo-txt">${pausaF&&F.f==="longa"?"Ciclo completo!":`${ciclo} de 4 até a pausa longa`}</li></ol>
  <div class="fc-bts">${bts}</div>
  ${dica?`<p class="fc-dica">${ic("lampada")}<span><b>Dica da pausa.</b> ${esc(dica)}</span></p>`:""}
  ${F.f==="foco"&&tar&&tar[3]?`<button class="botao linha fc-ir" data-fc="ir" data-tela="${tar[3]}">${ic(tar[2])} Ir para ${esc(tar[1].toLowerCase())}<small>o timer continua no cantinho da tela</small></button>`:""}
 </section>
 <div class="hoje-stats fc-stats">
  <div class="hs"><span class="hs-ic">${ic("tomate")}</span><div><b>${dHoje.n}</b><span>pomodoro${dHoje.n===1?"":"s"} hoje</span></div></div>
  <div class="hs"><span class="hs-ic">${ic("relogio")}</span><div><b>${dHoje.m}</b><span>minutos de foco hoje</span></div></div>
  <div class="hs"><span class="hs-ic">${ic("chama")}</span><div><b>${tot}</b><span>pomodoros no total${totM?` · ${totM>=120?Math.floor(totM/60)+"h"+(totM%60?p2(totM%60):""):totM+" min"}`:""}</span></div></div>
 </div>
 ${fcSemana()}
 <div class="secao" role="heading" aria-level="2">Tempo de cada bloco</div>
 <div class="cores fc-pre">${FC_PRE.map(([k,n,d,f])=>`<button data-fc="pre" data-v="${k}" aria-pressed="${C.p===k}" ${ativo?"disabled":""}><span class="ico-op fc-num">${f}</span><span>${n}<small>${d}</small></span></button>`).join("")}</div>
 ${ativo?`<p class="nota fc-nota">Para trocar o tempo, encerre o bloco atual.</p>`:""}
 <div class="secao" role="heading" aria-level="2">O que você vai estudar</div>
 <div class="fc-tar" role="group" aria-label="O que você vai estudar">${FC_TAR.map(([k,n,i])=>`<button data-fc="tar" data-v="${k}" aria-pressed="${(F.f?F.tar:C.tar)===k}">${ic(i)}<span>${n}</span></button>`).join("")}</div>
 <div class="secao" role="heading" aria-level="2">Som ambiente</div>
 <div class="cores fc-amb">${FC_AMB.map(([k,n,d,i])=>`<button data-fc="amb" data-v="${k}" aria-pressed="${C.amb===k}"><span class="ico-op">${ic(i)}<i class="fc-eq" aria-hidden="true"><b></b><b></b><b></b></i></span><span>${n}<small>${d}</small></span></button>`).join("")}</div>
 <label class="fc-vol"><span>${ic("mudo")}</span><input type="range" id="fc-vol" min="0" max="100" step="1" value="${Math.round(C.vol*100)}" aria-label="Volume do som ambiente"><span>${ic("som")}</span></label>
 <p class="nota fc-nota">O som toca só durante o foco e para sozinho na pausa. Toque numa opção para ouvir uma amostra.${somTocaSom()?"":" Os sons de acerto e de alarme estão desligados em Configurações; o som ambiente toca mesmo assim."}</p>
 ${"wakeLock" in navigator?`<div class="chave fc-chave"><p><b>Manter a tela acesa</b><small>Durante o foco, o celular não apaga a tela sozinho</small></p><label class="switch"><input type="checkbox" id="fc-acesa" ${C.acesa!==false?"checked":""} aria-label="Manter a tela acesa durante o foco"><span></span></label></div>`:""}
 <div class="secao" role="heading" aria-level="2">Como funciona o Pomodoro</div>
 <ol class="fc-passos">
  <li style="--c:var(--nv2)">${ic("alvo")}<span><b>Uma tarefa só</b><small>Escolha antes: 20 questões de Penal, um tema da apostila, os cartões do dia.</small></span></li>
  <li style="--c:var(--nv4)">${ic("chama")}<span><b>Foco até o timer tocar</b><small>Celular longe, sem trocar de assunto. Lembrou de algo? Anote num papel e volte.</small></span></li>
  <li style="--c:var(--nv1)">${ic("lua")}<span><b>Pausa de verdade</b><small>Levante, beba água, olhe para longe. Na pausa não se estuda: é o descanso que mantém a atenção.</small></span></li>
  <li style="--c:var(--nv6)">${ic("tomate")}<span><b>A cada 4, uma pausa longa</b><small>Fechou o ciclo? Descanse de 10 a 20 minutos e recomece com a cabeça fresca.</small></span></li>
 </ol>
 <div class="dica fc-porque"><p style="margin:0"><b>Por que funciona.</b> Um bloco curto, com hora para acabar, é bem mais fácil de começar do que "estudar a tarde toda". E as pausas no meio ajudam a atenção a durar o dia inteiro. <b>No Facul Lab</b>, cada pomodoro concluído conta como dia de estudo e mantém sua ofensiva acesa.</p></div>
 </main>`}

/* ---------- toques ---------- */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-fc]");if(!b||b.disabled)return;const a=b.dataset.fc,C=fcCfg();
 switch(a){
  case "ini":fcIniciar();break;
  case "pausa":fcPausar();break;
  case "fim":fcEncerrar();break;
  case "pular":{const f=b.closest(".festa");if(f){f.remove();syncVoltar()}fcPularPausa();break}
  case "abrir":raiz({tela:"foco"});break;
  case "ir":raiz({tela:b.dataset.tela});break;
  case "mais":case "menos":C.min=Math.max(5,Math.min(90,fcMinFoco()+(a==="mais"?5:-5)));if(C.min===fcPre()[3])delete C.min;salvar();som("toque");fcRedesenha();break;
  case "pre":C.p=b.dataset.v;delete C.min;salvar();som("toque");fcRedesenha();break;
  case "tar":{const v=b.dataset.v,ja=(FC.f?FC.tar:C.tar)===v;C.tar=ja?"":v;if(FC.f){FC.tar=C.tar;fcGuarda()}salvar();som("toque");fcRedesenha();break}
  case "amb":C.amb=b.dataset.v;salvar();document.querySelectorAll(".fc-amb button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
   if(fcRodando()&&FC.f==="foco")ambTocar(C.amb);else if(C.amb!=="silencio")ambTocar(C.amb,true);else ambParar(.4);
   anunciar(C.amb==="silencio"?"Sem som ambiente":`Som ambiente: ${FC_AMB.find(x=>x[0]===C.amb)[1]}`);break;
  case "atica":{const ch=$("#fc-chama");if(ch&&animOn()){ch.classList.remove("aticar");void ch.offsetWidth;ch.classList.add("aticar")}fcFaisca(FC.f==="foco"?12:5,true);som(FC.f?"fogo":"toque");break}
 }});
let tFcVol=null;
document.addEventListener("input",e=>{if(e.target.id!=="fc-vol")return;const C=fcCfg();C.vol=+e.target.value/100;
 if(AMB)try{AMB.g.gain.setTargetAtTime(ambVolume()+.0001,AMB.a.currentTime,.08)}catch(err){}
 else if(C.amb!=="silencio")ambTocar(C.amb,true);clearTimeout(tFcVol);tFcVol=setTimeout(salvar,400)});
document.addEventListener("change",e=>{if(e.target.id!=="fc-acesa")return;fcCfg().acesa=e.target.checked;salvar();if(fcRodando())fcAcesa(e.target.checked)});

/* ---------- segredo: o tomate de Cirillo (cinco toques seguidos no relógio do modo foco) ---------- */
OVOS.push({id:"tomate",ic:"tomate",nome:"O tomate de Cirillo",dica:"O relógio do modo foco tem uma origem curiosa. Toque nos números dele cinco vezes seguidas."});
const OVO_TOMATE=`<svg class="ot-svg" viewBox="0 0 200 170" aria-hidden="true" focusable="false"><ellipse cx="100" cy="160" rx="62" ry="6" fill="#000" opacity=".12"/>
 <g class="ot-tomate"><path d="M100 46c-44 0-74 26-74 58s30 52 74 52 74-20 74-52-30-58-74-58z" fill="#e5484d"/><path d="M58 70c-12 8-18 20-18 32" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".35"/>
 <path d="M30 108h140" stroke="#b9303a" stroke-width="3" opacity=".5"/>
 <g class="ot-giro"><circle cx="100" cy="108" r="44" fill="none"/>${seq(12,i=>`<text x="100" y="74" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" transform="rotate(${i*30} 100 108)">${i*5}</text>`)}</g>
 <path d="M100 98l-6 12h12z" fill="#fff"/>
 <path d="M100 48c-7-11-20-14-31-9 10 1 17 7 21 14zM100 48c7-11 20-14 31-9-10 1-17 7-21 14zM100 48c-2-10 1-17 7-22" fill="#3a9d5d" stroke="#2f7f4b" stroke-width="3" stroke-linejoin="round"/></g>
 <g class="ot-trim" fill="none" stroke="#f6c453" stroke-width="4" stroke-linecap="round"><path d="M28 50l-12-8M22 76H8M172 50l12-8M178 76h14"/></g></svg>`;
function ovoTomate(rever){ovoCena("tomate","ovo-tomate",`<div class="ot-palco">${OVO_TOMATE}</div>
 <h2>O tomate de Cirillo</h2><p class="frase"><b>Pomodoro</b> quer dizer <b>tomate</b> em italiano. O método nasceu no fim dos anos 1980, quando o estudante universitário Francesco Cirillo resolveu estudar em blocos curtos, cronometrados por um timer de cozinha em forma de tomate.</p>
 <p class="ovo-nota"><b>Pausa também é direito.</b> Na CLT, quem trabalha mais de 6 horas seguidas tem direito a um intervalo de, no mínimo, 1 hora para repouso e alimentação; entre 4 e 6 horas, o intervalo é de 15 minutos (art. 71, caput e § 1º, da CLT). Se a lei garante o descanso de quem trabalha, garanta também o seu.</p>
 ${ovoBotoes(`<button class="botao" data-fc="tom-corda">Dar corda de novo</button>`)}`,{rever,titulo:"O tomate de Cirillo"});ovoSomDepois("fc-tomate",300)}
OVO_ABRE.tomate=ovoTomate;
document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;
 if(t.closest('[data-fc="tom-corda"]')){{const p=t.closest(".festa").querySelector(".ot-palco");if(p)p.innerHTML=OVO_TOMATE};ovoSomDepois("fc-tomate",120);return}
 if(t.closest("#fc-tempo")&&!document.querySelector(".festa,#tour")&&ovoConta("tomate",5,3500))setTimeout(()=>ovoTomate(),250)});
/* volta de um timer que estava correndo antes de o app ser fechado */
if(FC.f){fcAvanca();if(fcRodando())fcAcesa(true)}
