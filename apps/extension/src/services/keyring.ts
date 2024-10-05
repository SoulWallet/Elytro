import { decrypt, encrypt } from '@/utils/passworder';
import { localStorage } from '@/utils/storage/local';
import { SubscribableStore } from '@/utils/SubscribableStore';
import { Hex } from 'viem';
import {
  PrivateKeyAccount,
  generatePrivateKey,
  privateKeyToAccount,
} from 'viem/accounts';

type KeyringServiceState = {
  encryptedKey?: string;
  encryptedLocked?: string;
};

const KEYRING_STORAGE_KEY = 'elytroKeyringState';

class KeyringService {
  private _initialized = false;
  private _locked = true;
  private _key: Nullable<Hex> = null;
  private _owner: Nullable<PrivateKeyAccount> = null;
  private _password: Nullable<string> = null;

  private _store: Nullable<SubscribableStore<KeyringServiceState>> = null;

  constructor() {
    console.log('!!!keyring constructor', new Date());
    this.restore();
  }

  public initialize = async () => {
    this._store = new SubscribableStore({} as KeyringServiceState);
    this._store.subscribe((state) => {
      localStorage.save({ [KEYRING_STORAGE_KEY]: state });
    });

    this._initialized = true;
  };

  public get initialized() {
    return this._initialized;
  }

  public get locked() {
    return this._locked;
  }

  public get owner() {
    return this._owner;
  }

  public async restore() {
    if (!this._initialized) {
      // throw new Error('Keyring not initialized');
      this.initialize();
    }

    const { [KEYRING_STORAGE_KEY]: prevState } = await localStorage.get([
      KEYRING_STORAGE_KEY,
    ]);
    if (prevState) {
      this._store!.setState(prevState as KeyringServiceState);
    }

    await this._verifyPassword();
  }

  public async setPassword(password: string) {
    if (this._owner) {
      const encryptedLocked = await encrypt('unlock', password);
      this._store?.setState({
        encryptedLocked,
      });
    } else {
      throw new Error('Cannot set password if owner is already set');
      // or this.createNewOwner(password);
    }
    this._password = password;
    this._locked = false;
  }

  public async lock() {
    if (!this._owner) {
      throw new Error('Cannot lock if owner is not set');
    }
    this._owner = null;
    this._password = null;
    this._locked = true;
    this._key = null;
    this._store?.setState({});
  }

  public async createNewOwner(password: string) {
    if (this._owner) {
      throw new Error('Cannot create new owner if owner is already set');
    }

    this._updateOwnerByKey(generatePrivateKey());
    await this.setPassword(password);
    await this._persistOwner();

    return this._owner;
  }

  public async unlock(password: string) {
    if (!password) {
      throw new Error('Password is required');
    }
    await this._verifyPassword(password);
    this._password = password;
    // TODO: calc will throw error, need to fix.
    // await walletClient.calcWalletAddress();
  }

  private _updateOwnerByKey(key: Hex) {
    this._key = key;
    this._owner = privateKeyToAccount(this._key);
  }

  private async _persistOwner() {
    if (this._key) {
      const encryptedKey = await encrypt(this._key, this._password!);
      this._store?.setState({
        encryptedKey,
      });
    }
  }

  private async _verifyPassword(password?: string) {
    const { encryptedLocked, encryptedKey } = this._store?.state ?? {};

    if (!encryptedLocked || !encryptedKey) {
      throw new Error('Cannot verify password if there is no previous owner');
    }

    // await decrypt(encryptedLocked, password);
    const key = await decrypt(encryptedKey, password);
    this._updateOwnerByKey(key as Hex);
    this._locked = false;
  }

  public async reset() {
    this._store?.setState({});
    this._owner = null;
    this._password = null;
    this._locked = true;
    this._key = null;
  }

  public tryUnlock(onSuccess: () => void) {
    this._verifyPassword().then(onSuccess);
  }
}

const keyring = new KeyringService();
export default keyring;
