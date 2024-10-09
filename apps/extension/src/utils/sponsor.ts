import { mutate_sponsor_op } from '@/requests/mutate';

import { mutate } from '@/requests';
import { paddingBytesToEven } from './format';
import { toHex } from 'viem';

export const canUserOpGetSponsor = async (
  userOp: ElytroUserOperation,
  chainID: bigint,
  entryPoint: string
) => {
  let canGetSponsored = false;

  try {
    const res = await mutate(mutate_sponsor_op, {
      input: {
        userOp: {
          chainID,
          entryPoint,
          op: {
            sender: userOp.sender,
            nonce: toHex(userOp.nonce),
            factory: userOp.factory,
            factoryData:
              userOp.factory === null
                ? null
                : paddingBytesToEven(userOp.factoryData ?? ''),
            callData: userOp.callData,
            callGasLimit: toHex(userOp.callGasLimit),
            verificationGasLimit: toHex(userOp.verificationGasLimit),
            preVerificationGas: toHex(userOp.preVerificationGas),
            maxFeePerGas: toHex(userOp.maxFeePerGas),
            maxPriorityFeePerGas: toHex(userOp.maxPriorityFeePerGas),
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
