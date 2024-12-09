import { useWallet } from '@/contexts/wallet';
import { toast } from '@/hooks/use-toast';
import { DecodeResult } from '@soulwallet/decoder';
import type { Transaction } from '@soulwallet/sdk';
import { createContext, useContext, useState } from 'react';
import { toHex } from 'viem';

export enum UserOpType {
  DeployWallet = 1,
  SendTransaction,
  ApproveTransaction,
}

// TODO: move approvals to dialog-context. means that there is no isXXXDialogVisible but which dialog is open
type IDialogContext = {
  isUserOpConfirmDialogVisible: boolean;
  opType: Nullable<UserOpType>;
  isPacking: boolean;
  hasSufficientBalance: boolean;
  userOp: Nullable<ElytroUserOperation>;
  // TODO: params can be an array of transactions
  openUserOpConfirmDialog: (opType: UserOpType, params?: Transaction) => void;
  closeUserOpConfirmDialog: () => void;
};

const DialogContext = createContext<IDialogContext>({
  isUserOpConfirmDialogVisible: false,
  opType: null,
  isPacking: false,
  hasSufficientBalance: false,
  userOp: null,
  openUserOpConfirmDialog: () => {},
  closeUserOpConfirmDialog: () => {},
});

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet();
  const [isUserOpConfirmDialogVisible, setIsUserOpConfirmDialogVisible] =
    useState(false);

  const [opType, setOpType] = useState<Nullable<UserOpType>>(null);
  const [isPacking, setIsPacking] = useState(false);
  const [decodedDetail, setDecodedDetail] = useState<DecodeResult[]>([]);
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false);
  const [userOp, setUserOp] = useState<Nullable<ElytroUserOperation>>(null);

  const openUserOpConfirmDialog = async (
    type: UserOpType,
    params?: Transaction
  ) => {
    setIsUserOpConfirmDialogVisible(true);
    setOpType(type);
    packUserOp(type, params);
  };

  const closeUserOpConfirmDialog = () => {
    setIsUserOpConfirmDialogVisible(false);
    setOpType(null);
    setDecodedDetail([]);
    setHasSufficientBalance(false);
    setIsPacking(false);
  };

  const packUserOp = async (type: UserOpType, params?: Transaction) => {
    try {
      setIsPacking(true);

      let transferAmount = 0n;
      let currentUserOp: ElytroUserOperation;

      if (type === UserOpType.DeployWallet) {
        currentUserOp = await wallet.createDeployUserOp();
      } else if (params) {
        currentUserOp = await wallet.createTxUserOp([params]);

        const decodeRes = await wallet.decodeUserOp(currentUserOp);

        if (!decodeRes) {
          throw new Error('Failed to decode user operation');
        }

        transferAmount = decodeRes[0].value;

        console.log(decodedDetail, '----todo: remove');
        setDecodedDetail(decodeRes);
      } else {
        throw new Error('Invalid user operation type');
      }

      const { needDeposit = true } = await wallet.packUserOp(
        currentUserOp,
        toHex(transferAmount)
      );

      setUserOp(currentUserOp);
      setHasSufficientBalance(!needDeposit);
    } catch (err: unknown) {
      toast({
        title: 'Failed to pack user operation',
        variant: 'destructive',
        description: (err as Error)?.message,
      });
    } finally {
      setIsPacking(false);
    }
  };

  return (
    <DialogContext.Provider
      value={{
        userOp,
        opType,
        isPacking,
        hasSufficientBalance,
        isUserOpConfirmDialogVisible,
        openUserOpConfirmDialog,
        closeUserOpConfirmDialog,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  return useContext(DialogContext);
};
