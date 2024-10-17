import React from 'react';
import RequestProvider from './RequestProvider';
import '@/index.css';
import { Toaster } from './ui/toaster';
import { WalletProvider } from '@/entries/side-panel/contexts/wallet-context';

interface IPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

function PageContainer({ children, className }: IPageContainerProps) {
  return (
    <>
      <div className={`w-screen h-screen flex ${className}`}>
        <WalletProvider>
          <RequestProvider>{children}</RequestProvider>
        </WalletProvider>
      </div>

      <Toaster />
    </>
  );
}

export default PageContainer;
