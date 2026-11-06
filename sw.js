// Youssef only. A missing optional audio asset must not break installation.
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
const AUDIO_CACHE='youssef-audio-v1';
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(/\/youssef-audio-[a-z]+\.mp3$/.test(u.pathname)){e.respondWith(caches.open(AUDIO_CACHE).then(async c=>{const old=await c.match(e.request);if(old)return old;const r=await fetch(e.request);if(r.ok)await c.put(e.request,r.clone());return r;}));return;}
 e.respondWith(fetch(e.request,{cache:'no-store'}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(async rows=>{const row=rows.find(x=>x.url.startsWith(self.registration.scope));if(row)return row.focus();return self.clients.openWindow(self.registration.scope);}));});
