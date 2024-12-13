import { DEFAULT_CHAIN_CONFIG, TChainConfigItem } from '@/constants/chains';
import {
  Address,
  BlockTag,
  createPublicClient,
  GetBlockParameters,
  Hex,
  http,
  PublicClient,
  ReadContractParameters,
  toHex,
} from 'viem';
import { ethErrors } from 'eth-rpc-errors';
import { formatBlockInfo, formatBlockParam } from '@/utils/format';
import { normalize } from 'viem/ens';

class ElytroWalletClient {
  private _client!: PublicClient;

  constructor() {
    // default to ETH Sepolia
    this.init(DEFAULT_CHAIN_CONFIG);
  }

  // TODO: check if it's safe to use rpc url instead of chain config.
  public async init(chain: TChainConfigItem) {
    if (chain.rpcUrl !== this._client?.transport?.url) {
      this._client = createPublicClient({
        transport: http(chain.rpcUrl),
      });
    }
  }

  public async getBlockByNumber(params: GetBlockParameters) {
    const res = await this._client.getBlock(params);
    return formatBlockInfo(res);
  }

  public async getBlockNumber() {
    return toHex(await this._client.getBlockNumber());
  }

  public async getCode(address: Address, block: BlockTag | bigint = 'latest') {
    try {
      return await this._client.getCode({
        address,
        ...formatBlockParam(block),
      });
    } catch {
      throw ethErrors.rpc.invalidParams();
    }
  }

  public async rpcRequest(method: ProviderMethodType, params: SafeAny) {
    // TODO: methods will be as same as viem's request method eventually
    // TODO: maybe change all 'from' to local account?
    return await this._client.request({ method: method as SafeAny, params });
  }

  public async estimateGas(tx: SafeAny, block: BlockTag | bigint = 'latest') {
    return toHex(
      await this._client.estimateGas({
        ...tx,
        ...formatBlockParam(block),
      })
    );
  }

  public async readContract(param: ReadContractParameters) {
    return await this._client.readContract(param);
  }

  public async getTransaction(hash: Hex) {
    return await this._client.getTransaction({ hash });
  }

  public async getBalance(address: Address) {
    return await this._client.getBalance({
      address,
    });
  }

  public async getENSAddressByName(name: string) {
    try {
      const ensAddress = await this._client.getEnsAddress({
        name: normalize(name),
        universalResolverAddress:
          DEFAULT_CHAIN_CONFIG.ensContractAddress as Address,
      });
      return ensAddress;
    } catch (error) {
      throw ethErrors.rpc.internal((error as Error)?.message);
    }
  }
}

const walletClient = new ElytroWalletClient();

export default walletClient;

export { ElytroWalletClient };
