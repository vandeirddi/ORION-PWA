const CACHE_NAME = "orion-cache-v1";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ARQUIVOS))
  );

  self.skipWaiting();

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(chaves => {

      return Promise.all(

        chaves
          .filter(chave => chave !== CACHE_NAME)
          .map(chave => caches.delete(chave))

      );

    })

  );

  self.clients.claim();

});


self.addEventListener("fetch", event => {

  // A consulta da escala sempre deve ir
  // diretamente ao Apps Script.
  if (
    event.request.url.includes(
      "script.google.com"
    )
  ) {

    return;

  }


  event.respondWith(

    caches.match(event.request)
      .then(resposta => {

        return resposta ||
               fetch(event.request);

      })

  );

});
