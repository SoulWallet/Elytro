import {
  Chain,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'viem/chains';

export enum SupportedChainTypeEn {
  ETH = 'Ethereum',
  ETH_SEPOLIA = 'Ethereum Sepolia',
  OP = 'Optimism',
  OP_SEPOLIA = 'Optimism Sepolia',
}

export const SUPPORTED_CHAIN_MAP: Record<SupportedChainTypeEn, Chain> = {
  [SupportedChainTypeEn.ETH]: mainnet,
  [SupportedChainTypeEn.ETH_SEPOLIA]: sepolia,
  [SupportedChainTypeEn.OP]: optimism,
  [SupportedChainTypeEn.OP_SEPOLIA]: optimismSepolia,
};

export const SUPPORTED_CHAIN_RPC_URL_MAP: Record<SupportedChainTypeEn, string> =
  {
    [SupportedChainTypeEn.ETH]: 'https://ethereum-rpc.publicnode.com',
    [SupportedChainTypeEn.ETH_SEPOLIA]:
      'https://ethereum-sepolia-rpc.publicnode.com',
    [SupportedChainTypeEn.OP]: 'https://optimism-rpc.publicnode.com',
    [SupportedChainTypeEn.OP_SEPOLIA]:
      'https://optimism-sepolia-rpc.publicnode.com', //https://optimism-sepolia.drpc.org
  };

export const SUPPORTED_CHAIN_ICON_MAP: Record<SupportedChainTypeEn, string> = {
  [SupportedChainTypeEn.ETH]:
    'https://etherscan.io/images/svg/brands/ethereum-original.svg',
  [SupportedChainTypeEn.ETH_SEPOLIA]:
    'https://etherscan.io/images/svg/brands/ethereum-original.svg',
  [SupportedChainTypeEn.OP]:
    'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
  [SupportedChainTypeEn.OP_SEPOLIA]:
    'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
};

export const DEFAULT_CHAIN_TYPE = SupportedChainTypeEn.ETH_SEPOLIA;

export const chainIdToChainNameMap: Record<number, SupportedChainTypeEn> = {
  [optimismSepolia.id]: SupportedChainTypeEn.OP_SEPOLIA,
  [optimism.id]: SupportedChainTypeEn.OP,
  [mainnet.id]: SupportedChainTypeEn.ETH,
  [sepolia.id]: SupportedChainTypeEn.ETH_SEPOLIA,
};
