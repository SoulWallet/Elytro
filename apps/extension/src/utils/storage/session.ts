/**
 * Elytro Session Storage
 */
const sessionStorage: StorageOperations = {
  save: async <T>(items: Record<string, T>): Promise<void> => {
    try {
      await chrome.storage.session.set(items);
    } catch (error) {
      throw new Error(
        `Elytro::SessionStorage::save: ${(error as Error).message}`
      );
    }
  },
  get: async <T>(keys: string[]): Promise<Record<string, T>> => {
    try {
      const result = await chrome.storage.session.get(keys);
      return result;
    } catch (error) {
      throw new Error(
        `Elytro::SessionStorage::get: ${(error as Error).message}`
      );
    }
  },
  remove: async (keys: string[]): Promise<void> => {
    try {
      await chrome.storage.session.remove(keys);
    } catch (error) {
      throw new Error(
        `Elytro::SessionStorage::remove: ${(error as Error).message}`
      );
    }
  },
  clear: async (): Promise<void> => {
    try {
      await chrome.storage.session.clear();
    } catch (error) {
      throw new Error(
        `Elytro::SessionStorage::clear: ${(error as Error).message}`
      );
    }
  },
};

export { sessionStorage };
