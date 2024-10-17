// export const rpcFlow = async (method: string, params: any[]) => {};

import AsyncTaskFlow from '@/utils/asyncTaskFlow';
import { checkMethodExist } from './checkMethodExist';
import { checkLock } from './checkLock';
import { callProvider } from './callProvider';
export type TProviderRequest = {
  ctx?: unknown;
  dApp: TDAppInfo;
  origin?: string;
  needApproval?: boolean;
  rpcReq: RequestArguments;
};

export type TRpcFlowContext = {
  request: TProviderRequest;
};

const taskFlow = new AsyncTaskFlow<TRpcFlowContext>();

const composedTasks = taskFlow
  .use(checkMethodExist)
  .use(checkLock)
  .use(callProvider)
  .compose();

export default (request: TProviderRequest) => {
  const initContext = {
    request: {
      ...request,
      needApproval: false,
    },
  };

  return composedTasks(initContext).finally(() => {
    console.log('YES, final context is');
  });
};
