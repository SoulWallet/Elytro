import { DEFAULT_LOCAL_CHAINS, TChainConfigItem } from '@/constants/chains';
import { localStorage } from '@/utils/storage/local';
import { SubscribableStore } from '@/utils/store/subscribableStore';

type TChainsState = {
  chains: TChainConfigItem[];
  currentChain: TChainConfigItem | null;
};

const CHAINS_STORAGE_KEY = 'elytroChains';

class ChainService {
  private _store: SubscribableStore<TChainsState>;

  private get _chains() {
    return this._store.state.chains;
  }

  private set _chains(chains: TChainConfigItem[]) {
    this._store.setState({
      chains,
    });
  }

  private get _currentChain() {
    return this._store.state.currentChain;
  }

  private set _currentChain(currentChain: TChainConfigItem | null) {
    this._store.setState({
      currentChain,
    });
  }

  public get currentChain() {
    return this._currentChain;
  }

  public get chains() {
    return this._chains;
  }

  constructor() {
    this._store = new SubscribableStore({
      chains: [],
      currentChain: null,
    } as TChainsState);

    this._store.subscribe((state) => {
      localStorage.save({ [CHAINS_STORAGE_KEY]: JSON.stringify(state) });
    });

    this._loadStore();
  }

  private async _loadStore() {
    const { [CHAINS_STORAGE_KEY]: strState } = (await localStorage.get([
      CHAINS_STORAGE_KEY,
    ])) as { [CHAINS_STORAGE_KEY: string]: string };

    const parsedState = strState ? JSON.parse(strState) : {};

    if (!parsedState.chains?.length) {
      // default to local chains config if no previously set chains are found
      parsedState.chains = DEFAULT_LOCAL_CHAINS;
    }

    this._store.setState(parsedState);
  }

  public addChain(chain: TChainConfigItem) {
    if (this._chains.find((n) => n.chainId === chain.chainId)) {
      throw new Error('Elytro::ChainService::addChain: chain already exists');
    }

    this._chains = [...this._chains, chain];
  }

  private _findChainById(chainId: number) {
    const targetChain = this._chains.find((n) => n.chainId === chainId);

    if (!targetChain) {
      throw new Error('Elytro::ChainService::_findChainById: chain not found');
    }

    return targetChain;
  }

  public updateChain(chainId: number, config: Partial<TChainConfigItem>) {
    const targetChain = this._findChainById(chainId);
    const updatedChain = { ...targetChain, ...config };

    // ! reset the array reference to trigger a fully updated state
    this._chains = this._chains.map((n) =>
      n.chainId === chainId ? updatedChain : n
    );

    if (this._currentChain?.chainId === chainId) {
      this._currentChain = updatedChain;
    }
  }

  public switchChain(chainId: number) {
    if (this._currentChain?.chainId === chainId) {
      console.log('Elytro::ChainService::switchChains: no need to switch');
      return;
    }

    this._currentChain = this._findChainById(chainId);

    return this._currentChain;
  }

  public deleteChain(chainId: number) {
    if (this._currentChain?.chainId === chainId) {
      throw new Error(
        'Elytro::ChainService::deleteChains: cannot delete current chain'
      );
    }

    this._chains = this._chains.filter((n) => n.chainId !== chainId);
  }
}

const chainService = new ChainService();

export default chainService;
