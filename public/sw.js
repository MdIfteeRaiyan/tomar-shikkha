const CACHE_NAME = "tomar-shikkha-offline-v1";
const CORE_URLS = ["/", "/favicon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_URLS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) return;
  const safeUrls = event.data.urls.filter((url) => {
    try { return new URL(url, self.location.origin).origin === self.location.origin; } catch { return false; }
  });
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => Promise.all(safeUrls.map((url) => cache.add(url).catch(() => undefined)))));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put("/", copy)); return response;
    }).catch(() => caches.match("/").then((response) => response || Response.error())));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); }
    return response;
  })));
});
