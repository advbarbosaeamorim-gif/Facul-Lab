/* Troque CACHE_NAME a cada atualização de conteúdo para que os aparelhos baixem a versão nova. */
const CACHE_NAME = 'facul-lab-v12';
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
/* Página: rede primeiro (pega atualizações), cache se estiver offline.
   Demais arquivos e fontes: cache primeiro, e o que vier da rede é guardado para uso offline. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copia = r.clone();
      caches.open(CACHE_NAME).then(c => c.put('./index.html', copia));
      return r;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(resp => {
    if (resp.ok || resp.type === 'opaque') {
      const copia = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, copia));
    }
    return resp;
  })));
});
