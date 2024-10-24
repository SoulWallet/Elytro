import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PropsWithChildren } from 'react';
import EmailIcon from '@/assets/icons/email.svg';
import WalletIcon from '@/assets/icons/wallet.svg';
import { ContactEnum } from './AddRecoverContactModal';

interface IProps extends PropsWithChildren {
  onItemClick: (type: string) => void;
}

export default function AddContactDropdown({ children, onItemClick }: IProps) {
  const RecoverTypes = [
    {
      name: ContactEnum.Email,
      icon: EmailIcon,
    },
    {
      name: ContactEnum.Wallet,
      icon: WalletIcon,
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 space-y-2">
        {RecoverTypes.map((type) => (
          <DropdownMenuItem
            onClick={() => onItemClick(type.name)}
            key={type.name}
            className="min-w-[220px] cursor-pointer text-lg font-medium"
          >
            <img src={type.icon} alt={type.name} />
            <div>{type.name}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
