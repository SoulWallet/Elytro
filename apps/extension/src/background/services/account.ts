import { localStorage } from '@/utils/storage/local';
import { SubscribableStore } from '@/utils/store/subscribableStore';
import { elytroSDK } from './sdk';

type TAccountsState = {
  accounts: TAccountInfo[];
  currentAccount: TAccountInfo | null;
};

const ACCOUNTS_STORAGE_KEY = 'elytroAccounts';

class AccountManager {
  private _store: SubscribableStore<TAccountsState>;

  constructor() {
    this._store = new SubscribableStore({
      accounts: [],
      currentAccount: null,
    } as TAccountsState);

    this._store.subscribe((state) => {
      localStorage.save({ [ACCOUNTS_STORAGE_KEY]: JSON.stringify(state) });
    });

    this.restoreAccounts();
  }

  private get _accounts() {
    return this._store.state.accounts;
  }

  private set _accounts(accounts: TAccountInfo[]) {
    this._store.setState({ accounts });
  }

  private get _currentAccount() {
    return this._store.state.currentAccount;
  }

  private set _currentAccount(currentAccount: TAccountInfo | null) {
    this._store.setState({ currentAccount });
  }

  // TODO: maybe make _accounts public?
  get accounts() {
    return this._accounts;
  }

  get currentAccount() {
    return this._currentAccount;
  }

  public async restoreAccounts() {
    const { [ACCOUNTS_STORAGE_KEY]: prevState } = await localStorage.get([
      ACCOUNTS_STORAGE_KEY,
    ]);

    if (prevState) {
      const parsedState = JSON.parse(prevState as string);
      if (!parsedState.currentAccount) {
        parsedState.currentAccount = parsedState.accounts?.[0] ?? null;
      }

      this._store.setState(parsedState);
    }
  }

  public getAccountByChainId(chainId: number | string) {
    return this._accounts.find(
      (account) => account.chainId === Number(chainId)
    );
  }

  public async createAccountAsCurrent(eoaAddress: string, chainId: number) {
    const account = this.getAccountByChainId(chainId);

    if (account) {
      console.log(
        'Elytro::AccountManager::createAccount: account already exists'
      );
      // return account;
      return;
    }

    try {
      // creating address is not a sdk chain related request, so we don't rely on switch chain
      const newAccountAddress = await elytroSDK.createWalletAddress(
        eoaAddress,
        chainId
      );

      const newAccount = {
        address: newAccountAddress,
        chainId,
        isDeployed: false,
      };

      // ! push method will not trigger state update, so we need to reset the array
      this._accounts = [...this._accounts, newAccount];
      this._currentAccount = newAccount;
    } catch (error) {
      console.error(error);
    }
  }

  public async switchAccountByChainId(chainId: number) {
    const account = this.getAccountByChainId(chainId);

    if (!account) {
      throw new Error(
        'Elytro::AccountManager::switchAccountByChainId: account not found'
      );
    }

    this._currentAccount = account;
  }

  public activateCurrentAccount() {
    if (!this._currentAccount) {
      throw new Error(
        'Elytro::AccountManager::activateCurrentAccount: current account not found'
      );
    }

    const updatedAccount = {
      ...this._currentAccount,
      isDeployed: true,
    };

    this._accounts = this._accounts.map((account) =>
      account.address === updatedAccount.address ? updatedAccount : account
    );

    this._currentAccount = updatedAccount;
  }

  public async resetAccounts() {
    this._store.setState({
      accounts: [],
      currentAccount: null,
    });
  }

  public async removeAccountByAddress(address: string) {
    this._accounts = this._accounts.filter(
      (account) => account.address !== address
    );
  }
}

const accountManager = new AccountManager();
export default accountManager;
