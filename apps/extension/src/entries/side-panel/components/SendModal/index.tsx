import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import SendStep from './SendStep';
import RecipientStep from './RecipientStep';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
}

enum SendStepEnum {
  send = 1,
  recipient = 2,
  review = 3,
}

export default function SendModal({ open, onOpenChange }: IProps) {
  const [step, setStep] = useState(SendStepEnum.recipient);
  const [isVlaid, setIsValid] = useState(false);
  const moveStep = () => {
    if (step === SendStepEnum.review) {
      return setStep(SendStepEnum.send);
    }
    return setStep(step + 1);
  };
  const checkIsValid = (valid: boolean) => {
    setIsValid(valid);
  };
  const handleOnOpenChange = () => {
    onOpenChange();
    setStep(SendStepEnum.send);
    setIsValid(false);
  };
  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent className="h-screen">
        <div className="h-full relative">
          <div className="mt-10">
            {step === SendStepEnum.send ? (
              <SendStep checkIsValid={checkIsValid} />
            ) : null}
            {step === SendStepEnum.recipient ? (
              <RecipientStep checkIsValid={checkIsValid} />
            ) : null}
            {step === SendStepEnum.review ? 'review' : null}
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <Button
              disabled={!isVlaid}
              className={`w-full p-8 rounded-full ${isVlaid ? 'bg-[#0E2D50]' : 'bg-[#F2F3F5] text-[#676B75]'}`}
              onClick={moveStep}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
