const CACHE_NAME = "sahmt-pwa-v36";
const APP_SHELL = [
  "./",
  "./index.html",
  "./atualizar.html",
  "./atualizar-v2.html",
  "./escala-ferias.html",
  "./styles.css",
  "./app.js",
  "./sync-config.js",
  "./notices.js",
  "./data.js",
  "./contacts.js",
  "./manifest.webmanifest",
  "./escala-ferias-2026.pdf",
  "./sahmt_option1_clean.png",
  "./gestao_operacional.png",
  "./eventos/index.html",
  "./eventos/styles.css",
  "./eventos/app.js",
  "./eventos/config.js",
  "./eventos/sw.js",
  "./eventos/manifest.webmanifest",
  "./eventos/assets/hero-icon.png",
  "./eventos/assets/icon-192.png",
  "./eventos/assets/icon-512.png",
  "./logo_administrativo.png",
  "./logo_gestao.png",
  "./logo_equipe.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
