const withErrorHandling = <T extends (...args: unknown[]) => unknown>(
  operation: T,
  fallback?: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return operation(...args) as ReturnType<T>;
    } catch (error) {
      // TODO: add notification
      console.error('Elytro::SyncStorage::save: ', error);
      if (fallback) {
        console.log('Elytro::SyncStorage::save: trying fallback');
        return fallback(...args) as ReturnType<T>;
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
    (items: Record<string, unknown>): void => {
      chrome.storage.sync.set(items, () => {
        if (chrome.runtime.lastError) {
          throw chrome.runtime.lastError;
        }
      });
    },
    localStorage.save // sync storage size is limited, fallback to local storage
  ),

  get: withErrorHandling(
    <T>(keys: string[]): Record<string, T> => {
      let result: Record<string, T> = {};
      chrome.storage.sync.get(keys, (items) => {
        if (chrome.runtime.lastError) {
          throw chrome.runtime.lastError;
        }
        result = items;
      });
      return result;
    },
    localStorage.get // if sync storage get failed, try local storage
  ),

  // @ts-ignore
  remove: withErrorHandling(async (keys: string[]): Promise<void> => {
    await new Promise((resolve) => {
      chrome.storage.sync.remove(keys, () => {
        if (chrome.runtime.lastError) {
          throw chrome.runtime.lastError;
        }
        resolve(void 0);
      });
    });
  }),

  clear: withErrorHandling(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }),
};

export { syncStorage };
