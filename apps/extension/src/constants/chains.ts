import { mainnet, optimism, optimismSepolia, sepolia } from 'viem/chains';

export type TChainConfigItem = {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  blockExplorerUrl?: string;
  bundlerUrl: string;
  currencySymbol: { name: string; symbol: string; decimals: number };
};

// DEFAULT_LOCAL_CHAINS is used to store chains in local storage
export const DEFAULT_LOCAL_CHAINS: TChainConfigItem[] = [
  {
    chainId: sepolia.id,
    chainName: sepolia.name,
    rpcUrl: sepolia.rpcUrls.default.http[0],
    bundlerUrl:
      'https://api.pimlico.io/v2/11155111/rpc?apikey=pim_7KhEvjRKpLviLbtDBuHySr',
    currencySymbol: sepolia.nativeCurrency,
    blockExplorerUrl: sepolia.blockExplorers.default.url,
  },
  {
    chainId: optimismSepolia.id,
    chainName: optimismSepolia.name,
    rpcUrl: optimismSepolia.rpcUrls.default.http[0], //,'https://opt-sepolia.g.alchemy.com/v2/q9tQ1GMZy-4gtTuQQO6JF_5m_Bf1NYdq',
    bundlerUrl:
      'https://soulwallet.optimism-sepolia.voltaire.candidewallet.com/rpc',
    currencySymbol: optimismSepolia.nativeCurrency,
    blockExplorerUrl: optimismSepolia.blockExplorers.default.url,
  },
  {
    chainId: optimism.id,
    chainName: optimism.name,
    rpcUrl: optimism.rpcUrls.default.http[0],
    bundlerUrl:
      'https://api.pimlico.io/v2/10/rpc?apikey=pim_7KhEvjRKpLviLbtDBuHySr',
    currencySymbol: optimism.nativeCurrency,
    blockExplorerUrl: optimism.blockExplorers.default.url,
  },
];

export const SUPPORTED_CHAIN_IDS = DEFAULT_LOCAL_CHAINS.map(
  (chain) => chain.chainId
);

export const SUPPORTED_CHAIN_ICON_MAP: Record<number, string> = {
  [mainnet.id]: 'https://etherscan.io/images/svg/brands/ethereum-original.svg',
  [sepolia.id]: 'https://etherscan.io/images/svg/brands/ethereum-original.svg',
  [optimism.id]:
    'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
  [optimismSepolia.id]:
    'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
};

export const DEFAULT_CHAIN_CONFIG = DEFAULT_LOCAL_CHAINS[0];
