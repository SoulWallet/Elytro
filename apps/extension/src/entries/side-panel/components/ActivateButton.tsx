import { Button } from '@/components/ui/button';
import { useState } from 'react';
import useActivateStore from '@/stores/activate';
import { useAccount } from '../contexts/account-context';
import { toast } from '@/hooks/use-toast';

export default function ActivateButton() {
  const [loading, setLoading] = useState(false);
  const { createDeployUserOp } = useActivateStore();
  const {
    accountInfo: { ownerAddress },
  } = useAccount();

  const onClickActivate = async () => {
    try {
      setLoading(true);

      await createDeployUserOp(ownerAddress!);
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
      disabled={loading || !ownerAddress}
    >
      {loading ? 'Activating...' : 'Activate account'}
    </Button>
  );
}
