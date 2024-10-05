import useDialogStore from '@/stores/dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatAddressToShort } from '@/utils/format';

const LabelValue = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className="w-full flex items-center justify-between text-sm">
      <div className="text-gray-400 font-medium">{label}</div>
      <div className="text-gray-900">{value || '--'}</div>
    </div>
  );
};

export default function SignTxModal() {
  const { isSignTxDialogOpen, closeSignTxDialog, signTxDetail } =
    useDialogStore();

  const handleClose = (open: boolean) => {
    // only allow close inside the dialog
    if (!open) {
      closeSignTxDialog();
    }
  };

  return (
    <Dialog open={isSignTxDialogOpen} modal={false} onOpenChange={handleClose}>
      <DialogContent className="flex flex-col items-center gap-y-6">
        {/* DApp Action Detail */}
        <div className="flex flex-col items-center">
          <img
            className="w-16 h-16 p-2"
            src={signTxDetail?.action?.dAppLogo}
            alt="dApp Logo"
          />
          <div className="text-xl font-medium text-gray-900">
            {signTxDetail?.action?.name}
          </div>
          <div className="text-sm text-gray-300">
            {signTxDetail?.action?.description}
          </div>
        </div>

        {/* Sign Tx Detail */}
        <div className="w-full flex flex-col gap-y-2">
          <LabelValue
            label="Account"
            value={formatAddressToShort(signTxDetail?.accountAddress)}
          />
          {/* TODO: check if to's logo & name are available */}
          <LabelValue
            label="Contract Address"
            value={formatAddressToShort(signTxDetail?.contractAddress)}
          />
          <LabelValue label="Fee" value={signTxDetail?.fee} />

          {/* TODO: tx detail. implement it later. ux is not ready */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
