import { elytroSDK } from '@/background/services/sdk';
import { create } from 'zustand';
import useDialogStore from './dialog';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '@/entries/side-panel/routes';

interface ActivateState {
  calcResult: Nullable<TUserOperationPreFundResult>;
  deployUserOp: ElytroUserOperation | null;
  createDeployUserOp: (ownerAddress: string) => Promise<void>;
  calculateDeployUserOp: (
    userOp: ElytroUserOperation
  ) => Promise<TUserOperationPreFundResult | undefined>;
  isCalculating: boolean;
}

const useActivateStore = create<ActivateState>((set, get) => ({
  deployUserOp: null,
  calcResult: null,
  isCalculating: false,
  async calculateDeployUserOp(userOp: ElytroUserOperation) {
    if (get().isCalculating) {
      return;
    }

    try {
      set({ isCalculating: true });
      const res = await elytroSDK.getRechargeAmountForUserOp(userOp, 0n);
      set({ calcResult: res });
      return res;
    } catch (error) {
      console.error(error);
    } finally {
      set({ isCalculating: false });
    }
  },
  async createDeployUserOp(ownerAddress: string) {
    const deployUserOp =
      await elytroSDK.createUnsignedDeployWalletUserOp(ownerAddress);

    await elytroSDK.estimateGas(deployUserOp);
    const calcResult = await get().calculateDeployUserOp(deployUserOp);

    if (calcResult && !calcResult?.needDeposit) {
      // if no need to deposit, directly open sign tx dialog
      useDialogStore.getState().openSignTxDialog(
        deployUserOp,
        () => {
          navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
        },
        'Activate account'
      );
    } else {
      set({ deployUserOp });
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Activate);
    }
  },
}));

export default useActivateStore;
