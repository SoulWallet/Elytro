import { useMemo, useState } from 'react';
import { UserOpType, useTx } from '../contexts/tx-context';
import { useChain } from '../contexts/chain-context';
import PackingTip from '../components/PackingTip';
import { Button } from '@/components/ui/button';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import { useApproval } from '../contexts/approval-context';
import { useWallet } from '@/contexts/wallet';
import { formatObjectWithBigInt } from '@/utils/format';
import { toast } from '@/hooks/use-toast';
import SecondaryPageWrapper from '../components/SecondaryPageWrapper';
import { UserOpDetail } from '../components/UserOpDetail';

const UserOpTitleMap = {
  [UserOpType.DeployWallet]: 'Activate account',
  [UserOpType.SendTransaction]: "You' are sending",
  [UserOpType.ApproveTransaction]: 'Confirm Transaction',
};

export default function TxConfirm() {
  const wallet = useWallet();
  const {
    opType,
    isPacking,
    hasSufficientBalance,
    userOp,
    calcResult,
    decodedDetail,
  } = useTx();
  const { currentChain } = useChain();
  const [isSending, setIsSending] = useState(false);
  const { reject, resolve, approval } = useApproval();

  const renderContent = useMemo(() => {
    if (isPacking) return <PackingTip />;

    if (opType) {
      return (
        <UserOpDetail
          opType={opType}
          calcResult={calcResult}
          chainId={currentChain!.chainId}
          decodedUserOp={decodedDetail}
          session={approval?.data?.dApp}
          from={userOp?.sender}
        />
      );
    }

    // TODO: error tip
    return null;
  }, [isPacking, opType, calcResult, decodedDetail]);

  const handleCancel = () => {
    if (opType === UserOpType.ApproveTransaction) {
      reject();
    } else if (history.length > 1) {
      history.back();
    } else {
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
    }
  };

  const onSendSuccess = async (opHash: string) => {
    if (opType === UserOpType.ApproveTransaction) {
      resolve(opHash);
    } else {
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard, {
        activating: opType as unknown as string,
      });
    }
  };

  const handleConfirm = async () => {
    try {
      setIsSending(true);

      let currentUserOp = userOp;

      // TODO: check this logic
      if (!currentUserOp?.paymaster) {
        currentUserOp = await wallet.estimateGas(currentUserOp!);
      }

      const { signature, opHash } = await wallet.signUserOperation(
        formatObjectWithBigInt(currentUserOp!)
      );

      currentUserOp!.signature = signature;

      // const simulationResult =
      //   await elytroSDK.simulateUserOperation(currentUserOp);
      // const txDetail = formatSimulationResultToTxDetail(simulationResult);

      await wallet.sendUserOperation(currentUserOp!);

      // TODO: what to do if op is a batch of txs?
      if (decodedDetail) {
        wallet.addNewHistory({
          opHash,
          timestamp: Date.now(),
          from: userOp!.sender,
          to: decodedDetail.to,
          method: decodedDetail.method,
          value: decodedDetail.value.toString(),
        });
      }

      await toast({
        title: 'Transaction sent successfully',
        description: 'User operation hash: ' + opHash,
      });

      onSendSuccess(opHash);
    } catch (error) {
      toast({
        title: 'Failed to send transaction',
        description:
          (error as Error).message ||
          String(error) ||
          'Unknown error, please try again',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SecondaryPageWrapper
      className="flex flex-col p-md"
      title={UserOpTitleMap[opType!]}
    >
      {/* Content */}
      <div className="flex flex-col gap-y-md pb-14">{renderContent}</div>

      {/* Footer */}
      <div className="flex w-full mt-auto">
        <div className="flex w-full gap-x-2">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex-1 rounded-md border border-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 rounded-md"
            disabled={isPacking || !hasSufficientBalance || isSending}
          >
            {isPacking
              ? 'Packing...'
              : hasSufficientBalance
                ? isSending
                  ? 'Confirming...'
                  : 'Confirm'
                : 'Insufficient balance'}
          </Button>
        </div>
      </div>
    </SecondaryPageWrapper>
  );
}
