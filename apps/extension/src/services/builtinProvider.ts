import { createClient, http } from 'viem';
import { mainnet } from 'viem/chains';

/**
 * Elytro Builtin Provider: based on EIP-1193
 */
class BuiltinProvider {
  private _initialized: boolean = false;
  private _client: ReturnType<typeof createClient> | null = null;

  constructor() {
    this.initialize();
  }

  public initialize = async () => {
    this._initialized = true;

    this._client = createClient({
      chain: mainnet,
      transport: http(),
    });
  };

  public get client() {
    if (!this._initialized) {
      throw new Error('Provider not initialized');
    }

    return this._client;
  }

  public get initialized() {
    return this._initialized;
  }

  // TODO: Implement the rest of the EIP-1193 methods
}

export default new BuiltinProvider();
