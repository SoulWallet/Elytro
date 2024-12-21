import {
  keccak256,
  encodeAbiParameters,
  encodePacked,
  Hex,
  zeroHash,
} from 'viem';

export const DEFAULT_GUARDIAN_SAFE_PERIOD = 5;

export const DEFAULT_GUARDIAN_HASH = zeroHash;

const SOUL_WALLET_MSG_TYPE_HASH =
  '0x04e6b5b1de6ba008d582849d4956d004d09a345fc11e7ba894975b5b56a4be66';
// keccak256(
//   toBytes('SoulWalletMessage(bytes32 message)')
// );
const DOMAIN_SEPARATOR_TYPE_HASH =
  '0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218';
// keccak256(
//   toBytes('EIP712Domain(uint256 chainId,address verifyingContract)')
// );

export const getEncoded1271MessageHash = (message: Hex) => {
  return keccak256(
    encodeAbiParameters(
      [{ type: 'bytes32' }, { type: 'bytes32' }],
      [SOUL_WALLET_MSG_TYPE_HASH, message]
    )
  );
};

export const getDomainSeparator = (chainIdHex: Hex, walletAddress: Hex) => {
  return keccak256(
    encodeAbiParameters(
      [{ type: 'bytes32' }, { type: 'uint256' }, { type: 'address' }],
      [DOMAIN_SEPARATOR_TYPE_HASH, BigInt(chainIdHex), walletAddress]
    )
  );
};

export const getEncodedSHA = (
  domainSeparator: Hex,
  encode1271MessageHash: Hex
) => {
  return keccak256(
    encodePacked(
      ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
      ['0x19', '0x01', domainSeparator, encode1271MessageHash]
    )
  );
};
