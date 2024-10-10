// import walletClient from '../walletClient';
import { SafeEventEmitter } from '@/utils/safeEventEmitter';
import walletClient from '../walletClient';
import { SendTransactionParameters, toHex } from 'viem';
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

  private async _sendTransaction(params: unknown) {
    // prepare tx, should display this tx for user
    const request = await walletClient.prepareTransactionRequest(
      (params as unknown[])[0] as SendTransactionParameters
    );

    // sign tx, should open a tab then need user to confirm the sign
    const serializedTransaction = await walletClient.signTransaction(request);

    if (serializedTransaction) {
      const hash = await walletClient.sendRawTransaction(serializedTransaction);
      return hash;
    }
    return null;
  }

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
        return this._sendTransaction(params);
      case 'eth_signTypedDataV4':
        return walletClient.signTypedDataV4(params);
      case 'personal_sign':
        // return walletClient.chainType;
        return await walletClient.personalSign(params);
      case 'eth_getTransactionByHash':
        return await walletClient.getTransactionByHash(params);
      default:
        throw new Error(`Elytro: ${method} is not supported yet.`);
    }
  }
}

const provider = new BuiltinProvider();

export default provider;
