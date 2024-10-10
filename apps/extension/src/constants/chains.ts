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
// Ethereum Mainnet
const ETHEREUM_RPC_URL = 'https://base-rpc.publicnode.com';
const ETHEREUM_WS_RPC_URL = 'wss://ethereum-rpc.publicnode.com';
const ETHEREUM_BEACON_RPC_URL = 'https://ethereum-beacon-api.publicnode.com';

// Sepolia Testnet
const ETHEREUM_SEPOLIA_RPC_URL = 'https://base-sepolia-rpc.publicnode.com';
const ETHEREUM_SEPOLIA_WS_RPC_URL = 'wss://ethereum-sepolia-rpc.publicnode.com'; // Sepolia
const ETHEREUM_SEPOLIA_BEACON_RPC_URL =
  'https://ethereum-sepolia-beacon-api.publicnode.com'; // Teku

// Holesky Testnet
const ETHEREUM_HOLESKY_RPC_URL = 'https://ethereum-holesky-rpc.publicnode.com';
const ETHEREUM_HOLESKY_WS_RPC_URL = 'wss://ethereum-holesky-rpc.publicnode.com';
const ETHEREUM_HOLESKY_BEACON_RPC_URL =
  'https://ethereum-holesky-beacon-api.publicnode.com';

export const ETHEREUM_CHAIN_CONFIG = {
  chain_id: '0x1',
  name: 'Ethereum',
  mainnet: {
    rpc: ETHEREUM_RPC_URL,
    ws: ETHEREUM_WS_RPC_URL,
    beacon: ETHEREUM_BEACON_RPC_URL,
  },
  testnet: {
    sepolia: {
      rpc: ETHEREUM_SEPOLIA_RPC_URL,
      ws: ETHEREUM_SEPOLIA_WS_RPC_URL,
      beacon: ETHEREUM_SEPOLIA_BEACON_RPC_URL,
    },
    holesky: {
      rpc: ETHEREUM_HOLESKY_RPC_URL,
      ws: ETHEREUM_HOLESKY_WS_RPC_URL,
      beacon: ETHEREUM_HOLESKY_BEACON_RPC_URL,
    },
  },
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
