type EIP712Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
  salt?: string;
};

type EIP712Message = {
  from: string;
  to: string;
  value: number;
  nonce: number;
};

type EIP712Type = {
  domain: EIP712Domain;
  message: EIP712Message;
  primaryType: string;
  types: {
    EIP712Domain: Array<{ name: string; type: string }>;
    [key: string]: Array<{ name: string; type: string }>;
  };
};
