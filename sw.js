const CACHE = 'routesync-v10';
const STATIC = [
  '/routesync/',
  '/routesync/index.html',
  '/routesync/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Never cache Maps API, Firebase, or fonts
  if (url.includes('googleapis.com') || url.includes('gstatic.com') ||
      url.includes('firebase') || url.includes('fonts.')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
