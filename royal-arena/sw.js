const CACHE = 'royal-arena-v372';
const CORE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'maskable-512.png', 'js/g1-art-assets.js', 'js/g2-sprite-assets.js', 'js/g3-frame-assets.js', 'js/g4-ux-data.js', 'js/g5-core.js', 'js/g6-battle.js', 'js/g7-ui-systems.js', 'js/g8-boot.js', 'qa-driver.js', ];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url; try { url = new URL(req.url); } catch(_) { return; }
  const isNav = req.mode === 'navigate' || /index\.html$/.test(url.pathname) || url.pathname.endsWith('/');
  if (isNav) {
    e.respondWith(fetch(req).then(res => { try { const cp = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); } catch(_) {} return res; }).catch(() => caches.match('./index.html').then(r => r || caches.match(req))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => { const net = fetch(req).then(res => { try { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } catch(_) {} return res; }).catch(() => hit); return hit || net; }));
});
