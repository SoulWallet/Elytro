import { elytroSDK } from './sdk';
import { localStorage } from '@/utils/storage/local';
import { Method } from '@soulwallet/decoder';
import { formatEther, Hex, Transaction } from 'viem';
import { ElytroTxHistoryEventManager } from './txHistoryEventManager';
export const TX_HISTORY_UPDATE_EVENT = 'txHistoryUpdate';
export const TX_HISTORY_STORAGE_KEY = 'elytroTxHistoryState';
export const ADD_TX = 'addTx';

export type ElytroTxHistoryEventData = {
  hash: Hex;
  from: string;
  to: string;
  method?: Method;
  value: string;
};

export class TxHistoryManager {
  private _store: TxHistory[] = [];
  private _initialized = false;
  txHistoryEventManager: ElytroTxHistoryEventManager;
  constructor(txHistoryEventManager: ElytroTxHistoryEventManager) {
    this.txHistoryEventManager = txHistoryEventManager;
    this._initialize();
  }
  private async _initialize() {
    // remove when is ready
    // await localStorage.remove([TX_HISTORY_STORAGE_KEY]);

    if (this._initialized) {
      return;
    }
    const localStorageData = await localStorage.get([TX_HISTORY_STORAGE_KEY]);
    if (localStorageData) {
      this._store =
        (localStorageData[TX_HISTORY_STORAGE_KEY] as TxHistory[]) || [];
    }
    this._initialized = true;
    this.broadcast();
  }
  saveInLocalStorage() {
    localStorage.save({ [TX_HISTORY_STORAGE_KEY]: this._store });
  }
  addHistory(historyDetail: ElytroTxHistoryEventData) {
    const history = new TxHistory(historyDetail);
    const existed = this._store.find((his) => his.id === history.id);
    if (!existed) {
      this._store.push(history);
    }
    this.broadcast();
    this.saveInLocalStorage();
  }
  updateHistory(history: TxHistory) {
    this._store = this._store.map((his) => {
      if (his.id === history.id) {
        return history;
      }
      return his;
    });
    this.broadcast();
    this.saveInLocalStorage();
  }
  broadcast() {
    this.txHistoryEventManager.broadcast(JSON.stringify(this._store));
  }
}

export enum HistoryStatus {
  PENDING = 'pending',
  DONE = 'done',
  SUCCESS = 'success',
}

export class TxHistory {
  status: HistoryStatus = HistoryStatus.PENDING;
  id: string;
  timestamp: string | number;
  txDetail: (Partial<Omit<Transaction, 'value'>> & { value?: string }) | null =
    null;
  historyDetail: ElytroTxHistoryEventData | null = null;
  constructor(historyDetail: ElytroTxHistoryEventData) {
    this.id = historyDetail.hash;
    this.timestamp = new Date().getTime();
    this._waitForUserOpTxHash();
    this.historyDetail = historyDetail;
  }
  private async _waitForUserOpTxHash() {
    const tx = await elytroSDK.waitForUserOperationTransaction({
      hash: this.id,
    });

    if (tx) {
      const txDetail = {
        hash: tx.hash,
        to: tx.to,
        from: tx.from,
        value: formatEther(tx.value),
        nonce: tx.nonce,
        blockHash: tx.blockHash,
      };
      this.txDetail = txDetail;
      this.status = HistoryStatus.SUCCESS;
    } else {
      this.status = HistoryStatus.DONE;
    }
    txHistoryManager.updateHistory(this);
  }
}

export const elytroTxHistoryEventManager = new ElytroTxHistoryEventManager();
const txHistoryManager = new TxHistoryManager(elytroTxHistoryEventManager);
export default txHistoryManager;
