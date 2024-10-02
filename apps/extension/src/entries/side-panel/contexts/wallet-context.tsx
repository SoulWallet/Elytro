import SignTxModal from '../components/SignTx';
import { createContext } from 'react';

type IWalletContext = {
  temp?: unknown; // todo: remove this
};

export const WalletContext = createContext<IWalletContext>({ temp: 'test' });

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletContext.Provider value={{}}>
      <>{children}</>
      <SignTxModal />
    </WalletContext.Provider>
  );
};
