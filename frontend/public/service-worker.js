// Service Worker for LegisFlow CEMAC PWA

const CACHE_NAME = 'legisflow-cemac-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add CSS, JS, and other static assets here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For HTML requests - network first, fallback to cache, then offline page
  if (event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For non-HTML requests - cache first, fallback to network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the new response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-matters') {
    event.waitUntil(syncMatters());
  } else if (event.tag === 'sync-time-entries') {
    event.waitUntil(syncTimeEntries());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Helper functions for background sync
async function syncMatters() {
  // Implementation for syncing matters when back online
  const db = await openDB();
  const offlineMatters = await db.getAll('offlineMatters');
  
  // Process each offline matter
  for (const matter of offlineMatters) {
    try {
      const response = await fetch('/api/matters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(matter)
      });
      
      if (response.ok) {
        await db.delete('offlineMatters', matter.id);
      }
    } catch (error) {
      console.error('Failed to sync matter:', error);
    }
  }
}

async function syncTimeEntries() {
  // Implementation for syncing time entries when back online
  const db = await openDB();
  const offlineTimeEntries = await db.getAll('offlineTimeEntries');
  
  // Process each offline time entry
  for (const entry of offlineTimeEntries) {
    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      });
      
      if (response.ok) {
        await db.delete('offlineTimeEntries', entry.id);
      }
    } catch (error) {
      console.error('Failed to sync time entry:', error);
    }
  }
}

// IndexedDB helper
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LegisFlowOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores for offline data
      if (!db.objectStoreNames.contains('offlineMatters')) {
        db.createObjectStore('offlineMatters', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('offlineTimeEntries')) {
        db.createObjectStore('offlineTimeEntries', { keyPath: 'id' });
      }
    };
  });
}

