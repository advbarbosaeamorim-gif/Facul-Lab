"use strict";
/* ---------- eventos ---------- */
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-acao]");if(!b)return;const a=b.dataset.acao;
  if((a==="fechar-gaveta"||a==="fechar-folha"||a==="fechar-rep"||(a==="festa-fechar"&&b.classList.contains("festa")))&&e.target!==b)return;
  if(b.disabled)return;
  switch(a){
    case "gaveta":abrirGaveta();break;
    case "fechar-gaveta":fecharGaveta();break;
    case "tour":tourAbrir();break;
    case "tour-pular":tourFechar();break;
    case "tour-fim":tourFechar("hoje");break;
    case "tour-prox":tourIr(tourI+1);break;
    case "tour-ant":tourIr(tourI-1);break;
    case "tour-ir":tourIr(+b.dataset.v);break;
    case "tour-per":S.cfg=S.cfg||{};S.cfg.per=+b.dataset.v;periodo=Math.min(9,+b.dataset.v);salvar();tourD.novo=true;rota.manterScroll=true;render();tourRender();break;
    case "tour-plano":{const P=tourD.plano=tourD.plano||{};P[b.dataset.v]=!P[b.dataset.v];tourD.novo=true;tourRender();
      if([0,1,2].every(k=>P[k]))estouro(document.querySelector("#tour .tour-res"),["#ff8a1f","#ffc53d","#3bb273","#ffffff"]);break}
    case "tour-q":tourD.q=+b.dataset.v;tourD.novo=true;tourRender();som(tourD.q===TOUR_Q.c?"acerto":"erro");if(tourD.q===TOUR_Q.c)estouro(document.querySelector("#tour .alt.certa"),["#3bb273","#ffc53d","#ffffff"]);break;
    case "tour-q-de-novo":delete tourD.q;tourRender();{const a=document.querySelector("#tour .alt");if(a)a.focus({preventScroll:true})}break;
    case "tour-card-virar":tourD.virado=true;tourD.novo="vira";tourRender();som("vira");{const n=document.querySelector('#tour [data-acao="tour-card-nota"]');if(n)n.focus({preventScroll:true})}break;
    case "tour-card-nota":tourD.nota=+b.dataset.v;tourD.novo=true;tourRender();break;
    case "tour-ls":tourD.ls=b.dataset.v;tourD.novo=true;tourRender();som(tourD.ls==="iguais"?"acerto":"erro");if(tourD.ls==="iguais")estouro(document.querySelector("#tour .tour-lacuna"),["#3bb273","#ffc53d","#ffffff"]);break;
    case "tour-dia":tourD.dias=Math.min(7,(tourD.dias||0)+1);tourD.novo=true;tourRender();som(tourD.dias===7?"meta":"chama");estouro(document.querySelector("#tour .tour-semana li.novo"),["#ff8a1f","#ffc53d","#ffffff"]);break;
    case "tour-menu":tourD.menu=+b.dataset.v;tourD.novo=true;tourRender();break;
    case "tour-estilo":S.cfg=S.cfg||{};S.cfg.estilo=b.dataset.v;salvar();rota.manterScroll=true;render();tourRender();anunciar("Estilo "+(b.dataset.v==="classico"?"Clássico":"Premium")+" aplicado");break;
    case "cores-mais":coresTodas=!coresTodas;rota.manterScroll=true;render();if(document.querySelector(".tour"))tourRender();break;
    case "tour-paleta":S.cfg=S.cfg||{};S.cfg.paleta=b.dataset.v;salvar();rota.manterScroll=true;render();tourRender();break;
    case "tour-som":S.cfg=S.cfg||{};S.cfg.som=b.dataset.v;salvar();rota.manterScroll=true;render();tourRender();som("acerto");break;
    case "tour-anim":S.cfg=S.cfg||{};S.cfg.anim=b.dataset.v;salvar();rota.manterScroll=true;render();tourRender();break;
    case "treinar-ass":gaveta=false;ir({tela:"pre",key:`ass:${b.dataset.sc}:${b.dataset.a}`});break;
    case "reportar":repQ=b.dataset.q;repMot="";rota.manterScroll=true;render();setTimeout(()=>{const t=document.getElementById("rep-txt");if(t&&!(S.rep&&S.rep[repQ]))t.blur()},0);break;
    case "rep-mot":repMot=b.dataset.v;document.querySelectorAll('[data-acao="rep-mot"]').forEach(x=>x.setAttribute("aria-pressed",String(x===b)));{const ok=document.getElementById("rep-ok");if(ok)ok.disabled=false}break;
    case "rep-enviar":{const r=(S.rep||{})[repQ]||{};const t=document.getElementById("rep-txt");S.rep=S.rep||{};S.rep[repQ]={m:repMot||r.m,t:t?t.value.trim().slice(0,600):"",d:Date.now()};salvar();repQ=null;rota.manterScroll=true;render();break}
    case "rep-tirar":if(S.rep)delete S.rep[repQ];salvar();repQ=null;rota.manterScroll=true;render();break;
    case "rep-fechar":case "fechar-rep":repQ=null;rota.manterScroll=true;render();break;
    case "copiar-rep":{const tx=textoReportes();const fim=()=>{b.textContent="Lista copiada";anunciar("Lista copiada");setTimeout(()=>{b.textContent="Copiar a lista"},2200)};
      try{navigator.clipboard.writeText(tx).then(fim,()=>{prompt("Copie o texto:",tx)})}catch(err){prompt("Copie o texto:",tx)}break}
    case "ir-raiz":raiz({tela:b.dataset.tela,aba:"progresso"});break;
    case "aba":rota.aba=b.dataset.aba;render();break;
    case "voltar":voltar();break;
    case "materia":ir({tela:"materia",m:b.dataset.m});break;
    case "disc":ir({tela:"disc",d:b.dataset.d});break;
    case "per":ir({tela:"periodo",p:+b.dataset.p});break;
    case "ap":ir({tela:"apost",p:+b.dataset.p});break;
    case "ler":ir({tela:"ler",d:b.dataset.d});break;
    case "ler-troca":rota={tela:"ler",d:b.dataset.d,pg:0};render();topoTela();break;
    case "pag":{rota.pg=+b.dataset.pg;rota.q=null;if(rota.pg>0&&periodoDe(rota.d)>=0&&apOk(periodoDe(rota.d))&&rota.pg<=paginas(rota.d).secs.length){marcarDia("p");salvar()}render();topoTela();break}
    case "modo-ap":{S.cfg=S.cfg||{};S.cfg.apTudo=b.dataset.v==="1";rota.pagina=false;salvar();const pg=rota.pg;render();if(S.cfg.apTudo&&pg>0){const el=document.getElementById(pg>paginas(rota.d).secs.length?"t-fim":"t"+pg);if(el)try{el.scrollIntoView({block:"start"})}catch(e){}}else topoTela();break}
    case "ir-ancora":{const el=document.getElementById(b.dataset.id);if(el)try{el.scrollIntoView({block:"start"})}catch(e){};break}
    case "fav":{const k=b.dataset.key;S.fav=S.fav||{};if(S.fav[k])delete S.fav[k];else S.fav[k]=Date.now();salvar();b.classList.toggle("on",!!S.fav[k]);b.setAttribute("aria-pressed",String(!!S.fav[k]));b.querySelector("span").textContent=S.fav[k]?"Tema favoritado":"Favoritar este tema";anunciar(S.fav[k]?"Tema adicionado aos favoritos":"Tema removido dos favoritos");break}
    case "abrir-tema":ir({tela:"ler",d:b.dataset.d,pg:+b.dataset.k,q:b.dataset.q||null,pagina:true});break;
    case "estudar":{const q=QMAP[b.dataset.q];if(!q)break;b.disabled=true;const tx=b.innerHTML;b.textContent="Procurando o tema…";temaDaQuestao(q).then(r=>{if(r&&(rota.tela==="res"||rota.tela==="busca"||rota.tela==="caderno"))ir({tela:"ler",d:r.d,pg:r.k,pagina:true});else{b.disabled=false;b.innerHTML=r?tx:"Tema não encontrado nas apostilas"}});break}
    case "cards-per":rota.p=+b.dataset.p;rota.manterScroll=true;render();break;
    case "cards-disc":{const d=b.dataset.d;iniciarDeck([d],15,"Cartões · "+nomeCurto(infoDisc(d).nome));break}
    case "cards-venc":{const ds=[...new Set(Object.keys(S.cards||{}).filter(id=>S.cards[id].due<=Date.now()).map(id=>id.split(":")[0]))].filter(d=>DISC[d]);iniciarDeck(ds,0,"Revisão de hoje");break}
    case "card-virar":deck.virado=true;rota.manterScroll=true;render();efeitoCartao("vira");som("vira");break;
    case "card-nota":{const n=+b.dataset.v;avaliarCartao(n);render();som(deck&&deck.pos>=deck.q.length?(deck.er?"fim":"aprovado"):n===0?"erro":"acerto");break}
    case "rev-ap":{const d=b.dataset.d;const A=agendaAp();if(A[d]){A[d].n=Math.min(INTERV_AP.length-1,A[d].n+1);A[d].prox=inicioDia()+INTERV_AP[A[d].n]*864e5;salvar()}ir({tela:"ler",d,pg:999,pagina:true});break}
    case "dv-tema":case "dv-meio":{const p=(S.cfg.provasFac||[]).find(x=>x.id===b.dataset.id);if(!p)break;const D=divisaoProva(p);if(!D)break;
      p.corte=b.dataset.acao==="dv-meio"?undefined:Math.max(1,Math.min(D.N-1,+b.dataset.k));salvar();som("toque");rota.abreDv=p.id;rota.manterScroll=true;render();
      anunciar(p.corte?`N1 até o tema ${p.corte}`:"Matéria dividida ao meio");{const f=document.querySelector(`#dv-${p.id} .dv-corte`);if(f&&animOn())f.classList.add("pula")}break}
    case "av-modo":S.cfg=S.cfg||{};S.cfg.av=b.dataset.v==="1";salvar();rota.manterScroll=true;render();break;
    case "av-notas":S.cfg=S.cfg||{};S.cfg.notas=b.dataset.v==="1";salvar();rota.manterScroll=true;render();anunciar(S.cfg.notas?"Notas e média ligadas":"Notas e média desligadas");
      if(S.cfg.notas){const el=document.querySelector(".pv-notas");if(el)estouro(el,["#ffc53d","#3bb273","#2e86ab","#ffffff"])}break;
    case "av-add":{const d=$("#av-d").value,dt=$("#av-dt").value,rr=$("#av-r").value;const er=$("#av-erro");
      if(!dt){if(er)er.textContent="Escolha o dia da prova.";const i=$("#av-dt");if(i){i.focus();i.classList.remove("treme");void i.offsetWidth;i.classList.add("treme")}break}
      S.cfg.provasFac=S.cfg.provasFac||[];let p=S.cfg.provasFac.find(x=>x.d===d);if(!p){p={id:"p"+Date.now().toString(36),d,datas:[]};S.cfg.provasFac.push(p)}
      if(!p.datas.some(x=>x.dt===dt))p.datas.push({dt,r:rr});salvar();rota.novaProva=p.id;rota.novaData=p.id+dt;rota.manterScroll=true;render();rota.novaProva=null;rota.novaData=null;
      {const el=document.querySelector(".pv-nova");if(el){estouro(el,[infoDisc(d).cor,"#ffc53d","#3bb273","#ffffff"]);try{el.scrollIntoView({block:"nearest",behavior:animOn()?"smooth":"auto"})}catch(e){}}}anunciar("Prova adicionada");break}
    case "av-add-data":{const id=b.dataset.id;const dt=($("#av-dt-"+id)||{}).value,rr=($("#av-r-"+id)||{}).value;const p=(S.cfg.provasFac||[]).find(x=>x.id===id);
      if(!p)break;if(!dt){const i=$("#av-dt-"+id);if(i){i.focus();i.classList.remove("treme");void i.offsetWidth;i.classList.add("treme")}break}
      if(!p.datas.some(x=>x.dt===dt))p.datas.push({dt,r:rr});salvar();rota.novaData=id+dt;rota.manterScroll=true;render();rota.novaData=null;anunciar("Data adicionada");break}
    case "av-del-data":{const p=(S.cfg.provasFac||[]).find(x=>x.id===b.dataset.id);if(p){p.datas=p.datas.filter(x=>!(x.dt===b.dataset.dt&&(x.r||"")===b.dataset.r));if(!p.datas.length)S.cfg.provasFac=S.cfg.provasFac.filter(x=>x!==p)}salvar();rota.manterScroll=true;render();break}
    case "av-del":{const el=b.closest(".pv-cfg");const fim=()=>{S.cfg.provasFac=(S.cfg.provasFac||[]).filter(x=>x.id!==b.dataset.id);salvar();rota.manterScroll=true;render();anunciar("Prova removida")};
      if(el&&animOn()){el.classList.add("pv-sai");setTimeout(fim,280)}else fim();break}
    case "cfg-ritmo":{S.cfg=S.cfg||{};S.cfg.ritmo=b.dataset.v==="auto"?"":b.dataset.v;salvar();rota.manterScroll=true;render();anunciar("Ritmo "+ritmoAtual()[1]);
      const v=document.querySelector(".rt-vel");if(v&&animOn()){v.classList.add("rt-novo");if(b.dataset.v==="intenso")estouro(v,["#e5484d","#ffc53d","#ff8a1f","#ffffff"])}break}
    case "meta":S.cfg=S.cfg||{};S.cfg.meta=+b.dataset.v;salvar();rota.manterScroll=true;render();break;
    case "cfg-paleta":S.cfg=S.cfg||{};S.cfg.paleta=b.dataset.v;dinPrev=null;salvar();rota.manterScroll=true;render();if(b.dataset.v==="dinamica")anunciar("Cor Dinâmica: cada matéria com as suas cores");break;
    case "din-gal":{dinGalAberta=!dinGalAberta;const w=document.getElementById("din-gal-mais");if(!w)break;
      w.classList.toggle("aberta",dinGalAberta);w.toggleAttribute("inert",!dinGalAberta);b.setAttribute("aria-expanded",dinGalAberta);
      b.innerHTML=(dinGalAberta?"Esconder as cores":`Ver as cores das ${b.dataset.n} matérias`)+" "+ic("prox");
      som("toque");anunciar(dinGalAberta?"Lista aberta":"Lista fechada");
      break}
    case "din-prev":dinPrev=dinPrev===b.dataset.k?null:b.dataset.k;rota.manterScroll=true;render();{const e=DIN[dinPrev];if(e)anunciar(dinNome(dinPrev)+": "+e[0])}break;
    case "cfg-cor":S.cfg=S.cfg||{};S.cfg.cor=b.dataset.v;dinPrev=null;salvar();rota.manterScroll=true;render();if(b.dataset.v==="dinamica")anunciar("Cor Dinâmica: cada matéria com as suas cores");break;
    case "cfg-estilo":S.cfg=S.cfg||{};S.cfg.estilo=b.dataset.v;salvar();rota.manterScroll=true;render();anunciar("Estilo "+(b.dataset.v==="classico"?"Clássico":"Premium")+" aplicado");break;
    case "chama":faiscas(b);som(b.classList.contains("apagada")?"toque":"fogo");break;
    case "notif":if(b.dataset.v==="1")lbLigar();else lbDesligar();break;
    case "lb-convite-sim":cfgAbre.dados=true;{const f=document.querySelector(".festa");if(f)f.remove();syncVoltar();lbLigar().then(()=>{if(lbCfg().on){const c=document.querySelector(".lb-card");if(!c)anunciar("Lembretes ligados! Você recebe um recado por dia.")}else if(lbStatus&&rota.tela!=="config")raiz({tela:"config"})});break}
    case "notif-teste":lbTestar();break;
    case "cal-vira":b.classList.toggle("virado");som("mes");break;
    case "cfg-anim":S.cfg=S.cfg||{};S.cfg.anim=b.dataset.v;salvar();rota.manterScroll=true;render();break;
    case "cfg-som":S.cfg=S.cfg||{};S.cfg.som=b.dataset.v;salvar();rota.manterScroll=true;render();som("acerto");break;
    case "cfg-tema":S.cfg=S.cfg||{};S.cfg.tema=b.dataset.v;salvar();rota.manterScroll=true;render();break;
    case "cfg-modoq":S.cfg=S.cfg||{};S.cfg.modoQ=b.dataset.v;salvar();rota.manterScroll=true;render();break;
    case "cfg-corr":S.cfg=S.cfg||{};S.cfg.corrFinal=b.dataset.v==="1";salvar();rota.manterScroll=true;render();break;
    case "cfg-setas":S.cfg=S.cfg||{};S.cfg.setas=b.dataset.v;salvar();rota.manterScroll=true;render();break;
    case "cfg-per":S.cfg=S.cfg||{};S.cfg.per=+b.dataset.v;periodo=Math.min(9,+b.dataset.v);salvar();rota.manterScroll=true;render();break;
    case "cfg-prova":S.cfg=S.cfg||{};S.cfg.prova="";rota.escolherData=false;rota.tipoData=null;salvar();rota.manterScroll=true;render();break;
    case "cfg-tipo-prova":{const v=b.dataset.v;rota.tipoData=v;rota.escolherData=true;rota.abreAv=v!=="oab";rota.manterScroll=true;render();rota.abreAv=false;
      if(v==="oab"){const el=document.getElementById("data-prova");if(el)try{el.focus();el.showPicker&&el.showPicker()}catch(e){}}
      else{const sec=document.getElementById("sec-av");if(sec)setTimeout(()=>{try{sec.scrollIntoView({block:"start",behavior:animOn()?"smooth":"auto"})}catch(e){}},v==="ambas"?500:150)}break}
    case "ir-avancado":{const sec=document.getElementById("sec-av");if(sec){sec.classList.remove("av-abre");void sec.offsetWidth;sec.classList.add("av-abre");try{sec.scrollIntoView({block:"start",behavior:animOn()?"smooth":"auto"})}catch(e){}}break}
    case "cfg-prova-data":rota.escolherData=true;rota.manterScroll=true;render();{const el=document.getElementById("data-prova");if(el)try{el.focus();el.showPicker&&el.showPicker()}catch(e){}}break;
    case "cards-disc":{const d=b.dataset.d;iniciarDeck([d],novosFase(),"Cartões · "+nomeCurto(infoDisc(d).nome));break}
    case "pp-dia":rota.ppDia=+b.dataset.v;som("toque");rota.manterScroll=true;render();break;
    case "cards-foco":{const PP=planoProvas(),fora=PP?[...PP.hoje,...PP.leve].map(x=>x.p.d):[];let ds=discsFoco().filter(d=>!fora.includes(d));if(!ds.length)ds=PERIODOS[periodo].slice();iniciarDeck(ds.filter(d=>DISC[d]),novosFase(),"Cartões novos · "+nomePer(perAtual()));break}
    case "lida":{const d=b.dataset.d;S.lidos=S.lidos||{};S.revAp=S.revAp||{};if(S.lidos[d]){delete S.lidos[d];delete S.revAp[d]}else{S.lidos[d]=Date.now();S.revAp[d]={n:0,prox:inicioDia()+864e5}}salvar();rota.manterScroll=true;render();break}
    case "resumo":ir({tela:"resumo",p:+b.dataset.p,k:0,q:b.dataset.q||null});break;
    case "busca-sug":{const el=document.getElementById("q-busca");if(el){el.value=b.dataset.v;rota.q=el.value;const r=document.getElementById("res-busca");if(r)r.innerHTML=resultadosBusca(el.value,rota.bf);animarBusca()}break}
    case "busca-f":rota.bf=b.dataset.v;{const el=document.getElementById("q-busca");if(el)rota.q=el.value}rota.manterScroll=b.closest(".chips")?true:false;render();{const el=document.getElementById("q-busca");if(el&&!b.closest(".chips"))try{el.focus({preventScroll:true})}catch(e){}}break;
    case "res-mat":rota.k=+b.dataset.k;render();topoTela();break;
    case "ls-filtro":rota.lsm=b.dataset.v;rota.manterScroll=true;render();break;
    case "ls-iniciar":lsIniciar(b.dataset.modo);break;
    case "ls-resp":lsResponder(+b.dataset.v);break;
    case "ls-prox":if(lsSess&&lsSess.resp[lsSess.i]!==undefined){lsSess.i++;render();topoTela();if(lsSess&&lsSess.i>=lsSess.itens.length)som(lsSess.ok===lsSess.itens.length?"gabarito":lsSess.ok*2>=lsSess.itens.length?"aprovado":"fim")}break;
    case "ls-sair":lsSess=null;{const f=pilha.length&&pilha[pilha.length-1].tela==="leiseca";if(f)voltar();else raiz({tela:"leiseca"})}break;
    case "meta-ver":{const f=document.querySelector(".festa");if(f)f.remove();raiz({tela:"metas"});break}
    case "motiva-ir":{const f=document.querySelector(".festa");if(f)f.remove();raiz({tela:"hoje"});setTimeout(()=>{const l=document.querySelector(".plano-lista");if(l)l.scrollIntoView({behavior:animOn()?"smooth":"auto",block:"start"})},60);break}
    case "festa-fechar":{const f=document.querySelector(".festa");if(f)f.remove();syncVoltar();break}
    case "fonte":{S.cfg=S.cfg||{};S.cfg.fonte=Math.max(-1,Math.min(2,(S.cfg.fonte||0)+(+b.dataset.v)));salvar();rota.manterScroll=true;render();break}
    case "imprimir":imprimir();break;
    case "periodo":periodo=+b.dataset.p;rota.manterScroll=true;render();break;
    case "erradas":gaveta=false;ir({tela:"pre",key:"err"});break;
    case "erradas-hoje":gaveta=false;ir({tela:"pre",key:"errhoje"});break;
    case "abrir":{const k=b.dataset.key;const e2=estado(k);if(e2.st==="nao"||e2.st==="pausa")ir({tela:"pre",key:k});else ir({tela:"res",id:e2.a.id});break}
    case "proximo":{let k=null;for(let i=0;i<N_SIM;i++){const st=estado("oab:"+i).st;if(st==="pausa"){k="oab:"+i;break}}
      if(!k)for(let i=0;i<N_SIM;i++){if(estado("oab:"+i).st==="nao"){k="oab:"+i;break}}
      ir({tela:"pre",key:k||"oab:0"});break}
    case "comecar":comecar(rota.key);break;
    case "continuar":{const x=ultima(rota.key);if(!x)return;sessao=x;idx=Math.min(x.pos||0,x.qids.length-1);folha=false;confirmar=null;ir({tela:"quiz"});break}
    case "ver-ultima":{const x=S.hist.find(y=>y.key===rota.key&&y.status==="concluido");if(x)ir({tela:"res",id:x.id});break}
    case "refazer-sim":ir({tela:"pre",key:b.dataset.key});break;
    case "refazer-erradas-res":{const x=S.hist.find(y=>y.id===rota.id);if(!x)return;const ids=x.qids.filter(id=>x.resp[id]!==0&&QMAP[id]);if(!ids.length)return;
      const ordem={};ids.forEach(id=>ordem[id]=emb([0,1,2,3]));
      sessao={id:"a"+Date.now(),key:"rev:"+x.id,titulo:"Revisão",sub:x.titulo+" · "+(x.sub||""),inicio:Date.now(),status:"pausado",qids:emb(ids),ordem,resp:{},tempo:0,limite:0,corrFinal:false,pos:0};
      S.hist.unshift(sessao);idx=0;salvar();ir({tela:"quiz"});break}
    case "marcar":{const s=sessao,id=s.qids[idx],o=+b.dataset.o;if(!s.corrFinal&&s.resp[id]!==undefined)return;
      const modo=modoQ();
      if(modo==="confirmar"){pend={id,o};rota.manterScroll=true;render();break}
      responderQ(o);
      if(modo==="avancar"){clearTimeout(tAvanca);const fim=idx>=s.qids.length-1;
        tAvanca=setTimeout(()=>{tAvanca=null;if(sessao!==s||s.qids[idx]!==id)return;if(fim){folha=true;confirmar=null;rota.manterScroll=true}else{idx++;s.pos=idx}render()},s.corrFinal?300:1100)}
      break}
    case "confirmar-resp":{const s=sessao,id=s.qids[idx];if(!pend||pend.id!==id)return;const o=pend.o;pend=null;responderQ(o);break}
    case "ant":clearTimeout(tAvanca);pend=null;if(idx>0)idx--;sessao.pos=idx;render();break;
    case "prox":clearTimeout(tAvanca);pend=null;if(idx<sessao.qids.length-1)idx++;sessao.pos=idx;render();break;
    case "folha":folha=true;confirmar=null;rota.manterScroll=true;render();break;
    case "fechar-folha":folha=false;confirmar=null;rota.manterScroll=true;render();break;
    case "pular":clearTimeout(tAvanca);pend=null;idx=+b.dataset.i;sessao.pos=idx;folha=false;render();break;
    case "pedir-fim":confirmar=true;rota.manterScroll=true;render();break;
    case "nao-finalizar":confirmar=null;rota.manterScroll=true;render();break;
    case "finalizar":finalizar();break;
    case "pausar":pausar();break;
  }
});
document.addEventListener("change",e=>{if(e.target.id==="corrFinal"){S.cfg.corrFinal=e.target.checked;salvar();rota.manterScroll=true;render()}
  if(e.target.dataset&&e.target.dataset.corte){corteVivo(e.target,true);return}
  if(e.target.dataset&&e.target.dataset.n2tudo){const p=(S.cfg.provasFac||[]).find(x=>x.id===e.target.dataset.n2tudo);if(p){p.n2tudo=e.target.checked;salvar();som("toque");rota.abreDv=p.id;rota.manterScroll=true;render();anunciar(p.n2tudo?"A N2 cai a matéria toda":"A N2 cobra só os temas depois da N1")}return}
  if(e.target.dataset&&e.target.dataset.nota){const el=e.target,p=(S.cfg.provasFac||[]).find(x=>x.id===el.dataset.id);if(!p)return;
   const antes=situacaoNotas(p).est;p.notas=p.notas||{};const v=el.value.trim().replace(",",".");
   if(v===""||isNaN(+v))delete p.notas[el.dataset.nota];else p.notas[el.dataset.nota]=Math.max(0,+v);salvar();
   const s=situacaoNotas(p),box=document.getElementById("pv-res-"+p.id);
   if(el.dataset.nota==="v1"||el.dataset.nota==="v2"){const o=document.querySelector(`[data-nota="${el.dataset.nota==="v1"?"v2":"v1"}"][data-id="${p.id}"]`);if(o&&p.notas[o.dataset.nota]==null)o.value=el.dataset.nota==="v1"?s.v2:s.v1}
   if(box){box.outerHTML=resultadoNotas(p);const nb=document.getElementById("pv-res-"+p.id);
    if(nb&&animOn())nb.classList.add("pv-novo");
    if(nb&&s.est==="aprovado"&&antes!=="aprovado"){estouro(nb,[infoDisc(p.d).cor,"#ffc53d","#3bb273","#ffffff"]);anunciar(s.titulo)}}}
  if(e.target.id==="data-prova"){S.cfg=S.cfg||{};S.cfg.prova=e.target.value||"";salvar();rota.manterScroll=true;render()}});
let tNota=null,tBusca=null;
document.addEventListener("input",e=>{const el=e.target;
  if(el.dataset&&el.dataset.corte){corteVivo(el,false);return}
  if(el.dataset&&el.dataset.nota){clearTimeout(tNota);tNota=setTimeout(()=>{S.notas=S.notas||{};const v=el.value.trim();if(v)S.notas[el.dataset.nota]=el.value;else delete S.notas[el.dataset.nota];salvar()},500)}
  if(el.id==="q-busca"){clearTimeout(tBusca);tBusca=setTimeout(()=>{rota.q=el.value;buscaGuardar(el.value);const r=document.getElementById("res-busca");if(r)r.innerHTML=resultadosBusca(el.value,rota.bf);animarBusca()},250)}});
document.addEventListener("input",e=>{const f=e.target.closest&&e.target.closest(".calc");if(f)calcAtualiza(f)});
document.addEventListener("keydown",e=>{
  if(tourI>=0){if(e.key==="Escape")tourFechar();else if(e.key==="ArrowRight")tourIr(tourI+1);else if(e.key==="ArrowLeft")tourIr(tourI-1);return}
  if(e.key==="Escape"){const fs=document.querySelector(".festa");if(fs){fs.remove();return}if(repQ){repQ=null;rota.manterScroll=true;render()}else if(gaveta){fecharGaveta();const b=document.querySelector('[data-acao="gaveta"]');if(b)b.focus()}else if(folha){folha=false;rota.manterScroll=true;render()}return}
  if(rota.tela!=="quiz"||folha)return;
  if(e.key==="ArrowRight"){const b=$('[data-acao="prox"]');b&&!b.disabled&&b.click()}
  if(e.key==="ArrowLeft"){const b=$('[data-acao="ant"]');b&&!b.disabled&&b.click()}
  const k="abcd".indexOf(e.key.toLowerCase());if(k>=0){const al=document.querySelectorAll(".alt");al[k]&&!al[k].disabled&&al[k].click()}
});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&lbCfg().on){clearTimeout(tLb);lbEnviar("salvar").catch(()=>{})}});
if(lbCfg().on&&!lbSuporte())setTimeout(()=>lbEnviar("salvar",true).catch(()=>{}),2500);
document.addEventListener("visibilitychange",()=>{if(rota.tela!=="quiz"||!sessao)return;if(document.hidden){pararRelogio();salvar()}else iniciarRelogio()});

