import {
  Chain,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'viem/chains';

export type TChainConfigItem = {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  blockExplorerUrl?: string;
  bundlerUrl: string;
  currencySymbol: { name: string; symbol: string; decimals: number };
  ensContractAddress: string;
  icon?: string;
};

export type TChainItem = Chain & {
  icon?: string;
  endpoint: string; // rpc url
  bundler: string; // bundler url
  factory: string; // factory address
  fallback: string; // fallback address
  recovery: string; // social recovery module address
  validator: string; // validator address
  // onchain config. If provided, it will be used to initialize the SDK and the SDK won't check chain config anymore.
  onchainConfig: {
    chainId: number;
    entryPoint: string;
    soulWalletLogic: string;
  };
};

export const SUPPORTED_CHAINS: TChainItem[] = [
  {
    ...optimism,
    icon: 'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
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
  {
    ...optimismSepolia,
    icon: 'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
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
  {
    ...sepolia,
    icon: 'https://etherscan.io/images/svg/brands/ethereum-original.svg',
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
];

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id);

export const SUPPORTED_CHAIN_ICON_MAP: Record<number, string> = {
  [mainnet.id]: 'https://etherscan.io/images/svg/brands/ethereum-original.svg',
  [sepolia.id]: 'https://etherscan.io/images/svg/brands/ethereum-original.svg',
  [optimism.id]:
    'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
  [optimismSepolia.id]:
    'https://assets.coingecko.com/coins/images/25244/standard/Optimism.png',
};
