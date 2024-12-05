import { SupportedChainTypeEn } from '@/constants/chains';
import { QRCodeSVG } from 'qrcode.react';
import FragmentedAddress from './FragmentedAddress';

interface IReceiveProps {
  address: string;
  chainType: SupportedChainTypeEn;
}

export default function ReceiveAddressBadge({
  address,
  chainType,
}: IReceiveProps) {
  return (
    <div className="px-2xl py-4xl bg-light-green rounded-lg flex flex-col items-center gap-y-2xl w-full">
      <QRCodeSVG value={address} size={205} />

      <FragmentedAddress address={address} chainType={chainType} />
    </div>
  );
}
