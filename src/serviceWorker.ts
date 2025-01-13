/// <reference lib="webworker" />

export type {};
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'mindful-moments-v1';
const FIREBASE_DOMAINS = [
  'firebaseio.com',
  'googleapis.com',
  'google.com',
  'firebase.com',
  'firebaseapp.com'
];

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/js/',
  '/static/css/',
  '/static/media/'
];

// Skip waiting and claim clients immediately
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(urlsToCache);
      })
    ])
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Helper function to check if a request is for Firebase
const isFirebaseRequest = (url: string): boolean => {
  return FIREBASE_DOMAINS.some(domain => url.includes(domain));
};

// Helper function to determine if a response should be cached
const shouldCache = (response: Response): boolean => {
  const contentType = response.headers.get('content-type');
  if (!contentType) return false;
  
  return (
    contentType.includes('text/html') ||
    contentType.includes('text/css') ||
    contentType.includes('application/javascript') ||
    contentType.includes('image/') ||
    contentType.includes('font/')
  );
};

// Fetch resources with network-first strategy for Firebase requests
// and cache-first for static assets
self.addEventListener('fetch', (event: FetchEvent) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // Network-first strategy for Firebase requests
  if (isFirebaseRequest(url.hostname)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.warn('Firebase request failed, falling back to cache if available');
          return caches.match(event.request).then(response => {
            if (response) return response;
            throw new Error('No cached response available');
          });
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response immediately
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Clone the response before using it
            const responseToCache = response.clone();

            // Only cache successful responses
            if (response.status === 200 && shouldCache(response)) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                })
                .catch(error => {
                  console.error('Cache put error:', error);
                });
            }

            return response;
          })
          .catch(error => {
            console.error('Network fetch failed:', error);
            // Return a basic offline page or error response
            return new Response('You are offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
      })
  );
});

// Register service worker
export function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('SW registered:', registration);
          
          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch(error => {
          console.error('SW registration failed:', error);
        });
    });
  }
}

// Unregister service worker
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

// Service Worker for Push Notifications
self.addEventListener('push', (event: any) => {
  const options = {
    body: event.data.text(),
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Mindful Moments', options)
  );
});

// When the user clicks a notification, focus the window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow('/')
  );
}); 