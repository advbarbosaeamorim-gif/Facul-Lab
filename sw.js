/* Os arquivos do app vêm da rede primeiro, então conteúdo novo chega sem trocar CACHE_NAME.
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
  "./questoes.js","./resumos.js","./resumos2.js"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Página e arquivos do próprio app: rede primeiro (pega atualizações na hora), cache se estiver
   offline ou se a rede demorar mais de 4 s. Fontes e outros sites: cache primeiro. */
const guarda = (chave, resp) => {
  if (resp.ok || resp.type === 'opaque') { const copia = resp.clone(); caches.open(CACHE_NAME).then(c => c.put(chave, copia)); }
  return resp;
};
const redePrimeiro = (req, chave) => new Promise(ok => {
  let feito = false;
  const doCache = () => caches.match(chave).then(r => r || caches.match(req));
  const t = setTimeout(() => doCache().then(r => { if (r && !feito) { feito = true; ok(r); } }), 4000);
  fetch(req, { cache: 'no-cache' }).then(resp => { guarda(chave, resp); if (!feito) { feito = true; clearTimeout(t); ok(resp); } })
    .catch(() => doCache().then(r => { if (!feito) { feito = true; clearTimeout(t); ok(r || Response.error()); } }));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') { e.respondWith(redePrimeiro(req, './index.html')); return; }
  if (new URL(req.url).origin === self.location.origin) { e.respondWith(redePrimeiro(req, req)); return; }
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
