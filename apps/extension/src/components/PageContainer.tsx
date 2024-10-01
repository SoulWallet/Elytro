import React from 'react';
import RequestProvider from './RequestProvider';
import '@/index.css';
import { Toaster } from './ui/toaster';

interface IPageContainerProps {
  children: React.ReactNode;
}

function PageContainer({ children }: IPageContainerProps) {
  return (
    <div className="w-screen h-screen">
      <RequestProvider>{children}</RequestProvider>
      <Toaster />
    </div>
  );
}

export default PageContainer;
