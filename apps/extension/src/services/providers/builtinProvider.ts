// import walletClient from '../walletClient';
import { SafeEventEmitter } from '@/utils/safeEventEmitter';
import walletClient from '../walletClient';
import { toHex } from 'viem';
import keyring from '../keyring';

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

  private _sendTransaction = async (params: RequestArguments['params']) => {
    // notify the tab page to show the transaction status
    console.log('sendTransaction', params);
  };

  public async request({ method, params }: RequestArguments) {
    // TODO: try unlock if needed -> call up the unlock page
    keyring.tryUnlock();

    switch (method) {
      case 'eth_chainId':
        // return '0xa';
        return toHex(walletClient.chain.id);
      case 'eth_accounts':
      case 'eth_requestAccounts':
        // return ['12Hxfu93cCXatFWELpc3Bp6X8BP5sCS4D6'];
        return walletClient.address ? [walletClient.address] : [];
      case 'eth_getBlockByNumber':
        return walletClient.getBlockByNumber();
      // TODO: implement the rest of the methods
      case 'eth_sendTransaction':
        this._sendTransaction(params);
        return '0x1';
      case 'eth_signTypedDataV4':
        return walletClient.signTypedDataV4(params);
      case 'personal_sign':
        // return walletClient.chainType;
        return await walletClient.personalSign(params);
      default:
        throw new Error(`Elytro: ${method} is not supported yet.`);
    }
  }
}

const provider = new BuiltinProvider();

export default provider;
