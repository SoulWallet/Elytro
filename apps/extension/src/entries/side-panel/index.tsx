import React from 'react';
import ReactDOM from 'react-dom/client';
import HashRouter from '@/components/HashRouter';
import PageContainer from '@/components/PageContainer';
import { bootstrap } from '@/utils/bootstrap';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ApprovalProvider } from './contexts/approval-context';
import { AccountProvider } from './contexts/account-context';
import { ApolloProvider } from '@apollo/client';
import { routes } from './routes';
import SignTxModal from '@/entries/side-panel/components/SignTxModal';
import { client } from '@/requests';

const main = () => {
  const SidePanelApp: React.FC = () => (
    <ApolloProvider client={client}>
      <AccountProvider>
        <ApprovalProvider>
          <PageContainer className="min-w-96">
            <TooltipProvider>
              <HashRouter routes={routes} />
              <SignTxModal />
            </TooltipProvider>
          </PageContainer>
        </ApprovalProvider>
      </AccountProvider>
    </ApolloProvider>
  );

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <SidePanelApp />
    </React.StrictMode>
  );
};

bootstrap(main);
