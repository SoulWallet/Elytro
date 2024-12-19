import { keccak256, encodeAbiParameters, encodePacked, Hex } from 'viem';

import { optimism, optimismSepolia, sepolia } from 'viem/chains';

export type SDKInitConfig = {
  endpoint: string; // rpc url
  bundler: string; // bundler url
  factory: string; // factory address
  fallback: string; // fallback address
  recovery: string; // social recovery module address
  validator: string; // validator address
  onchainConfig: {
    chainId: number;
    entryPoint: string;
    soulWalletLogic: string;
  }; // onchain config address
};

export const SDK_INIT_CONFIG_BY_CHAIN_MAP: Record<number, SDKInitConfig> = {
  [optimismSepolia.id]: {
    endpoint:
      'https://opt-sepolia.g.alchemy.com/v2/7EJnXZWkG9HIhjj0ZLx7vk_lexCq25Pr', //this.chain.rpcUrls.default.http[0], //
    bundler:
      'https://api.pimlico.io/v2/optimism-sepolia/rpc?apikey=f1b5c1b8-24a5-440b-b6fe-646c55819509',
    factory: '0x69C506356d393DcB987A8638ba752d9a611dE31e',
    fallback: '0xb56F1E091C1fc4AD22D5BDc7AA71D5f4D2251456',
    recovery: '0xe4aBECE6A68ac2D33cAFcF94c9b20c02d5A6F4C4',
    validator: '0x2425b23C5C2B322E664334debBa04eE73871ebf7',
    onchainConfig: {
      chainId: optimismSepolia.id,
      entryPoint: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
      soulWalletLogic: '0x763A7a9050A43C982c2953e8D094687594b92E71',
    },
  },
  // // TODO: change to respective chain config
  // [mainnet.id]: {
  //   endpoint:
  //     'https://opt-sepolia.g.alchemy.com/v2/q9tQ1GMZy-4gtTuQQO6JF_5m_Bf1NYdq', //this.chain.rpcUrls.default.http[0], //
  //   bundler:
  //     'https://soulwallet.optimism-sepolia.voltaire.candidewallet.com/rpc',
  //   factory: '0xF78Ae187CED0Ca5Fb98100d3F0EAB7a6461d6fC6',
  //   fallback: '0x880c6eb80583795625935B08AA28EB37F16732C7',
  //   recovery: '0x3Cc36538cf53A13AF5C28BB693091e23CF5BB567',
  //   validator: '0x162485941bA1FAF21013656DAB1E60e9D7226DC0',
  //   onchainConfig: {
  // chainId: mainnet.id,
  // entryPoint: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
  // soulWalletLogic: '0x763A7a9050A43C982c2953e8D094687594b92E71',
  // },
  // },
  [sepolia.id]: {
    endpoint:
      // 'https://eth-sepolia.g.alchemy.com/v2/Gp8ptWCctltOyYxWVlQMI_eg8Uj44o64',
      'https://ethereum-sepolia-rpc.publicnode.com',
    bundler:
      'https://api.pimlico.io/v2/11155111/rpc?apikey=pim_7KhEvjRKpLviLbtDBuHySr',
    factory: '0x70B616f23bDDB18c5c412dB367568Dc360e224Bb',
    fallback: '0xe4eA02c80C3CD86B2f23c8158acF2AAFcCa5A6b3',
    recovery: '0x36693563E41BcBdC8d295bD3C2608eb7c32b1cCb',
    validator: '0x162485941bA1FAF21013656DAB1E60e9D7226DC0',
    onchainConfig: {
      chainId: sepolia.id,
      entryPoint: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
      soulWalletLogic: '0x186b91aE45dd22dEF329BF6b4233cf910E157C84',
    },
  },
  [optimism.id]: {
    endpoint:
      'https://opt-mainnet.g.alchemy.com/v2/GCSFuO3fOSch0AQ4JQThV5CO_McJvA0V', //this.chain.rpcUrls.default.http[0], //
    bundler:
      // 'https://soulwallet.optimism-sepolia.voltaire.candidewallet.com/rpc',
      'https://api.pimlico.io/v2/10/rpc?apikey=pim_7KhEvjRKpLviLbtDBuHySr',
    factory: '0x70B616f23bDDB18c5c412dB367568Dc360e224Bb',
    fallback: '0xe4eA02c80C3CD86B2f23c8158acF2AAFcCa5A6b3',
    recovery: '0x36693563E41BcBdC8d295bD3C2608eb7c32b1cCb',
    validator: '0x162485941bA1FAF21013656DAB1E60e9D7226DC0',
    onchainConfig: {
      chainId: optimism.id,
      entryPoint: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
      soulWalletLogic: '0x186b91aE45dd22dEF329BF6b4233cf910E157C84',
    },
  },
};

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
