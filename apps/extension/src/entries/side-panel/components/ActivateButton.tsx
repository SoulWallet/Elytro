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
      openSignTxDialog(
        {
          callData: '0x',
          callGasLimit: '0x194d',
          factory: '0xF78Ae187CED0Ca5Fb98100d3F0EAB7a6461d6fC6',
          factoryData:
            'a1aafc9e0000000000000000000000000000000000000000000000000000000000000040e6be02833bbbb7621abde523edf7041a434a475e79c3df01c698d0521588e27000000000000000000000000000000000000000000000000000000000000001a4ac27308a0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000880c6eb80583795625935b08aa28eb37f16732c700000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000000100000000000000000000000038cb7e3f163cad2f4dabb2cda7ebb804fc8c7db90000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000543cc36538cf53a13af5c28bb693091e23cf5bb56700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          maxFeePerGas: 1000504n,
          maxPriorityFeePerGas: 1000000n,
          nonce: 0,
          paymaster: '0x0000000000000039cd5e8aE05257CE51C473ddd1',
          paymasterData:
            '0x0000006707974200000000000001ab05ee61a5bcc4b9839612af58febe1563706fc73b5e0b4e242eea79b84d89048886a9787c2fb133f9f584559c4ee1710c79eee77375982c52b6f506f6ee581b',
          paymasterPostOpGasLimit: '0x1',
          paymasterVerificationGasLimit: '0x6c3a',
          preVerificationGas: '0x989680',
          sender: '0xfcE9F3B3779ABE40615A69a0650e5E22176B7cd7',
          signature: '0x',
          verificationGasLimit: '0x10cec1',
        },
        'Activate account'
      );

      // const deployUserOp = await elytroSDK.createUnsignedDeployWalletUserOp(
      //   keyring.owner!.address
      // );

      // await elytroSDK.estimateGas(deployUserOp);

      // // await elytroSDK.signUserOperation(deployUserOp);
      // const getSponsored = await elytroSDK.canGetSponsored(deployUserOp);

      // if (getSponsored) {
      //   debugger;
      //   openSignTxDialog(deployUserOp);
      // } else {
      //   navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Activate);
      // }
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
