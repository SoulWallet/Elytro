import { Button } from '@/components/ui/button';
import GuardianImg from '@/assets/guardian.png';
import AddContactDropdown from './AddContactDropdown';

export default function AddRecoverHomePage({
  openAddModal,
}: {
  openAddModal: (type: string) => void;
}) {
  return (
    <div className="h-[80vh] w-[90vw] md:w-[65vw] flex justify-evenly items-center flex-col">
      <div className="flex flex-col items-center text-center">
        <img
          className="w-[16rem] h-[16rem] mb-10"
          src={GuardianImg}
          alt="guardian"
        />
        <h2 className="font-medium text-2xl">Recovery contact</h2>
        <p className="text-sm text-gray-800">
          If you lose access to your account, recovery contacts can help you get
          your account back.
        </p>
      </div>
      <AddContactDropdown onItemClick={openAddModal}>
        <Button>Add recovery contact</Button>
      </AddContactDropdown>
    </div>
  );
}
