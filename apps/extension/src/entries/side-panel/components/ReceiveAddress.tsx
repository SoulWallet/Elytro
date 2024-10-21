import {
  SUPPORTED_CHAIN_ICON_MAP,
  SUPPORTED_CHAIN_MAP,
  SupportedChainTypeEn,
} from '@/constants/chains';
import { QRCodeSVG } from 'qrcode.react';
import { safeClipboard } from '@/utils/clipboard';
import { Button } from '@/components/ui/button';
import SplitedGrayAddress from '@/components/SplitedGrayAddress';
import { Address } from 'viem';

interface IReceiveProps {
  address: string;
  chainType: SupportedChainTypeEn;
}

export default function ReceiveAddress({ address, chainType }: IReceiveProps) {
  const chainInfo = SUPPORTED_CHAIN_MAP[chainType];

  return (
    <div className="self-center flex flex-col items-center bg-white rounded-3xl p-4  border border-gray-200 max-w-96">
      {/* Chain info */}
      <div className="flex flex-row items-center gap-2 mb-10">
        <img
          src={SUPPORTED_CHAIN_ICON_MAP[chainType]}
          alt={chainInfo.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <div className="text-lg font-medium">{chainInfo.name}</div>
          <div className="text-sm text-gray-500">
            Only send {chainInfo.name} assets to this address
          </div>
        </div>
      </div>

      {/* QR Code */}
      <QRCodeSVG value={address} size={200} />

      {/* Address */}
      <SplitedGrayAddress
        className="text-sm text-gray-500 my-4"
        address={address as Address}
      />

      {/* Copy Address */}
      <Button className="rounded-full" onClick={() => safeClipboard(address)}>
        Copy Address
      </Button>
    </div>
  );
}
