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
  tryUnlock: () => void;
  isActivated: boolean;
  createNewOwner: (password: string) => Promise<void>;
}

const useKeyringStore = create<KeyringState>((set) => ({
  isLocked: null,
  isActivated: walletClient.isActivated,
  tryUnlock: () => {
    keyring.tryUnlock(() => {
      set({ isLocked: keyring.locked });

      if (keyring.locked) {
        navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Unlock);
      } else {
        navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
      }
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
    try {
      await keyring.unlock(password);
      set({ isLocked: false });
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
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
