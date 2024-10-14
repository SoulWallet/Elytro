import {
  DEFAULT_CHAIN_TYPE,
  SUPPORTED_CHAIN_MAP,
  SupportedChainTypeEn,
  TEMP_RPC_URL,
} from '@/constants/chains';
import {
  Address,
  createWalletClient,
  formatEther,
  http,
  PrepareTransactionRequestParameters,
  publicActions,
  PublicClient,
  SendTransactionParameters,
  WalletClient,
} from 'viem';
import keyring from './keyring';
import { SignTypedDataParameters } from 'viem/accounts';
import { elytroSDK } from './sdk';

class ElytroWalletClient {
  private _address: Nullable<Address> = null;
  private _isDeployed: boolean = false;
  private _chainType: SupportedChainTypeEn = DEFAULT_CHAIN_TYPE;
  private _balance: Nullable<string> = null;

  private _client!: WalletClient & PublicClient;

  constructor() {
    // default to OP
    this.init(SupportedChainTypeEn.OP_SEPOLIA);
  }

  get chainType() {
    return this._chainType;
  }

  get chain() {
    return SUPPORTED_CHAIN_MAP[this._chainType];
  }

  get address() {
    return this._address;
  }

  get balance() {
    return this._balance;
  }

  get isActivated() {
    return this._isDeployed;
  }

  public async init(chainType: SupportedChainTypeEn) {
    if (!this._client || chainType !== this._chainType) {
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

      this._balance = formatEther(
        await this._client.getBalance({
          address: this._address,
        })
      );
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

  public async getTransactionByHash(params: unknown) {
    try {
      if (Array.isArray(params) && params.length)
        return await this._client.getTransaction({ hash: params[0] });
      else {
        return new Error('Elytro: invalid params');
      }
    } catch (error) {
      throw error;
    }
  }

  public async sendTransaction(params: SendTransactionParameters) {
    return await this._client.sendTransaction(params);
  }

  public async prepareTransactionRequest(
    args: PrepareTransactionRequestParameters
  ) {
    return await this._client.prepareTransactionRequest(args);
  }

  public async signTransaction(request: any) {
    return await this._client.signTransaction(request);
  }

  public async sendRawTransaction(serializedTransaction: `0x${string}`) {
    return await this._client.sendRawTransaction({ serializedTransaction });
  }

  public async getBalance() {
    return await this._client.getBalance({
      address: keyring.owner?.address as Address,
    });
  }
}

const walletClient = new ElytroWalletClient();

export default walletClient;
