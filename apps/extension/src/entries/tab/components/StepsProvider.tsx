import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

type TStepContext = {
  steps: TStep[];
  currentStepIndex: number;
  currentStep: Nullable<TStep>;
  canGoBack: boolean;
  canGoNext: boolean;
  goNext: () => void;
  goBack: () => void;
};

const StepContext = createContext<TStepContext>({
  steps: [],
  currentStepIndex: 0,
  currentStep: null,
  canGoBack: false,
  canGoNext: false,
  goNext: () => {},
  goBack: () => {},
});

type TStep = {
  title: string;
  component: ReactNode;
};

interface IStepsProviderProps extends PropsWithChildren {
  steps: TStep[];
  defaultStep?: number;
  footer?: ReactNode;
}

function StepsProvider({
  steps,
  defaultStep = 0,
  children,
}: IStepsProviderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(defaultStep);

  const { canGoBack, canGoNext } = useMemo(
    () => ({
      canGoBack: currentStepIndex !== 0,
      canGoNext: currentStepIndex !== steps.length - 1,
    }),
    [currentStepIndex, steps.length]
  );

  const currentStep = useMemo(() => {
    return steps[currentStepIndex] ?? null;
  }, [currentStepIndex, steps]);

  const goNext = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <StepContext.Provider
      value={{
        steps,
        currentStepIndex,
        goNext,
        goBack,
        canGoBack,
        canGoNext,
        currentStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}

const useSteps = () => {
  return useContext(StepContext);
};

export { StepsProvider, useSteps };
