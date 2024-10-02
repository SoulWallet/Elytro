import { SupportedChainTypeEn } from '@/constants/chains';
import keyring from '@/services/keyring';
import walletClient from '@/services/walletClient';
import { create } from 'zustand';

interface AccountState {
  address: string | null;
  currentChainType: SupportedChainTypeEn;
  balance: string;
  isActivated: boolean;
  setCurrentChainId: (chainId: SupportedChainTypeEn) => void;
  setAddress: (address: string | null) => void;
  setBalance: (balance: string) => void;
  resetFromKeyring: () => void;
}

const useAccountStore = create<AccountState>((set) => ({
  address: null,
  balance: '0',
  currentChainType: SupportedChainTypeEn.OP,
  isActivated: false,
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  setCurrentChainId: (chainType: SupportedChainTypeEn) => {
    walletClient.init(chainType);
    set({ currentChainType: chainType });
  },
  resetFromKeyring: () => {
    set({
      address: keyring.owner?.address ?? null,
      currentChainType: walletClient.chainType,
      balance: '0',
      isActivated: walletClient.isActivated,
    });
  },
}));

export default useAccountStore;
