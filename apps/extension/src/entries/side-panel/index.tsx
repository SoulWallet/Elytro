import React from 'react';
import ReactDOM from 'react-dom/client';
import HashRouter from '@/components/HashRouter';
import { routes } from './routes';
import PageContainer from '@/components/PageContainer';
import { WalletProvider } from './contexts/wallet-context';

const SidePanelApp: React.FC = () => (
  <PageContainer className="min-w-96">
    <WalletProvider>
      <HashRouter routes={routes} />
    </WalletProvider>
  </PageContainer>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidePanelApp />
  </React.StrictMode>
);
