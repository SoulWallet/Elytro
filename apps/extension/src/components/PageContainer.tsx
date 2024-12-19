import React from 'react';
import RequestProvider from './RequestProvider';
import '@/index.css';
import { Toaster } from './ui/toaster';
import { WalletProvider } from '@/contexts/wallet';
import { KeyringProvider } from '@/contexts/keyring';
import ErrorBoundary from './ErrorBoundary';
import { cn } from '@/utils/shadcn/utils';
import { ChainProvider } from '@/entries/side-panel/contexts/chain-context';

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
              <ChainProvider>
                <RequestProvider>{children}</RequestProvider>
              </ChainProvider>
            </KeyringProvider>
          </WalletProvider>
        </div>
      </ErrorBoundary>
      <Toaster />
    </>
  );
}

export default PageContainer;
