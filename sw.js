// service-worker.js
// console.log('Hello from sw.js');

// Service Worker のバージョンとキャッシュする App Shell を定義する
var CACHE_NAME = 'pwa2-beta';
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

// リクエストされたファイルが Service Worker にキャッシュされている場合
// キャッシュからレスポンスを返す
self.addEventListener('fetch', function(event) {
  // console.log('[Service Worker] Fetched resource '+event.request.url);
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

  event.respondWith(
    caches.match(event.request).then(function (r) {
      return r || fetch(event.request).then(function(response) {
        return caches.open(CACHE_NAME).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+event.request.url);
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
          if (key !== CACHE_NAME) {
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
