import {
  formatAddressToShort,
  formatRawData,
  formatTokenAmount,
} from '@/utils/format';
import { DecodeResult } from '@soulwallet/decoder';
import { useState } from 'react';
import LabelValue from './LabelValue';

interface ITxDetail {
  tx: DecodeResult;
  type: SendTxTypeEn;
}

export enum SendTxTypeEn {
  SEND = 'send',
  DEPLOY = 'deploy',
}

type TDetailRenderItemProps = {
  title: string;
  fields: {
    label: string;
    key: keyof DecodeResult;
    format?: (value: string) => string;
  }[];
};

const TxDetailRenderItemMap: Record<SendTxTypeEn, TDetailRenderItemProps> = {
  [SendTxTypeEn.SEND]: {
    title: 'Send Token',
    fields: [
      {
        label: 'Send to',
        key: 'to',
        format: (value: string) => formatAddressToShort(value),
      },
      {
        label: 'Send token',
        key: 'value',
        format: (value: string) => formatTokenAmount(value),
      },
    ],
  },
  [SendTxTypeEn.DEPLOY]: {
    title: 'Deploy Contract',
    fields: [
      {
        label: 'address',
        key: 'to',
      },
    ],
  },
};

export default function TxDetail({ tx, type }: ITxDetail) {
  const { title, fields } = TxDetailRenderItemMap[type];
  const [showRawData, setShowRawData] = useState(false);

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Transaction Type */}
      <div className="text-lg font-bold mb-3">{title}</div>

      {/* Transaction Detail */}
      <div className="space-y-2">
        {fields.map(({ label, key, format }) => (
          <LabelValue
            key={key}
            label={label}
            value={
              (format
                ? tx[key] !== undefined
                  ? format(tx[key] as string)
                  : '--'
                : tx[key] || '--') as string
            }
          />
        ))}
      </div>

      {/* Transaction Raw Data */}
      <div className="mt-4 w-full ">
        <button
          className="text-sm text-gray-400 w-full text-center"
          onClick={() => setShowRawData((prev) => !prev)}
        >
          {showRawData ? 'Hide' : 'Show'} Raw Data
        </button>
        <pre
          className={`
            text-sm text-gray-500 overflow-auto w-full max-h-40
            transition-opacity duration-300
            ${showRawData ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        >
          {formatRawData(tx)}
        </pre>
      </div>
    </div>
  );
}
