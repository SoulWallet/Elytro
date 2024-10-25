import { WalletController } from '@/background/walletController';
import { formatRawData } from '@/utils/format';
import { isHex } from 'viem';

enum SignTypeEn {
  SignText = 'personal_sign',
  SignTypedData = 'eth_signTypedData',
  SignTypedDataV3 = 'eth_signTypedData_v3',
  SignTypedDataV4 = 'eth_signTypedData_v4',
}

export function formatMessage(message: string) {
  return isHex(message)
    ? Buffer.from(message.substring(2), 'hex').toString('utf8')
    : 'Unknown Message';
}

export function parseTypedData(typedDataArray: TTypedDataItem[]) {
  const parsedData: { [key: string]: string | number } = {};

  for (const item of typedDataArray) {
    let value: string | number = item.value.trim();

    if (item.type.startsWith('uint') || item.type.startsWith('int')) {
      value = parseInt(value);
      if (isNaN(value)) {
        console.warn(`无法将 "${item.value}" 解析为数字。`);
        value = item.value;
      }
    }

    parsedData[item.name.replace(/\s+/g, '').toLowerCase()] = value;
  }

  return parsedData;
}

const getProcessingFromSignType = (signType: SignTypeEn) => {
  let title = 'Sign Text';
  let format: (params: string[]) => string;
  let messageIdx = 0;
  let showDetail = false;
  let signMethod: keyof WalletController = 'signMessage';

  switch (signType) {
    case SignTypeEn.SignTypedData:
      title = 'Sign Typed Data';
      signMethod = 'signTypedData';
      format = (params) => {
        const rawData = parseTypedData(
          params[0] as unknown as TTypedDataItem[]
        );
        return formatRawData(rawData);
      };
      break;
    case SignTypeEn.SignTypedDataV3:
    case SignTypeEn.SignTypedDataV4:
      title = 'Sign Typed Data';
      messageIdx = 1;
      showDetail = true;
      signMethod = 'signTypedData';
      format = (params: string[]) =>
        formatRawData(JSON.parse(params[messageIdx]).message as string);
      break;
    case SignTypeEn.SignText:
    default:
      format = (params) => formatMessage(params[messageIdx]);
      break;
  }

  return {
    title,
    format,
    messageIdx,
    showDetail,
    signMethod,
  };
};

export { getProcessingFromSignType, SignTypeEn };
