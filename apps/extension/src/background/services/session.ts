import { PortMessageManager } from '@/utils/message/portMessageManager';

class DAppSession {
  constructor(
    private _tabId: number,
    private _dAppOrigin: string,
    private _portMsgManager: PortMessageManager
  ) {}

  get tabId() {
    return this._tabId;
  }

  get dAppOrigin() {
    return this._dAppOrigin;
  }

  sendMessage(event: string, data: unknown) {
    this._portMsgManager.sendMessage(event, data);
  }
}

class SessionManager {
  private _sessions: Map<string, DAppSession> = new Map();

  public createSession(
    tabId: number,
    dAppOrigin: string,
    portMsgManager: PortMessageManager
  ) {
    const key = `${tabId}-${dAppOrigin}`;
    const session = this._sessions.get(key);

    if (session) {
      return session;
    }

    const newSession = new DAppSession(tabId, dAppOrigin, portMsgManager);
    this._sessions.set(key, newSession);

    return newSession;
  }

  public removeSession(tabId: number, dAppOrigin: string) {
    this._sessions.delete(`${tabId}-${dAppOrigin}`);
  }

  public removeSessionByTabId(tabId: number) {
    this._sessions.forEach((_, key) => {
      if (key.startsWith(`${tabId}-`)) {
        this._sessions.delete(key);
      }
    });
  }

  public getSessionsByTabId(tabId: number) {
    return Array.from(this._sessions.values()).filter(
      (session) => session.tabId === tabId
    );
  }

  private _broadcastMessage(
    session: DAppSession,
    event: ElytroEventMessage['event'],
    data: ElytroEventMessage['data']
  ) {
    session.sendMessage('message', { event, data });
  }

  public broadcastMessage(
    event: ElytroEventMessage['event'],
    data: ElytroEventMessage['data']
  ) {
    this._sessions.forEach((session) => {
      this._broadcastMessage(session, event, data);
    });
  }

  public broadcastMessageToTab(
    tabId: number,
    event: ElytroEventMessage['event'],
    data: ElytroEventMessage['data']
  ) {
    this.getSessionsByTabId(tabId).forEach((session) => {
      this._broadcastMessage(session, event, data);
    });
  }

  public broadcastMessageToDApp(
    dAppOrigin: string,
    event: ElytroEventMessage['event'],
    data: ElytroEventMessage['data']
  ) {
    this._sessions.forEach((session) => {
      if (session.dAppOrigin === dAppOrigin) {
        this._broadcastMessage(session, event, data);
      }
    });
  }
}

const sessionManager = new SessionManager();

export default sessionManager;
