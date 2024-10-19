type TUserOperationPreFundResult = {
  balance: bigint;
  hasSponsored: boolean;
  missAmount: bigint;
  needDeposit: boolean;
  suspiciousOp: boolean;
};

type TAccountInfo = {
  address: Nullable<string>;
  ownerAddress: Nullable<string>;
  balance: Nullable<string>;
  isActivated: boolean;
  chainType: SupportedChainTypeEn;
};

type TTransactionInfo = {
  from: string; // Address
  to: string; // Address
  value: string; // Hex
  gas: string; // Hex
  gasPrice: string; // Hex
  input: string; // Hex

  // sw sdk need below, maybe change it to standards arguments?
  gasLimit?: string; // Hex
  data?: string; // HEX
};

type TElytroTxInfo = {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  from: string;
  txs: TTransactionInfo[];
};

type TDAppInfo = {
  name: string;
  origin?: string;
  icon: string;
};

type TApprovalData = {
  dApp: TDAppInfo;
  tx?: TTransactionInfo[];
};

type TApprovalInfo = {
  type: ApprovalTypeEn;
  id: string;
  data?: TApprovalData;
  resolve: (data?: unknown) => void;
  reject: (data?: unknown) => void;
};
