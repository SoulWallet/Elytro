import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
}

export default function SendModal({ open, onOpenChange }: IProps) {
  const [step, setStep] = useState(1);
  const sendStep = {
    send: 1,
    recipient: 2,
    review: 3,
  };
  const moveStep = () => {
    if (step === sendStep.review) {
      return setStep(sendStep.send);
    }
    return setStep(step + 1);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen">
        <div>
          {step === sendStep.send ? 'send' : null}
          {step === sendStep.recipient ? 'recipient' : null}
          {step === sendStep.review ? 'review' : null}
        </div>
        <DialogFooter>
          <Button size="lg" onClick={moveStep}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
