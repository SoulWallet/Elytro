import { Input } from '@/components/ui/input';
import { ArrowRightLeftIcon } from 'lucide-react';
import { FieldValues } from 'react-hook-form';
import { cn } from '@/utils/shadcn/utils';
import { useMemo } from 'react';

export default function AmountInput({
  field,
  isDisabled,
  price,
}: {
  field: FieldValues;
  isDisabled: boolean;
  price: string | number;
}) {
  const dynamicFontSize = useMemo(
    () => (field.value?.length > 10 ? 'text-xl' : 'text-5xl'),
    [field.value]
  );
  return (
    <div className="bg-white px-3 py-4 rounded-md flex flex-row items-center">
      <Input
        {...field}
        className={cn('border-none', dynamicFontSize)}
        placeholder="0"
        disabled={isDisabled}
      />
      <div className="bg-gray-300 p-2 rounded-sm">
        <ArrowRightLeftIcon className="w-4 h-4" />
      </div>
      <div className="text-lg px-4 font-light text-gray-600">${price}</div>
    </div>
  );
}
