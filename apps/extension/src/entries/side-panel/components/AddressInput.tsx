import { TChainConfigItem } from '@/constants/chains';
import { Input } from '@/components/ui/input';
import { PropsWithChildren, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { isAddress } from 'viem';
import FragmentedAddress from './FragmentedAddress';
import { useWallet } from '@/contexts/wallet';
import Spin from '@/components/Spin';

export default function AddressInput({
  field,
  currentChain,
}: PropsWithChildren<{
  field: FieldValues;
  currentChain: TChainConfigItem | null;
}>) {
  const wallet = useWallet();
  const [displayLabel, setDisplayLabel] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ensAddress, setEnsAddress] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleClickENS = () => {
    if (ensAddress) {
      field.onChange(ensAddress);
    }
  };

  const getENSAddress = async (value: string) => {
    try {
      const isENS = value.endsWith('.eth');
      if (!isENS) {
        if (ensAddress) {
          setEnsAddress('');
        }
        return;
      }
      setLoading(true);
      const ensAddr = await wallet.getENSAddressByName(value);
      if (ensAddr) {
        setEnsAddress(ensAddr);
      }
    } catch (error) {
      setEnsAddress('');
      field.onChange(value);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isAddr = isAddress(value);
    if (isAddr) {
      setDisplayLabel(value);
    } else {
      setDisplayLabel('');
    }
    setIsFocused(false);
    field.onChange(ensAddress || value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
  };

  const genInputResult = () => {
    if (displayLabel) {
      return (
        <div className="absolute bg-white">
          <FragmentedAddress
            address={displayLabel}
            chainId={currentChain?.chainId as number}
          />
        </div>
      );
    }
    if (ensAddress) {
      return (
        <div className="absolute bg-white">
          <div className="text-sm font-semibold">{value}</div>
          <div className="scale-75 origin-left">
            <FragmentedAddress
              address={ensAddress}
              chainId={currentChain?.chainId as number}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    getENSAddress(value);
  }, [value]);

  return (
    <div className="bg-white rounded-md px-5 py-4 flex items-center mb-4 relative">
      <Input
        className="text-lg border-none"
        placeholder={
          !isFocused && !(displayLabel || ensAddress)
            ? 'Recipient address / ENS'
            : ''
        }
        value={isFocused ? value : displayLabel || ensAddress ? '' : value}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
      />
      {!isFocused && genInputResult()}
      {isFocused && (loading || ensAddress) && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-md mt-1 z-10 p-4">
          <Spin isLoading={loading} />
          {ensAddress && (
            <div className="hover:bg-gray-300" onClick={handleClickENS}>
              <div className="text-sm font-semibold">{value}</div>
              <div className="scale-75 origin-left">
                <FragmentedAddress
                  address={ensAddress}
                  chainId={currentChain?.chainId as number}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
