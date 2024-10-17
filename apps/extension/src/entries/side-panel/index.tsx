import React from 'react';
import ReactDOM from 'react-dom/client';
import HashRouter from '@/components/HashRouter';
import { routes } from './routes';
import PageContainer from '@/components/PageContainer';
import { bootstrap } from '@/utils/bootstrap';
import { TooltipProvider } from '@/components/ui/tooltip';

const main = () => {
  const SidePanelApp: React.FC = () => (
    <PageContainer className="min-w-96">
      <TooltipProvider>
        <HashRouter routes={routes} />
      </TooltipProvider>
    </PageContainer>
  );

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <SidePanelApp />
    </React.StrictMode>
  );
};

bootstrap(main);
