import React from 'react';
import ReactDOM from 'react-dom/client';
import routes from './routes';
import HashRouter from '@/components/HashRouter';
import PageContainer from '@/components/PageContainer';
import { RUNTIME_MESSAGE_TYPE } from '@/constants/message';

const main = () => {
  const TabApp: React.FC = () => (
    <PageContainer>
      <HashRouter routes={routes} />
    </PageContainer>
  );

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <TabApp />
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
