import { TSignTxDetail } from '@/constants/operations';
import { ELYTRO_SESSION_DATA, TSessionData } from '@/constants/session';
import { toast } from '@/hooks/use-toast';
import { elytroSDK } from '@/services/sdk';
import { formatSimulationResultToTxDetail } from '@/utils/format';
import { create } from 'zustand';

interface DialogState {
  isSignTxDialogOpen: boolean;
  signTxDetail: Nullable<TSignTxDetail>;
  openSignTxDialog: (
    userOp: ElytroUserOperation,
    actionName?: string,
    fromSession?: TSessionData,
    toSession?: TSessionData
  ) => void;
  closeSignTxDialog: () => void;
  getTxDetailFromUserOp: () => void;
  loading: boolean;
}

const useDialogStore = create<DialogState>((set) => ({
  loading: false,
  isSignTxDialogOpen: false,
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
        // const txDetail = formatSimulationResultToTxDetail(
        //   await elytroSDK.simulateUserOperation(userOp)
        // );
        set({
          signTxDetail: {
            userOpDetail: {
              from: '0x0000000000000000000000000000000000000000',
              to: '0x0000000000000000000000000000000000000000',
              value: 0,
              fee: '0',
              callData: userOp.callData,
            },
            fromSession,
            toSession,
            actionName,
          },
        });
      } catch (error) {
        toast({
          title: 'Oops!',
          description: 'Failed to get transaction detail',
        });
      } finally {
        set({ loading: false });
      }
    } else {
      toast({
        title: 'Oops!',
        description: 'No sign transaction detail provided',
      });
    }
  },
  closeSignTxDialog: () => {
    set({ isSignTxDialogOpen: false, signTxDetail: null, loading: false });
  },
  getTxDetailFromUserOp() {},
}));

export default useDialogStore;
