import { Hex, size } from 'viem';

export const isBytes32 = (val: Hex | Uint8Array) => {
  try {
    const s = size(val);
    return s !== null && s === 32;
  } catch (e) {
    console.error('variable', val, 'is not a Bytes 32', e);
    return false;
  }
};
