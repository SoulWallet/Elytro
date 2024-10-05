type StorageOperations = {
  save: <T>(items: Record<string, T>) => Promise<void>;

  get: <T>(keys: string[]) => Promise<Record<string, T>>;
  remove: (keys: string[]) => Promise<void>;
  clear: () => Promise<void>;
};
