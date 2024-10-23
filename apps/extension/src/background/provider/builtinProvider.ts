// import walletClient from '../walletClient';
import { SafeEventEmitter } from '@/utils/safeEventEmitter';
import { toHex } from 'viem';
import walletClient from '../services/walletClient';

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
    switch (method) {
      case 'eth_chainId':
        return toHex(walletClient.chain.id);
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return walletClient.address ? [walletClient.address] : [];
      case 'eth_getBlockByNumber':
        return walletClient.getBlockByNumber();
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

const builtinProvider = new BuiltinProvider();

export default builtinProvider;
