import { Button } from '@/components/ui/button';
import { useAccount } from '../contexts/account-context';
import { toast } from '@/hooks/use-toast';
import { useDialog, UserOpType } from '../contexts/dialog-context';

export default function ActivateButton() {
  const { accountInfo } = useAccount();
  const { openUserOpConfirmDialog, isUserOpConfirmDialogVisible } = useDialog();

  const onClickActivate = async () => {
    try {
      // TODO: send userOp to Send Tx Modal
      openUserOpConfirmDialog(UserOpType.DeployWallet);
    } catch (error) {
      toast({
        title: 'Activate account failed',
        description: (error as Error)?.message,
      });
      console.error(error);
    }
  };

  return (
    <Button
      onClick={onClickActivate}
      disabled={isUserOpConfirmDialogVisible || !accountInfo}
    >
      Activate account
    </Button>
  );
}
