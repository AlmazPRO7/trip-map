/* Страница открывается и без сети: свежая версия берётся из интернета, при его отсутствии — из сохранённой копии. */
const C = 'map-v2';
// при установке сразу сохраняю саму страницу: без этого после первого открытия без сети она бы не открылась
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'icon-180.png'])).catch(() => {}).then(() => self.skipWaiting())) });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;          // снимки карты и чужие адреса не трогаю
  e.respondWith(fetch(r).then(resp => { if (resp && resp.ok) { const cp = resp.clone(); caches.open(C).then(c => c.put(r, cp)) } return resp })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('./'))));
});
