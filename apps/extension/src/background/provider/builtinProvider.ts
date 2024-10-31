// import walletClient from '../walletClient';
import { SafeEventEmitter } from '@/utils/safeEventEmitter';
import { BlockTag, toHex } from 'viem';
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
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return walletClient.address ? [walletClient.address] : [];
      case 'eth_getBlockByNumber':
        return await walletClient.getBlockByNumber({
          blockTag: (params as [BlockTag])?.[0] ?? 'latest',
          includeTransactions: (params as [BlockTag, false])?.[1],
        });
      // case 'eth_signTypedDataV4':
      //   return walletClient.signTypedDataV4(params);
      // case 'personal_sign':
      //   return await walletClient.personalSign(params);
      // case 'eth_getTransactionByHash':
      //   return await walletClient.getTransactionByHash(params);
      default:
        throw ethErrors.rpc.methodNotFound(method);
    }
  }
}

const builtinProvider = new BuiltinProvider();

export default builtinProvider;
