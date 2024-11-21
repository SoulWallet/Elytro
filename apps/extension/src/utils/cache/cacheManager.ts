type TCacheValue = {
  value: SafeAny;
  expireTime: number;
  timeoutId: NodeJS.Timeout; // ! Need to clear cache value when the cache is expired
};

abstract class CacheManager {
  protected _cache: Map<string, TCacheValue> = new Map();

  protected abstract _getCacheKey(...args: SafeAny[]): string;

  protected _set(key: string, value: SafeAny, expireTime: number): void {
    const cacheValue = this._cache.get(key);
    if (cacheValue) {
      clearTimeout(cacheValue.timeoutId);
    }

    this._cache.set(key, {
      value,
      expireTime: Date.now() + expireTime,
      timeoutId: setTimeout(() => {
        this._cache.delete(key);
      }, expireTime),
    });
  }

  protected _get(key: string): SafeAny | null {
    return this._cache.has(key) ? this._cache.get(key)?.value : null;
  }

  public clear(): void {
    this._cache.clear();
  }

  public abstract set(...args: SafeAny[]): void;
  public abstract get(...args: SafeAny[]): SafeAny | null;
}

export default CacheManager;
