import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { useWallet } from '@/contexts/wallet';
import { toast } from '@/hooks/use-toast';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '@/entries/side-panel/routes';

type IKeyringContext = {
  isLocked?: boolean;
  lock: () => Promise<void>;
  unlock: (
    password: string,
    onSuccess?: () => void,
    onFailed?: () => void
  ) => Promise<void>;
  createNewOwner: (password: string) => Promise<void>;
};

const KeyringContext = createContext<IKeyringContext>({
  isLocked: undefined,
  lock: async () => {},
  unlock: async () => {},
  createNewOwner: async () => {},
});

export const KeyringProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallet = useWallet();
  const [isLocked, setIsLocked] = useState<boolean>();

  const getLockStatus = useCallback(async () => {
    const res = await wallet.getLockStatus();
    setIsLocked(res);
  }, [wallet]);

  useEffect(() => {
    if (isLocked === undefined) {
      getLockStatus();
    } else if (isLocked === true) {
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Unlock);
    }
  }, [isLocked, getLockStatus]);

  const lock = async () => {
    await wallet.lock();
    setIsLocked(true);
  };

  const unlock = async (
    password: string,
    onSuccess?: () => void,
    onFailed?: () => void
  ) => {
    try {
      const locked = await wallet.unlock(password);

      if (locked) {
        throw new Error('Invalid password');
      } else {
        navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
        onSuccess?.();
      }

      setIsLocked(locked);
    } catch (error) {
      toast({
        title: 'Oops! Failed to unlock',
        description: (error as Error).message ?? 'Unknown error',
        variant: 'destructive',
      });
      onFailed?.();
    }
  };

  const createNewOwner = async (password: string) => {
    await lock();
    await wallet.createNewOwner(password);
  };

  return (
    <KeyringContext.Provider value={{ isLocked, lock, unlock, createNewOwner }}>
      {children}
    </KeyringContext.Provider>
  );
};

export const useKeyring = () => {
  return useContext(KeyringContext);
};
