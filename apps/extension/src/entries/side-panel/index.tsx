import React from 'react';
import ReactDOM from 'react-dom/client';
import HashRouter from '@/components/HashRouter';
import { routes } from './routes';
import PageContainer from '@/components/PageContainer';

const SidePanelApp: React.FC = () => (
  <PageContainer>
    <HashRouter routes={routes} />
  </PageContainer>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidePanelApp />
  </React.StrictMode>
);
