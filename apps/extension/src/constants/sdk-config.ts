import { SupportedChainTypeEn } from './chains';

type SDKInitConfig = {
  endpoint: string; // rpc url
  bundler: string; // bundler url
  factory: string; // factory address
  fallback: string; // fallback address
  recovery: string; // social recovery module address
};

export const SDK_INIT_CONFIG_BY_CHAIN_MAP: Record<
  SupportedChainTypeEn,
  SDKInitConfig
> = {
  [SupportedChainTypeEn.OP_SEPOLIA]: {
    endpoint:
      'https://opt-sepolia.g.alchemy.com/v2/7EJnXZWkG9HIhjj0ZLx7vk_lexCq25Pr', //this.chain.rpcUrls.default.http[0], //
    bundler:
      'https://soulwallet.optimism-sepolia.voltaire.candidewallet.com/rpc',
    factory: '0xF78Ae187CED0Ca5Fb98100d3F0EAB7a6461d6fC6',
    fallback: '0x880c6eb80583795625935B08AA28EB37F16732C7',
    recovery: '0x3Cc36538cf53A13AF5C28BB693091e23CF5BB567',
  },
};
