import React from 'react';
import RequestProvider from './RequestProvider';
import '@/index.css';
import { Toaster } from './ui/toaster';
import { WalletProvider } from '@/contexts/wallet';
import { KeyringProvider } from '@/contexts/keyring';
import ErrorBoundary from './ErrorBoundary';
import { cn } from '@/utils/shadcn/utils';

interface IPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

function PageContainer({ children, className }: IPageContainerProps) {
  return (
    <>
      <ErrorBoundary>
        <div
          className={cn(
            'w-screen h-screen flex justify-center mx-auto',
            className
          )}
        >
          <WalletProvider>
            <KeyringProvider>
              <RequestProvider>{children}</RequestProvider>
            </KeyringProvider>
          </WalletProvider>
        </div>
      </ErrorBoundary>
      <Toaster />
    </>
  );
}

export default PageContainer;
