import { Dialog, DialogContent } from '@/components/ui/dialog';
import Account from './Account';
import { useAccount } from '../contexts/account-context';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
}

export default function AccountsModal({ open, onOpenChange }: IProps) {
  const {
    accountInfo: { address, chainType, balance, isActivated },
  } = useAccount();
  // TODO: get accounts by what? need to handle accounts
  const mockAccouts: Omit<TAccountInfo, 'ownerAddress'>[] = [
    {
      address,
      balance,
      chainType,
      isActivated,
    },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen">
        <div className="mt-10">
          <h3 className="text-3xl mb-10">Accounts</h3>
          {mockAccouts.map((account) => (
            <div
              key={account.address}
              className="flex justify-between items-center"
            >
              <Account
                chainType={account.chainType}
                address={account.address}
              />
              <div className="text-gray-400 font-medium text-lg">
                {account.balance || 0} ETH
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
