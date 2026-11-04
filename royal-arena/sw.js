/* 로얄 아레나 서비스 워커 — 오프라인 지원
   전략: 설치 시 앱 셸 프리캐시, 이후 stale-while-revalidate
   (오프라인 → 캐시로 즉시 표시 / 온라인 → 백그라운드 갱신) */
const CACHE = 'royal-arena-v189';
const CORE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'maskable-512.png', 'js/g1-art-assets.js', 'js/g2-sprite-assets.js', 'js/g3-frame-assets.js', 'js/g4-ux-data.js', 'js/g5-core.js', 'js/g6-battle.js', 'js/g7-ui-systems.js', 'js/g8-boot.js', 'qa-driver.js', 'ui-patch.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const cp = res.clone();
        caches.open(CACHE).then(c => c.put(req, cp));
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.ok && new URL(req.url).origin === self.location.origin) {
          const cp = res.clone();
          caches.open(CACHE).then(c => c.put(req, cp));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
