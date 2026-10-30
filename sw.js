/* A página vem da rede primeiro e os arquivos de conteúdo se atualizam em segundo plano, então conteúdo novo chega sem trocar CACHE_NAME.
   NÃO mude CACHE_NAME nos PRs (é isso que fazia os PRs colidirem). Só mude se a lista CORE
   mudar ou o formato do cache precisar ser apagado, e faça isso depois de mergear na main. */
const CACHE_NAME = 'facul-lab-v37';
const CORE = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  "./ap1.js","./ap10.js","./ap2.js","./ap3.js","./ap4.js","./ap5.js","./ap6.js","./ap7.js","./ap8.js","./ap9.js",
  "./assuntos.js","./base.js","./explicacoes.js",
  "./f1a.js","./f1b.js","./f1c.js","./f2a.js","./f2b.js","./f3a.js","./f3b.js","./f4a.js","./f4b.js",
  "./f5a.js","./f5b.js","./f6a.js","./f6b.js","./f7a.js","./f7b.js","./f8.js",
  "./leiseca.js","./niveis.js",
  "./q1.js","./q2.js","./q3.js","./q4.js","./q5.js","./q6.js","./q7.js","./q8.js","./q9.js",
  "./q10.js","./q11.js","./q12.js","./q13.js","./q14.js","./q15.js","./q16.js","./q17.js","./q18.js",
  "./css/base.css","./css/premium.css","./css/caderno.css","./css/foco.css","./css/ovos.css","./css/backup.css","./css/inverso.css","./css/revisao.css","./css/semanal.css","./css/modo-prova.css","./css/dinamica.css","./css/ajustes.css","./css/casos.css",
  "./js/01-base.js","./js/02-estudo-e-provas.js","./js/03-cartoes-sons-busca.js","./js/04-estado-e-navegacao.js","./js/05-telas.js","./js/06-eventos.js","./js/07-segredos.js","./js/08-backup.js","./js/09-revisao.js","./js/10-inverso-e-caderno.js","./js/11-foco.js","./js/12-resumo-semanal.js","./js/13-modo-prova.js","./js/14-ajustes.js","./js/15-casos.js","./js/16-leveza.js","./js/99-inicio.js",
  "./questoes.js","./resumos.js","./resumos2.js","./casos.js"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Página (index.html), manifest e código do app (css/ e js/): abrem na hora da cópia guardada, que é sempre um conjunto
   inteiro da mesma versão. Antes o app esperava a internet até 4 s por arquivo antes de abrir; com sinal fraco, era essa
   a demora para abrir. Depois que a página carrega, ela pede "conferir": aqui se baixa a página nova e todo o código que
   ela usa e, só se tudo chegou bem e algo mudou, o conjunto inteiro é trocado de uma vez (página nova nunca se mistura
   com código velho) e a página recebe o aviso "conteudo-novo". Sem cópia guardada, vem da rede. Fontes e outros sites:
   cache primeiro. */
const guarda = (chave, resp) => {
  if (resp.ok || resp.type === 'opaque') { const copia = resp.clone(); caches.open(CACHE_NAME).then(c => c.put(chave, copia)); }
  return resp;
};
const daRede = (req, chave) => fetch(req, { cache: 'no-cache' }).then(resp => guarda(chave, resp));
const guardadoOuRede = (req, chave) => caches.match(chave).then(r => r || daRede(req, chave).catch(() => Response.error()));
const versao = r => r ? (r.headers.get('etag') || r.headers.get('last-modified') || r.headers.get('content-length') || '') : '';
const ehCodigo = u => /^(css|js)\/[^/]+\.(css|js)$/.test(u);
let conferindo = null, conferiuEm = 0;
const conferirVersao = () => {
  if (conferindo) return conferindo;
  if (Date.now() - conferiuEm < 30000) return Promise.resolve();
  conferindo = (async () => {
    const pagina = await fetch('./index.html', { cache: 'no-cache' });
    if (!pagina.ok) return;
    const html = await pagina.clone().text();
    const lista = ['./manifest.json'];
    html.replace(/(?:src|href)="(?:\.\/)?([^"?#]+)"/g, (m, u) => { if (ehCodigo(u) && !lista.includes('./' + u)) lista.push('./' + u); return m; });
    const novos = await Promise.all(lista.map(u => fetch(u, { cache: 'no-cache' }).then(r => [u, r])));
    if (novos.some(([, r]) => !r.ok)) return;
    const c = await caches.open(CACHE_NAME);
    let mudou = versao(await c.match('./index.html')) !== versao(pagina);
    for (const [u, r] of novos) if (!mudou && versao(await c.match(u)) !== versao(r)) mudou = true;
    if (!mudou) return;
    await Promise.all([c.put('./index.html', pagina), ...novos.map(([u, r]) => c.put(u, r))]);
    avisaNovo();
  })().catch(() => {}).finally(() => { conferindo = null; conferiuEm = Date.now(); });
  return conferindo;
};
self.addEventListener('message', e => { if (e.data && e.data.tipo === 'conferir') e.waitUntil(conferirVersao()); });
/* Arquivos de conteúdo (questões, apostilas, explicações, imagens): abrem na hora da cópia guardada e se atualizam
   em segundo plano. Com sinal fraco, o app não espera mais 4 s por arquivo. Se algum chegou diferente, a página
   recebe o aviso "conteudo-novo" e oferece atualizar. Sem cópia guardada, vem da rede como antes. */
const avisaNovo = () => self.clients.matchAll({ type: 'window' }).then(l => l.forEach(c => c.postMessage({ tipo: 'conteudo-novo' })));
const guardadoPrimeiro = (e, req) => caches.match(req).then(velho => {
  const rede = fetch(req, { cache: 'no-cache' }).then(resp => {
    if (resp.ok && velho) {
      const a = velho.headers.get('etag') || velho.headers.get('last-modified') || velho.headers.get('content-length');
      const b = resp.headers.get('etag') || resp.headers.get('last-modified') || resp.headers.get('content-length');
      if (a && b && a !== b) avisaNovo();
    }
    return guarda(req, resp);
  });
  if (!velho) return rede.catch(() => Response.error());
  e.waitUntil(rede.catch(() => {}));
  return velho;
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const caminho = url.origin === self.location.origin && url.pathname.startsWith(self.registration.scope.replace(location.origin, '')) ? url.pathname.slice(self.registration.scope.replace(location.origin, '').length) : null;
  if (req.mode === 'navigate') {
    if (caminho === '' || caminho === 'index.html') e.respondWith(guardadoOuRede(req, './index.html'));
    else e.respondWith(fetch(req).catch(() => caches.match('./index.html').then(r => r || Response.error())));
    return;
  }
  if (url.origin === self.location.origin) {
    if (caminho !== null && (ehCodigo(caminho) || caminho === 'manifest.json')) { e.respondWith(guardadoOuRede(req, './' + caminho)); return; }
    if (/\.(js|png|jpg|svg|mp3)$/.test(url.pathname) && !/\/sw\.js$/.test(url.pathname)) { e.respondWith(guardadoPrimeiro(e, req)); return; }
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(resp => guarda(req, resp)).catch(() => caches.match(req).then(r => r || Response.error()))); return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(resp => guarda(req, resp))));
});

/* Lembretes no celular (Web Push): chegam mesmo com o app fechado. */
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Facul Lab', {
    body: d.body || 'Seu plano de estudo de hoje está pronto.',
    icon: d.icon ? new URL(d.icon, self.registration.scope).href : './icon-192.png',
    badge: './lembretes/selo.png',
    image: d.image ? new URL(d.image, self.registration.scope).href : undefined,
    tag: d.tag || 'facul-lab',
    renotify: true,
    lang: 'pt-BR',
    data: { url: d.url || './' }
  }));
});
/* Tocar no lembrete abre o app (ou traz para frente a aba que já estiver aberta). */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const alvo = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(lista => {
    const aberta = lista.find(c => c.url.startsWith(self.registration.scope));
    if (aberta) return aberta.focus();
    return self.clients.openWindow(alvo);
  }));
});
