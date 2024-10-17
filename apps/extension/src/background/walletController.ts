import keyring from './services/keyring';
import walletClient from './services/walletClient';

// ! DO NOT use getter. They can not be proxied.
class WalletController {
  constructor() {
    // walletClient.init();
  }

  public async createNewOwner(password: string) {
    return await keyring.createNewOwner(password);
  }

  /**
   * Get Keyring is Locked or not
   */
  public async getLockStatus() {
    await keyring.tryUnlock();
    return keyring.locked;
  }

  /**
   * Get Smart Account Owner Address
   */
  public async getOwnerAddress() {
    return keyring.owner?.address;
  }

  /**
   * Get Smart Account Info
   */
  public async getSmartAccountInfo() {
    return await walletClient.initSmartAccount();
  }

  public async lock() {
    return await keyring.lock();
  }

  public async unlock(password: string) {
    return await keyring.unlock(password);
  }
}

export const walletController = new WalletController();
export { WalletController };
