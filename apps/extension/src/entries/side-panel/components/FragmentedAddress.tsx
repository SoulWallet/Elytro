import {
  SUPPORTED_CHAIN_ICON_MAP,
  SupportedChainTypeEn,
} from '@/constants/chains';
import { isAddress } from 'viem';

interface IProps {
  address: string;
  chainType: SupportedChainTypeEn;
}

export default function FragmentedAddress({ address, chainType }: IProps) {
  if (!isAddress(address)) {
    return null;
  }

  const prefix = address.slice(0, 6);
  const suffix = address.slice(address.length - 6, address.length);

  return (
    <div className="flex items-center gap-sm">
      <img
        src={SUPPORTED_CHAIN_ICON_MAP[chainType]}
        alt={chainType}
        className="size-8"
      />
      <div className="flex items-center gap-sm elytro-text-bold-body">
        <span>{prefix}</span>
        <span className="px-1 bg-[#B5D6BA] rounded-xs"> … </span>
        <span>{suffix}</span>
      </div>
    </div>
  );
}
