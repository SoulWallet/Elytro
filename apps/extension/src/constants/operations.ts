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
  accountAddress: string;
  contractAddress: string;
  fee: string;
  txHash: string;
  // txStatus: UserOperationStatusEn;
  action: TDAppActionDetail;
};
