type MessageHandler = (message: SafeAny, port: chrome.runtime.Port) => void;

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

    port.onDisconnect.addListener(() => {
      this.ports.delete(port.sender?.id || 'default');
    });
  }

  // public listen(onConnect: (port: chrome.runtime.Port) => void) {
  //   chrome.runtime.onConnect.addListener((port) => {
  //     if (port.name === this.name) {
  //       this._setupPort(port);
  //       onConnect(port);
  //     }
  //   });
  // }

  // @ts-ignore
  public sendMessage(type: string, data: SafeAny, portId: string = 'default') {
    const port = this.ports.get(portId);
    if (port) {
      port.postMessage({ type, data });
    } else {
      console.error(`No port found for ID: ${portId}`);
    }
  }

  public onMessage(type: string, handler: MessageHandler) {
    this.messageHandlers.set(type, handler);
  }
}
