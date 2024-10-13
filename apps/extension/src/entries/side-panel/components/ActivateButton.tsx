import { Button } from '@/components/ui/button';
import { useState } from 'react';
import useActivateStore from '@/stores/activate';

export default function ActivateButton() {
  const [loading, setLoading] = useState(false);
  const { createDeployUserOp } = useActivateStore();

  const onClickActivate = async () => {
    try {
      setLoading(true);

      await createDeployUserOp();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="bg-elytro-btn-bg text-gray-900 hover:bg-blue-200 h-12"
      onClick={onClickActivate}
      disabled={loading}
    >
      {loading ? 'Activating...' : 'Activate account'}
    </Button>
  );
}
