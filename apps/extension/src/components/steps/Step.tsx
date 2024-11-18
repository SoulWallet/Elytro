import { PropsWithChildren, useContext } from 'react';
import { StepContext } from './StepProvider';

interface IProps extends PropsWithChildren {
  index: number;
}

export default function Step({ children, index }: IProps) {
  const value = useContext(StepContext);
  if (value?.currentStep !== index) return null;
  return children;
}
