import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAccount } from '../contexts/account-context';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/wallet';

export default function ActivateButton() {
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const { accountInfo } = useAccount();

  const onClickActivate = async () => {
    try {
      setLoading(true);
      const userOp = await wallet.createDeployUserOp();

      // TODO: send userOp to Send Tx Modal
      console.log('TODO: send userOp to Send Tx Modal', userOp);
    } catch (error) {
      toast({
        title: 'Activate account failed',
        description: (error as Error)?.message,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="bg-elytro-btn-bg text-gray-900 hover:bg-blue-200 h-12"
      onClick={onClickActivate}
      disabled={loading || !accountInfo}
    >
      {loading ? 'Activating...' : 'Activate account'}
    </Button>
  );
}
