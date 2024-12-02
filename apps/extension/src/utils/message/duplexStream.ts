/**
 * Elytro Message
 * Background <-> Content-script <-> UI
 */
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { ethErrors } from 'eth-rpc-errors';
import { SafeEventEmitter } from '../safeEventEmitter';

export enum ElytroMessageTypeEn {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  REQUEST_FROM_PAGE_PROVIDER = 'requestFromPageProvider',
  RESPONSE_TO_PAGE_PROVIDER = 'responseToPageProvider',
  MESSAGE = 'event_message',
}

type ElytroMessageData =
  | {
      type: ElytroMessageTypeEn.CONNECT | ElytroMessageTypeEn.DISCONNECT;
    }
  | {
      type: ElytroMessageTypeEn.RESPONSE_TO_PAGE_PROVIDER;
      uuid: string;
      payload: {
        method: ProviderMethodType;
        response: unknown;
      };
    }
  | {
      type: ElytroMessageTypeEn.REQUEST_FROM_PAGE_PROVIDER;
      uuid: string;
      payload: RequestArguments;
    }
  | {
      type: ElytroMessageTypeEn.MESSAGE;
      payload: ElytroEventMessage;
    };

type ElytroMessageHandler = (payload: SafeAny) => unknown;

class ElytroDuplexMessage extends SafeEventEmitter {
  private _stream: WindowPostMessageStream;
  private _isConnected: boolean = false;

  // request handlers (Multiple, used by pageProvider's request method)
  private _requestHandlers: Map<string, ElytroMessageHandler> = new Map();

  // response handler (Only one, used by content-script)
  private _responseHandler:
    | ((response: { payload: RequestArguments; uuid: string }) => void)
    | null = null;

  constructor(name: string, target: string) {
    super();
    this._stream = new WindowPostMessageStream({
      name,
      target,
    });

    this._initialize();

    return this;
  }

  public get isConnected() {
    return this._isConnected;
  }

  private _initialize() {
    this._stream.on('data', (data: ElytroMessageData) => {
      switch (data.type) {
        case ElytroMessageTypeEn.CONNECT:
          this.connect();
          break;
        case ElytroMessageTypeEn.DISCONNECT:
          this.disconnect();
          break;
        case ElytroMessageTypeEn.REQUEST_FROM_PAGE_PROVIDER:
          // todo:  we don't need to handle the request here.
          // this._handleRequest(data.payload);//
          this._responseHandler?.({
            uuid: data.uuid,
            payload: data.payload,
          });
          break;
        case ElytroMessageTypeEn.RESPONSE_TO_PAGE_PROVIDER:
          this._handleResponse(data.uuid, data.payload);
          break;
        case ElytroMessageTypeEn.MESSAGE:
          this.emit('event_message', data.payload);
          break;
        default:
          throw ethErrors.rpc.internal();
      }
    });
  }

  private _handleResponse(uuid: string, response: unknown) {
    if (this._isConnected) {
      const handler = this._requestHandlers.get(uuid);
      if (handler) {
        handler(response);
        this._requestHandlers.delete(uuid);
      } else {
        throw ethErrors.rpc.limitExceeded();
      }
    }
  }

  // todo: i think connect and disconnect should be handled by the stream. We don't need to manage the connection state here.
  public connect() {
    if (!this._isConnected) {
      this._isConnected = true;
      this.send({ type: ElytroMessageTypeEn.CONNECT });
    }
  }
  public disconnect() {
    if (this._isConnected) {
      this._isConnected = false;
      this.send({ type: ElytroMessageTypeEn.DISCONNECT });
    }
  }

  public send(data: ElytroMessageData) {
    this._stream.write(data);
  }

  public onceMessage(uuid: string, handler: ElytroMessageHandler) {
    if (this._isConnected) {
      this._requestHandlers.set(uuid, handler);
    } else {
      throw ethErrors.rpc.internal();
    }
  }

  public listen(
    responseHandler: (response: {
      payload: RequestArguments;
      uuid: string;
    }) => void
  ) {
    this._responseHandler = responseHandler;
  }

  public dispose() {
    this._stream.destroy();
    this._requestHandlers.clear();
    this._responseHandler = null;
  }
}

export { ElytroDuplexMessage };
