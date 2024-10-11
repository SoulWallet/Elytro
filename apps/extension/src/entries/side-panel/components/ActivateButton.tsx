import { Button } from '@/components/ui/button';
import { navigateTo } from '@/utils/navigation';

import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import { elytroSDK } from '@/services/sdk';
import keyring from '@/services/keyring';
import { useState } from 'react';
import useDialogStore from '@/stores/dialog';

export default function ActivateButton() {
  const [loading, setLoading] = useState(false);
  const { openSignTxDialog } = useDialogStore();

  const onClickActivate = async () => {
    try {
      setLoading(true);

      const deployUserOp = await elytroSDK.createUnsignedDeployWalletUserOp(
        keyring.owner!.address
      );

      await elytroSDK.estimateGas(deployUserOp);
      await elytroSDK.signUserOperation(deployUserOp);
      const getSponsored = await elytroSDK.canGetSponsored(deployUserOp);

      if (getSponsored) {
        openSignTxDialog(deployUserOp);
      } else {
        navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Activate);
      }
    } catch (error) {
      console.log('error', error);
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
