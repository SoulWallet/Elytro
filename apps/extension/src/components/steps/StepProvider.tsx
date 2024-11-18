import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { useStep } from 'usehooks-ts';
export interface StepValueInterface {
  stepNumber: number;
  currentStep: number;
  stepData: unknown;
  handleBack: <T>(data: T) => void;
  handleContinue: <T>(data: T) => void;
}

export interface StepProviderProps extends PropsWithChildren {
  stepNumber: number;
}

export const StepContext = createContext<StepValueInterface>({
  stepNumber: 0,
  currentStep: 0,
  stepData: null,
  handleBack: () => {},
  handleContinue: () => {},
});

export default function StepProvider({
  stepNumber,
  children,
}: StepProviderProps) {
  const [currentStep, helpers] = useStep(stepNumber);
  const [stepData, setStepData] = useState<unknown>();
  const { canGoToPrevStep, canGoToNextStep, goToNextStep, goToPrevStep } =
    helpers;
  const handleBack = (data: unknown) => {
    if (canGoToPrevStep) {
      goToPrevStep();
      if (data)
        setStepData((prev: unknown) => ({
          ...(prev as unknown as object),
          ...data,
        }));
    }
  };
  const handleContinue = (data: unknown) => {
    if (canGoToNextStep) {
      goToNextStep();
      if (data)
        setStepData((prev: unknown) => ({
          ...(prev as unknown as object),
          ...data,
        }));
    }
  };
  const contextValue = {
    stepNumber,
    currentStep,
    stepData,
    handleContinue,
    handleBack,
  };

  return (
    <StepContext.Provider value={contextValue}>{children}</StepContext.Provider>
  );
}

export const useElytroStep = () => {
  return useContext(StepContext);
};
