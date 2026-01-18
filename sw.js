const CACHE_NAME = 'vimstack-pwa-v1';
const assets = [];

self.addEventListener("install", installEvent => {

    installEvent.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(assets)
        })
    )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});