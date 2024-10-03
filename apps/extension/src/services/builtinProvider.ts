import { EventEmitter } from 'events';
import walletClient from './walletClient';
import { toHex } from 'viem';

/**
 * Elytro Builtin Provider: based on EIP-1193
 */
class BuiltinProvider extends EventEmitter {
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
    // TODO: try unlock if needed

    console.log('ElytroProvider getting request', method, ':\n', params);

    switch (method) {
      case 'eth_chainId':
        return toHex(walletClient.chain.id);
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return walletClient.address ? [walletClient.address] : [];

      // TODO: implement the rest of the methods
      case 'eth_sendTransaction':
        return '0x1';
      case 'eth_signTypedDataV4':
        return '0x1';
      case 'personal_sign':
        return '0x1';
      default:
        throw new Error(`Elytro: ${method} is not supported yet.`);
    }
  }
}

const provider = new BuiltinProvider();

export default provider;
