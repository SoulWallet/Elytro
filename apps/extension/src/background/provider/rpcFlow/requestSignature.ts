import {
  approvalService,
  ApprovalTypeEn,
} from '@/background/services/approval';
import type { TFlowMiddleWareFn } from '@/utils/asyncTaskFlow';

const SIGN_METHODS: ProviderMethodType[] = [
  'personal_sign',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
];

export const requestSignature: TFlowMiddleWareFn = async (ctx, next) => {
  const { rpcReq, dApp } = ctx.request;

  if (SIGN_METHODS.includes(rpcReq.method)) {
    await approvalService.request(ApprovalTypeEn.Sign, {
      dApp,
      sign: rpcReq,
    });
  }

  return next();
};
