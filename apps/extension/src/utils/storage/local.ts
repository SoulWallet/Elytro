/**
 * Elytro Local Storage
 */
const localStorage: StorageOperations = {
  // TODO: add parse/stringify
  save: async <T>(items: Record<string, T>): Promise<void> => {
    try {
      await chrome.storage.local.set(items);
    } catch (error) {
      throw new Error(
        `Elytro::LocalStorage::save: ${(error as Error).message}`
      );
    }
  },

  // TODO: add parse/stringify
  get: async <T>(keys: string[]): Promise<Record<string, T>> => {
    try {
      const result = await chrome.storage.local.get(keys);
      return result;
    } catch (error) {
      throw new Error(`Elytro::LocalStorage::get: ${(error as Error).message}`);
    }
  },

  remove: async (keys: string[]): Promise<void> => {
    try {
      await chrome.storage.local.remove(keys);
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
