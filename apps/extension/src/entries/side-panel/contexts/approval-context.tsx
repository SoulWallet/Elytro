import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@/contexts/wallet';
import { toast } from '@/hooks/use-toast';
import { RuntimeMessage } from '@/utils/message';
import { EVENT_TYPES } from '@/constants/events';
import { UserOpType, useTx } from './tx-context';
import { Transaction } from '@soulwallet/sdk';
import { useInterval } from 'usehooks-ts';

type IApprovalContext = {
  approval: Nullable<TApprovalInfo>;
  resolve: (data?: unknown) => Promise<void>;
  reject: (e?: Error) => Promise<void>;
};

const ApprovalContext = createContext<IApprovalContext>({
  approval: null,
  resolve: async () => {},
  reject: async () => {},
});

export const ApprovalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallet = useWallet();
  const { openUserOpConfirmTx } = useTx();
  const [approval, setApproval] = useState<Nullable<TApprovalInfo>>(null);

  const getCurrentApproval = async (targetApprovalId?: string) => {
    const approval = await wallet.getCurrentApproval();

    // todo : add '&& approval?.id === targetApprovalId' once all approval requests are handled by the target page
    if (approval) {
      setApproval(approval);

      // TODO: move approval fetching to target page
      // approval.type === ApprovalTypeEn.SendTx
      if (approval.data?.tx?.[0]) {
        openUserOpConfirmTx(
          UserOpType.ApproveTransaction,
          approval.data?.tx?.[0] as Transaction
        );
      }
    } else {
      setApproval(null);
    }
  };

  const resolve = async (data: unknown) => {
    if (!approval) {
      return;
    }
    await wallet.resolveApproval(approval.id, data);
  };

  const reject = async (e?: Error) => {
    if (!approval) {
      return;
    }
    await wallet.rejectApproval(approval.id);

    toast({
      title: 'Rejected',
      description: e ? e.message : 'The approval request has been rejected',
    });
  };

  // todo: delete it once all approval requests are handled by the target page
  useInterval(() => {
    if (!approval) {
      getCurrentApproval();
    }
  }, 1000);

  useEffect(() => {
    RuntimeMessage.onMessage(EVENT_TYPES.APPROVAL.REQUESTED, (approvalId) => {
      getCurrentApproval(approvalId as unknown as string);
    });
  }, [approval]);

  return (
    <ApprovalContext.Provider value={{ approval, resolve, reject }}>
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApproval = () => {
  return useContext(ApprovalContext);
};
