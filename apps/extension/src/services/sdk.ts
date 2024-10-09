import {
  DEFAULT_CHAIN_TYPE,
  SUPPORTED_CHAIN_MAP,
  SupportedChainTypeEn,
} from '@/constants/chains';
import { SDK_INIT_CONFIG_BY_CHAIN_MAP } from '@/constants/sdk-config';
import {
  DEFAULT_GUARDIAN_HASH,
  DEFAULT_GUARDIAN_SAFE_PERIOD,
  TEMP_ENTRY_POINT,
  TEMP_VALIDATOR,
} from '@/constants/temp';
import { getHexString, paddingZero } from '@/utils/format';
import { Bundler, SignkeyType, SoulWallet } from '@soulwallet/sdk';
import { DecodeUserOp } from '@soulwallet/decoder';
import { canUserOpGetSponsor } from '@/utils/sponsor';

class ElytroSDK {
  private _sdk!: SoulWallet;
  private _bundler!: Bundler;
  private _chainType!: SupportedChainTypeEn;

  constructor() {
    this._initByChainType(DEFAULT_CHAIN_TYPE);
  }

  get bundler() {
    return this._bundler;
  }

  public resetSDK(chainType: SupportedChainTypeEn) {
    if (chainType !== this._chainType) {
      this._initByChainType(chainType);
    }
  }

  // TODO: temp, make sure it's unique later.
  // random index, just make sure it's unique. Save to local if user need to export the wallet.
  // also, make sure it keeps the same when it's a same SA address.
  private get _index() {
    return 0; // Math.floor(Math.random() * 100);
  }

  get chain() {
    return SUPPORTED_CHAIN_MAP[this._chainType];
  }

  private _initByChainType(chainType: SupportedChainTypeEn) {
    const { endpoint, bundler, factory, fallback, recovery } =
      SDK_INIT_CONFIG_BY_CHAIN_MAP[chainType];

    this._sdk = new SoulWallet(endpoint, bundler, factory, fallback, recovery);
    this._bundler = new Bundler(bundler);
    this._chainType = chainType;
  }

  /**
   * Create a smart account wallet address
   * @param eoaAddress - The address of the EOA that will be the owner of the wallet.
   * @param initialGuardianHash - The hash of the initial guardian.
   * @param initialGuardianSafePeriod - The safe period for the initial guardian.
   * @param chainId - The chain id.
   * @returns The address of the wallet.
   */
  public async createWalletAddress(
    eoaAddress: string,
    initialGuardianHash: string = DEFAULT_GUARDIAN_HASH,
    initialGuardianSafePeriod: number = DEFAULT_GUARDIAN_SAFE_PERIOD,
    chainId: number | string = this.chain.id
  ) {
    const res = await this._sdk?.calcWalletAddress(
      this._index,
      [paddingZero(eoaAddress, 32)],
      initialGuardianHash,
      initialGuardianSafePeriod,
      chainId
    );

    if (res.isErr()) {
      throw res.ERR;
    } else {
      return res.OK;
    }
  }

  /**
   * Create an unsigned user operation for deploying a smart account wallet
   * @param eoaAddress - The address of the EOA that will be the owner of the wallet.
   * @param initialGuardianHash - The hash of the initial guardian.
   * @param initialGuardianSafePeriod - The safe period for the initial guardian.
   * @returns The unsigned user operation.
   */
  public async createUnsignedDeployWalletUserOp(
    eoaAddress: string,
    initialGuardianHash: string = DEFAULT_GUARDIAN_HASH,
    initialGuardianSafePeriod: number = DEFAULT_GUARDIAN_SAFE_PERIOD
  ) {
    const emptyCallData = '0x';
    const res = await this._sdk?.createUnsignedDeployWalletUserOp(
      this._index,
      [paddingZero(eoaAddress, 32)],
      initialGuardianHash,
      emptyCallData,
      initialGuardianSafePeriod
    );

    if (res.isErr()) {
      throw res.ERR;
    } else {
      return res.OK;
    }
  }

  public async canGetSponsored(userOp: ElytroUserOperation) {
    return canUserOpGetSponsor(userOp, BigInt(this.chain.id), TEMP_ENTRY_POINT);
  }

  public async isSmartAccountDeployed(address: string) {
    const code = await this._sdk.provider.getCode(address);
    // when account is not deployed, it's code is undefined or 0x.
    return code !== undefined && code !== '0x';
  }

  public async activateSmartAccount(address: string) {
    try {
      const userOp = await this.createUnsignedDeployWalletUserOp(address);
      await this.sendUserOperation(userOp);
    } catch (error) {
      console.error('Elytro: Failed to activate smart account.', error);
    }
  }

  public async sendUserOperation(userOp: ElytroUserOperation) {
    const opHash = await this._sdk.userOpHash(userOp);
    console.log(opHash);
  }

  private async _getPackedUserOpHash(userOp: ElytroUserOperation) {
    const res = await this._sdk.userOpHash(userOp);

    if (res.isErr()) {
      throw res.ERR;
    } else {
      const packedHash = await this._sdk.packRawHash(
        res.OK,
        0, // start time
        Math.floor(new Date().getTime() / 1000) + 60 * 5 // end time
      );

      if (packedHash.isErr()) {
        throw packedHash.ERR;
      } else {
        return packedHash.OK;
      }
    }
  }

  private async _decodeUserOperation(userOp: ElytroUserOperation) {
    if (userOp.callData?.length <= 2) {
      return null;
    }

    // todo: entrypoint should be dynamically changed with chainId?
    const res = await DecodeUserOp(this.chain.id, TEMP_ENTRY_POINT, userOp);

    if (res.isErr()) {
      throw res.ERR;
    } else {
      return res.OK;
    }
  }

  private async _estimateGas(userOp: ElytroUserOperation) {
    const gasPrice = await this._sdk.provider.getFeeData();

    // todo: what if it's null? set as 0?
    userOp.maxFeePerGas = gasPrice?.maxFeePerGas ?? 0;
    userOp.maxPriorityFeePerGas = gasPrice?.maxPriorityFeePerGas ?? 0;

    // todo: sdk can be optimized (fetch balance in sdk)
    const res = await this._sdk.estimateUserOperationGas(
      TEMP_VALIDATOR,
      userOp,
      {
        [userOp.sender]: {
          balance: getHexString(
            await this._sdk.provider.getBalance(userOp.sender)
          ),
        },
      },
      SignkeyType.EOA // 目前仅支持EOA
    );

    if (res.isErr()) {
      throw res.ERR;
    } else {
      const {
        callGasLimit,
        preVerificationGas,
        verificationGasLimit,
        paymasterPostOpGasLimit,
        paymasterVerificationGasLimit,
      } = res.OK;

      userOp.callGasLimit = BigInt(callGasLimit);
      userOp.preVerificationGas = BigInt(preVerificationGas);
      userOp.verificationGasLimit = BigInt(verificationGasLimit);
      if (
        userOp.paymaster !== null &&
        typeof paymasterPostOpGasLimit !== 'undefined' &&
        typeof paymasterVerificationGasLimit !== 'undefined'
      ) {
        userOp.paymasterPostOpGasLimit = BigInt(paymasterPostOpGasLimit);
        userOp.paymasterVerificationGasLimit = BigInt(
          paymasterVerificationGasLimit
        );
      }
    }
  }
}

export const elytroSDK = new ElytroSDK();
