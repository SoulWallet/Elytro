import { DEFAULT_CHAIN_TYPE, SUPPORTED_CHAIN_MAP } from '@/constants/chains';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useWallet } from '@/contexts/wallet';
import { useHashLocation } from 'wouter/use-hash-location';
import useSearchParams from '@/hooks/use-search-params';
import { Address, toHex } from 'viem';
import useTokens, { TokenDTO } from '@/hooks/use-tokens';
import {
  elytroTxHistoryEventManager,
  TxHistory,
} from '@/background/services/txHistory';

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
  history: TxHistory[];
};

const AccountContext = createContext<IAccountContext>({
  accountInfo: DEFAULT_ACCOUNT_INFO,
  updateAccount: async () => {},
  loading: false,
  tokenInfo: {
    tokens: [],
    loadingTokens: false,
  },
  history: [],
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
  const [history, setTxHistory] = useState<TxHistory[]>([]);

  const updateAccount = async () => {
    if (loading) {
      return;
    }
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

  const { tokens, loadingTokens, refetchTokens } = useTokens(
    accountInfo.address as Address,
    chainId
  );

  const updateHistory = () => {
    elytroTxHistoryEventManager.subscribTxHistory((his: string) => {
      const history = JSON.parse(his);
      if (history.length) {
        const reversedHistory = history.reverse();
        setTxHistory(reversedHistory);
        refetchTokens();
      }
    });
  };
  useEffect(() => {
    updateHistory();
    wallet.broadcastHistoy();
  }, []);

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
        history,
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
