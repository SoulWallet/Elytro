import { SupportedChainTypeEn } from '@/constants/chains';
import walletClient from '@/services/walletClient';
import { create } from 'zustand';

interface AccountState {
  address: Nullable<string>;
  isActivated: boolean;
  chainType: SupportedChainTypeEn;
  update: () => void;
}

const useAccountStore = create<AccountState>((set) => ({
  address: walletClient.address,
  isActivated: walletClient.isActivated,
  chainType: walletClient.chainType,
  async update() {
    await walletClient.initSmartAccount();

    set({
      address: walletClient.address,
      isActivated: walletClient.isActivated,
      chainType: walletClient.chainType,
    });
  },
}));

export default useAccountStore;
