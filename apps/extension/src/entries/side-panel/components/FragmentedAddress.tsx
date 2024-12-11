import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SUPPORTED_CHAIN_ICON_MAP } from '@/constants/chains';
import { isAddress } from 'viem';

interface IProps {
  address: string;
  chainId: number;
}

export default function FragmentedAddress({ address, chainId }: IProps) {
  if (!isAddress(address)) {
    return null;
  }

  const prefix = address.slice(0, 6);
  const suffix = address.slice(address.length - 6, address.length);

  return (
    <div className="flex items-center gap-sm">
      <img
        src={SUPPORTED_CHAIN_ICON_MAP[chainId]}
        alt={chainId.toString()}
        className="size-8"
      />
      <div className="flex items-center gap-sm elytro-text-bold-body">
        <span>{prefix}</span>
        <Tooltip>
          <TooltipTrigger>
            <span className="px-1 bg-[#B5D6BA] rounded-xs"> … </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{address}</p>
          </TooltipContent>
        </Tooltip>
        <span>{suffix}</span>
      </div>
    </div>
  );
}
