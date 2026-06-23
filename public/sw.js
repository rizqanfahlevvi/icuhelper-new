const CACHE_NAME = 'icu-helper-assets-v2';

// Essential offline starting assets
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.json'
];

// Install event to cache base assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event to prune old storage caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old system asset cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event to serve offline content seamlessly
self.addEventListener('fetch', (event) => {
  // Only handle standard GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass system dev tooling / hot-module-replacement server-sent-events
  if (
    url.pathname.includes('/@vite') ||
    url.pathname.includes('/node_modules') ||
    (url.hostname === 'localhost' && url.port !== '3000')
  ) {
    return;
  }

  // Bypass API calls, OAuth redirections, or Firebase-specific endpoints
  if (
    url.pathname.startsWith('/api') || 
    url.hostname.includes('firebase') || 
    url.hostname.includes('googleapis')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('Offline: Layanan tidak tersedia.', { status: 503 }))
    );
    return;
  }

  // Network-First strategy for pages / documents (to ensure immediate updates of app code)
  const isPageRequest = 
    event.request.mode === 'navigate' || 
    url.pathname === '/' || 
    url.pathname.endsWith('.html') || 
    (!url.pathname.includes('.') && !url.pathname.startsWith('/api'));

  if (isPageRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fall back to cache only when completely offline
          return caches.match(event.request);
        })
    );
    return;
  }

  // Stale-while-revalidate / Cache-First for static assets (images, js, css, icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse && 
            networkResponse.status === 200 && 
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          throw err;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
