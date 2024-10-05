import { toast } from '@/hooks/use-toast';
import keyring from '@/services/keyring';
import { navigateTo } from '@/utils/navigation';
import { create } from 'zustand';
import walletClient from '@/services/walletClient';
import { SIDE_PANEL_ROUTE_PATHS } from '@/entries/side-panel/routes';

interface KeyringState {
  isLocked: null | boolean;
  lock: () => void;
  unlock: (password: string) => Promise<void>;
  resetFromKeyring: () => void;
  isActivated: boolean;
  createNewOwner: (password: string) => Promise<void>;
}

console.log('hello!!! store', new Date());

const useKeyringStore = create<KeyringState>((set) => ({
  isLocked: null,
  isActivated: walletClient.isActivated,
  resetFromKeyring: () => {
    keyring.tryUnlock(() => {
      set({ isLocked: keyring.locked });
    });
  },
  createNewOwner: async (password: string) => {
    try {
      await keyring.createNewOwner(password);
      // TODO: create elytro wallet address. Encounter blocking issue, comment out for now
      // await walletClient.createWalletAddress();
    } catch (error) {
      keyring.reset();

      toast({
        title: 'Oops! Something went wrong. Try again later.',
        description: error?.toString(),
      });
    }
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
