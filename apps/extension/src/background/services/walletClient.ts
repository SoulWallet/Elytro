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
  Hex,
  http,
  PrepareTransactionRequestParameters,
  publicActions,
  PublicClient,
  WalletClient,
} from 'viem';
import keyring from './keyring';
import { SignTypedDataParameters } from 'viem/accounts';
import { elytroSDK } from './sdk';
import { ethErrors } from 'eth-rpc-errors';

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

  public async initSmartAccount(): Promise<TAccountInfo | undefined> {
    await keyring.tryUnlock();

    if (keyring.smartAccountAddress) {
      this._address = keyring.smartAccountAddress;
      this._isDeployed = await elytroSDK.isSmartAccountDeployed(this._address);

      this._balance = formatEther(
        await this._client.getBalance({
          address: this._address,
        })
      );

      return {
        address: this._address,
        ownerAddress: keyring.owner?.address,
        isActivated: this._isDeployed,
        chainType: this._chainType,
        balance: this._balance,
      };
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
    if (!Array.isArray(params) || params?.length < 2) {
      throw ethErrors.rpc.invalidParams();
    }

    // todo: maybe more params check?
    return await elytroSDK.signMessage(params[0], params[1] as Hex);
  }

  public async getTransactionByHash(params: unknown) {
    try {
      if (Array.isArray(params) && params.length)
        return await this._client.getTransaction({ hash: params[0] });
      else {
        return new Error('Elytro: invalid params');
      }
    } catch {
      // do nth.
    }
  }

  public async sendTransaction(params: TTransactionInfo[]) {
    return await elytroSDK.sendTransaction(params, this._address!);
  }

  public async prepareTransactionRequest(
    args: PrepareTransactionRequestParameters
  ) {
    return await this._client.prepareTransactionRequest(args);
  }

  public async signTransaction(request: SafeAny) {
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

export { ElytroWalletClient };
