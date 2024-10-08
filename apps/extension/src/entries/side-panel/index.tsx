import React from 'react';
import ReactDOM from 'react-dom/client';
import HashRouter from '@/components/HashRouter';
import { routes } from './routes';
import PageContainer from '@/components/PageContainer';
import { WalletProvider } from './contexts/wallet-context';
import { RUNTIME_MESSAGE_TYPE } from '@/constants/message';

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);

const main = () => {
  const SidePanelApp: React.FC = () => (
    <PageContainer className="min-w-96">
      <WalletProvider>
        <HashRouter routes={routes} />
      </WalletProvider>
    </PageContainer>
  );

  root.render(
    <React.StrictMode>
      <SidePanelApp />
    </React.StrictMode>
  );
};

const bootstrap = () => {
  chrome.runtime
    .sendMessage({ type: RUNTIME_MESSAGE_TYPE.DOM_READY })
    .then((res) => {
      if (!res) {
        setTimeout(() => {
          bootstrap();
        }, 100);
        return;
      }

      main();
    });
};

bootstrap();
