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
  if (typeof value === 'string') {
    return '0x' + BigInt(value).toString(16);
  } else if (typeof value === 'number' || typeof value === 'bigint') {
    return '0x' + BigInt(value).toString(16);
  } else {
    throw new Error(`value ${value} is not number | string | bigint`);
  }
}

// make the hex string length even
export function paddingBytesToEven(value: string): string {
  if (value.startsWith('0x')) {
    value = value.slice(2);
  }
  if (value.length % 2 !== 0) {
    value = '0' + value;
  }
  return value;
}

export function formatAddressToShort(address: Nullable<string>) {
  // 0x12345...123456
  // todo: check if address is valid
  return address && address?.length > 12
    ? `${address?.substring(0, 6)}...${address?.substring(address?.length - 6)}`
    : '--';
}
