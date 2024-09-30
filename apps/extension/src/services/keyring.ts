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
    this.initialize();
  }

  public initialize = async () => {
    this._store = new SubscribableStore({} as KeyringServiceState);
    this._store.subscribe((state) => {
      localStorage.save(KEYRING_STORAGE_KEY, state);
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

  public restore() {
    if (!this._initialized) {
      // throw new Error('Keyring not initialized');
      this.initialize();
    }

    localStorage.get(KEYRING_STORAGE_KEY).then((state) => {
      if (state) {
        this._store!.setState(state);
      }
    });
  }

  public async setPassword(password: string) {
    if (this._owner) {
      const encryptedLocked = await encrypt(password, 'unlock');
      this._store?.setState({
        encryptedLocked,
      });
    } else {
      throw new Error('Cannot set password if owner is already set');
    }
    this._password = password;
  }

  public async lock() {
    if (!this._owner) {
      throw new Error('Cannot lock if owner is not set');
    }
    this._owner = null;
    this._password = null;
    this._locked = true;
    this._key = null;
  }

  public async unlock(password: string) {
    this._verifyPassword(password);
    this._locked = false;
  }

  private _updateOwnerByKey(key: Hex) {
    this._key = key;
    this._owner = privateKeyToAccount(this._key);
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

  private async _persistOwner() {
    if (this._key) {
      const encryptedKey = await encrypt(this._password!, this._key);
      this._store?.setState({
        encryptedKey,
      });
    }
  }

  private async _verifyPassword(password: string) {
    const { encryptedLocked, encryptedKey } = this._store?.state ?? {};

    if (!encryptedLocked || !encryptedKey) {
      throw new Error('Cannot verify password if there is no previous owner');
    }

    await decrypt(password, encryptedLocked);
    const key = await decrypt(password, encryptedKey);
    this._updateOwnerByKey(key as Hex);

    this._password = password;
  }
}

export default new KeyringService();
