import { useState } from 'react';
import TabLayout from '../../components/TabLayout';
import RecoverSteps, { StepEnum } from './RecoverSteps';
import AddressStep from './AddressStep';
import AddpasskeyStep from './AddPasskeyStep';
import GuardianSignatureRequestStep from './GuardianSignatureRequestStep';

export default function RecoverAccount() {
  const [step, setStep] = useState<StepEnum>(StepEnum.EnterWalletAddress);
  return (
    <TabLayout className="bg-transparent">
      <div className="h-[80vh] w-[90vw] md:w-[65vw] grid grid-cols-4 space-x-8">
        <div className="col-span-3">
          <div className="bg-white rounded-super p-10">
            {step === StepEnum.EnterWalletAddress ? (
              <AddressStep onContinue={() => setStep(StepEnum.AddPasskey)} />
            ) : null}
            {step === StepEnum.AddPasskey ? (
              <AddpasskeyStep
                onContinue={() => setStep(StepEnum.RecoveryContactConfirmation)}
                onBack={() => setStep(StepEnum.EnterWalletAddress)}
              />
            ) : null}
            {step === StepEnum.RecoveryContactConfirmation ? (
              <GuardianSignatureRequestStep />
            ) : null}
          </div>
        </div>
        <RecoverSteps step={step} />
      </div>
    </TabLayout>
  );
}
