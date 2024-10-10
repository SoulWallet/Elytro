import useKeyringStore from '@/stores/keyring';
import SignTxModal from '../components/SignTxModal';
import { createContext, useEffect } from 'react';

type IWalletContext = {
  temp?: unknown; // todo: remove this
};

export const WalletContext = createContext<IWalletContext>({ temp: 'test' });

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { tryUnlock, isLocked } = useKeyringStore();

  useEffect(() => {
    if (isLocked === null) {
      tryUnlock();
    }
  }, [isLocked]);

  return (
    <WalletContext.Provider value={{}}>
      <>{children}</>
      <SignTxModal />
    </WalletContext.Provider>
  );
};
