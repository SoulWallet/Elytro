import React from 'react';
import RequestProvider from './RequestProvider';

interface IPageContainerProps {
  children: React.ReactNode;
}

function PageContainer({ children }: IPageContainerProps) {
  return (
    <div className="w-full h-full bg-white">
      <RequestProvider>{children}</RequestProvider>
    </div>
  );
}

export default PageContainer;
