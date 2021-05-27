let CACHE_NAME = "my-site-cache-v1";
const urlsToCache = [
  "/",
  "/fallback.json",
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
  let request = event.request;
  let url = new URL(request.url);

  //pisahkan request API dan Internal
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  } else {
    event.respondWith(
      caches.open("products-cache").then(function (cache) {
        return fetch(request)
          .then((liveResponse) => {
            cache.put(request, liveResponse.clone());
            return liveResponse;
          })
          .catch(() => {
            return caches.match(request).then((response) => {
              if (response) return response;
              return caches.match("/fallback.json");
            });
          });
      })
    );
  }
});
