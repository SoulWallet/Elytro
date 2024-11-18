import { PropsWithChildren } from 'react';
import StepProvider from './StepProvider';
import React from 'react';
import Step from './Step';

export default function Steps({ children }: PropsWithChildren) {
  const Steps = React.Children.toArray(children);
  return (
    <StepProvider stepNumber={Steps.length}>
      {Steps.map((s, index) => (
        <Step key={index} index={index + 1}>
          {s}
        </Step>
      ))}
    </StepProvider>
  );
}
