import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@/contexts/wallet';
type IApprovalContext = {
  approval: Nullable<TApprovalInfo>;
};

const ApprovalContext = createContext<IApprovalContext>({
  approval: null,
});

export const ApprovalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallet = useWallet();
  const [approval, setApproval] = useState<Nullable<TApprovalInfo>>();

  const getCurrentApproval = async () => {
    const approval = await wallet.getCurrentApproval();
    setApproval(approval);
  };

  useEffect(() => {
    getCurrentApproval();
  }, []);

  return (
    <ApprovalContext.Provider value={{ approval }}>
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApproval = () => {
  return useContext(ApprovalContext);
};
