import SignTxModal from '../components/SignTxModal';
import { createContext, useContext, useEffect } from 'react';
import { PortMessageManager } from '@/utils/message/portMessageManager';
import { ElytroWalletClient } from '@/background/services/walletClient';
import useKeyringStore from '@/stores/keyring';

const portMessageManager = new PortMessageManager('elytro-ui');
portMessageManager.connect();

const walletClientProxy = new Proxy(
  {},
  {
    get(_, prop: keyof ElytroWalletClient) {
      return function (...args: unknown[]) {
        const descriptor = Object.getOwnPropertyDescriptor(
          ElytroWalletClient.prototype,
          prop
        );

        if (descriptor && typeof descriptor.get === 'function') {
          portMessageManager.sendMessage('UI_REQUEST', {
            method: prop,
            params: [],
          });
        } else {
          portMessageManager.sendMessage('UI_REQUEST', {
            method: prop,
            params: args,
          });
        }

        return new Promise((resolve) => {
          portMessageManager.onMessage('UI_RESPONSE', (response) => {
            resolve(response?.result);
          });
        });
      };
    },
  }
) as ElytroWalletClient;

type IWalletContext = {
  walletClient: ElytroWalletClient;
};

const WalletContext = createContext<IWalletContext>({
  walletClient: walletClientProxy as ElytroWalletClient,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { tryUnlock, isLocked } = useKeyringStore();

  useEffect(() => {
    if (isLocked === null) {
      tryUnlock();
    }
  }, [isLocked]);

  return (
    <WalletContext.Provider value={{ walletClient: walletClientProxy }}>
      <>{children}</>
      <SignTxModal />
    </WalletContext.Provider>
  );
};

export const useWalletClient = () => {
  return useContext(WalletContext);
};
