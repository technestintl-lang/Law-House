// Service Worker for LegisFlow CEMAC PWA - Production Ready

const CACHE_NAME = 'legisflow-cemac-v1';
const STATIC_CACHE_NAME = 'legisflow-static-v1';
const DYNAMIC_CACHE_NAME = 'legisflow-dynamic-v1';
const API_CACHE_NAME = 'legisflow-api-v1';
const OFFLINE_URL = '/offline.html';

// Cache expiration times
const STATIC_CACHE_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 days
const DYNAMIC_CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const API_CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 1 day

const staticUrlsToCache = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/badge-72x72.png',
  // Static assets
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/pages/_app.js',
  '/_next/static/chunks/pages/index.js',
  '/_next/static/chunks/pages/login.js',
  '/_next/static/chunks/pages/dashboard.js',
  '/_next/static/css/main.css',
];

// API routes to cache with network-first strategy
const apiUrlsToCache = [
  '/api/matters',
  '/api/clients',
  '/api/deadlines',
  '/api/time-entries',
];

// Routes that should never be cached
const neverCacheUrls = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/refresh',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(staticUrlsToCache);
      }),
      
      // Create other caches
      caches.open(DYNAMIC_CACHE_NAME),
      caches.open(API_CACHE_NAME),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, API_CACHE_NAME];
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Clean up expired items from dynamic cache
      cleanExpiredCache(DYNAMIC_CACHE_NAME, DYNAMIC_CACHE_EXPIRATION),
      
      // Clean up expired items from API cache
      cleanExpiredCache(API_CACHE_NAME, API_CACHE_EXPIRATION),
      
      // Claim clients to control all tabs
      self.clients.claim()
    ])
  );
});

// Helper function to clean expired cache items
async function cleanExpiredCache(cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  const now = Date.now();
  
  for (const request of requests) {
    const response = await cache.match(request);
    const responseDate = response.headers.get('date');
    
    if (responseDate) {
      const date = new Date(responseDate).getTime();
      if (now - date > maxAge) {
        await cache.delete(request);
        console.log(`Deleted expired item from ${cacheName}:`, request.url);
      }
    }
  }
}

// Fetch event - advanced caching strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (!url.origin.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip requests that should never be cached
  if (neverCacheUrls.some(path => url.pathname.includes(path))) {
    return;
  }

  // Handle different request types with appropriate strategies
  
  // 1. HTML requests - Network First with Offline Fallback
  if (event.request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithOfflineFallback(event.request));
    return;
  }
  
  // 2. API requests - Network First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    // Check if it's a cacheable API route
    const isCacheableApi = apiUrlsToCache.some(path => url.pathname.includes(path));
    
    if (isCacheableApi) {
      event.respondWith(networkFirstWithCache(event.request, API_CACHE_NAME));
    } else {
      // For non-cacheable API routes, just use network
      return;
    }
    return;
  }
  
  // 3. Static assets - Cache First with Network Fallback
  if (
    url.pathname.startsWith('/_next/static/') || 
    url.pathname.startsWith('/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(cacheFirstWithNetwork(event.request, STATIC_CACHE_NAME));
    return;
  }
  
  // 4. Other requests - Network First with Dynamic Cache
  event.respondWith(networkFirstWithCache(event.request, DYNAMIC_CACHE_NAME));
});

// Network First with Offline Fallback Strategy
async function networkFirstWithOfflineFallback(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache the successful response
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If cache fails, return offline page
    return caches.match(OFFLINE_URL);
  }
}

// Network First with Cache Fallback Strategy
async function networkFirstWithCache(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache the successful response
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both fail, throw error
    throw error;
  }
}

// Cache First with Network Fallback Strategy
async function cacheFirstWithNetwork(request, cacheName) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If cache fails, try network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the successful response
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // If both fail, throw error
    throw error;
  }
}

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
