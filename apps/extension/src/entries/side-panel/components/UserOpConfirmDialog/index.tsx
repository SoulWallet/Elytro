import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { useDialog } from '../../contexts/dialog-context';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserOpDetail } from './UserOpDetail';
import { useMemo } from 'react';

const PackingTip = () => {
  return (
    <div className="flex flex-col items-center gap-y-sm py-lg">
      <div className="bg-blue rounded-pill p-md">
        <LoaderCircle
          className="size-12 animate-spin"
          stroke="#fff"
          strokeOpacity={0.9}
        />
      </div>
      <div className="elytro-text-bold-body">Preparing the send package</div>
      <div className="elytro-text-tiny-body text-gray-600">
        This may take up to 5 seconds
      </div>
    </div>
  );
};

export function UserOpConfirmDialog() {
  const {
    isUserOpConfirmDialogVisible,
    opType,
    isPacking,
    closeUserOpConfirmDialog,
    hasSufficientBalance,
    userOp,
  } = useDialog();

  const renderContent = useMemo(() => {
    if (isPacking) return <PackingTip />;

    if (opType && userOp)
      return <UserOpDetail opType={opType} userOp={userOp} />;

    return 'No user operation';
  }, [isPacking, opType, userOp]);

  return (
    <Dialog modal={false} open={isUserOpConfirmDialogVisible}>
      <DialogContent showCloseButton={false}>
        {renderContent}

        <DialogFooter className="flex w-full mt-auto">
          <div className="flex w-full gap-x-2">
            <Button
              variant="ghost"
              onClick={closeUserOpConfirmDialog}
              className="flex-1 rounded-md border border-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={closeUserOpConfirmDialog}
              className="flex-1 rounded-md"
              disabled={isPacking || !hasSufficientBalance}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
