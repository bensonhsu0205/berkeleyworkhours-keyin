/* 社區時數表系統 · 離線快取
   策略：有網路 → 一律拿最新版（改版立刻生效）；沒網路 → 用上次存下來的版本。 */
const C='berkeley-hours-cache';
self.addEventListener('install', e=>{ self.skipWaiting(); });
self.addEventListener('activate', e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e=>{
  const r=e.request;
  if(r.method!=='GET' || new URL(r.url).origin!==self.location.origin) return;
  e.respondWith((async()=>{
    try{
      const resp=await fetch(r);
      if(resp && resp.status===200){ const c=await caches.open(C); c.put(r, resp.clone()); }
      return resp;
    }catch(err){
      const hit = await caches.match(r) || await caches.match('./') || await caches.match('./index.html');
      if(hit) return hit;
      throw err;
    }
  })());
});
