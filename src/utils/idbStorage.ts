import { StateStorage } from 'zustand/middleware';

const DB_NAME = 'icu-patient-offline-db';
const STORE_NAME = 'patient-store';
const DB_VERSION = 1;

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Custom storage engine utilizing browser IndexedDB for patient storage.
 * Completely separate from standard web cache and general settings storage.
 */
export const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const db = await getDB();
      const val = await new Promise<string | null>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(name);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });

      // BACKWARDS-COMPATIBILITY MIGRATION:
      // If there is no patient data in IndexedDB yet, check if there's any in localStorage
      // and import it directly so the clinician doesn't lose their patient list!
      if (!val) {
        const localVal = localStorage.getItem(name);
        if (localVal) {
          console.log(`[IndexedDB Persistence] Migrated '${name}' from localStorage to IndexedDB...`);
          await idbStorage.setItem(name, localVal);
          localStorage.removeItem(name);
          return localVal;
        }
      }

      return val;
    } catch (e) {
      console.warn('IndexedDB getItem failed, falling back to localStorage:', e);
      return localStorage.getItem(name);
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const db = await getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, name);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn('IndexedDB setItem failed, falling back to localStorage:', e);
      localStorage.setItem(name, value);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      const db = await getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(name);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn('IndexedDB removeItem failed, falling back to localStorage:', e);
      localStorage.removeItem(name);
    }
  },
};

/**
 * Deletes the patient database completely upon global hard reset.
 */
export function clearPatientDb(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => {
      console.log(`[IndexedDB Persistence] Database '${DB_NAME}' deleted successfully.`);
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}
