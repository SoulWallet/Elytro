import { Button } from '@/components/ui/button';
import { useSteps } from '../../components/StepsProvider';

interface IStepControlsProps {
  beforeBack?: () => Promise<void>;
  beforeNext?: () => Promise<void>;
  disabledBack?: boolean;
  disabledNext?: boolean;
}

export default function StepControls({
  beforeBack,
  beforeNext,
  disabledBack = false,
  disabledNext = false,
}: IStepControlsProps) {
  const { goBack, goNext, canGoBack, canGoNext } = useSteps();

  const handleBack = async () => {
    await beforeBack?.();
    goBack();
  };

  const handleNext = async () => {
    await beforeNext?.();
    goNext();
  };

  return (
    <div>
      <Button onClick={handleBack} disabled={disabledBack || !canGoBack}>
        Back
      </Button>
      <Button onClick={handleNext} disabled={disabledNext || !canGoNext}>
        Next
      </Button>
    </div>
  );
}
