type StorageOperations = {
  save: <T>(key: string, value: T) => Promise<void>;
  get: <T>(key: string) => Promise<T | undefined>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
};
