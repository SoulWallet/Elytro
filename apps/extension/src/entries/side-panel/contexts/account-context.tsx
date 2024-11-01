import { DEFAULT_CHAIN_TYPE, SUPPORTED_CHAIN_MAP } from '@/constants/chains';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useWallet } from '@/contexts/wallet';
import { useHashLocation } from 'wouter/use-hash-location';
import useSearchParams from '@/hooks/use-search-params';
import { gql } from '@apollo/client';
import { Address, Hex, toHex } from 'viem';
import { query } from '@/requests';

export interface TokenDTO {
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tokenBalance: Hex;
  price: number;
}

interface TokenQueryDTO {
  tokens: TokenDTO[];
}

const DEFAULT_ACCOUNT_INFO: TAccountInfo = {
  address: '',
  isActivated: false,
  chainType: DEFAULT_CHAIN_TYPE,
  balance: '0',
  ownerAddress: '',
};

type IAccountContext = {
  accountInfo: TAccountInfo;
  updateAccount: () => Promise<void>;
  loading: boolean;
  tokenInfo: {
    tokens: TokenDTO[];
    loadingTokens: boolean;
  };
};

const AccountContext = createContext<IAccountContext>({
  accountInfo: DEFAULT_ACCOUNT_INFO,
  updateAccount: async () => {},
  loading: false,
  tokenInfo: {
    tokens: [],
    loadingTokens: false,
  },
});

export const AccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallet = useWallet();
  const [accountInfo, setAccountInfo] =
    useState<TAccountInfo>(DEFAULT_ACCOUNT_INFO);
  const [loading, setLoading] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [tokens, setTokens] = useState<TokenDTO[]>([]);
  const [pathname] = useHashLocation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();

  const updateAccount = async () => {
    try {
      setLoading(true);
      const res = (await wallet.getSmartAccountInfo()) ?? DEFAULT_ACCOUNT_INFO;
      setAccountInfo(res);

      if (intervalRef.current && res.isActivated) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(intervalRef.current ? true : false);
    }
  };

  const getTokens = async (address: Address, chainId: Hex) => {
    const tokens_query = gql`
      query TokensQuery($address: String!, $chainId: String!) {
        tokens(address: $address, chainID: $chainId) {
          decimals
          logoURI
          name
          symbol
          tokenBalance
          price
        }
      }
    `;
    setLoadingTokens(true);
    const data = await query<TokenQueryDTO>(tokens_query, { address, chainId });
    if (data?.tokens) {
      setTokens(data.tokens);
    }
    setLoadingTokens(false);
  };

  useEffect(() => {
    const { address, chainType } = accountInfo;
    const chainId = toHex(
      SUPPORTED_CHAIN_MAP[chainType as keyof typeof SUPPORTED_CHAIN_MAP].id
    );
    if (address) {
      getTokens(address as Address, chainId);
    }
  }, [accountInfo]);

  useEffect(() => {
    if (!loading && !accountInfo.address) {
      updateAccount();
    }
  }, [pathname]);

  useEffect(() => {
    if (searchParams.activating) {
      intervalRef.current = setInterval(() => {
        updateAccount();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [searchParams]);

  return (
    <AccountContext.Provider
      value={{
        accountInfo,
        updateAccount,
        tokenInfo: {
          tokens,
          loadingTokens,
        },
        loading,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  return useContext(AccountContext);
};
