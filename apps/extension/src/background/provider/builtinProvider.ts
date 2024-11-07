// import walletClient from '../walletClient';
import { SafeEventEmitter } from '@/utils/safeEventEmitter';
import { BlockTag, CallParameters, toHex } from 'viem';
import walletClient from '../services/walletClient';
import { ethErrors } from 'eth-rpc-errors';

/**
 * Elytro Builtin Provider: based on EIP-1193
 */
class BuiltinProvider extends SafeEventEmitter {
  private _initialized: boolean = false;
  private _connected: boolean = false;

  constructor() {
    super();
    this.initialize();
  }

  public initialize = async () => {
    this._initialized = true;
    this._connected = true;
  };

  public get connected() {
    return this._connected;
  }

  public get initialized() {
    return this._initialized;
  }

  public async request({ method, params }: RequestArguments) {
    switch (method) {
      case 'net_version':
        return walletClient.chain.id ? walletClient.chain.id.toString() : '0';
      case 'eth_chainId':
        return toHex(walletClient.chain.id);
      case 'eth_blockNumber':
        return await walletClient.getBlockNumber();
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return walletClient.address ? [walletClient.address] : [];
      case 'eth_getBlockByNumber':
        return await walletClient.getBlockByNumber({
          blockTag: (params as [BlockTag])?.[0] ?? 'latest',
          includeTransactions: (params as [BlockTag, false])?.[1],
        });
      case 'eth_getCode':
        if (
          !Array.isArray(params) ||
          !params[0].startsWith('0x') ||
          !params[1]
        ) {
          throw ethErrors.rpc.invalidParams();
        }

        return await walletClient.getCode([params[0], params[1]]);
      case 'eth_call':
        if (!Array.isArray(params) || !params[0] || !params[1] || !params[2]) {
          throw ethErrors.rpc.invalidParams();
        }
        return await walletClient.call(
          params as [CallParameters, bigint | BlockTag]
        );
      default:
        throw ethErrors.rpc.methodNotFound(method);
    }
  }
}

const builtinProvider = new BuiltinProvider();

export default builtinProvider;
