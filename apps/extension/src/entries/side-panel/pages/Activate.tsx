import { BackArrow } from '@/assets/icons/BackArrow';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import ActivateStep, { ActivateStepStatus } from '../components/ActivateStep';
import useActivateStore from '@/stores/activate';
import { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import useDialogStore from '@/stores/dialog';

export default function Activate() {
  const { calcResult, calculateDeployUserOp, deployUserOp } =
    useActivateStore();
  const { openSignTxDialog } = useDialogStore();
  const [stepStatus, setStepStatus] = useState({
    deposit: ActivateStepStatus.Ready,
    activate: ActivateStepStatus.NonReady,
  });

  const recalculateStatus = () => {
    if (stepStatus.deposit === ActivateStepStatus.Ready && deployUserOp) {
      calculateDeployUserOp(deployUserOp);
    }
  };

  useInterval(recalculateStatus, 3000);

  useEffect(() => {
    if (calcResult) {
      const { needDeposit } = calcResult;
      setStepStatus({
        deposit: needDeposit
          ? ActivateStepStatus.Ready
          : ActivateStepStatus.Finished,
        activate: needDeposit
          ? ActivateStepStatus.NonReady
          : ActivateStepStatus.Ready,
      });
    }
  }, [calcResult]);

  const handleDeposit = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Receive, {
      fromActivate: '1',
    });
  };

  const handleActivate = () => {
    if (deployUserOp) {
      openSignTxDialog(
        deployUserOp,
        () => {
          // todo: when activated, UI need to be updated (but it seems have seconds latency)
          navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard, {
            activating: '1',
          });
        },
        'Activate account'
      );
    }
  };

  return (
    <div className="bg-gray-50 p-4 flex-grow">
      <BackArrow onClick={() => history.back()} />
      <h1 className="text-2xl font-medium my-10">Activate account</h1>

      <div className="space-y-4">
        <ActivateStep
          status={stepStatus.deposit}
          stepIndex={1}
          title="Deposit ETH"
          description="Deposit any amount of ETH. The ETH will be used as gas for account activation."
          buttonText="Deposit"
          onClick={handleDeposit}
        />

        <ActivateStep
          status={stepStatus.activate}
          stepIndex={2}
          title="Make a  transaction"
          description="Click on Active button to active your account. A transaction will be send on chain."
          buttonText="Activate"
          onClick={handleActivate}
        />
      </div>
    </div>
  );
}
