import { Button } from '@/components/ui/button';
import { useChain } from '../contexts/chain-context';
import SecondaryPageWrapper from '../components/SecondaryPageWrapper';
import { useState } from 'react';
import ChainItem from '@/components/ChainItem';
import { TChainConfigItem } from '@/constants/chains';
import { toast } from '@/hooks/use-toast';

export default function CreateNewAddress() {
  const { chains, currentChain } = useChain();
  const [selectedChain, setSelectedChain] = useState<TChainConfigItem | null>(
    null
  );
  const handleChange = (value: string) => {
    setSelectedChain(
      () =>
        chains.find((chain) => chain.chainId.toString() === value) || chains[0]
    );
  };

  const handleCreate = () => {
    if (!selectedChain) return;
    if (currentChain?.chainId === selectedChain.chainId) {
      toast({
        title: 'Create address failed',
        description: 'You are already on this network',
      });
    }
  };
  return (
    <SecondaryPageWrapper
      title="Create New Address"
      footer={
        <Button
          size="large"
          className="w-full"
          onClick={handleCreate}
          disabled={!selectedChain}
        >
          Create
        </Button>
      }
    >
      <div className=" text-lg font-semibold mb-2">Create a new address</div>
      <div className="text-gray-600 mb-2">
        You are about to create a new address within the below network. You can
        use the same local password to access it.
      </div>
      <div className="space-y-2">
        {chains.map((chain) => {
          return (
            <ChainItem
              isSelected={selectedChain?.chainId === chain.chainId}
              key={chain.chainId}
              chain={chain}
              onClick={() => handleChange(chain.chainId.toString())}
            />
          );
        })}
      </div>
    </SecondaryPageWrapper>
  );
}
