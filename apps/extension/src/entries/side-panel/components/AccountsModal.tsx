import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAccount } from '../contexts/account-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useWallet } from '@/contexts/wallet';
import { Loader2 } from 'lucide-react';
import { useChain } from '../contexts/chain-context';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
}

export default function AccountsModal({ open, onOpenChange }: IProps) {
  const { accounts, getAccounts, updateAccount } = useAccount();
  const { chains, currentChain, getCurrentChain } = useChain();
  const wallet = useWallet();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [networkId, setNetworkId] = useState<string>('');

  const handleAdd = async () => {
    try {
      setIsAdding(true);
      if (networkId) {
        await wallet.createAccount(Number(networkId));
        getAccounts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSwitch = async (chainId: string) => {
    try {
      await wallet.switchAccountByChain(Number(chainId));

      getAccounts();
      updateAccount();
    } catch (error) {
      console.error(error);
    } finally {
      getCurrentChain();
      updateAccount();
    }
  };

  if (chains.length === 0) return;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen">
        <div className="mt-10">
          <h3 className="text-3xl mb-10">Accounts</h3>
          {accounts.map((account, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                {chains.find((chain) => chain.chainId === account.chainId)
                  ?.chainName || 'Unknown Network'}
              </div>
              {account.address && <div>{account.address}</div>}
              <div>{account.isDeployed ? 'Activated' : 'Not Activated'}</div>
              {account.chainId !== currentChain?.chainId && (
                <Button
                  onClick={() => handleSwitch(account.chainId.toString())}
                >
                  Switch
                </Button>
              )}
            </div>
          ))}

          <div>
            <h3 className=" font-bold text-2xl">Add Account</h3>
            <div>
              <Select
                value={networkId}
                onValueChange={(val) => setNetworkId(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="select network" />
                </SelectTrigger>
                <SelectContent>
                  {chains.map((chain) => (
                    <SelectItem
                      key={chain.chainId}
                      value={chain.chainId.toString()}
                    >
                      {chain.chainName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button disabled={isAdding} onClick={handleAdd}>
                {isAdding && <Loader2 className="animate-spin" />}
                Add
              </Button>
            </div>
          </div>
          {currentChain ? (
            <div className="text-3xl">
              currentChain: {currentChain.chainName}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
