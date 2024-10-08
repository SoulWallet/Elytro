import { SafeEventEmitter } from '../safeEventEmitter';

type RuntimeMessageData = {
  type: string;
  data: CallbackData;
};

type CallbackData = {
  type: string;
  data: unknown;
  origin: string;
};

type MessageListener = (callbackData: CallbackData) => void;

export class ElytroRuntimeMessage extends SafeEventEmitter {
  private _port: Nullable<chrome.runtime.Port> = null;
  private _origin: string;
  private _listener: Nullable<MessageListener> = null;

  constructor(originName: string, port?: chrome.runtime.Port) {
    super();
    this._origin = originName;
    this._port = port;
  }

  public connect(name?: string) {
    if (!this._port) {
      this._port = chrome.runtime.connect({ name });
    }

    this._port.onMessage.addListener(({ type, data }: RuntimeMessageData) => {
      if (!type || !data) {
        // not eth request, ignore
        return;
      }

      if (data.origin === this._origin) {
        // ignore message from self
        return;
      }

      if (this._listener) {
        this._listener({ type, data, origin: data.origin });
      }
    });
  }

  public sendMessage({ type, data }: RuntimeMessageData) {
    if (!this._port) return;

    try {
      this._port.postMessage({ type, data, origin: this._origin });
    } catch (e) {
      console.log('!!!Elytro: runtimeMessage sendMessage error', e);
      // do nothing.
    }
  }

  public listen(callback: MessageListener) {
    if (!this._port) {
      return;
    }

    this._listener = callback;
  }

  public disconnect() {
    this._port?.disconnect();
  }
}
