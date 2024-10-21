import { Address } from 'viem';
import { cn } from '@/utils/shadcn/utils';

interface IProps {
  address: Address;
  className?: string;
}

export default function SplitedGrayAddress({ address, className }: IProps) {
  const handleAddress = () => {
    const prefix = address.slice(0, 6);
    const suffix = address.slice(address.length - 6, address.length);
    const middle = address.slice(6, address.length - 6);
    return (
      <>
        <span>{prefix}</span>
        <span className="text-gray-300">{middle}</span>
        <span>{suffix}</span>
      </>
    );
  };
  return <div className={cn('break-all', className)}>{handleAddress()}</div>;
}
