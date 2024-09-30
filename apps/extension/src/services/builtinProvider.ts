import { createClient, http, RpcError } from 'viem';
import { mainnet } from 'viem/chains';
import { rpcErrors, serializeError } from '@metamask/rpc-errors';
import EventEmitter from 'eventemitter3';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const messages = {
  errors: {
    disconnected: (): string =>
      'Elytro Wallet: Disconnected from chain. Attempting to connect.',
    invalidRequestArgs: (): string =>
      `Elytro Wallet: Expected a single, non-array, object argument.`,
    invalidRequestGeneric: (): string =>
      `Elytro Wallet: Please check the input passed to the request method`,
  },
};

/**
 * Elytro Builtin Provider: based on EIP-1193
 */
class BuiltinProvider extends EventEmitter {
  private _initialized: boolean = false;
  private _client: ReturnType<typeof createClient> | null = null;

  constructor() {
    super();
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

  // requset method for handle json rpc request
  request = async (args: RequestArguments) => {
    try {
      if (!args || typeof args !== 'object' || Array.isArray(args)) {
        throw rpcErrors.invalidRequest({
          message: messages.errors.invalidRequestArgs(),
          data: args,
        });
      }

      const { method, params } = args;

      if (typeof method !== 'string' || method.length === 0) {
        throw rpcErrors.invalidRequest({
          message: messages.errors.invalidRequestGeneric(),
          data: args,
        });
      }

      if (
        params !== undefined &&
        !Array.isArray(params) &&
        (typeof params !== 'object' || params === null)
      ) {
        throw rpcErrors.invalidRequest({
          message: messages.errors.invalidRequestArgs(),
          data: args,
        });
      }

      const requestId = uuidv4();
      const result = await axios({
        method: 'POST',
        url: this._client?.chain?.rpcUrls.default.http[0],
        data: {
          id: requestId,
          jsonrpc: '2.0',
          ...args,
        },
      });
      if (result.data.error) {
        throw rpcErrors.invalidRequest({
          message: result.data.error.message,
          data: args,
        });
      }
      return result;
    } catch (error) {
      throw serializeError(
        rpcErrors.invalidRequest({
          message: (error as RpcError).message,
          data: args,
        })
      );
    }
  };

  // send is DEPRECATED
  send(args: RequestArguments) {
    return this.request(args);
  }
  // sendAsync is DEPRECATED
  sendAsync = (
    args: RequestArguments,
    callback: (error: unknown, response: unknown) => void
  ): Promise<unknown> | void => {
    return this.request(args).then(
      (response) =>
        callback(null, {
          result: response,
        }),
      (error) => callback(error, null)
    );
  };
}

const builtinProvider = new BuiltinProvider();
// to receive the event emited by the chrome extension
builtinProvider.on('chainChanged', (event) => {
  console.log(event);
});
builtinProvider.on('accountsChanged', (event) => {
  console.log(event);
});
builtinProvider.on('disconnect', (code, reason) => {
  console.log(`Provider connection closed: ${reason}. Code: ${code}`);
});
export default builtinProvider;
