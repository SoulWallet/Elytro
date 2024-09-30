/**
 * Elytro Local Storage
 */
const localStorage: StorageOperations = {
  save: async <T>(key: string, value: T): Promise<void> => {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      throw new Error(
        `Elytro::LocalStorage::save: ${(error as Error).message}`
      );
    }
  },

  get: async <T>(key: string): Promise<T | undefined> => {
    try {
      const result = await chrome.storage.local.get(key);
      return (result?.[key] || result) as T;
    } catch (error) {
      throw new Error(`Elytro::LocalStorage::get: ${(error as Error).message}`);
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      throw new Error(
        `Elytro::LocalStorage::remove: ${(error as Error).message}`
      );
    }
  },

  clear: async (): Promise<void> => {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      throw new Error(
        `Elytro::LocalStorage::clear: ${(error as Error).message}`
      );
    }
  },
};

export { localStorage };
