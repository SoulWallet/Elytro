import React from 'react';
import ReactDOM from 'react-dom/client';
import routes from './routes';
import HashRouter from '@/components/HashRouter';

const TabApp: React.FC = () => {
  return <HashRouter routes={routes} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TabApp />
  </React.StrictMode>
);
