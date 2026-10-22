const CACHE = 'fut-v2';
const CORE = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;
  // Network first so new versions show at once; cached copy when offline
  e.respondWith(fetch(req, { cache: 'no-store' }).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); } return r; })
    .catch(() => caches.match(req).then(m => m || caches.match('index.html'))));
});
