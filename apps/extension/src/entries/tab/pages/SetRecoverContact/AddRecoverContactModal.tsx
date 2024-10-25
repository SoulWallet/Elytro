import { Dialog, DialogContent } from '@/components/ui/dialog';
import AddContactFrom from './AddContactForm';
import { useRecoverContactForm } from './useRecoverContactForm';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { Address } from 'viem';

type Data = {
  email: string;
  confirm: string;
} & {
  address: Address;
  guardian: string;
};

export type SubmitDataType = {
  type: string;
  data: Data;
};

const titleMapping = {
  Wallet: 'Add wallet address',
  Email: 'Email',
};

export enum ContactEnum {
  Wallet = 'Wallet',
  Email = 'Email',
}

export default function AddReoverContactModal({
  contacts,
  open,
  type,
  onSubmit,
  handleOnOpenChange,
}: {
  open: boolean;
  contacts: SubmitDataType[];
  type?: string;
  onSubmit: (data: SubmitDataType) => void;
  handleOnOpenChange: () => void;
}) {
  if (!type) return null;
  const { formConfig, formFields } = useRecoverContactForm(type, contacts);
  const handleSubmit: SubmitHandler<FieldValues> = (data) => {
    onSubmit({
      type,
      data: data as Data,
    });
    handleOnOpenChange();
  };
  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent
        overlayClassName="bg-black/30"
        className="w-[50vw] bottom-[calc(50%-25vh)] left-[calc(50%-25vw)] right-[calc(50%-25vh)] min-h-[50vh] max-h-[50vh]"
      >
        <div className="p-10 h-full flex flex-col">
          <h3 className="text-[28px] font-medium">
            {titleMapping[type as keyof typeof titleMapping]}
          </h3>
          <AddContactFrom
            formConfig={formConfig}
            formFields={formFields}
            handleSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
