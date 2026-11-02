// Youssef 03 : réseau uniquement pour le pilotage, aucun jeton mis en cache.
const CACHE='gamezone-youssef-patron-03';
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys()){if(key.startsWith('gamezone-youssef-patron-')&&key!==CACHE)await caches.delete(key);}await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==self.location.origin)return;e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>new Response('Connexion Internet nécessaire. Rouvre GameZone une fois connecté.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));});
