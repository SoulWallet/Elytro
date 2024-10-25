import greenTickCircleIcon from '@/assets/icons/greenTickCircle.svg';

export enum StepEnum {
  EnterWalletAddress = 'Enter wallet address',
  AddPasskey = 'Add passkey',
  RecoveryContactConfirmation = 'Recovery contact confirmation',
}

export default function RecoverSteps({ step }: { step: StepEnum }) {
  const steps = [
    StepEnum.EnterWalletAddress,
    StepEnum.AddPasskey,
    StepEnum.RecoveryContactConfirmation,
  ];
  const stepIndex = steps.findIndex((st) => st === step);
  return (
    <div>
      <div className="p-4 bg-white/70 rounded-lg">
        <div className="text-lg font-medium mb-2">
          Recovery process ({stepIndex + 1}/{steps.length})
        </div>
        <div className="space-y-2">
          {steps.map((stp, index) => (
            <div
              key={stp}
              className={`flex items-center space-x-2 ${stepIndex >= index ? '' : 'opacity-60'}`}
            >
              {stepIndex > index ? (
                <img className="w-5 h-5" src={greenTickCircleIcon} alt="" />
              ) : (
                <div className="w-5 h-5 border-2 border-black rounded-full" />
              )}
              <span className="font-medium">Step</span> {index + 1} {stp}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
