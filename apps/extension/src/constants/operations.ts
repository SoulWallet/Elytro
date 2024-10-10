import { TSessionData } from './session';

export enum UserOperationStatusEn {
  pending = 'pending',
  confirmedSuccess = 'success',
  confirmedFailed = 'failed',
  error = 'error',
}

export type TDAppActionDetail = {
  dAppLogo?: string;
  name: string;
  description?: string;
};

export type TSignTxDetail = {
  fromSession: TSessionData;
  toSession: TSessionData;
  actionName: string;
  userOpDetail: TUserOperationDetail;
};

export type TUserOperationDetail = {
  from: string;
  to: string;
  value: number;
  fee: string;
  callData: string;
};
