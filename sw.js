// ============================================================
// sw.js — service worker for offline use.
// Precaches the whole (small, fully-static) app on install, then
// serves cache-first with a network fallback and an index.html
// fallback for navigations. Bump CACHE to invalidate on release.
// Paths are relative to the SW's scope, so this works both at the
// server root (local) and under /soccer-the-build/ (GitHub Pages).
// ============================================================

const CACHE = 'thebuild-v3';
const ASSETS = [
  './', 'index.html', 'manifest.json', 'css/style.css',
  'js/app.js', 'js/state.js', 'js/session.js', 'js/gates.js',
  'js/render/parts.js', 'js/render/today.js', 'js/render/plan.js',
  'js/render/progress.js', 'js/render/transfer.js', 'js/render/settings.js',
  'data/plan.js', 'data/transfer.js', 'data/diagrams.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('index.html')));
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((resp) => {
      const copy = resp.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return resp;
    }))
  );
});
