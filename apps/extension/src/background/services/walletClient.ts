import {
  DEFAULT_CHAIN_TYPE,
  SUPPORTED_CHAIN_MAP,
  SUPPORTED_CHAIN_RPC_URL_MAP,
  SupportedChainTypeEn,
} from '@/constants/chains';
import {
  Address,
  createWalletClient,
  formatEther,
  GetBlockParameters,
  http,
  publicActions,
  PublicClient,
  WalletClient,
} from 'viem';
import keyring from './keyring';
import { elytroSDK } from './sdk';
import { ethErrors } from 'eth-rpc-errors';
import { formatBlockInfo } from '@/utils/format';

class ElytroWalletClient {
  private _address: Nullable<Address> = null;
  private _isDeployed: boolean = false;
  private _chainType: SupportedChainTypeEn = DEFAULT_CHAIN_TYPE;
  private _balance: Nullable<string> = null;

  private _client!: WalletClient & PublicClient;

  constructor() {
    // default to ETH Sepolia
    this.init(DEFAULT_CHAIN_TYPE);
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
        transport: http(SUPPORTED_CHAIN_RPC_URL_MAP[this._chainType]),
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

  public async getBlockByNumber(params: GetBlockParameters) {
    const res = await this._client.getBlock(params);
    return formatBlockInfo(res);
  }

  public async signMessage(message: string) {
    if (!this._address) {
      throw ethErrors.rpc.internal();
    }

    if (typeof message !== 'string') {
      throw ethErrors.rpc.invalidParams();
    }

    // todo: maybe more params check?
    return await elytroSDK.signMessage(message, this._address);
  }

  // public async signTypedDataV4(params: unknown) {
  //   // todo: maybe need format the params
  //   return await keyring.owner?.signTypedData(
  //     params as unknown as SignTypedDataParameters
  //   );
  // }

  // public async personalSign(message: string) {
  //   if (!this._address) {
  //     throw ethErrors.rpc.internal();
  //   }

  //   if (typeof message !== 'string') {
  //     throw ethErrors.rpc.invalidParams();
  //   }

  //   // todo: maybe more params check?
  //   return await elytroSDK.signMessage(message, this._address);
  // }

  // public async signTypedData(data: string) {
  //   if (!this._address) {
  //     throw ethErrors.rpc.internal();
  //   }

  //   return await elytroSDK.signMessage(data, this._address);
  // }

  // public async getTransactionByHash(params: unknown) {
  //   try {
  //     if (Array.isArray(params) && params.length)
  //       return await this._client.getTransaction({ hash: params[0] });
  //     else {
  //       return new Error('Elytro: invalid params');
  //     }
  //   } catch {
  //     // do nth.
  //   }
  // }

  // public async prepareTransactionRequest(
  //   args: PrepareTransactionRequestParameters
  // ) {
  //   return await this._client.prepareTransactionRequest(args);
  // }

  // public async signTransaction(request: SafeAny) {
  //   return await this._client.signTransaction(request);
  // }

  // public async sendRawTransaction(serializedTransaction: `0x${string}`) {
  //   return await this._client.sendRawTransaction({ serializedTransaction });
  // }

  // public async getBalance() {
  //   return await this._client.getBalance({
  //     address: keyring.owner?.address as Address,
  //   });
  // }
}

const walletClient = new ElytroWalletClient();

export default walletClient;

export { ElytroWalletClient };
