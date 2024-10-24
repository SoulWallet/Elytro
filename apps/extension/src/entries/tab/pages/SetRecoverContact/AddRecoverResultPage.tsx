import { Button } from '@/components/ui/button';
import AddContactDropdown from './AddContactDropdown';
import { PlusIcon } from 'lucide-react';
import { ContactEnum, SubmitDataType } from './AddRecoverContactModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EmailIcon from '@/assets/icons/email.svg';
import WalletIcon from '@/assets/icons/wallet.svg';

const ContactView = ({ contact }: { contact: SubmitDataType }) => (
  <div className="flex items-center">
    <div className="w-[200px]">
      {contact.data.guardian || contact.data.email}
    </div>
    <div className="flex items-center">
      <img
        className="mr-2"
        src={contact.type === ContactEnum.Email ? EmailIcon : WalletIcon}
        alt={contact.data.address || contact.data.email}
      />
      <div>{contact.data.address || contact.data.email}</div>
    </div>
  </div>
);

export default function AddRecoverResultPage({
  contacts,
  openAddModal,
  onBack,
}: {
  contacts: SubmitDataType[];
  openAddModal: (type: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="h-[80vh] w-[90vw] md:w-[65vw] flex flex-col justify-between">
      <div>
        <h2 className="font-medium text-3xl">Account recovery</h2>
        <div className="mt-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-medium">RECOVERY CONTACT</h3>
            <AddContactDropdown onItemClick={openAddModal}>
              <Button variant="outline">
                <PlusIcon /> Add another contact
              </Button>
            </AddContactDropdown>
          </div>
          <div className="space-y-4 text-sm mb-10">
            {contacts.map((contact) => (
              <ContactView
                contact={contact}
                key={contact.data.address || contact.data.email}
              />
            ))}
          </div>
          <div>
            <h3 className="text-xl font-medium mb-10">RECOVERY SETTINGS</h3>
            <div className="flex items-center">
              <Select defaultValue="1">
                <SelectTrigger className="w-[130px] h-[60px] rounded-md mr-4">
                  <div className="flex-1 ml-4 font-medium text-center text-lg">
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((_, index) => (
                    <SelectItem
                      className="h-[60px] text-lg font-medium w-full"
                      value={(index + 1).toString()}
                      key={index}
                    >
                      {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm">{`Out of ${contacts.length} guardian(s) confirmation is needed for wallet recovery. `}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button>Confirm</Button>
      </div>
    </div>
  );
}
