import { TSignTxDetail } from '@/constants/operations';
import { ELYTRO_SESSION_DATA, TSessionData } from '@/constants/session';
import { toast } from '@/hooks/use-toast';
import { elytroSDK } from '@/services/sdk';
import { formatSimulationResultToTxDetail } from '@/utils/format';
import { create } from 'zustand';

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
      const { userOp } = get();
      if (userOp) {
        await elytroSDK.sendUserOperation(userOp);
        get().closeSignTxDialog();
      } else {
        throw new Error('No user operation to send');
      }
    } catch (error) {
      toast({
        title: 'Oops!',
        description: 'Failed to send transaction',
      });
    }
  },
}));

export default useDialogStore;
