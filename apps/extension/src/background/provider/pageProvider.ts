import { ethErrors } from 'eth-rpc-errors';
import { ElytroDuplexMessage, ElytroMessageTypeEn } from '@/utils/message';
import { SafeEventEmitter } from '@/utils/safeEventEmitter';

/**
 * Elytro Page Provider: injects Elytro into the page
 */
class PageProvider extends SafeEventEmitter {
  static defaultMaxListeners = 100; // original is 10, very easy to exceed
  private _currentAddress: string | null = null;
  private _currentChainId: number | null = null;

  private _isDomVisible: boolean = false;
  private _isDomReady: boolean = false;
  private _message = new ElytroDuplexMessage(
    'elytro-page-provider',
    'elytro-content-script'
  );

  constructor() {
    super();
    this.initialize();
  }

  private _checkReady() {
    if (this._isDomReady && this._isDomVisible) {
      return true;
    }

    if (document.readyState === 'complete') {
      this._isDomReady = true;
    } else {
      const domContentLoadedHandler = () => {
        this._isDomReady = true;
        document.removeEventListener(
          'DOMContentLoaded',
          domContentLoadedHandler
        );
      };
      document.addEventListener('DOMContentLoaded', domContentLoadedHandler);
    }

    this._isDomVisible = document.visibilityState === 'visible';

    const visibilityChangeHandler = () => {
      this._isDomVisible = document.visibilityState === 'visible';

      if (this._isDomVisible) {
        document.removeEventListener(
          'visibilitychange',
          visibilityChangeHandler
        );
      }
    };
    document.addEventListener('visibilitychange', visibilityChangeHandler);

    return this._isDomReady && this._isDomVisible;
  }

  initialize = async () => {
    this._message.connect();

    this._message.addListener('message', (payload) => {
      this.emit(payload.event, payload.data);
    });

    // try {
    //   // document.addEventListener('visibilitychange', this._checkDomVisibility);
    //   // todo: get connect site info?
    //   // todo: init chain & accounts from builtin provider
    //   // this.emit('connected');
    // } catch {
    //   //
    // }
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

    if (this._checkReady()) {
      // post message to background, let the builtin provider handle it

      this._message.send({
        type: ElytroMessageTypeEn.REQUEST_FROM_PAGE_PROVIDER,
        payload: data,
      });
    }

    return new Promise((resolve) => {
      this._message.onceMessage(data.method, (response) => {
        resolve(response);
      });
    });
  };

  // TODO: listen dapp's 'connected' event
  on = (event: string | symbol, handler: (...args: unknown[]) => void) => {
    return super.on(event, handler);
  };

  // @ts-ignore
  emit = (eventName: string | symbol, ...args: any[]) => {
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
