import {
  approvalService,
  ApprovalTypeEn,
} from '@/background/services/approval';
import type { TFlowMiddleWareFn } from '@/utils/asyncTaskFlow';

export interface UnSupportedMethod {
  name: string;
  reason: string;
}

const UN_SUPPORTED_METHODS: UnSupportedMethod[] = [
  {
    name: 'eth_sign',
    reason: 'Elytro is not supported eth_sign because of security reasons',
  },
  {
    name: 'eth_getEncryptionPublicKey',
    reason:
      'Elytro is a smart wallet, not supported eth_getEncryptionPublicKey yet',
  },
];

export const checkMethodExist: TFlowMiddleWareFn = async (ctx, next) => {
  const { rpcReq, dApp } = ctx.request;

  const unSupportedMethod = UN_SUPPORTED_METHODS.find(
    (method) => method.name === rpcReq.method
  );
  if (unSupportedMethod) {
    console.error(unSupportedMethod.reason);
    return await approvalService.request(ApprovalTypeEn.Alert, {
      dApp,
      options: unSupportedMethod,
    });
  }

  return next();
};
