import { useState } from 'react';
import { useWallet } from '../contexts/wallet-context';
import { DEFAULT_CHAIN_TYPE } from '@/constants/chains';

const DEFAULT_ACCOUNT_INFO: TAccountInfo = {
  address: '',
  isActivated: false,
  chainType: DEFAULT_CHAIN_TYPE,
  balance: '0',
};

export function useAccount() {
  const wallet = useWallet();
  const [accountInfo, setAccountInfo] =
    useState<TAccountInfo>(DEFAULT_ACCOUNT_INFO);

  const [loading, setLoading] = useState(false);

  const updateAccount = async () => {
    try {
      setLoading(true);
      const res = (await wallet.getSmartAccountInfo()) ?? DEFAULT_ACCOUNT_INFO;

      setAccountInfo(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { accountInfo, updateAccount, loading };
}