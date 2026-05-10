const CACHE_NAME = 'sistema-solicitacoes-v37';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// INSTALL
self.addEventListener('install', event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVATE
self.addEventListener('activate', event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if(key !== CACHE_NAME){
            return caches.delete(key);
          }

        })

      );

    })

  );

  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {

  if(event.request.method !== 'GET') return;

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        return response || fetch(event.request)
          .then(fetchResponse => {

            return caches.open(CACHE_NAME)
              .then(cache => {

                cache.put(event.request, fetchResponse.clone());

                return fetchResponse;
              });

          });

      })

  );

});
