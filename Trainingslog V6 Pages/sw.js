/* Trainingslog V6 - Offline-Cache.
   Bei einer neuen Version die Zahl in CACHE erhoehen. */
const CACHE = "log-v6-1";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest",
                "./icon-180.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e =>{
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=> self.skipWaiting()));
});

self.addEventListener("activate", e =>{
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
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
