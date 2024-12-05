export type MessageHandler = (
  message: SafeAny,
  port: chrome.runtime.Port
) => void;

export class PortMessageManager {
  private ports: Map<string, chrome.runtime.Port> = new Map();
  private messageHandlers: Map<string, MessageHandler> = new Map();

  constructor(private name: string) {}

  public connect(
    port: chrome.runtime.Port = chrome.runtime.connect({ name: this.name })
  ) {
    this._setupPort(port);
    return port;
  }

  private _setupPort(port: chrome.runtime.Port) {
    this.ports.set(port.sender?.id || 'default', port);

    port.onMessage.addListener(({ type, data }) => {
      const handler = this.messageHandlers.get(type);
      if (handler) {
        handler(data, port);
      }
    });

    port.postMessage({
      type: 'NEW_PAGE_LOADED',
      data: '{}', // !DO NOT REMOVE THIS LINE, a workaround for crx message channel
    });
  }

  // @ts-ignore
  public sendMessage(type: string, data: SafeAny, portId: string = 'default') {
    const port = this.ports.get(portId) ?? this.ports.values().next().value;

    if (port) {
      port.postMessage({ type, data });
    } else {
      console.error(`No port found for ID: ${portId}`);
    }
  }

  public onMessage(type: string, handler: MessageHandler) {
    this.messageHandlers.set(type, handler);
  }

  public dispose() {
    this.ports.forEach((port) => {
      port.disconnect();
    });

    this.messageHandlers.clear();
    this.ports.clear();
  }
}
