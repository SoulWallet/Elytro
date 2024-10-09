// TODO: use this temporarily. Replace to user config later.
export const TEMP_RPC_URL = 'https://optimism-rpc.publicnode.com';

import { Chain, optimismSepolia } from 'viem/chains';

export enum SupportedChainTypeEn {
  // OP = 'Optimism',
  OP_SEPOLIA = 'Optimism Sepolia',
}

export const SUPPORTED_CHAIN_MAP: Record<SupportedChainTypeEn, Chain> = {
  // [SupportedChainTypeEn.OP]: optimism,
  [SupportedChainTypeEn.OP_SEPOLIA]: optimismSepolia,
};

export const SUPPORTED_CHAIN_ICON_MAP: Record<SupportedChainTypeEn, string> = {
  // TODO: temp use asset from coingecko, replace with ours assets later
  // [SupportedChainTypeEn.OP]:
  //   'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
  [SupportedChainTypeEn.OP_SEPOLIA]:
    'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
};

// TODO: use Optimism Sepolia as default chain for testnet.
export const DEFAULT_CHAIN_TYPE = SupportedChainTypeEn.OP_SEPOLIA;
