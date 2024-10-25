import type { TFlowMiddleWareFn } from '@/utils/asyncTaskFlow';
import builtinProvider from '../builtinProvider';

export const callProvider: TFlowMiddleWareFn = async (ctx) => {
  const {
    request: { rpcReq },
  } = ctx;

  return await builtinProvider.request(rpcReq);
};
