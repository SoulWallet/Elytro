import type { TFlowMiddleWareFn } from '@/utils/asyncTaskFlow';

export const checkMethodExist: TFlowMiddleWareFn = async (ctx, next) => {
  const {
    request: { rpcReq },
  } = ctx;

  console.log(
    ctx,
    'received eth method:',
    rpcReq.method,
    'params:',
    rpcReq.params
  );

  return next();
};
