import { TChainConfigItem } from '@/constants/chains';
import { Input } from '@/components/ui/input';
import { PropsWithChildren, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { isAddress } from 'viem';
import FragmentedAddress from './FragmentedAddress';
import { useWallet } from '@/contexts/wallet';
import Spin from '@/components/Spin';

interface IENSInfo {
  name: string;
  address: string;
  avatar: string;
}

const ENSInfoComponent = ({
  ensInfo,
  chainId,
}: {
  ensInfo: IENSInfo;
  chainId: number;
}) => {
  return (
    <>
      <div className="flex items-center">
        {ensInfo.avatar ? (
          <img
            src={ensInfo.avatar}
            alt={ensInfo.name}
            className="w-6 h-6 rounded-full mr-2"
          />
        ) : (
          <div className="w-6 h-6 rounded-full flex items-center font-semibold justify-center text-white bg-blue mr-2">
            {ensInfo.name[0].toUpperCase()}
          </div>
        )}
        <div className="text-sm font-semibold">{ensInfo.name}</div>
      </div>
      <div className="scale-75 origin-left">
        <FragmentedAddress
          address={ensInfo.address}
          chainId={chainId as number}
        />
      </div>
    </>
  );
};

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
  const [ensInfo, setEnsInfo] = useState<IENSInfo | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const handleClickENS = () => {
    if (ensInfo) {
      field.onChange(ensInfo.address);
    }
  };

  const getENSAddress = async (value: string) => {
    try {
      const isENS = value.endsWith('.eth');
      if (!isENS) {
        if (ensInfo) {
          setEnsInfo(null);
        }
        return;
      }
      setLoading(true);
      const ensAddr = await wallet.getENSInfoByName(value);
      if (ensAddr) {
        setEnsInfo(ensAddr as IENSInfo);
      }
    } catch (error) {
      setEnsInfo(null);
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
    field.onChange(ensInfo?.address || value);
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
    if (ensInfo) {
      return (
        <div className="absolute bg-white">
          <ENSInfoComponent
            ensInfo={ensInfo}
            chainId={currentChain?.chainId as number}
          />
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
          !isFocused && !(displayLabel || ensInfo)
            ? 'Recipient address / ENS'
            : ''
        }
        value={isFocused ? value : displayLabel || ensInfo ? '' : value}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
      />
      {!isFocused && genInputResult()}
      {isFocused && (loading || ensInfo) && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-md mt-1 z-10 p-4">
          <Spin isLoading={loading} />
          {ensInfo && (
            <div className="hover:bg-gray-300" onClick={handleClickENS}>
              <ENSInfoComponent
                ensInfo={ensInfo}
                chainId={currentChain?.chainId as number}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
