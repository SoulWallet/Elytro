const withErrorHandling = <T extends (...args: any[]) => any>(
  operation: T,
  fallback?: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>) => {
    try {
      return operation(...args);
    } catch (error) {
      // TODO: add notification
      console.error('Elytro::SyncStorage::save: ', error);
      if (fallback) {
        console.log('Elytro::SyncStorage::save: trying fallback');
        return fallback(...args);
      }
      throw error;
    }
  };
};

/**
 * Elytro Sync Storage
 */
const syncStorage: StorageOperations = {
  save: withErrorHandling(
    (key: string, value: unknown): void => {
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          throw chrome.runtime.lastError;
        }
      });
    },
    localStorage.save // sync storage size is limited, fallback to local storage
  ),

  get: withErrorHandling(
    <T>(key: string): T | undefined => {
      let result: T | undefined;
      chrome.storage.sync.get(key, (items) => {
        if (chrome.runtime.lastError) {
          throw chrome.runtime.lastError;
        }
        result = items[key] as T;
      });
      return result;
    },
    localStorage.get // if sync storage get failed, try local storage
  ),

  remove: withErrorHandling((key: string): void => {
    chrome.storage.sync.remove(key, () => {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
    });
  }),

  clear: withErrorHandling((): void => {
    chrome.storage.sync.clear(() => {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
    });
  }),
};

export { syncStorage };
