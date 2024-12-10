import DefaultTokenIcon from '@/assets/icons/ether.svg';
import { SUPPORTED_CHAIN_ICON_MAP, TChainConfigItem } from '@/constants/chains';
import { Input } from '@/components/ui/input';
import { PropsWithChildren } from 'react';
import { FieldValues } from 'react-hook-form';

export default function AddressInput({
  field,
  currentChain,
}: PropsWithChildren<{
  field: FieldValues;
  currentChain: TChainConfigItem | null;
}>) {
  return (
    <div className="bg-white rounded-md pl-5 py-4 flex items-center mb-4">
      <img
        className="w-6 h-6"
        // TODO: config the chain icon in chain service
        src={
          currentChain?.chainId
            ? SUPPORTED_CHAIN_ICON_MAP[currentChain.chainId]
            : DefaultTokenIcon
        }
        alt={currentChain?.chainName}
      />
      <Input
        className="text-lg border-none"
        placeholder="Recipient address / ENS"
        {...field}
      />
    </div>
  );
}
