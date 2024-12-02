import { ethErrors } from 'eth-rpc-errors';
import { ElytroDuplexMessage, ElytroMessageTypeEn } from '@/utils/message';
import { SafeEventEmitter } from '@/utils/safeEventEmitter';
import { v4 as UUIDv4 } from 'uuid';

/**
 * Elytro Page Provider: injects Elytro into the page
 */
class PageProvider extends SafeEventEmitter {
  static defaultMaxListeners = 100; // original is 10, very easy to exceed
  private _currentAddress: string | null = null;
  private _currentChainId: number | null = null;

  private _message = new ElytroDuplexMessage(
    'elytro-page-provider',
    'elytro-content-script'
  );

  constructor() {
    super();
    this.initialize();
  }

  // TODO: looks like we don't need this check?
  // private _checkReady() {
  //   if (this._isDomReady && this._isDomVisible) {
  //     return true;
  //   }

  //   if (document.readyState === 'complete') {
  //     this._isDomReady = true;
  //   } else {
  //     const domContentLoadedHandler = () => {
  //       this._isDomReady = true;
  //       document.removeEventListener(
  //         'DOMContentLoaded',
  //         domContentLoadedHandler
  //       );
  //     };
  //     document.addEventListener('DOMContentLoaded', domContentLoadedHandler);
  //   }

  //   this._isDomVisible = document.visibilityState === 'visible';

  //   const visibilityChangeHandler = () => {
  //     this._isDomVisible = document.visibilityState === 'visible';

  //     if (this._isDomVisible) {
  //       document.removeEventListener(
  //         'visibilitychange',
  //         visibilityChangeHandler
  //       );
  //     }
  //   };
  //   document.addEventListener('visibilitychange', visibilityChangeHandler);

  //   return this._isDomReady && this._isDomVisible;
  // }

  initialize = async () => {
    this._message.connect();

    this._message.addListener(ElytroMessageTypeEn.MESSAGE, (payload) => {
      this.emit(payload.event, payload.data);
    });

    // this.on('connected', () => {
    //   console.log('Elytro Provider received connected event');
    // });
  };

  send = async () => {
    console.error(
      'Elytro: we do not support send method as it is a legacy method'
    );

    throw ethErrors.rpc.methodNotFound();
  };

  sendAsync = async () => {
    console.error(
      'Elytro: we do not support sendAsync method as it is a legacy method'
    );

    throw ethErrors.rpc.methodNotFound();
  };

  request = async (data: RequestArguments) => {
    if (!data || !data.method) {
      throw ethErrors.rpc.invalidRequest();
    }

    // if (this._checkReady()) {
    // post message to background, let the builtin provider handle it
    const uuid = UUIDv4();

    this._message.send({
      type: ElytroMessageTypeEn.REQUEST_FROM_PAGE_PROVIDER,
      uuid,
      payload: data,
    });

    return new Promise((resolve) => {
      this._message.onceMessage(uuid, (response) => {
        resolve(response?.response);
      });
    });
    // }

    // return Promise.reject(ethErrors.rpc.resourceUnavailable());
  };

  // TODO: listen dapp's 'connected' event
  on = (event: string | symbol, handler: (...args: unknown[]) => void) => {
    return super.on(event, handler);
  };

  // @ts-ignore
  emit = (eventName: ProviderEvent, ...args: SafeAny[]) => {
    switch (eventName) {
      case 'accountsChanged':
        if (args[0] && args[0] !== this._currentAddress) {
          this._currentAddress = args[0];
          return super.emit(eventName, ...args);
        }
        break;
      case 'chainChanged':
        if (args[0] && args[0] !== this._currentChainId) {
          this._currentChainId = args[0];
          return super.emit(eventName, ...args);
        }
        break;
      default:
        return super.emit(eventName, ...args);
    }

    return false;
  };
}

export default PageProvider;
