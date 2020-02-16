var VERSION = 'v200216-new';
// 开始缓存
self.addEventListener('install', function(event) {
  this.skipWaiting();  
// 避免更新后的 service-worker 处于等待状态
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll([
        './',
        './mcxz/',
        './mcxz/pe/',
        './mcxz/pc/',
        './3dweb/',
        './barcode/',
        './vip/',
        './blog/',
        './sitemap.html',
        './MSDN/',
      ]);
    })
  );
});

// 更新缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // 如果当前版本和缓存版本不一致
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 捕获请求并返回缓存数据
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (resp) {
        if (resp) {
          console.log(new Date(), 'fetch ', event.request.url, '有缓存，从缓存中取')
          return resp
        } else {
          console.log(new Date(), 'fetch ', event.request.url, '没有缓存，网络获取')
          return fetch(event.request)
            .then(function (response) {
              return caches.open(VERSION).then(function (cache) {
                cache.put(event.request, response.clone())
                return response
              })
            })
        }
      })
  )
})
