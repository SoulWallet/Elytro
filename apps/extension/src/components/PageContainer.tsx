import React from 'react';
import RequestProvider from './RequestProvider';
import '@/index.css';

interface IPageContainerProps {
  children: React.ReactNode;
}

function PageContainer({ children }: IPageContainerProps) {
  return (
    <div className="w-screen h-screen">
      <RequestProvider>{children}</RequestProvider>
    </div>
  );
}

export default PageContainer;
