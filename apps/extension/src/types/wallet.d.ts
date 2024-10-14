type TUserOperationPreFundResult = {
  balance: bigint;
  hasSponsored: boolean;
  missAmount: bigint;
  needDeposit: boolean;
  suspiciousOp: boolean;
};

type TAccountInfo = {
  address: Nullable<string>;
  balance: Nullable<string>;
  isActivated: boolean;
  chainType: SupportedChainTypeEn;
};
