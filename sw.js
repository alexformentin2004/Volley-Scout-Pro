/* Versioned app-shell cache. Never caches user records or external requests. */
const PREFIX='vsp-pro-'+self.registration.scope+'-',CACHE=PREFIX+'beta-1.1';
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(x=>new Request(new URL(x,self.registration.scope),{cache:'reload'}))))));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('message',e=>{if(e.data==='VSP_ACTIVATE')self.skipWaiting()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url),scope=new URL(self.registration.scope);if(e.request.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;const key=new URL('./index.html',scope).href;if(e.request.mode==='navigate'){e.respondWith(caches.open(CACHE).then(async c=>(await c.match(key))||fetch(e.request)));return}if(ASSETS.some(x=>new URL(x,scope).href===u.href))e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request))||fetch(e.request)))});
