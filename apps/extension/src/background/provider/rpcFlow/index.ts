// export const rpcFlow = async (method: string, params: any[]) => {};

import AsyncTaskFlow from '@/utils/asyncTaskFlow';
import { checkMethodExist } from './checkMethodExist';
import { checkLock } from './checkLock';
import { callProvider } from './callProvider';
import { requestConnect } from './requestConnect';
import { sendTx } from './sendTx';
import { requestSignature } from './requestSignature';

export type TProviderRequest = {
  ctx?: unknown;
  dApp: TDAppInfo;
  origin?: string;
  needConnection?: boolean;
  rpcReq: RequestArguments;
};

export type TRpcFlowContext = {
  request: TProviderRequest;
};

const taskFlow = new AsyncTaskFlow<TRpcFlowContext>();

const composedTasks = taskFlow
  .use(checkMethodExist)
  .use(checkLock)
  .use(requestConnect)
  .use(requestSignature)
  .use(sendTx)
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
    console.log(initContext.request.rpcReq.method, 'finished');
  });
};
