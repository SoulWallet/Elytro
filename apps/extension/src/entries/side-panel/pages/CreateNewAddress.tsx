import { Button } from '@/components/ui/button';
import { useChain } from '../contexts/chain-context';
import SecondaryPageWrapper from '../components/SecondaryPageWrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useState } from 'react';
import DefaultTokenIcon from '@/assets/icons/ether.svg'; // Adjust the path as necessary
import { TChainConfigItem } from '@/constants/chains';

const ChainItem = ({ chain }: { chain: TChainConfigItem }) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src={chain?.icon || DefaultTokenIcon}
        alt={chain.chainName}
        className="w-8 h-8"
      />
      <div className="font-semibold">{chain.chainName}</div>
    </div>
  );
};

export default function CreateNewAddress() {
  const { chains } = useChain();
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const handleChange = (value: string) => {
    setSelectedChain(
      chains.find((chain) => chain.chainId.toString() === value) || chains[0]
    );
  };
  return (
    <SecondaryPageWrapper
      title="Create New Address"
      footer={
        <div className="flex justify-between w-full gap-4">
          <Button variant="outline" size="large" className="w-full">
            Cancel
          </Button>
          <Button size="large" className="w-full">
            Continue
          </Button>
        </div>
      }
    >
      <div className=" text-lg font-semibold mb-2">Create a new address</div>
      <div className="text-gray-600 mb-2">
        You are about to create a new address within the below network. You can
        use the same local password to access it.
      </div>
      <Select onValueChange={handleChange}>
        <SelectTrigger className="h-16 px-5 py-0 rounded-sm">
          <ChainItem chain={selectedChain} />
        </SelectTrigger>
        <SelectContent className="rounded-sm bg-white overflow-hidden w-full">
          {chains.map((chain) => {
            return (
              <SelectItem
                key={chain.chainId}
                needCheckIcon={false}
                value={chain.chainId.toString()}
                className="px-5 py-0 h-16 rounded-none"
              >
                <ChainItem chain={chain} />
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </SecondaryPageWrapper>
  );
}
