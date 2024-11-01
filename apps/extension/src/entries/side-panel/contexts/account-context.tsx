import { DEFAULT_CHAIN_TYPE, SUPPORTED_CHAIN_MAP } from '@/constants/chains';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useWallet } from '@/contexts/wallet';
import { useHashLocation } from 'wouter/use-hash-location';
import useSearchParams from '@/hooks/use-search-params';
import { Address, toHex } from 'viem';
import useActivities, { AggregatedTransaction } from '@/hooks/use-activities';
import useTokens, { TokenDTO } from '@/hooks/use-tokens';

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
  activityInfo: {
    loadingActivities: boolean;
    activities: AggregatedTransaction[];
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
  activityInfo: {
    loadingActivities: false,
    activities: [],
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

  const chainId = toHex(
    SUPPORTED_CHAIN_MAP[
      accountInfo.chainType as keyof typeof SUPPORTED_CHAIN_MAP
    ].id
  );

  const { loadingActivities, activities } = useActivities(
    accountInfo.address as Address,
    chainId
  );

  const { tokens, loadingTokens } = useTokens(
    accountInfo.address as Address,
    chainId
  );

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
        activityInfo: {
          loadingActivities,
          activities,
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
