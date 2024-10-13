import { SupportedChainTypeEn } from '@/constants/chains';
import walletClient from '@/services/walletClient';
import { create } from 'zustand';

interface AccountState {
  address: Nullable<string>;
  balance: Nullable<string>;
  isActivated: boolean;
  chainType: SupportedChainTypeEn;
  loading: boolean;
  currentUserOp: Nullable<ElytroUserOperation>;
  update: () => void;
  setCurrentUserOp: (userOp: ElytroUserOperation) => void;
  setIsActivated: (isActivated: boolean) => void;
}

const useAccountStore = create<AccountState>((set) => ({
  address: walletClient.address,
  isActivated: walletClient.isActivated,
  chainType: walletClient.chainType,
  loading: false,
  balance: null,
  currentUserOp: null,
  setIsActivated(isActivated) {
    set({ isActivated });
  },
  setCurrentUserOp: (userOp: ElytroUserOperation) =>
    set({ currentUserOp: userOp }),
  async update() {
    set({ loading: true });

    try {
      await walletClient.initSmartAccount();

      set({
        address: walletClient.address,
        isActivated: walletClient.isActivated,
        chainType: walletClient.chainType,
        balance: walletClient.balance,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAccountStore;
