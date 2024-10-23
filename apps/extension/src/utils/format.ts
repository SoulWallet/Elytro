import { TTxDetail } from '@/constants/operations';
import { SimulationResult } from './ethRpc/simulate';
import { Hex, toHex, size as getSize, pad, formatUnits } from 'viem';

export function paddingZero(
  value: string | number | bigint,
  bytesLen?: number
): string {
  const hexString =
    typeof value === 'string'
      ? value.toLowerCase().startsWith('0x')
        ? value.slice(2)
        : value
      : BigInt(value).toString(16);

  const targetLength = bytesLen ? bytesLen * 2 : Math.max(hexString.length, 2);

  if (hexString.length > targetLength) {
    throw new Error(
      `Value ${value} exceeds the target length of ${targetLength} characters`
    );
  }

  return '0x' + hexString.padStart(targetLength, '0');
}

export function getHexString(
  value: string | number | bigint | boolean | Uint8Array,
  size: number = 16
): Hex {
  if (typeof value === 'string' && value.startsWith('0x')) {
    if (getSize(value as Hex) === size) {
      return value as Hex;
    } else {
      return pad(value as Hex, { size });
    }
  }

  return toHex(value, { size });
}

// make the hex string length even
export function paddingBytesToEven(value?: string): string | null {
  if (!value) return null;

  const hexValue = value.startsWith('0x') ? value.slice(2) : value;

  const paddedHex = hexValue.length % 2 === 1 ? '0' + hexValue : hexValue;

  return '0x' + paddedHex;
}

export function formatAddressToShort(address: Nullable<string>) {
  // 0x12345...123456
  // todo: check if address is valid
  return address && address?.length > 12
    ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
    : '--';
}

export function formatTokenAmount(amount: string): string {
  // todo: format amount
  return formatUnits(BigInt(amount), 16) + ' ETH';
}

export function formatSimulationResultToTxDetail(
  simulationResult: SimulationResult
) {
  return {
    from: simulationResult.assetChanges[0].from,
    to: simulationResult.assetChanges[0].to,
    value: parseInt(simulationResult.assetChanges[0].rawAmount, 16),
    fee: simulationResult.gasUsed, // todo: calculate fee
  } as TTxDetail;
}

export function formatRawData(data: any) {
  const bigintReplacer = (_: string, value: any) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  };

  return JSON.stringify(data, bigintReplacer, 2);
}
