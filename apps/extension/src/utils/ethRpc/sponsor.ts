import { mutate_sponsor_op } from '@/requests/mutate';
import { mutate } from '@/requests';
import { getHexString, paddingBytesToEven } from '../format';

export const canUserOpGetSponsor = async (
  userOp: ElytroUserOperation,
  chainID: number,
  entryPoint: string
) => {
  let canGetSponsored = false;

  try {
    const res = await mutate(mutate_sponsor_op, {
      input: {
        chainID: getHexString(chainID),
        entryPoint,
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
    });
    const {
      paymaster,
      paymasterData,
      preVerificationGas,
      verificationGasLimit,
      callGasLimit,
      paymasterVerificationGasLimit,
      paymasterPostOpGasLimit,
      // @ts-ignore
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

    canGetSponsored = true;
  } catch (error) {
    console.error('Elytro: Failed to check valid for sponsor.', error);
  } finally {
    return canGetSponsored;
  }
};
