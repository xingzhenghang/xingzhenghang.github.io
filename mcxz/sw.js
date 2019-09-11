var CACHE_VERSION = 'sw_v8';
var CACHE_FILES = [
    '//www.xingzhenghang.tk/ui/css/mdui.min.css',
    '//www.xingzhenghang.tk/js/mdui.js',
    './index.html',
    './pe/index.html'
    './pc/index.html'
    '/',
    '/index.html',
    '/pe',
    '/pc',
    '//www.xingzhenghang.tk/images/card.png',
];
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION)
          .then(cache => cache.addAll(CACHE_FILES)
    ));
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(keys.map(function(key, i){
                if(key !== CACHE_VERSION){
                    return caches.delete(keys[i]);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function(response){
            if(response){
                return response;
            }
            var requestToCache = event.request.clone();
            return fetch(requestToCache).then(
              function(response){
                if(!response || response.status !== 200){
                  return response;
                }
                var responseToCache = response.clone();
                caches.open(CACHE_VERSION)
                  .then(function(cache){
                    cache.put(requestToCache, responseToCache);
                  });
                return response;
              }
            );
        })
    );
});
