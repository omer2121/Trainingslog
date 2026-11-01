/* Kraftbuch - Offline-Cache.
   Bei einer neuen Version die Zahl in CACHE erhoehen. */
const CACHE = "kb-v1";
const ASSETS = ["./", "./index.html", "./styles.css", "./data.js", "./app.js", "./manifest.webmanifest",
                "./icon-180.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e =>{
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=> self.skipWaiting()));
});

/* Nur eigene alte Caches aufraeumen, die Caches der anderen Apps auf dieser Seite bleiben. */
self.addEventListener("activate", e =>{
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("kb-") && k !== CACHE).map(k => caches.delete(k))))
    .then(()=> self.clients.claim()));
});

/* Aus dem Cache anzeigen, im Hintergrund erneuern. */
self.addEventListener("fetch", e =>{
  const req = e.request;
  if(req.method !== "GET") return;
  if(new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req).then(hit =>{
    const net = fetch(req).then(res =>{
      if(res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(()=> hit);
    return hit || net;
  }));
});
