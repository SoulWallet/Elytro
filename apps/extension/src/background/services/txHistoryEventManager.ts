import {
  ADD_TX,
  ElytroTxHistoryEventData,
  TX_HISTORY_UPDATE_EVENT,
} from './txHistory';

export class ElytroTxHistoryEventManager {
  emitAddTxHistory(data: ElytroTxHistoryEventData) {
    chrome.runtime.sendMessage({ type: ADD_TX, data });
  }
  subscribTxHistory(handler: (data: string) => void) {
    chrome.runtime.onMessage.addListener(({ type, data }) => {
      if (type === TX_HISTORY_UPDATE_EVENT) {
        handler(data);
      }
    });
  }
  broadcast(data: string) {
    chrome.runtime.sendMessage({ type: TX_HISTORY_UPDATE_EVENT, data });
  }
}
