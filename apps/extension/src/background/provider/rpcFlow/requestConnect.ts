import {
  approvalService,
  ApprovalTypeEn,
} from '@/background/services/approval';
import connectionManager from '@/background/services/connection';
import type { TFlowMiddleWareFn } from '@/utils/asyncTaskFlow';

const NEED_CONNECT_METHODS: ProviderMethodType[] = [
  'eth_accounts',
  'eth_requestAccounts',
];

export const requestConnect: TFlowMiddleWareFn = async (ctx, next) => {
  const {
    rpcReq: { method },
    dApp,
  } = ctx.request;

  if (NEED_CONNECT_METHODS.includes(method)) {
    // const connection = connectionManager.getSite(origin);

    const isConnected = connectionManager.getSite(dApp.origin)?.isConnected;

    if (!isConnected) {
      await approvalService.request(ApprovalTypeEn.Connect, {
        dApp,
      });
    }
  }

  return next();
};
