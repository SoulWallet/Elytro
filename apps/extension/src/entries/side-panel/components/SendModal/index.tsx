import { Dialog, DialogContent } from '@/components/ui/dialog';
import SendStep from './SendStep';
import RecipientStep from './RecipientStep';
import ReviewStep from './ReviewStep';
import { TokenDTO } from '@/hooks/use-tokens';
import Steps from '@/components/steps/Steps';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
}

export interface TxData {
  token?: TokenDTO;
  amount?: string;
  to?: string;
}

export default function SendModal({ open, onOpenChange }: IProps) {
  const handleOnOpenChange = () => {
    onOpenChange();
  };
  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent className="h-screen">
        <div className="h-full relative">
          <div className="mt-10">
            <Steps>
              <SendStep />
              <RecipientStep />
              <ReviewStep />
            </Steps>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
