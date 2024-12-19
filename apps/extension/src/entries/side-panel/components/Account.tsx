import { SUPPORTED_CHAIN_ICON_MAP, TChainConfigItem } from '@/constants/chains';
import { ChevronDown, Copy, Trash } from 'lucide-react';
import { safeClipboard } from '@/utils/clipboard';
import { MouseEventHandler, useState } from 'react';
import DefaultTokenIcon from '@/assets/icons/ether.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import SplittedGrayAddress from '@/components/SplittedGrayAddress';
import { cn } from '@/utils/shadcn/utils';
import { useAlert } from '@/components/ui/alerter';

interface IAccountItemProps {
  address: string;
  chainIcon?: string;
  balance: string | null;
  isCurrent?: boolean;
  isDeployed?: boolean;
  onDelete?: (address: string) => void;
}

export const AccountItem = ({
  address,
  chainIcon,
  balance,
  isDeployed,
  onDelete,
  isCurrent = false,
}: IAccountItemProps) => {
  const { elytroAlert } = useAlert();
  const handleClickCopy: MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    safeClipboard(address || '');
  };
  const handleDelete: MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    elytroAlert({
      title: 'Are you sure to delete this address?',
      onConfirm: () => {
        onDelete?.(address);
      },
    });
  };
  return (
    <div
      className={cn(
        'flex items-center justify-between min-w-[300px] px-5 py-4 hover:bg-gray-150',
        isCurrent ? 'bg-gray-150' : 'cursor-pointer'
      )}
    >
      <div className="flex items-center">
        <img
          src={chainIcon || DefaultTokenIcon}
          alt={address}
          className="size-8"
        />
        <div className=" font-semibold ml-2">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </div>
      <div className="flex items-center gap-2 ">
        <div className="text-gray-600">
          {isDeployed ? `${balance} ETH` : 'Inactivated'}{' '}
        </div>
        <Copy className="size-4" onClick={handleClickCopy} />
        {!isCurrent && <Trash className="size-4" onClick={handleDelete} />}
      </div>
    </div>
  );
};

interface IAccountProps {
  currentAccount: TAccountInfo;
  accounts: TAccountInfo[];
  chain: TChainConfigItem;
  chains: TChainConfigItem[];
  onClickAccount?: (account: TAccountInfo) => void;
  onDeleteAccount?: (address: string) => void;
}

export default function Account({
  accounts,
  chain,
  chains = [],
  currentAccount,
  onClickAccount,
  onDeleteAccount,
}: IAccountProps) {
  const [open, setOpen] = useState(false);
  const onClickCreateBtn = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.CreateNewAddress);
  };
  const handleClickItem = (item: TAccountInfo) => {
    if (onClickAccount) {
      onClickAccount(item);
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger onClick={() => setOpen(true)}>
        <div className="flex flex-row gap-2 items-center bg-white rounded-sm p-xs cursor-pointer hover:bg-gray-200">
          <img
            className="w-5 h-5"
            src={SUPPORTED_CHAIN_ICON_MAP[chain!.chainId]}
          />
          <div className="font-light font-base">
            <SplittedGrayAddress address={currentAccount.address} />
          </div>
          <ChevronDown className="w-3 h-3" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="p-0"
        align="start"
        onPointerDownOutside={() => setOpen(false)}
      >
        <div className="px-5 py-3 flex justify-between items-center min-w-[400px]">
          <div className=" font-bold text-base">Switch Addresses</div>
          <Button variant="outline" size="sm" onClick={onClickCreateBtn}>
            Create New Address
          </Button>
        </div>
        <div>
          <DropdownMenuLabel className="font-medium px-5 py-1 text-gray-600">
            {chain?.chainName} {currentAccount?.isDeployed && '(Current)'}
          </DropdownMenuLabel>
          <AccountItem
            isDeployed={currentAccount?.isDeployed}
            isCurrent
            address={currentAccount?.address}
            balance={currentAccount?.balance || '0'}
          />
        </div>
        {accounts
          .filter((ac) => ac.address !== currentAccount?.address)
          .map((account: TAccountInfo) => {
            const chainName =
              chains.find((c) => c.chainId === account.chainId)?.chainName ||
              'Unknown Chian';
            return (
              <div
                key={account.address}
                onClick={() => handleClickItem(account)}
              >
                <DropdownMenuLabel className="font-medium px-5 py-1 text-gray-600">
                  {chainName}{' '}
                  {account.address === currentAccount?.address && '(Current)'}
                </DropdownMenuLabel>
                <div onClick={() => handleClickItem(account)}>
                  <AccountItem
                    isDeployed={account.isDeployed}
                    address={account.address}
                    balance={account.balance || '0'}
                    onDelete={onDeleteAccount}
                  />
                </div>
              </div>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
