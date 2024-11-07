// import walletClient from '../walletClient';
import { SafeEventEmitter } from '@/utils/safeEventEmitter';
import { Address, BlockTag, toHex } from 'viem';
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

  private _validateArrayParams(params: SafeAny, expectedLength: number = 1) {
    if (!Array.isArray(params) || params.length < expectedLength) {
      throw ethErrors.rpc.invalidParams();
    }
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

      // TODO: optimize this. maybe move the params validating to rpcFlow?
      case 'eth_getCode':
        this._validateArrayParams(params);

        return await walletClient.getCode(
          ...(params as [Address, BlockTag | bigint])
        );
      case 'eth_call':
        this._validateArrayParams(params);
        return await walletClient.call(
          ...(params as [SafeAny, BlockTag | bigint])
        );
      case 'eth_estimateGas':
        this._validateArrayParams(params);
        return await walletClient.estimateGas(
          ...(params as [SafeAny, BlockTag | bigint])
        );
      default:
        throw ethErrors.rpc.methodNotFound(method);
    }
  }
}

const builtinProvider = new BuiltinProvider();

export default builtinProvider;
