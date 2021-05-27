let CACHE_NAME = "my-site-cache-v1";
const urlsToCache = [
  "/",
  "/css/main.css",
  "/js/main.js",
  "/js/jquery.min.js",
  "/images/icon/favicon.ico",
  "/images/logo.jpg",
];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("in install servece workerr... Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheNames) {
            return cacheNames != CACHE_NAME;
          })
          .map(function (cacheNames) {
            return caches.delete(cacheNames);
          })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
