import {
  UserOperationHistory,
  UserOperationStatusEn,
} from '@/constants/operations';
import { elytroSDK } from '../sdk';
import eventBus from '@/utils/eventBus';

// // TODO: check if these fields are enough
// type HistoryItemData = {
//   amount: string;
//   from: string;
//   to: string;
// };

const FETCH_INTERVAL = 2000;

class HistoryItem {
  private _data: UserOperationHistory;
  private _watcher: ReturnType<typeof setInterval> | null = null;
  private _status: UserOperationStatusEn = UserOperationStatusEn.pending;
  private _fetching: boolean = false;

  constructor(data: UserOperationHistory) {
    this._status = data?.status || UserOperationStatusEn.pending;
    this._data = {
      ...data,
    };
    this.fetchStatus();
    this._initWatcher();
  }

  get data() {
    return {
      ...this._data,
      status: this._status,
    };
  }

  get opHash() {
    return this._data.opHash;
  }

  get status() {
    return this._status;
  }

  private _updateStatus(status: UserOperationStatusEn) {
    if (this._status === status) {
      return;
    }
    this._status = status;
    this._broadcastToUI();
  }

  private _broadcastToUI() {
    // todo: test broadcast to ui
    console.log('elytro test broadcast to ui', this._data.opHash, this.status);
    eventBus.emit('historyItemStatusUpdated', this._data.opHash, this.status);
  }

  private _initWatcher() {
    if (this.status !== UserOperationStatusEn.pending) {
      if (this._watcher) {
        clearInterval(this._watcher);
        this._watcher = null;
      }
      return;
    }

    if (!this._watcher) {
      this._watcher = setInterval(() => this.fetchStatus(), FETCH_INTERVAL);
    }
  }

  async fetchStatus() {
    if (this._fetching) {
      return;
    }
    try {
      this._fetching = true;
      const opStatus = await elytroSDK.getUserOperationReceipt(
        this._data.opHash
      );
      this._updateStatus(opStatus);
    } catch (error) {
      console.error(error);
    } finally {
      this._fetching = false;
    }
  }
}

export default HistoryItem;
