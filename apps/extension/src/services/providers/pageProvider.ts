import { EventEmitter } from 'events';
import { ethErrors } from 'eth-rpc-errors';
import ElytroMessage from '@/utils/message';

/**
 * Elytro Page Provider: injects Elytro into the page
 */
class PageProvider extends EventEmitter {
  private _initialized: boolean = false;
  private _isDomVisible: boolean = false;
  private _isDomReady: boolean = false;
  private _message: ElytroMessage = new ElytroMessage(
    'elytro-page-provider',
    'elytro-content-script'
  );

  constructor() {
    super();
    this.setMaxListeners(100); // default is 10, very easy to exceed
    this.initialize();
  }

  get isInitialized() {
    return this._initialized;
  }

  private _checkReady() {
    if (document.readyState === 'loading') {
      const domContentLoadedHandler = () => {
        this._isDomReady = true;
        document.removeEventListener(
          'DOMContentLoaded',
          domContentLoadedHandler
        );
      };
      document.addEventListener('DOMContentLoaded', domContentLoadedHandler);
    } else {
      this._isDomReady = true;
    }

    return this._isDomVisible && this._isDomReady;
  }

  private _checkDomVisibility = () => {
    this._isDomVisible = document.visibilityState === 'visible';
  };

  initialize = async () => {
    this._message.receive((data) => {
      console.log('receive', data);
    });
    try {
      //! todo: init message channel between page and background
      document.addEventListener('visibilitychange', this._checkDomVisibility);
      // todo: get connect site info?
      // todo: init chain & accounts from builtin provider
      this.emit('connected');
    } catch {
      //
    } finally {
      this._initialized = true;
      // this.emit('_initialized');
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
      this._message.send(data);
    }
  };

  on = (event: string | symbol, handler: (...args: unknown[]) => void) => {
    return super.on(event, handler);
  };
}

export default PageProvider;
