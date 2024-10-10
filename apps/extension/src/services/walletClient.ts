import {
  DEFAULT_CHAIN_TYPE,
  SUPPORTED_CHAIN_MAP,
  SupportedChainTypeEn,
  TEMP_RPC_URL,
} from '@/constants/chains';
import {
  createWalletClient,
  http,
  publicActions,
  PublicClient,
  WalletClient,
} from 'viem';

import keyring from './keyring';
import { SignTypedDataParameters } from 'viem/accounts';
import { elytroSDK } from './sdk';

class ElytroWalletClient {
  private _address: Nullable<string> = null;
  private _isDeployed: boolean = false;
  private _chainType: SupportedChainTypeEn = DEFAULT_CHAIN_TYPE;

  private _client!: WalletClient & PublicClient;

  constructor() {
    this.init(this._chainType);
  }

  get chainType() {
    return this._chainType;
  }

  get chain() {
    return SUPPORTED_CHAIN_MAP[this._chainType];
  }

  // Elytro Wallet Address, not the eoa address
  get address() {
    return this._address;
  }

  get isActivated() {
    return this._isDeployed;
  }

  public async init(chainType: SupportedChainTypeEn) {
    if (chainType !== this._chainType) {
      this._chainType = chainType;

      this._client = createWalletClient({
        chain: SUPPORTED_CHAIN_MAP[this._chainType],
        transport: http(TEMP_RPC_URL),
      }).extend(publicActions);
    }
  }

  public async initSmartAccount() {
    await keyring.tryUnlock();

    if (keyring.smartAccountAddress) {
      this._address = keyring.smartAccountAddress;
      this._isDeployed = await elytroSDK.isSmartAccountDeployed(this._address);
    }
  }

  async setSocialRecoveryGuardian(walletAddress: string) {
    // TODO: implement recovery
    console.log('Elytro: Implement recovery.', walletAddress);
  }

  public async getBlockByNumber() {
    return await this._client.getBlockNumber();
  }

  public async signTypedDataV4(params: unknown) {
    // todo: maybe need format the params
    return await keyring.owner?.signTypedData(
      params as unknown as SignTypedDataParameters
    );
  }

  public async personalSign(params: unknown) {
    let signer = keyring.owner;

    return new Promise(async (resolve, reject) => {
      if (!signer) {
        await keyring.tryUnlock(async () => {
          signer = keyring.owner;
          signer
            ? resolve(
                await signer?.signMessage({
                  message: String(params),
                })
              )
            : reject(new Error('Elytro: Unable to unlock signer.'));
        });
      } else {
        resolve(
          await signer?.signMessage({
            message: String(params),
          })
        );
      }
    });
  }
}

const walletClient = new ElytroWalletClient();

export default walletClient;
