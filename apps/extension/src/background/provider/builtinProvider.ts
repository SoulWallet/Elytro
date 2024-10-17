// import walletClient from '../walletClient';
import { SafeEventEmitter } from '@/utils/safeEventEmitter';
import { toHex } from 'viem';
import { ethErrors } from 'eth-rpc-errors';
import walletClient from '../services/walletClient';
import keyring from '../services/keyring';

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

  public async createDappRequestWindow(request: unknown) {
    const window = await chrome.windows.getCurrent();
    const height = 932;
    const width = 433;

    const top = Math.round(
      (window.top ?? 0) + ((window.height ?? height) - height) / 2
    );
    const left = Math.round(
      (window.left ?? 0) + ((window.width ?? width) - width) / 2
    );
    try {
      chrome.windows.create(
        {
          url: chrome.runtime.getURL(
            `src/entries/tab/index.html#/send_transaction?id=windowid`
          ),
          focused: true,
          type: 'popup',
          width,
          height,
          top,
          left,
        },
        (window) => {
          if (window && window.tabs?.length) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs.length) {
                const transactionWindowTabId = tabs[0].id;
                chrome.tabs.onUpdated.addListener((tabId, info) => {
                  if (
                    tabId === transactionWindowTabId &&
                    info.status === 'complete'
                  ) {
                    setTimeout(() => {
                      chrome.tabs.sendMessage(transactionWindowTabId, {
                        request,
                      });
                    }, 500);
                  }
                });
              }
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private async _sendTransaction(params: unknown) {
    await this.createDappRequestWindow(params);
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
        // return this._sendTransaction(params);

        try {
          const mappedParams = (params as TTransactionInfo[]).map((tx) => ({
            data: tx?.input,
            gasLimit: tx?.gasPrice,
            ...tx,
          }));
          return walletClient.sendTransaction(mappedParams);
        } catch {
          return ethErrors.provider.userRejectedRequest();
        }

      // return walletClient.sendTransaction(params);
      case 'eth_signTypedDataV4':
        return walletClient.signTypedDataV4(params);
      case 'personal_sign':
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
