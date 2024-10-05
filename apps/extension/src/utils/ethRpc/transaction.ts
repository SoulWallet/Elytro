import { toHex } from 'viem';

export function generateTxId(
  fromAddr: string,
  nonce: number | string,
  chainEnum: string
) {
  // make sure nonce is hex
  const nonceHex = toHex(nonce);

  return `${fromAddr}_${nonceHex}_${chainEnum}`;
}
