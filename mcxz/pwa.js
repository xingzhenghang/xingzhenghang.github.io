var cacheName = 'MC 下载';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
          .then(cache => cache.addAll(
            [
                '//www.xingzhenghang.tk/ui/css/mdui.min.css',
                '//www.xingzhenghang.tk/js/mdui.js',
                './index.html',
                './pe/index.html'
                './pc/index.html'
            ]
          )).then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', function (event) {  
    event.respondWith(
      caches.match(event.request)                    
      .then(function (response) {
        if (response) {                              
          return response;                           
        }
        return fetch(event.request);                 
      })
    );
});
