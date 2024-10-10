import React from 'react';
import RequestProvider from './RequestProvider';
import '@/index.css';
import { Toaster } from './ui/toaster';

interface IPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

function PageContainer({ children, className }: IPageContainerProps) {
  return (
    <div className={`w-screen h-screen flex ${className}`}>
      <RequestProvider>{children}</RequestProvider>
      <Toaster />
    </div>
  );
}

export default PageContainer;
