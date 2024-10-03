/**
 * Elytro Message
 * Background <-> Content-script <-> UI
 */
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { SafeEventEmitter } from '../safeEventEmitter';

export enum ElytroMessageType {
  Request = 'REQUEST',
  Response = 'RESPONSE',
}

export type ElytroMessageRequest = {
  type: ElytroMessageType.Request;
  payload: unknown;
};

export type ElytroMessageResponse = {
  type: ElytroMessageType.Response;
  payload: unknown;
};

class ElytroMessage extends SafeEventEmitter {
  private _stream: WindowPostMessageStream;

  constructor(name: string, target: string) {
    super();
    this._stream = new WindowPostMessageStream({
      name,
      target,
    });

    return this;
  }

  public initialize() {
    this._stream.on('data', (data) => {
      console.log('message data', data);
    });
  }

  public send(payload: unknown) {
    this._stream.write({
      type: ElytroMessageType.Request,
      payload,
    });
  }

  public receive(handler: (payload: unknown) => void) {
    this._stream.on('data', handler);
  }
}

export default ElytroMessage;
