import { StepsProvider, useSteps } from '../../components/StepsProvider';

import SetWalletAddress from './steps/SetWalletAddress';
import ResetOwner from './steps/ResetOwner';
import TabLayout from '../../components/TabLayout';

const RECOVERY_STEPS = [
  {
    title: 'Set Wallet Address',
    component: <SetWalletAddress />,
  },
  {
    title: 'Reset Owner',
    component: <ResetOwner />,
  },
];

function StepProgress() {
  const { steps } = useSteps();

  return (
    <div>
      {steps.map((step, index) => (
        <div key={index}>{step.title}</div>
      ))}
    </div>
  );
}

function StepContent() {
  const { currentStepIndex, steps } = useSteps();

  return (
    <div>
      <div>{steps[currentStepIndex].title}</div>
      <div>{steps[currentStepIndex].component}</div>
    </div>
  );
}

export default function Recovery() {
  return (
    <StepsProvider steps={RECOVERY_STEPS}>
      <TabLayout className="min-w-[1000px]">
        <div className="flex flex-row gap-4">
          <StepContent />

          <StepProgress />
        </div>
      </TabLayout>
    </StepsProvider>
  );
}
