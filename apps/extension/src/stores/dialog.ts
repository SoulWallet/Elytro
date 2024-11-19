import { TSignTxDetail } from '@/constants/operations';
import { ELYTRO_SESSION_DATA, TSessionData } from '@/constants/session';
import { toast } from '@/hooks/use-toast';
import { elytroSDK } from '@/background/services/sdk';
import { formatSimulationResultToTxDetail } from '@/utils/format';
import { create } from 'zustand';

interface DialogState {
  isSignTxDialogOpen: boolean;
  isSendTxDialogOpen: boolean;
  signTxDetail: Nullable<TSignTxDetail>;
  userOp: Nullable<ElytroUserOperation>;
  txDetail: Nullable<TTransactionInfo>;
  openSignTxDialog: (
    userOp: ElytroUserOperation,
    onSuccess?: () => void,
    actionName?: string,
    fromSession?: TSessionData,
    toSession?: TSessionData
  ) => void;
  closeSignTxDialog: () => void;
  loading: boolean;
  confirmTx: () => Promise<void>;
  successCallback: Nullable<() => void>;
  closeSendTxDialog: () => void;
  openSendTxDialog: (
    txDetail: TTransactionInfo,
    afterSendTxConfirm: () => void
  ) => void;
  afterSendTxConfirm: () => void;
}

const useDialogStore = create<DialogState>((set, get) => ({
  loading: false,
  isSignTxDialogOpen: false,
  isSendTxDialogOpen: false,
  userOp: null,
  successCallback: null,
  // todo: remove this
  signTxDetail: null,
  txDetail: null,
  afterSendTxConfirm: () => {},
  openSignTxDialog: async (
    userOp: ElytroUserOperation,
    onSuccess?: () => void,
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
          successCallback: onSuccess,
        });
      } catch (_error) {
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

      get().successCallback?.();
    } catch (_error) {
      toast({
        title: 'Oops!',
        description: 'Failed to send transaction',
      });
    } finally {
      set({ loading: false });
    }
  },
  openSendTxDialog: (txDetail, afterSendTxConfirm) => {
    set({
      isSendTxDialogOpen: true,
      txDetail,
      afterSendTxConfirm,
    });
  },
  closeSendTxDialog: () => {
    set({
      isSendTxDialogOpen: false,
      txDetail: null,
      afterSendTxConfirm: () => {},
    });
  },
}));

export default useDialogStore;
