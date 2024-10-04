import { EventEmitter } from 'events';
import { ethErrors } from 'eth-rpc-errors';
import ElytroDuplexMessage, { ElytroMessageTypeEn } from '@/utils/message';

/**
 * Elytro Page Provider: injects Elytro into the page
 */
class PageProvider extends EventEmitter {
  static defaultMaxListeners = 100; // original is 10, very easy to exceed

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

    try {
      //! todo: init message channel between page and background
      // document.addEventListener('visibilitychange', this._checkDomVisibility);
      // todo: get connect site info?
      // todo: init chain & accounts from builtin provider
      this.emit('connected');
    } catch {
      //
    }
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
      this._message.once(data.method, (response) => {
        console.log(
          'Elytro: page provider got response',
          data.method,
          response
        );
        resolve(response);
      });
    });
  };

  on = (event: string | symbol, handler: (...args: unknown[]) => void) => {
    return super.on(event, handler);
  };
}

export default PageProvider;
