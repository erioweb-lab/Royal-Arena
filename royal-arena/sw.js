const CACHE = 'royal-arena-v442';
const CORE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'maskable-512.png', 'assets/ra_card_netter.jpg','assets/ra_card_buzzer.jpg','assets/ra_card_batqueen.jpg','assets/ra_card_catapult.jpg','assets/ra_spr_netter.png','assets/ra_spr_buzzer.png','assets/ra_spr_batqueen.png','assets/ra_spr_catapult.png','assets/ra_walk_netter.png','assets/ra_walk_buzzer.png','assets/ra_walk_batqueen.png','assets/ra_atk_netter.png','assets/ra_atk_batqueen.png', 'assets/ra_btn_gold.png','assets/ra_cta_plaque.png','assets/ra_btn_camp.png','assets/ra_btn_decked.png','assets/ra_btn_shield.png','assets/ra_btn_relic.png','assets/ra_btn_crown.png','assets/ra_btn_tactics.png','assets/ra_btn_diff.png','assets/ra_btn_diff_normal.png','assets/ra_btn_diff_nightmare.png','assets/ra_btn_diff_hell.png','assets/ra_boss_royal.png','assets/ra_boss_frost.png','assets/ra_boss_lava.png','assets/ra_boss_waste.png','assets/ra_boss_abyss.png','assets/ra_boss_sky.png','assets/ra_boss_tomb.png','assets/ra_boss_dusk.png','assets/ra_boss_divine.png','assets/ra_btn_navy.png','assets/ra_btn_plaque.png','assets/ra_btn_mapframe.png','assets/ra_map_classic.png','assets/ra_map_lava.png','assets/ra_map_ice.png','assets/ra_map_wasteland.png','assets/ra_map_abyss.png','assets/ra_map_sky.png','assets/ra_map_tomb.png','assets/ra_map_dusk.png','assets/ra_map_divine.png','assets/ra_btn_camp_new.png','js/g1a-art-assets.js','js/g1b-art-assets.js','js/g1c-art-assets.js', 'js/g2-sprite-assets.js', 'js/g3-frame-assets.js', 'js/g4-ux-data.js', 'js/g5-core.js', 'js/g6-battle.js', 'js/g7-ui-systems.js', 'js/g8-boot.js', 'js/g9-wide.js', 'qa-driver.js', ];
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
