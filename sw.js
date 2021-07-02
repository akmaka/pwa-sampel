// service-worker.js
// console.log('Hello from sw.js');

// Service Worker のバージョンとキャッシュする App Shell を定義する
var CACHE_NAME = 'pwa2-v2-1';
var appShellFiles = [
  '/pwa-sample/',
  '/pwa-sample/common/js/main.js',
  '/pwa-sample/common/css/main.css'
];

// Service Worker へファイルをインストール
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(appShellFiles);
    })
  );
});

// リクエストをキャッシュして返す
// https://developers.google.com/web/fundamentals/primers/service-workers?hl=ja
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT:Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT:Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Cache Storage にキャッシュされているサービスワーカーのkeyに変更があった場合
// 新バージョンをインストール後、旧バージョンのキャッシュを削除する
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function (keysList) {
      return Promise.all(keysList.map(function (key) {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
    .then(function () {
      console.log('[ServiceWorker] ' + CACHE_NAME + ' activated');
    })
  );
});
