export interface StorageEstimateInfo {
  used: string;       // human readable
  quota: string;      // human readable
  percentage: number;
}

/**
 * Formats bytes to standard human readable size (KB/MB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Estimate storage usage using modern browser API with fallback
 */
export async function getStorageEstimate(): Promise<StorageEstimateInfo> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usedValue = estimate.usage || 0;
      const quotaValue = estimate.quota || 1024 * 1024 * 100; // 100MB fallback limit
      return {
        used: formatBytes(usedValue),
        quota: formatBytes(quotaValue),
        percentage: quotaValue > 0 ? Math.round((usedValue / quotaValue) * 100) : 0,
      };
    } catch (e) {
      console.warn('Failed to fetch storage estimate:', e);
    }
  }

  // Fallback estimates using rough sizing of localStorage
  let localStorageSize = 0;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          localStorageSize += ((localStorage[key] || '').length + key.length) * 2; // ~2 bytes per character in JS strings
        }
      }
    } catch (e) {
      console.warn('Failed to calculate localStorage size:', e);
    }
  }

  return {
    used: formatBytes(localStorageSize),
    quota: '10 MB (Local)',
    percentage: Math.min(100, Math.round((localStorageSize / (10 * 1024 * 1024)) * 100)),
  };
}

/**
 * Refreshes cache & reloads client.
 * Clears window cache storage (assets), service workers, and forces reload.
 * This does NOT delete persistent local storage state to preserve clinical patient data.
 */
export async function refreshCacheAndReload(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Unregister all service workers
  if (navigator.serviceWorker) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    } catch (e) {
      console.warn('Failed to unregister ServiceWorkers:', e);
    }
  }

  // Clear cache storage files
  if (window.caches) {
    try {
      const keys = await window.caches.keys();
      for (const key of keys) {
        await window.caches.delete(key);
      }
    } catch (e) {
      console.warn('Failed to clear Caches:', e);
    }
  }

  // Force clean reload
  window.location.reload();
}

/**
 * Performs a complete hard reset of the app - clearing cache and all local storage data.
 * Useful for recovery or completely resetting clinical data in one tap.
 */
export async function performHardReset(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Clear caches and unregister WS
  await refreshCacheAndReload();

  // Clear all localStorage data
  localStorage.clear();

  // Redirect to home and reload
  window.location.href = '/';
}
