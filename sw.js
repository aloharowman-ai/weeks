// Офлайн: сначала сеть, при её отсутствии — кэш. Данные пользователя в кэш не попадают (они в localStorage).
const CACHE = 'weeks-v1'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      try {
        const res = await fetch(req)
        if (res.ok) cache.put(req, res.clone())
        return res
      } catch {
        const hit = await cache.match(req, { ignoreSearch: true })
        if (hit) return hit
        if (req.mode === 'navigate') return (await cache.match('./')) || (await cache.match('./index.html'))
        throw new Error('offline')
      }
    }),
  )
})
