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
  calcResult: Nullable<TUserOperationPreFundResult>;
  decodedDetail: Nullable<DecodeResult[]>;
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
  calcResult: null,
  decodedDetail: null,
  openUserOpConfirmDialog: () => {},
  closeUserOpConfirmDialog: () => {},
});

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet();
  const [isUserOpConfirmDialogVisible, setIsUserOpConfirmDialogVisible] =
    useState(false);

  const [opType, setOpType] = useState<Nullable<UserOpType>>(null);
  const [isPacking, setIsPacking] = useState(false);
  const [decodedDetail, setDecodedDetail] =
    useState<Nullable<DecodeResult[]>>(null);
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false);
  const [userOp, setUserOp] = useState<Nullable<ElytroUserOperation>>(null);
  const [calcResult, setCalcResult] =
    useState<Nullable<TUserOperationPreFundResult>>(null);

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
    setDecodedDetail(null);
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

        setDecodedDetail(decodeRes);
      } else {
        throw new Error('Invalid user operation type');
      }

      currentUserOp = await wallet.estimateGas(currentUserOp);

      const res = await wallet.packUserOp(currentUserOp, toHex(transferAmount));

      setUserOp(res.userOp);
      setCalcResult(res.calcResult);
      setHasSufficientBalance(!res.calcResult.needDeposit);
    } catch (err: unknown) {
      toast({
        title: 'Failed to pack user operation',
        variant: 'destructive',
        description: (err as Error)?.message || String(err) || 'Unknown Error',
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
        calcResult,
        hasSufficientBalance,
        decodedDetail,
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
