import { ElytroBundler } from '@/constants/bundler';
import { TEMP_RPC_URL } from '@/constants/chains';
import {
  SDKFactory,
  SDKFallbackHandler,
  SDKSocialRecoverModule,
} from '@/constants/endpoints';
import {
  SignkeyType,
  SoulWallet,
  Bundler,
  UserOperation,
} from '@soulwallet/sdk';
import { getHexString, paddingBytesToEven, paddingZero } from '@/utils/format';
import { createPublicClient, http, parseEther } from 'viem';
import {
  DEFAULT_GUARDIAN_HASH,
  DEFAULT_GUARDIAN_SAFE_PERIOD,
  TEMP_CALL_DATA,
  TEMP_CHAIN_ID,
  TEMP_CHAIN_ID_HEX,
  TEMP_ENTRY_POINT,
  TEMP_INDEX,
  TEMP_VALIDATOR,
} from '@/constants/temp';
import { DecodeUserOp, DecodeResult } from '@soulwallet/decoder';
import { getFeeData } from '@/utils/fee';
import { mutate, query } from '@/requests';
import { mutate_sponsor_op } from '@/requests/mutate';
import { query_simulated_op } from '@/requests/query';
import keyring from './keyring';
import { mainnet } from 'viem/chains';

class WalletClient {
  private _bundler: Nullable<Bundler> = null;
  private _sdk: Nullable<SoulWallet> = null;
  private _address: Nullable<string> = null;
  private _jsonRpcClient = createPublicClient({
    chain: mainnet,
    transport: http('https://base-rpc.publicnode.com'),
  });

  constructor() {
    this.initSDK();
    this._bundler = new Bundler(ElytroBundler);
  }

  get sdk() {
    if (!this._sdk) {
      this.initSDK();
    }
    return this._sdk!;
  }

  // todo: make it real keys
  get initialKeys() {
    // const initialSigner = sdkKeyring.signer;

    const initialSigner = keyring.owner?.address;

    if (!initialSigner) {
      throw new Error('Elytro: No signer found.');
    }

    return [paddingZero(initialSigner, 32)];
  }

  initSDK() {
    this._sdk = new SoulWallet(
      TEMP_RPC_URL,
      ElytroBundler,
      SDKFactory,
      SDKFallbackHandler,
      SDKSocialRecoverModule
    );
  }

  public resetSDK() {
    // TODO: allow user customize SDK
  }

  public async createWalletAddress() {
    if (this._address) {
      return this._address;
    }

    const newAddr = await this.calcWalletAddress();
    await this.getWalletStatus(newAddr);
    this._address = newAddr;
    return this._address;
  }

  public async calcWalletAddress() {
    if (!this._sdk) {
      throw new Error('Elytro: No SDK initiated.');
    }

    // todo: make it configurable
    const res = await this._sdk.calcWalletAddress(
      TEMP_INDEX,
      this.initialKeys, // temp initial keys
      DEFAULT_GUARDIAN_HASH,
      DEFAULT_GUARDIAN_SAFE_PERIOD
    );

    if (res.isErr()) {
      throw res.ERR;
    } else {
      return res.OK;
    }
  }

  public async getWalletStatus(address: string) {
    if (!address) {
      throw new Error('Elytro: No address found.');
    }

    const code = await this._jsonRpcClient.getCode({
      address: address as `0x${string}`, // todo: make sure its ok
    });

    if (code === undefined || code === '0x') {
      // 'undeployed'
      // TODO: make it real
      const _userOp = await this.sdk.createUnsignedDeployWalletUserOp(
        TEMP_INDEX,
        this.initialKeys,
        DEFAULT_GUARDIAN_HASH,
        TEMP_CALL_DATA,
        DEFAULT_GUARDIAN_SAFE_PERIOD
      );
      if (_userOp.isErr()) {
        console.error(_userOp.ERR);
        return;
      } else {
        const userOp = _userOp.OK;
        await this.sendUserOperation(userOp); // todo: check
      }
    } else {
      this.setSocialRecoveryGuardian(this._address as string);
    }
  }

  async setSocialRecoveryGuardian(walletAddress: string) {
    // TODO: implement recovery
    console.log('Elytro: Implement recovery.', walletAddress);
  }

  public async estimateGas(userOp: UserOperation) {
    const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(
      this._jsonRpcClient
    );

    // todo: add case for no gas price
    userOp.maxFeePerGas = maxFeePerGas ? BigInt(maxFeePerGas) : 0;
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

    const stateOverride = {
      [userOp.sender]: {
        balance: getHexString(parseEther('1')), // 账户中没有ETH余额会导致预估gas失败，在模拟时给账户默认有1个ETH的余额
      },
    };

    const _estimateGas = await this.sdk.estimateUserOperationGas(
      TEMP_VALIDATOR,
      userOp,
      stateOverride,
      SignkeyType.EOA // 目前仅支持EOA
    );

    if (_estimateGas.isErr()) {
      console.error(_estimateGas.ERR);
      return false;
    }

    const userOpGasRet = _estimateGas.OK;
    console.log('Elytro: Successfully estimated gas.', userOpGasRet);

    userOp.callGasLimit = BigInt(userOpGasRet.callGasLimit);
    userOp.preVerificationGas = BigInt(userOpGasRet.preVerificationGas);
    userOp.verificationGasLimit = BigInt(userOpGasRet.verificationGasLimit);

    if (
      userOp.paymaster &&
      userOpGasRet.paymasterPostOpGasLimit !== undefined &&
      userOpGasRet.paymasterVerificationGasLimit !== undefined
    ) {
      userOp.paymasterPostOpGasLimit = BigInt(
        userOpGasRet.paymasterPostOpGasLimit
      );
      userOp.paymasterVerificationGasLimit = BigInt(
        userOpGasRet.paymasterVerificationGasLimit
      );
    }
  }

  public async checkValidForSponsor(userOp: UserOperation) {
    let isValidForSponsor = false;

    try {
      const res = await mutate(mutate_sponsor_op, {
        input: {
          userOp: {
            chainID: TEMP_CHAIN_ID_HEX,
            entryPoint: TEMP_ENTRY_POINT,
            op: {
              sender: userOp.sender,
              nonce: getHexString(userOp.nonce),
              factory: userOp.factory,
              factoryData:
                userOp.factory === null
                  ? null
                  : paddingBytesToEven(userOp.factoryData ?? ''),
              callData: userOp.callData,
              callGasLimit: getHexString(userOp.callGasLimit),
              verificationGasLimit: getHexString(userOp.verificationGasLimit),
              preVerificationGas: getHexString(userOp.preVerificationGas),
              maxFeePerGas: getHexString(userOp.maxFeePerGas),
              maxPriorityFeePerGas: getHexString(userOp.maxPriorityFeePerGas),
              signature: userOp.signature,
            },
          },
        },
      });
      const {
        paymaster,
        paymasterData,
        preVerificationGas,
        verificationGasLimit,
        callGasLimit,
        paymasterVerificationGasLimit,
        paymasterPostOpGasLimit,
      } = (res as any).sponsorOp; // TODO: add type definition

      Object.assign(userOp, {
        paymaster,
        paymasterData,
        preVerificationGas,
        verificationGasLimit,
        callGasLimit,
        paymasterVerificationGasLimit,
        paymasterPostOpGasLimit,
      });

      isValidForSponsor = true;
    } catch (error) {
      console.error('Elytro: Failed to check valid for sponsor.', error);
    }

    return isValidForSponsor;
  }

  public async getPreFund(
    userOp: UserOperation,
    transferValue: bigint,
    isValidForSponsor: boolean
  ) {
    const _preFund = await this.sdk.preFund(userOp);
    if (_preFund.isErr()) {
      console.error(_preFund.ERR);
      return false;
    } else {
      const preFund = _preFund.OK;
      const _balance = await this._jsonRpcClient.getBalance({
        address: userOp.sender as `0x${string}`,
      });

      const missFund = BigInt(preFund.missfund);
      if (!isValidForSponsor || transferValue > 0) {
        const maxMissFoundEth = '0.001';
        const maxMissFund = parseEther(maxMissFoundEth);

        const fundRequest = isValidForSponsor
          ? transferValue
          : transferValue + missFund;

        if (fundRequest > maxMissFund) {
          throw new Error(
            'Elytro: We may encounter fund issues. Please try again.'
          );
        }

        if (fundRequest > _balance) {
          throw new Error('Elytro: Insufficient balance.');
        }
      }
    }
  }

  public async getUserOpHash(userOp: UserOperation) {
    const res = await this.sdk.userOpHash(userOp);

    if (res.isErr()) {
      throw res.ERR;
    } else {
      const userOpHash = res.OK;

      // 设置这个交易签名的有效截止期为5分钟后（如果交易在5分钟内没有被收录则永远不可能被收录）
      const dateNow = Math.floor(new Date().getTime() / 1000);
      const _packRawHash = await this.sdk.packRawHash(
        userOpHash,
        0,
        dateNow + 60 * 5
      );
      if (_packRawHash.isErr()) {
        throw _packRawHash.ERR;
      } else {
        return _packRawHash.OK; // TODO: add type def
      }
    }
  }

  public async signUserOperation(
    userOp: UserOperation,
    // todo: change to type def
    packRawHash: {
      packedHash: string;
      validationData: string;
    }
  ) {
    // const _signature = await sdkKeyring.vault.personalSign(
    //   toBytes(packRawHash.packedHash), // todo: check if this is correct, original is ethers.getBytes()
    //   undefined
    // );

    const _signature = await keyring.owner?.signMessage({
      message: packRawHash.packedHash,
    });

    // if (_signature.isErr()) {
    //   throw _signature.ERR;
    // } else {

    const _packedSignature = await this.sdk.packUserOpEOASignature(
      TEMP_VALIDATOR,
      _signature as string,
      packRawHash.validationData
    );
    if (_packedSignature.isErr()) {
      throw _packedSignature.ERR;
    } else {
      userOp.signature = _packedSignature.OK;
      return userOp;
    }
    // }
  }

  public async simulateTx(userOp: UserOperation) {
    try {
      const userOpData = {
        callData: paddingBytesToEven(userOp.callData),
        callGasLimit: getHexString(userOp.callGasLimit),
        factory: userOp.factory,
        factoryData: userOp.factoryData
          ? paddingBytesToEven(userOp.factoryData)
          : null,
        maxFeePerGas: getHexString(userOp.maxFeePerGas),
        maxPriorityFeePerGas: getHexString(userOp.maxPriorityFeePerGas),
        nonce: getHexString(userOp.nonce),
        paymaster: userOp.paymaster,
        paymasterData: userOp.paymasterData
          ? paddingBytesToEven(userOp.paymasterData)
          : null,
        paymasterPostOpGasLimit: userOp.paymasterPostOpGasLimit
          ? getHexString(userOp.paymasterPostOpGasLimit)
          : null,
        paymasterVerificationGasLimit: userOp.paymasterVerificationGasLimit
          ? getHexString(userOp.paymasterVerificationGasLimit)
          : null,
        preVerificationGas: getHexString(userOp.preVerificationGas),
        sender: userOp.sender,
        signature: userOp.signature,
        verificationGasLimit: getHexString(userOp.verificationGasLimit),
      };

      const res = await query(query_simulated_op, {
        chain: TEMP_CHAIN_ID,
        userOps: [userOpData],
      });
      const simulationResult = (res as any).simulate; // TODO: add type def
      if (simulationResult.success) {
        return simulationResult.result;
      } else {
        throw new Error(simulationResult);
      }
    } catch (error) {
      console.error('Elytro: Failed to simulate user operation.', error);
    }
  }

  public async getUserOpReceipt(userOpHash: string) {
    try {
      const res = await this._bundler?.eth_getUserOperationReceipt(userOpHash);

      if (res?.isErr()) {
        throw res.ERR;
      } else if (res?.OK) {
        return res.OK.success
          ? UserOperationStatusEn.confirmedSuccess
          : UserOperationStatusEn.confirmedFailed;
      } else {
        return UserOperationStatusEn.pending;
      }
    } catch (error) {
      console.error('Elytro: Failed to get user operation receipt.', error);
      return UserOperationStatusEn.error;
    }
  }

  public async sendUserOperation(userOp: UserOperation) {
    let transferValue = BigInt(0);
    let res: Nullable<DecodeResult[]> = null;

    if (userOp.callData.length > 2) {
      const _decoderResult = await DecodeUserOp(
        Number(BigInt(TEMP_CHAIN_ID)),
        TEMP_ENTRY_POINT,
        userOp
      );

      if (_decoderResult.isErr()) {
        console.log('Elytro: Failed to decode user operation.');
      } else {
        res = _decoderResult.OK;
        res.forEach((item) => {
          transferValue += item.value;
        });
      }
    }

    await this.estimateGas(userOp);

    // todo: temp comment out, gql error
    const isValidForSponsor = true; //= await this.checkValidForSponsor(userOp);

    await this.getPreFund(userOp, transferValue, isValidForSponsor);

    // todo: save this hash and query it's receipt constantly till it's confirmed
    const userOpHash = await this.getUserOpHash(userOp);

    // const signedUserOp =
    await this.signUserOperation(userOp, userOpHash);

    // todo: temp comment out, gql error
    //await this.simulateTx(userOp); // TODO: non-blocking? what we do with the result?

    const sendRes = await this.sdk.sendUserOperation(userOp);

    if (sendRes.isErr()) {
      throw new Error('Elytro: Failed to send user operation.');
    }
    // if success, do nth. let the business logic do the rest
  }
}

const walletClient = new WalletClient();

export default walletClient;
