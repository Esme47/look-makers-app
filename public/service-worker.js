const CACHE_NAME = "look-makers-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// La navegacion (el HTML de cada pagina) NUNCA se sirve desde cache: asi la
// app siempre muestra la version mas reciente (banner, imagenes, precios,
// etc.) la primera vez que se entra a una seccion, no solo despues de volver
// a entrar. Solo los recursos estaticos del propio sitio (JS, CSS, fuentes)
// se cachean para que la app siga funcionando sin conexion.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // no tocar Supabase ni otros orígenes

  event.respondWith(
    fetch(req)
      .then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copia));
        return respuesta;
      })
      .catch(() => caches.match(req))
  );
});
