const CACHE_NAME = "wardwalk-v14";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./employment-advice.html",
  "./request-ballot.html",

  // images (adjust if you rename files)
  "./bma-logo.jpg",
  "./strrdc-logo.jpg",
  "./jobs-crisis.jpg",
  "./pay-chart.png",
  "./pay-restoration.jpg",
  "./waiting-list.jpeg",
  "./post-ballot.jpeg",
  "./pay-cut.jpeg",
  "./pay-cut-2.jpeg",

  // app bits
  "./manifest.webmanifest",
  "./offline.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req)
          .then((res) => {
            // Cache same-origin successful responses
            const url = new URL(req.url);
            if (url.origin === location.origin && res.ok) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            }
            return res;
          })
          .catch(() => caches.match("./offline.html"))
      );
    })
  );
});
