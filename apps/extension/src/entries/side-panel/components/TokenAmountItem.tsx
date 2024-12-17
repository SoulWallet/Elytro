import { formatTokenAmount } from '@/utils/format';
import { cn } from '@/utils/shadcn/utils';
import { TokenInfo } from '@soulwallet/decoder';

interface ITokenAmountItemProps
  extends Partial<Pick<TokenInfo, 'logoURI' | 'name' | 'symbol' | 'decimals'>> {
  amount?: string;
  className?: string;
}

export default function TokenAmountItem({
  logoURI,
  name,
  symbol,
  decimals,
  amount,
  className,
}: ITokenAmountItemProps) {
  if (!amount) return '--';

  return (
    <span
      className={cn(
        'flex items-center gap-x-sm elytro-text-bold-body',
        className
      )}
    >
      {/* TODO: no fromInfo. no logo & name */}
      <img
        className="size-6 rounded-full ring-1 ring-gray-150"
        src={logoURI}
        alt={name}
      />
      <span>{formatTokenAmount(amount, decimals, symbol)}</span>
    </span>
  );
}
