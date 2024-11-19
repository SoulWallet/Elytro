import { SubscribableStore } from '@/utils/store/subscribableStore';
import HistoryItem from './historyItem';
import UniqueQueue from '@/utils/UniqueQueue';
import { UserOperationHistory } from '@/constants/operations';
import { localStorage } from '@/utils/storage/local';
import eventBus from '@/utils/eventBus';

const HISTORY_STORAGE_KEY = 'elytroHistory';

type TxHistoryState = {
  [key: string]: UserOperationHistory;
};

class HistoryManager {
  private _historyQueue: UniqueQueue<HistoryItem>;
  private _store: SubscribableStore<TxHistoryState>;

  constructor() {
    this._historyQueue = new UniqueQueue<HistoryItem>();
    this._store = new SubscribableStore({} as TxHistoryState);
    this._initialize();
  }

  get histories() {
    return this._historyQueue.items;
  }

  private _initialize = async () => {
    // update local storage when _store changes
    this._store.subscribe((state) => {
      localStorage.save({ [HISTORY_STORAGE_KEY]: state });

      eventBus.emit('HISTORY_UPDATED');
    });

    const { [HISTORY_STORAGE_KEY]: prevState } = await localStorage.get([
      HISTORY_STORAGE_KEY,
    ]);

    // sync local storage with _store
    if (prevState) {
      this._store.setState(prevState as TxHistoryState);

      Object.entries(prevState as TxHistoryState).forEach(([_, data]) => {
        this._historyQueue.enqueue(new HistoryItem(data));
      });
    }
  };

  add(data: UserOperationHistory) {
    const newHistory = new HistoryItem(data);
    this._historyQueue.enqueue(newHistory);

    this._store.setState({
      ...this._store.state,
      [data.opHash]: newHistory.data,
    });
  }

  find(opHash: string) {
    return this._historyQueue.find((item) => item.opHash === opHash);
  }

  remove(opHash: string) {
    this._historyQueue.dequeueByFn((item) => item.opHash === opHash);
    this._store.setState({
      ...this._store.state,
      [opHash]: undefined,
    });
  }
}

const historyManager = new HistoryManager();

export default historyManager;
