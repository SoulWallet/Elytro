import { Button } from '@/components/ui/button';
import TabLayout from '../../components/TabLayout';
import GuardianImg from '@/assets/guardian.png';
import EmailIcon from '@/assets/icons/email.svg';
import WalletIcon from '@/assets/icons/wallet.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import AddReoverContactModal from './AddRecoverContactModal';

const RecoverTypes = [
  {
    name: 'Email',
    icon: EmailIcon,
  },
  {
    name: 'Wallet',
    icon: WalletIcon,
  },
];

export default function SetRecoverContact() {
  const [addType, setAddType] = useState<string>();
  const [openModal, setOpenModal] = useState(false);
  const openAddModal = (type: (typeof RecoverTypes)[0]) => {
    setAddType(type.name);
    setOpenModal(true);
  };
  return (
    <TabLayout>
      <div className="h-[80vh] w-[90vw] md:w-[65vw] flex justify-evenly items-center flex-col">
        <div className="flex flex-col items-center text-center">
          <img
            className="w-[16rem] h-[16rem] mb-10"
            src={GuardianImg}
            alt="guardian"
          />
          <h2 className="font-medium text-2xl">Recovery contact</h2>
          <p className="text-sm text-gray-800">
            If you lose access to your account, recovery contacts can help you
            get your account back.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Add recovery contact</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 space-y-2">
            {RecoverTypes.map((type) => (
              <DropdownMenuItem
                onClick={() => openAddModal(type)}
                key={type.name}
                className="min-w-[220px] cursor-pointer text-lg font-medium"
              >
                <img src={type.icon} alt={type.name} />
                <div>{type.name}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {openModal ? (
        <AddReoverContactModal
          type={addType}
          open={openModal}
          handleOnOpenChange={() => setOpenModal(false)}
        />
      ) : null}
    </TabLayout>
  );
}
