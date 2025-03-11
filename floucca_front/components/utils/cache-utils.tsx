/**
 * Utility functions for handling local storage caching
 */

const DEFAULT_EXPIRATION = 60 * 60 * 1000; // 1 hour

/**
 * Check if a cached item exists and is not expired
 */
export function isCacheValid(key: string, expirationMs = DEFAULT_EXPIRATION): boolean {
  try {
    const timestampKey = `${key}_timestamp`;
    const cachedTimestamp = localStorage.getItem(timestampKey);
    
    if (!cachedTimestamp) {
      return false;
    }
    
    const timestamp = parseInt(cachedTimestamp, 10);
    const now = Date.now();
    
    return now - timestamp < expirationMs;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
}

/**
 * Get an item from cache if it exists and is not expired
 */
export function getFromCache<T>(key: string, expirationMs = DEFAULT_EXPIRATION): T | null {
  try {
    if (!isCacheValid(key, expirationMs)) {
      return null;
    }
    
    const cachedData = localStorage.getItem(key);
    if (!cachedData) {
      return null;
    }
    
    return JSON.parse(cachedData) as T;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
}

/**
 * Save an item to cache with timestamp
 */
export function saveToCache<T>(key: string, data: T): void {
  try {
    const timestampKey = `${key}_timestamp`;
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(timestampKey, Date.now().toString());
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

/**
 * Remove an item and its timestamp from cache
 */
export function removeFromCache(key: string): void {
  try {
    const timestampKey = `${key}_timestamp`;
    localStorage.removeItem(key);
    localStorage.removeItem(timestampKey);
  } catch (error) {
    console.error('Error removing from cache:', error);
  }
}

/**
 * Clear all caches related to Flouca
 */
export function clearAllFloucaCache(): void {
  try {
    const keysToRemove: string[] = [];
    
    // Find all keys related to Flouca
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('flouca_')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all found keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`Cleared ${keysToRemove.length} cached items`);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}