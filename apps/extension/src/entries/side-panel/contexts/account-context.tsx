import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useWallet } from '@/contexts/wallet';
import { useHashLocation } from 'wouter/use-hash-location';
import useSearchParams from '@/hooks/use-search-params';
import { Address } from 'viem';
import useTokens, { TokenDTO } from '@/hooks/use-tokens';
import { UserOperationHistory } from '@/constants/operations';
import RuntimeMessage from '@/utils/message/runtimeMessage';
import { EVENT_TYPES } from '@/constants/events';

const DEFAULT_ACCOUNT_INFO: TAccountInfo = {
  address: '',
  isDeployed: false,
  balance: '0',
  chainId: 0,
};

type IAccountContext = {
  accountInfo: TAccountInfo;
  updateAccount: () => Promise<void>;
  loading: boolean;
  tokenInfo: {
    tokens: TokenDTO[];
    loadingTokens: boolean;
  };
  history: UserOperationHistory[];
  accounts: TAccountInfo[];
  updateHistory: () => Promise<void>;
  getAccounts: () => Promise<void>;
};

// TODO: extract HistoryContext
const AccountContext = createContext<IAccountContext>({
  accountInfo: DEFAULT_ACCOUNT_INFO,
  updateAccount: async () => {},
  loading: false,
  tokenInfo: {
    tokens: [],
    loadingTokens: false,
  },
  history: [],
  updateHistory: async () => {},
  accounts: [],
  getAccounts: async () => {},
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
  const [history, setHistory] = useState<UserOperationHistory[]>([]);
  const [accounts, setAccounts] = useState<TAccountInfo[]>([]);

  const updateAccount = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const res = (await wallet.getCurrentAccount()) ?? DEFAULT_ACCOUNT_INFO;
      setAccountInfo(res);

      if (intervalRef.current && res.isDeployed) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(intervalRef.current ? true : false);
    }
  };

  const { tokens, loadingTokens } = useTokens({
    address: accountInfo.address as Address,
    chainId: accountInfo.chainId,
  });

  // TODO: check this logic
  const updateHistory = async () => {
    const res = await wallet.getLatestHistories();
    setHistory(res);
  };

  useEffect(() => {
    if (!history) {
      updateHistory();
    }

    RuntimeMessage.onMessage(EVENT_TYPES.HISTORY.ITEMS_UPDATED, updateHistory);
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

  const getAccounts = async () => {
    const res = await wallet.getAccounts();
    if (res) {
      setAccounts(res);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

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
        updateHistory,
        loading,
        accounts,
        getAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  return useContext(AccountContext);
};
