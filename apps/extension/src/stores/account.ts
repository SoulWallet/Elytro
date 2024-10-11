import { SupportedChainTypeEn } from '@/constants/chains';
import walletClient from '@/services/walletClient';
import { create } from 'zustand';

interface AccountState {
  address: Nullable<string>;
  isActivated: boolean;
  chainType: SupportedChainTypeEn;
  loading: boolean;
  update: () => void;
}

const useAccountStore = create<AccountState>((set) => ({
  address: walletClient.address,
  isActivated: walletClient.isActivated,
  chainType: walletClient.chainType,
  loading: false,
  async update() {
    set({ loading: true });

    try {
      await walletClient.initSmartAccount();
      set({
        address: walletClient.address,
        isActivated: walletClient.isActivated,
        chainType: walletClient.chainType,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAccountStore;
