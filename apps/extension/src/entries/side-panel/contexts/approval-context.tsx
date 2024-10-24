import { createContext, useContext, useState } from 'react';
import { useWallet } from '@/contexts/wallet';
import { useInterval } from 'usehooks-ts';
import { toast } from '@/hooks/use-toast';

type IApprovalContext = {
  approval: Nullable<TApprovalInfo>;
  resolve: (data: unknown) => Promise<void>;
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
  const [approval, setApproval] = useState<Nullable<TApprovalInfo>>(null);

  const getCurrentApproval = async () => {
    const approval = await wallet.getCurrentApproval();
    setApproval(approval);
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

  // todo: optimize it
  useInterval(() => {
    if (!approval) {
      getCurrentApproval();
    }
  }, 1000);

  return (
    <ApprovalContext.Provider value={{ approval, resolve, reject }}>
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApproval = () => {
  return useContext(ApprovalContext);
};
