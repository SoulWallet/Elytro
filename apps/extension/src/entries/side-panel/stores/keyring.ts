import { toast } from '@/hooks/use-toast';
import keyring from '@/services/keyring';
import { navigateTo } from '@/utils/navigation';
import { create } from 'zustand';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import walletClient from '@/services/walletClient';

interface KeyringState {
  isLocked: null | boolean;
  lock: () => void;
  unlock: (password: string) => Promise<void>;
  resetFromKeyring: () => void;
  isActivated: boolean;
}

const useKeyringStore = create<KeyringState>((set) => ({
  isLocked: null,
  isActivated: walletClient.isActivated,
  resetFromKeyring: () => {
    console.log(keyring.locked);
    set({ isLocked: keyring.locked });
  },
  lock: async () => {
    try {
      await keyring.lock();
      set({ isLocked: true });
    } catch (error) {
      toast({
        title: 'Oops!',
        description:
          error instanceof Error ? error.message : 'Failed to lock keyring',
      });
    }
  },
  unlock: async (password: string) => {
    // set({ isLocked: false });
    // navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Home);

    // TODO: temp comment out. only for testing
    try {
      await keyring.unlock(password);
      set({ isLocked: false });
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Home);
    } catch (error) {
      toast({
        title: 'Oops!',
        description:
          error instanceof Error ? error.message : 'Invalid password',
      });
    }
  },
}));

export default useKeyringStore;
