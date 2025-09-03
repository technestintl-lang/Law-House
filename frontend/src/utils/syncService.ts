import { openDB, DBSchema, IDBPDatabase } from 'idb';
import axios from 'axios';

// Define the database schema
interface LegisFlowDB extends DBSchema {
  timeEntries: {
    key: string;
    value: {
      id: string;
      description: string;
      duration: number;
      date: Date;
      matterId: string;
      userId: string;
      billable: boolean;
      billed: boolean;
      synced: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-synced': boolean; 'by-date': Date };
  };
  documents: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      type: string;
      matterId?: string;
      clientId?: string;
      filePath: string;
      fileSize: number;
      fileType: string;
      uploadedById: string;
      isTemplate: boolean;
      synced: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-synced': boolean; 'by-type': string };
  };
  matters: {
    key: string;
    value: {
      id: string;
      title: string;
      description: string;
      status: string;
      type: string;
      clientId: string;
      responsibleAttorneyId: string;
      ohadaCaseNumber?: string;
      courtDetails?: string;
      opposingCounsel?: string;
      synced: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-synced': boolean; 'by-status': string };
  };
  clients: {
    key: string;
    value: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      contactPerson: string;
      synced: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-synced': boolean };
  };
  deadlines: {
    key: string;
    value: {
      id: string;
      title: string;
      description: string;
      dueDate: Date;
      priority: string;
      matterId: string;
      assignedToId: string;
      completed: boolean;
      ruleUsed?: string;
      synced: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-synced': boolean; 'by-due-date': Date };
  };
}

// Database name and version
const DB_NAME = 'legisflow-db';
const DB_VERSION = 1;

// Initialize the database
async function initDB(): Promise<IDBPDatabase<LegisFlowDB>> {
  return openDB<LegisFlowDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('timeEntries')) {
        const timeEntriesStore = db.createObjectStore('timeEntries', { keyPath: 'id' });
        timeEntriesStore.createIndex('by-synced', 'synced');
        timeEntriesStore.createIndex('by-date', 'date');
      }

      if (!db.objectStoreNames.contains('documents')) {
        const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
        documentsStore.createIndex('by-synced', 'synced');
        documentsStore.createIndex('by-type', 'type');
      }

      if (!db.objectStoreNames.contains('matters')) {
        const mattersStore = db.createObjectStore('matters', { keyPath: 'id' });
        mattersStore.createIndex('by-synced', 'synced');
        mattersStore.createIndex('by-status', 'status');
      }

      if (!db.objectStoreNames.contains('clients')) {
        const clientsStore = db.createObjectStore('clients', { keyPath: 'id' });
        clientsStore.createIndex('by-synced', 'synced');
      }

      if (!db.objectStoreNames.contains('deadlines')) {
        const deadlinesStore = db.createObjectStore('deadlines', { keyPath: 'id' });
        deadlinesStore.createIndex('by-synced', 'synced');
        deadlinesStore.createIndex('by-due-date', 'dueDate');
      }
    },
  });
}

// Check if the browser is online
function isOnline(): boolean {
  return navigator.onLine;
}

// Register sync event with service worker
async function registerSync(tag: string): Promise<void> {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      console.log(`Registered sync event: ${tag}`);
    } catch (error) {
      console.error('Error registering sync event:', error);
    }
  } else {
    console.warn('Background sync is not supported in this browser');
  }
}

// Time Entries Sync Functions
export async function saveTimeEntry(timeEntry: any): Promise<string> {
  const db = await initDB();
  
  // Generate a temporary ID if not provided
  if (!timeEntry.id) {
    timeEntry.id = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  // Add metadata
  timeEntry.synced = false;
  timeEntry.createdAt = new Date();
  timeEntry.updatedAt = new Date();
  
  // Save to IndexedDB
  await db.put('timeEntries', timeEntry);
  
  // Try to sync if online
  if (isOnline()) {
    syncTimeEntries();
  } else {
    registerSync('sync-time-entries');
  }
  
  return timeEntry.id;
}

export async function syncTimeEntries(): Promise<void> {
  if (!isOnline()) {
    console.log('Cannot sync time entries: offline');
    return;
  }
  
  const db = await initDB();
  const unsyncedEntries = await db.getAllFromIndex('timeEntries', 'by-synced', false);
  
  for (const entry of unsyncedEntries) {
    try {
      // Determine if this is a new entry or an update
      const isNew = entry.id.startsWith('temp-');
      
      let response;
      if (isNew) {
        // Remove the temporary ID prefix for new entries
        const { id, synced, ...entryData } = entry;
        response = await axios.post('/api/time-entries', entryData);
        
        // Update the entry with the server-generated ID
        await db.delete('timeEntries', entry.id);
        entry.id = response.data.id;
      } else {
        // Update existing entry
        const { synced, ...entryData } = entry;
        response = await axios.put(`/api/time-entries/${entry.id}`, entryData);
      }
      
      // Mark as synced
      entry.synced = true;
      entry.updatedAt = new Date();
      await db.put('timeEntries', entry);
      
      console.log(`Synced time entry: ${entry.id}`);
    } catch (error) {
      console.error(`Error syncing time entry ${entry.id}:`, error);
    }
  }
}

// Document Sync Functions
export async function saveDocument(document: any, file?: File): Promise<string> {
  const db = await initDB();
  
  // Generate a temporary ID if not provided
  if (!document.id) {
    document.id = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  // Add metadata
  document.synced = false;
  document.createdAt = new Date();
  document.updatedAt = new Date();
  
  // Save to IndexedDB
  await db.put('documents', document);
  
  // Try to sync if online and file is provided
  if (isOnline() && file) {
    syncDocuments();
  } else {
    registerSync('sync-documents');
  }
  
  return document.id;
}

export async function syncDocuments(): Promise<void> {
  if (!isOnline()) {
    console.log('Cannot sync documents: offline');
    return;
  }
  
  const db = await initDB();
  const unsyncedDocuments = await db.getAllFromIndex('documents', 'by-synced', false);
  
  for (const document of unsyncedDocuments) {
    try {
      // Determine if this is a new document or an update
      const isNew = document.id.startsWith('temp-');
      
      let response;
      if (isNew) {
        // For new documents, we need to upload the file
        // This would typically involve FormData and file upload
        // This is a simplified version
        const { id, synced, ...documentData } = document;
        response = await axios.post('/api/documents', documentData);
        
        // Update the document with the server-generated ID
        await db.delete('documents', document.id);
        document.id = response.data.id;
      } else {
        // Update existing document metadata
        const { synced, ...documentData } = document;
        response = await axios.put(`/api/documents/${document.id}`, documentData);
      }
      
      // Mark as synced
      document.synced = true;
      document.updatedAt = new Date();
      await db.put('documents', document);
      
      console.log(`Synced document: ${document.id}`);
    } catch (error) {
      console.error(`Error syncing document ${document.id}:`, error);
    }
  }
}

// Initialize sync listeners
export function initSyncListeners(): void {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('App is online. Starting sync...');
    syncTimeEntries();
    syncDocuments();
  });
  
  window.addEventListener('offline', () => {
    console.log('App is offline. Sync paused.');
  });
}

// Export the database initialization function
export { initDB };

