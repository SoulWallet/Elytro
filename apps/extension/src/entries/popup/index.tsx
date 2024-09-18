import React from 'react';
import ReactDOM from 'react-dom/client';
import HashRouter from '@/components/HashRouter';
import { routes } from './routes';

const PopupApp: React.FC = () => {
  return <HashRouter routes={routes} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>
);
