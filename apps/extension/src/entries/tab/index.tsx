import React from 'react';
import ReactDOM from 'react-dom/client';
import routes from './routes';
import HashRouter from '@/components/HashRouter';
import PageContainer from '@/components/PageContainer';

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
