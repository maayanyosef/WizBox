// Service Worker for WizBox Tools PWA
const CACHE_NAME = 'wizbox-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/css/main.css',
  '/css/components.css',
  '/css/dark-mode.css',
  '/js/main.js',
  '/js/api-handlers.js',
  '/js/ui-helpers.js',
  '/images/apple-touch-icon.png',
  '/images/favicon-16x16.png',
  '/images/favicon-32x32.png',
  '/images/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('WizBox: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('WizBox: Failed to cache resources:', error);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html') || 
                   new Response('You are offline. Please check your internet connection.', {
                     status: 503,
                     statusText: 'Service Unavailable',
                     headers: { 'Content-Type': 'text/plain' }
                   });
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('WizBox: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions (if needed in future)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('WizBox: Background sync triggered');
    // Handle background sync tasks here
  }
});

// Push notifications (for future enhancement)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/apple-touch-icon.png',
      badge: '/images/favicon-32x32.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});