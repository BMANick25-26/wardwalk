/* sw.js — Ward Walk site
   Bump SW_VERSION on every deploy to force updates.
*/
const SW_VERSION = "v23"; // <-- change this each time you deploy (v13, v14, etc.)
const CACHE_NAME = `wardwalk-${SW_VERSION}`;

// Core assets you want available offline (optional).
// Keep this minimal to avoid stale issues.
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
];

// Install: activate this SW immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {
      // If any asset fails (path differences etc.), don't block install
    })
  );
});

// Activate: delete old caches and take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))
      );
      await self.clients.claim();
    })()
  );
});

// Helper: identify request types
function isHTMLRequest(request) {
  return request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html");
}

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

// Fetch strategy:
// - HTML/navigation: Network-first (prevents stale pages)
// - CSS/JS/images (same-origin): Stale-while-revalidate (fast, but updates in background)
// - Everything else: pass through
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== "GET") return;

  // Always let cross-origin requests pass through (fonts, analytics, etc.)
  if (!isSameOrigin(url)) return;

  // Network-first for HTML (so you see latest content)
  if (isHTMLRequest(request)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request, { cache: "no-store" });
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
          return fresh;
        } catch (err) {
          const cached = await caches.match(request);
          return cached || caches.match("./index.html");
        }
      })()
    );
    return;
  }

  // Stale-while-revalidate for static assets
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      const fetchPromise = fetch(request)
        .then(async (response) => {
          // Only cache successful, basic responses
          if (response && response.status === 200 && response.type === "basic") {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => null);

      // Return cache immediately if present, otherwise wait for network
      return cached || (await fetchPromise) || new Response("", { status: 504 });
    })()
  );
});
