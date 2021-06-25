// service-worker.js

// Service Worker のバージョンとキャッシュする App Shell を定義する
var NAME = 'v1-';
var VERSION = '20210623';
var CACHE_NAME = NAME + VERSION;
var urlsToCache = [
  '/index.html',
  '/common/js/main.js',
  '/common/css/main.css',
  '/common/img/logo.png'
];

// Service Worker へファイルをインストール
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(urlsToCache);
    })
  );
});

// リクエストされたファイルが Service Worker にキャッシュされている場合
// キャッシュからレスポンスを返す
self.addEventListener('fetch', function(event) {
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

  event.respondWith(
    caches.match(event.request).then(function (resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

// Cache Storage にキャッシュされているサービスワーカーのkeyに変更があった場合
// 新バージョンをインストール後、旧バージョンのキャッシュを削除する
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (!CACHE_NAME.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
    .then(function () {
      console.log('[ServiceWorker] ' + CACHE_NAME + ' activated');
    })
  );
});
