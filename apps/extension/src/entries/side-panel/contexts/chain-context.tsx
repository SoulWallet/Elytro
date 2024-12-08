import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@/contexts/wallet';
import { TChainConfigItem } from '@/constants/chains';
import { toast } from '@/hooks/use-toast';

type IChainContext = {
  chains: TChainConfigItem[];
  currentChain: TChainConfigItem | null;
  getCurrentChain: () => Promise<void>;
  getChains: () => Promise<void>;
};

const ChainContext = createContext<IChainContext>({
  chains: [],
  currentChain: null,
  getCurrentChain: async () => {},
  getChains: async () => {},
});

export const ChainProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet();
  const [chains, setChains] = useState<TChainConfigItem[]>([]);
  const [currentChain, setCurrentChain] = useState<TChainConfigItem | null>(
    null
  );

  const getChains = async () => {
    try {
      const res = await wallet.getChains();
      setChains(res);
    } catch (error) {
      console.error('Elytro chain-context: Failed to get chains', error);
      toast({
        title: 'Error',
        description: 'Failed to get chains',
      });
    }
  };

  const getCurrentChain = async () => {
    try {
      const res = await wallet.getCurrentChain();
      setCurrentChain(res);
    } catch (error) {
      console.error('Elytro chain-context: Failed to get current chain', error);
      toast({
        title: 'Error',
        description: 'Failed to get current chain',
      });
    }

    const res = await wallet.getCurrentChain();
    setCurrentChain(res);
  };

  useEffect(() => {
    getChains();
    getCurrentChain();
  }, []);

  return (
    <ChainContext.Provider
      value={{
        chains,
        currentChain,
        getCurrentChain,
        getChains,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export const useChain = () => {
  return useContext(ChainContext);
};
