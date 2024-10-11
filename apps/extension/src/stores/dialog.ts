import { TSignTxDetail } from '@/constants/operations';
import { ELYTRO_SESSION_DATA, TSessionData } from '@/constants/session';
import { toast } from '@/hooks/use-toast';
import { elytroSDK } from '@/services/sdk';
import { formatSimulationResultToTxDetail } from '@/utils/format';
import { create } from 'zustand';
import useAccountStore from './account';

interface DialogState {
  isSignTxDialogOpen: boolean;
  signTxDetail: Nullable<TSignTxDetail>;
  userOp: Nullable<ElytroUserOperation>;
  openSignTxDialog: (
    userOp: ElytroUserOperation,
    actionName?: string,
    fromSession?: TSessionData,
    toSession?: TSessionData
  ) => void;
  closeSignTxDialog: () => void;
  loading: boolean;
  confirmTx: () => void;
}

const useDialogStore = create<DialogState>((set, get) => ({
  loading: false,
  isSignTxDialogOpen: false,
  userOp: null,
  // todo: remove this
  signTxDetail: null,
  openSignTxDialog: async (
    userOp: ElytroUserOperation,
    actionName: string = 'Confirm Transaction',
    // default is elytro internal interaction
    fromSession: TSessionData = ELYTRO_SESSION_DATA,
    toSession: TSessionData = ELYTRO_SESSION_DATA
  ) => {
    if (userOp) {
      set({ isSignTxDialogOpen: true, loading: true });

      try {
        await elytroSDK.signUserOperation(userOp);

        const simulationResult = await elytroSDK.simulateUserOperation(userOp);
        const txDetail = formatSimulationResultToTxDetail(simulationResult);

        set({
          signTxDetail: {
            txDetail,
            fromSession,
            toSession,
            actionName,
          },
          userOp,
        });
      } catch (error) {
        set({ isSignTxDialogOpen: false });
        toast({
          title: 'Oops!',
          description: 'Failed to get transaction detail',
        });
      } finally {
        set({ loading: false });
      }
    } else {
      set({ isSignTxDialogOpen: false });
      toast({
        title: 'Oops!',
        description: 'No sign transaction detail provided',
      });
    }
  },
  closeSignTxDialog: () => {
    set({
      isSignTxDialogOpen: false,
      signTxDetail: null,
      loading: false,
      userOp: null,
    });
  },
  confirmTx: async () => {
    try {
      set({ loading: true });
      const { userOp } = get();
      if (userOp) {
        await elytroSDK.sendUserOperation(userOp);
        get().closeSignTxDialog();
      } else {
        throw new Error('No user operation to send');
      }

      toast({
        title: 'Success!',
        description: 'Transaction sent successfully',
      });

      // todo: when activate,  account info have to wait a lot time to update.
      setTimeout(() => {
        useAccountStore.getState().update();
      }, 1000);
    } catch (error) {
      toast({
        title: 'Oops!',
        description: 'Failed to send transaction',
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDialogStore;
