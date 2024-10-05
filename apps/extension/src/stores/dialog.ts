import { TSignTxDetail } from '@/constants/operations';
import { toast } from '@/hooks/use-toast';
import { create } from 'zustand';

interface DialogState {
  isSignTxDialogOpen: boolean;
  signTxDetail: Nullable<TSignTxDetail>;
  openSignTxDialog: (detail: TSignTxDetail) => void;
  closeSignTxDialog: () => void;
}

const useDialogStore = create<DialogState>((set) => ({
  isSignTxDialogOpen: false,
  // todo: remove this
  signTxDetail: {
    accountAddress: '0x123',
    contractAddress: '0x123',
    fee: '100',
    txHash: '0x123',
    action: {
      dAppLogo:
        'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
      name: 'Transfer',
      description: 'Transfer 10 USDC to 0x123',
    },
  },
  openSignTxDialog: (detail) => {
    if (detail) {
      set({ isSignTxDialogOpen: true, signTxDetail: detail });
    } else {
      toast({
        title: 'Oops!',
        description: 'No sign transaction detail provided',
      });
    }
  },
  closeSignTxDialog: () => {
    set({ isSignTxDialogOpen: false, signTxDetail: null });
  },
}));

export default useDialogStore;
