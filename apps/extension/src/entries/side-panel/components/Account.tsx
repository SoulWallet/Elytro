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

interface IAccountItemProps {
  address: string;
  chainIcon?: string;
  balance: string;
}

const AccountItem = ({ address, chainIcon, balance }: IAccountItemProps) => {
  const handleClickCopy: MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    safeClipboard(address || '');
  };
  const handleDelete = () => {
    console.log('delete');
  };
  return (
    <div className="flex items-center justify-between min-w-[300px] px-5 py-4 hover:bg-gray-150">
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
      <div className="flex items-center gap-2">
        <div className="text-gray-600">{balance} ETH</div>
        <Copy className="size-4" onClick={handleClickCopy} />
        <Trash className="size-4" onClick={handleDelete} />
      </div>
    </div>
  );
};

export default function Account({
  account,
  chain,
}: {
  account: {
    address: string;
    balance: string;
  };
  chain: TChainConfigItem;
}) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger onClick={() => setOpen(true)}>
        <div className="flex flex-row gap-2 items-center bg-white rounded-sm p-xs cursor-pointer hover:bg-gray-200">
          <img
            className="w-5 h-5"
            src={SUPPORTED_CHAIN_ICON_MAP[chain.chainId]}
          />
          <div className="font-light font-base">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
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
          <Button variant="outline" size="sm">
            Create New Address
          </Button>
        </div>
        <DropdownMenuLabel className="font-medium px-5 py-1 text-gray-600">
          {chain.chainName}
        </DropdownMenuLabel>
        <AccountItem address={account.address} balance={account.balance} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
