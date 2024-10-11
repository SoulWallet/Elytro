import { TTxDetail } from '@/constants/operations';
import { SimulationResult } from './ethRpc/simulate';
import { toHex } from 'viem';

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

// 将 number | string | bigint 转换为 16进制字符串
export function getHexString(value: number | string | bigint) {
  if (typeof value === 'string' && value.startsWith('0x')) {
    return value;
  }

  return toHex(value);
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
    ? `${address?.substring(0, 6)}...${address?.substring(address?.length - 6)}`
    : '--';
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
