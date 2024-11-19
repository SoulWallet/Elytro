import { createContext, useContext } from 'react';
import { PortMessageManager } from '@/utils/message/portMessageManager';
import { WalletController } from '@/background/walletController';

export const portMessageManager = new PortMessageManager('elytro-ui');
portMessageManager.connect();

const walletControllerProxy = new Proxy(
  {},
  {
    get(_, prop: keyof WalletController) {
      return function (...args: unknown[]) {
        portMessageManager.sendMessage('UI_REQUEST', {
          method: prop,
          params: args,
        });

        return new Promise((resolve) => {
          portMessageManager.onMessage(`UI_RESPONSE_${prop}`, (response) => {
            resolve(response?.result);
          });
        });
      };
    },
  }
) as WalletController;

type IWalletContext = {
  wallet: WalletController;
};

const WalletContext = createContext<IWalletContext>({
  wallet: walletControllerProxy as WalletController,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletContext.Provider value={{ wallet: walletControllerProxy }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const { wallet } = useContext(WalletContext);

  return wallet;
};
