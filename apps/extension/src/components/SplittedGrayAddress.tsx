import { Address } from 'viem';
import { cn } from '@/utils/shadcn/utils';

interface IProps {
  address: string | Address;
  className?: string;
}

export default function SplittedGrayAddress({ address, className }: IProps) {
  const handleAddress = () => {
    const prefix = address.slice(0, 6);
    const suffix = address.slice(-4);
    return (
      <>
        <span>{prefix}</span>
        <span>...</span>
        <span>{suffix}</span>
      </>
    );
  };
  return (
    <div className={cn('break-all text-gray-600', className)}>
      {handleAddress()}
    </div>
  );
}
