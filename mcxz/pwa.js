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

// CODELAB: Add fetch event handler here.
if (evt.request.mode !== 'navigate') {
  // Not a page navigation, bail.
  return;
}
evt.respondWith(
    fetch(evt.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
              .then((cache) => {
                return cache.match('offline.html');
              });
        })
);

// CODELAB: Add list of files to cache here.// CODELAB: Add list of 
const FILES_TO_CACHE = [
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
