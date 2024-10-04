/**
 * Elytro Message
 * Background <-> Content-script <-> UI
 */
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { ethErrors } from 'eth-rpc-errors';

enum ElytroMessageTypeEn {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  REQUEST_FROM_PAGE_PROVIDER = 'requestFromPageProvider',
  RESPONSE_TO_PAGE_PROVIDER = 'responseToPageProvider',
}

type ElytroMessageData =
  | {
      type: ElytroMessageTypeEn.CONNECT | ElytroMessageTypeEn.DISCONNECT;
    }
  | {
      type: ElytroMessageTypeEn.RESPONSE_TO_PAGE_PROVIDER;
      payload: {
        method: ProviderMethodType;
        response: unknown;
      };
    }
  | {
      type: ElytroMessageTypeEn.REQUEST_FROM_PAGE_PROVIDER;
      payload: RequestArguments;
    };

type ElytroMessageHandler = (payload: unknown) => unknown;

class ElytroDuplexMessage {
  private _stream: WindowPostMessageStream;
  private _isConnected: boolean = false;

  // request handlers (Multiple, used by pageProvider's request method)
  private _requestHandlers: Map<ProviderMethodType, ElytroMessageHandler> =
    new Map();

  // response handler (Only one, used by content-script)
  private _responseHandler: ((data: RequestArguments) => void) | null = null;

  constructor(name: string, target: string) {
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
          this._responseHandler?.(data.payload);
          break;
        case ElytroMessageTypeEn.RESPONSE_TO_PAGE_PROVIDER:
          this._handleResponse(data.payload);
          break;
        default:
          throw ethErrors.rpc.internal();
      }
    });
  }

  private _handleResponse({
    method,
    response,
  }: {
    method: ProviderMethodType;
    response: unknown;
  }) {
    if (this._isConnected) {
      const handler = this._requestHandlers.get(method);
      if (handler) {
        this._requestHandlers.delete(method);
        return handler(response);
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

  public once(type: ProviderMethodType, handler: ElytroMessageHandler) {
    if (this._isConnected) {
      const prev = this._requestHandlers.get(type);

      if (prev) {
        throw ethErrors.rpc.limitExceeded();
      }

      this._requestHandlers.set(type, handler);
    } else {
      throw ethErrors.rpc.internal();
    }
  }

  public listen(responseHandler: (data: RequestArguments) => void) {
    this._responseHandler = responseHandler;
  }
}

export default ElytroDuplexMessage;
