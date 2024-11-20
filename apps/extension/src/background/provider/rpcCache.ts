import { SupportedChainTypeEn } from '@/constants/chains';

type TCacheValue = {
  value: SafeAny;
  expireTime: number;
  timeoutId: NodeJS.Timeout; // ! Need to clear cache value when the cache is expired
};

const DEFAULT_BLOCK_NUMBER_CACHE_EXPIRE_TIME = 10_000; // ms
const DEFAULT_RPC_CACHE_EXPIRE_TIME = 30_000; //ms

const SAFE_CACHE_METHODS = ['eth_getCode'];

class RPCCacheManager {
  private _cache: Map<string, TCacheValue> = new Map();
  private _latestBlockNumberByChain: Record<string, string> = {}; // key is SupportedChainTypeEn

  init() {
    this._refreshLatestBlockNumber();

    setInterval(() => {
      this._refreshLatestBlockNumber();
    }, DEFAULT_BLOCK_NUMBER_CACHE_EXPIRE_TIME);
  }

  private _refreshLatestBlockNumber() {
    for (const chain in SupportedChainTypeEn) {
      if (Object.prototype.hasOwnProperty.call(SupportedChainTypeEn, chain)) {
        this._latestBlockNumberByChain[chain as SupportedChainTypeEn] =
          Date.now().toString();
      }
    }
  }

  private _getLatestBlockNumber(chain: SupportedChainTypeEn) {
    return this._latestBlockNumberByChain[chain] ?? 0;
  }

  private _getCacheKey(
    chainId: SupportedChainTypeEn,
    address: string,
    method: string,
    params: SafeAny
  ): string {
    return `${chainId}-${this._getLatestBlockNumber(chainId)}-${address}-${method}-${JSON.stringify(params)}`;
  }

  private _set(
    key: string,
    value: SafeAny,
    expireTime = DEFAULT_RPC_CACHE_EXPIRE_TIME
  ): void {
    this._cache.set(key, {
      value,
      expireTime: Date.now() + expireTime,
      timeoutId: setTimeout(() => {
        this._cache.delete(key);
      }, expireTime),
    });
  }

  public set(
    chainId: SupportedChainTypeEn,
    address: string,
    request: RequestArguments,
    result: SafeAny,
    expireTime = DEFAULT_RPC_CACHE_EXPIRE_TIME
  ): void {
    if (!SAFE_CACHE_METHODS.includes(request.method)) {
      return;
    }

    const key = this._getCacheKey(
      chainId,
      address,
      request.method,
      request.params
    );

    const cacheValue = this._cache.get(key);

    if (cacheValue) {
      clearTimeout(cacheValue.timeoutId);
    }

    this._set(key, result, expireTime);
  }

  public get(
    chainId: SupportedChainTypeEn,
    address: string,
    request: RequestArguments
  ): SafeAny | null {
    if (!SAFE_CACHE_METHODS.includes(request.method)) {
      return null;
    }

    const key = this._getCacheKey(
      chainId,
      address,
      request.method,
      request.params
    );

    return this._cache.has(key) ? this._cache.get(key)?.value : null;
  }

  public clear(): void {
    this._cache.clear();
  }
}

export const rpcCacheManager = new RPCCacheManager();
