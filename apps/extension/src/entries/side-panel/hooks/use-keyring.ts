import { useEffect, useState } from 'react';
import { useWallet } from '../contexts/wallet-context';
import { toast } from '@/hooks/use-toast';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import { navigateTo } from '@/utils/navigation';

export const useKeyring = () => {
  const wallet = useWallet();
  const [isLocked, setIsLocked] = useState<boolean>();

  const getLockStatus = async () => {
    const res = await wallet.getLockStatus();
    setIsLocked(res);
  };

  useEffect(() => {
    if (isLocked === undefined) {
      getLockStatus();
    } else if (isLocked === false) {
      navigateTo(
        'side-panel',
        isLocked
          ? SIDE_PANEL_ROUTE_PATHS.Unlock
          : SIDE_PANEL_ROUTE_PATHS.Dashboard
      );
    }
  }, [isLocked]);

  const lock = async () => {
    await wallet.lock();
    setIsLocked(true);
  };

  const unlock = async (password: string) => {
    try {
      const locked = await wallet.unlock(password);

      // if (locked) {
      //   throw new Error('Invalid password');
      // } else {
      //   navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
      // }

      setIsLocked(locked);
    } catch (error) {
      toast({
        title: 'Oops! Failed to unlock',
        description: (error as Error).message ?? 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const createNewOwner = async (password: string) => {
    await wallet.createNewOwner(password);
  };

  return { isLocked, lock, unlock, createNewOwner };
};
