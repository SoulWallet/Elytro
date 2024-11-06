import keyring from '@/background/services/keyring';
import type { TFlowMiddleWareFn } from '@/utils/asyncTaskFlow';
import { approvalService } from '@/background/services/approval';
import { ethErrors } from 'eth-rpc-errors';
import { ApprovalTypeEn } from '@/constants/operations';

// todo: move to keyring service
let isUnlocking = false;

const PUBLIC_METHODS: ProviderMethodType[] = ['eth_chainId'];

const SEMI_PUBLIC_METHODS: ProviderMethodType[] = ['eth_accounts'];

export const checkLock: TFlowMiddleWareFn = async (ctx, next) => {
  if (PUBLIC_METHODS.includes(ctx.request.rpcReq.method)) {
    return next();
  } else if (SEMI_PUBLIC_METHODS.includes(ctx.request.rpcReq.method)) {
    ctx.request.needConnection = true;
    return next();
  }

  await keyring.tryUnlock();

  if (keyring.locked) {
    // only allow one unlocking request once at a time
    if (isUnlocking) {
      throw ethErrors.rpc.resourceNotFound(
        'Elytro: Unlocking in progress. Please wait.'
      );
    }

    try {
      isUnlocking = true;
      await approvalService.request(ApprovalTypeEn.Unlock);
    } finally {
      isUnlocking = false;
    }
  } else {
    isUnlocking = false;
  }

  return next();
};
