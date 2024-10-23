import { decrypt, encrypt } from '@/utils/passworder';
import { localStorage } from '@/utils/storage/local';
import { SubscribableStore } from '@/utils/store/subscribableStore';
import { Address, Hex } from 'viem';
import {
  PrivateKeyAccount,
  generatePrivateKey,
  privateKeyToAccount,
} from 'viem/accounts';
import { elytroSDK } from './sdk';
import { sessionStorage } from '@/utils/storage/session';

type EncryptedData = {
  key: Hex;
  sa: string;
};

type KeyringServiceState = {
  data: string;
};

const KEYRING_STORAGE_KEY = 'elytroKeyringState';

class KeyringService {
  private _initialized = false;
  private _locked = true;
  private _key: Nullable<Hex> = null;
  private _owner: Nullable<PrivateKeyAccount> = null;
  private _sa: Nullable<Address> = null;
  private _store!: SubscribableStore<KeyringServiceState>;

  constructor() {
    this._initialize();
  }

  private _initialize = async () => {
    this._store = new SubscribableStore({} as KeyringServiceState);
    this._store.subscribe((state) => {
      localStorage.save({ [KEYRING_STORAGE_KEY]: state });
    });

    const { [KEYRING_STORAGE_KEY]: prevState } = await localStorage.get([
      KEYRING_STORAGE_KEY,
    ]);
    if (prevState) {
      this._store.setState(prevState as KeyringServiceState);
    }

    await this._verifyPassword();

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

  public get smartAccountAddress() {
    return this._sa;
  }

  public async restore() {
    if (!this._initialized) {
      this._initialize();
    }

    const { [KEYRING_STORAGE_KEY]: prevState } = await localStorage.get([
      KEYRING_STORAGE_KEY,
    ]);
    if (prevState) {
      this._store.setState(prevState as KeyringServiceState);
    }

    await this._verifyPassword();
  }

  // public async setPassword(password: string) {
  //   if (this._key) {
  //     const encryptedLocked = await encrypt('unlock', password);
  //     this._store?.setState({
  //       encryptedLocked,
  //     });
  //   } else {
  //     throw new Error('Elytro: No need to set password if no owner.');
  //   }
  //   this._password = password;
  //   this._locked = false;
  // }

  public async lock() {
    if (!this._owner) {
      throw new Error('Cannot lock if owner is not set');
    }
    this._owner = null;
    this._locked = true;
    this._key = null;
    this._store?.setState({});
    this._sa = null;
    sessionStorage.clear();
  }

  public async createNewOwner(password: string) {
    if (this._owner) {
      throw new Error('Cannot create new owner if owner is already set');
    }

    try {
      this._key = generatePrivateKey();
      this._owner = privateKeyToAccount(this._key);
      this._sa = await elytroSDK.createWalletAddress(this._owner.address);

      const encryptedData = await encrypt(
        {
          key: this._key,
          sa: this._sa,
        },
        password
      );
      this._store.setState({
        data: encryptedData,
      });
      this._locked = false;
    } catch {
      this._locked = true;
      throw new Error('Elytro: Failed to create new owner');
    }
  }

  public async unlock(password: string) {
    if (!password) {
      throw new Error('Password is required');
    }
    await this._verifyPassword(password);

    return this._locked;
  }

  private async _updateOwnerByKey(key: Hex) {
    this._key = key;
    this._owner = privateKeyToAccount(this._key);
  }

  private async _verifyPassword(password?: string) {
    const { data } = this._store.state;

    if (!data) {
      this._locked = true;
      return;
      // throw new Error('Cannot verify password if there is no previous owner');
    }

    try {
      const { key, sa } = (await decrypt(data, password)) as EncryptedData;

      this._updateOwnerByKey(key as Hex);
      this._sa = sa as Address;
      this._locked = false;
    } catch (error) {
      console.log('Elytro: Failed to verify password.', error);
      this._locked = true;
    }
  }

  public async reset() {
    this._store?.setState({});
    this._owner = null;
    this._locked = true;
    this._key = null;
    this._sa = null;
  }

  public async tryUnlock(callback?: () => void) {
    if (!this._initialized) {
      await this._initialize();
    }

    if (this._locked) {
      await this._verifyPassword();
    }

    callback?.();
  }
}

const keyring = new KeyringService();
export default keyring;
