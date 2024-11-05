import { zeroHash } from 'viem';

export const DEFAULT_GUARDIAN_SAFE_PERIOD = 5;

export const DEFAULT_GUARDIAN_HASH = zeroHash;

export const TEMP_INDEX = 0;

export const TEMP_CALL_DATA = '0x';

// const chainId = 11155420;
// const chainIdHex = BigNumberishToHexString(chainId);

export const TEMP_CHAIN_ID = 11155420;
export const TEMP_CHAIN_ID_HEX =
  '0x' + TEMP_CHAIN_ID.toString(16).padStart(8, '0');

export const TEMP_ENTRY_POINT = '0x0000000071727de22e5e9d8baf0edac6f37da032';

export const TEMP_RECOVERY_MODULE_ADDRESS =
  '0x3Cc36538cf53A13AF5C28BB693091e23CF5BB567';
