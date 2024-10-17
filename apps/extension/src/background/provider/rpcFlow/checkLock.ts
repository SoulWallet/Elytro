import keyring from '@/background/services/keyring';
import type { TFlowMiddleWareFn } from '@/utils/asyncTaskFlow';
import {
  approvalService,
  ApprovalTypeEn,
} from '@/background/services/approval';
import { ethErrors } from 'eth-rpc-errors';

let isUnlocking = false;

export const checkLock: TFlowMiddleWareFn = async (ctx, next) => {
  await keyring.tryUnlock();

  if (keyring.locked) {
    // request user to unlock
    ctx.request.needApproval = true;

    // only allow one unlocking request once at a time
    if (isUnlocking) {
      throw ethErrors.rpc.resourceNotFound(
        'Elytro: Unlocking in progress. Please wait.'
      );
    }

    try {
      isUnlocking = true;
      await approvalService.request(ApprovalTypeEn.Unlock, {});
    } catch {
      // do nth.
    } finally {
      isUnlocking = false;
    }
  }

  return next();
};