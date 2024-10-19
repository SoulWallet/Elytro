import { useEffect, useState } from 'react';
import SendTxDetail from '../components/SendTxDetail';
import { useAccount } from '../contexts/account-context';
import { useApproval } from '../contexts/approval-context';
import { useWallet } from '@/contexts/wallet';
import Spin from '@/components/Spin';

export default function SendTx() {
  const {
    accountInfo: { chainType },
  } = useAccount();
  const { approval } = useApproval();
  const wallet = useWallet();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (approval?.data?.tx) {
      setLoading(false);
    }
  }, [approval]);

  if (!approval || !approval.data?.tx) {
    return <Spin isLoading={loading} />;
  }

  const handleConfirm = async () => {
    console.log('confirm');
    try {
      await wallet.sendTransaction(approval.data!.tx!);

      approval.resolve();
    } catch (error) {
      approval.reject(error);
    }
  };

  const handleCancel = () => {
    console.log('cancel');
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="max-w-screen-sm h-full flex py-4">
        <SendTxDetail
          txParams={approval.data.tx[0]}
          chainName={chainType}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

        <Spin isLoading={loading} />
      </div>
    </div>
  );
}
