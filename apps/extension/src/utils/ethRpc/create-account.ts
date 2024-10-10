import { mutate, mutate_create_account } from '@/requests/mutate';
import { toHex } from 'viem';

export const createAccount = async (
  address: string,
  chainID: number,
  index: number,
  initialKeysStrArr: string[],
  initialGuardianHash: string,
  initialGuardianSafePeriod: number
) => {
  try {
    await mutate(mutate_create_account, {
      input: {
        address,
        chainID: toHex(chainID),
        initInfo: {
          index: index,
          initialKeys: initialKeysStrArr,
          initialGuardianHash: initialGuardianHash,
          initialGuardianSafePeriod: toHex(initialGuardianSafePeriod),
        },
      },
    });
  } catch (error) {
    console.error(
      'Elytro: Something went wrong when send create account info to backend',
      error
    );
  }
};
