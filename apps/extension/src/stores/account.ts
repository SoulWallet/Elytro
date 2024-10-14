import { DEFAULT_CHAIN_TYPE } from '@/constants/chains';
import { create } from 'zustand';

interface AccountState extends TAccountInfo {
  loading: boolean;
  currentUserOp: Nullable<ElytroUserOperation>;
  setCurrentUserOp: (userOp: ElytroUserOperation) => void;
  setIsActivated: (isActivated: boolean) => void;
  updateAccount: (info: TAccountInfo) => void;
}

const useAccountStore = create<AccountState>((set) => ({
  address: null,
  isActivated: false,
  chainType: DEFAULT_CHAIN_TYPE,
  loading: false,
  balance: null,
  currentUserOp: null,
  setIsActivated(isActivated) {
    set({ isActivated });
  },
  setCurrentUserOp: (userOp: ElytroUserOperation) =>
    set({ currentUserOp: userOp }),
  updateAccount: (info) =>
    set({
      ...info,
    }),
}));

export default useAccountStore;
