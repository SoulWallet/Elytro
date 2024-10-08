import { DEFAULT_DERIVE_PATH } from '@/constants/temp';
import { SubscribableStore } from '@/utils/SubscribableStore';
import { Vault } from '@soulwallet/keyvault';

// const SDK_KEYRING_STORAGE_KEY = 'elytroSdkKeyringState';

type SdkKeyringServiceState = {
  vault: Vault;
  locked: boolean;
  signer: string;
};

// TODO: 搞清 EOA 的返回格式后，切换为KeyringService
class SdkKeyringService {
  private _initialized = false;
  private _vault: Nullable<Vault> = null;
  private _locked = true;
  private _signer: Nullable<string> = null;
  private _store: Nullable<SubscribableStore<SdkKeyringServiceState>> = null;

  constructor() {
    this.initialize();
  }

  get initialized() {
    return this._initialized;
  }

  get vault() {
    if (!this._vault) {
      this._createVault();
    }
    return this._vault!;
  }

  get signer() {
    return this._signer;
  }

  private _createVault() {
    // todo: real vault tag
    this._vault = new Vault('test-vault-tag');
  }

  public async getSigner() {
    if (this._locked) {
      throw new Error('Elytro: Vault is locked.');
    }

    this._updateSignerFromVault(this.vault);
  }

  private async _updateSignerFromVault(vault: Vault) {
    // TODO: confirm what is DEFAULT_DERIVE_PATH and make it local
    const eoa = await vault.getSigner(DEFAULT_DERIVE_PATH);

    if (eoa.isErr()) {
      this._signer = null;
      throw eoa.ERR;
    } else {
      const EOASigner = eoa.OK;
      this._signer = EOASigner;
    }
  }

  public initialize = async () => {
    this._locked = false;
    // todo: allow config vault tag
    this._createVault();
    this._initialized = true;
  };

  public async createNewVault(password: string) {
    const initRes = await this.vault.init(password);

    if (initRes.isErr()) {
      throw initRes.ERR;
    } else {
      this._initialized = true;
      this._updateSignerFromVault(this.vault);
    }
  }

  public async unlock(password: string) {
    const res = await this.vault.unlock(password);

    if (res?.isErr()) {
      throw res.ERR;
    } else {
      this._locked = false;
      this._updateSignerFromVault(this.vault);
    }
  }

  public async lock() {
    await this.vault.lock();
    this._locked = true;
    this._signer = null;
  }

  public restore() {
    // todo: how to implement a working keyring with sdk.vault??
  }
}

export default new SdkKeyringService();
