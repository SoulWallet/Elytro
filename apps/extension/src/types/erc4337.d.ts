type ElytroNumber = number | string | bigint;

type ElytroUserOperation = {
  sender: Address;
  nonce: ElytroNumber;
  factory: Address | null;
  factoryData: HexString | null;
  callData: HexString;
  callGasLimit: ElytroNumber;
  verificationGasLimit: ElytroNumber;
  preVerificationGas: ElytroNumber;
  maxFeePerGas: ElytroNumber;
  maxPriorityFeePerGas: ElytroNumber;
  paymaster: Address | null;
  paymasterVerificationGasLimit: ElytroNumber | null;
  paymasterPostOpGasLimit: ElytroNumber | null;
  paymasterData: HexString | null;
  signature: HexString;
};

type UserOperation = {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
};
