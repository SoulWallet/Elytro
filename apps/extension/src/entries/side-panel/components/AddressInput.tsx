import { TChainConfigItem } from '@/constants/chains';
import { Input } from '@/components/ui/input';
import { PropsWithChildren, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { isAddress } from 'viem';
import FragmentedAddress from './FragmentedAddress';

export default function AddressInput({
  field,
  currentChain,
}: PropsWithChildren<{
  field: FieldValues;
  currentChain: TChainConfigItem | null;
}>) {
  const [displayLabel, setDisplayLabel] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isAddr = isAddress(value);
    if (isAddr) {
      setDisplayLabel(value);
    } else {
      setDisplayLabel('');
    }
    setIsFocused(false);
    field.onChange(value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className="bg-white rounded-md px-5 py-4 flex items-center mb-4">
      <Input
        className="text-lg border-none"
        placeholder={
          !isFocused && !displayLabel ? 'Recipient address / ENS' : ''
        }
        value={isFocused ? value : displayLabel ? '' : value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {!isFocused && displayLabel && (
        <div className="absolute bg-white">
          <FragmentedAddress
            address={displayLabel}
            chainId={currentChain?.chainId as number}
          />
        </div>
      )}
    </div>
  );
}
