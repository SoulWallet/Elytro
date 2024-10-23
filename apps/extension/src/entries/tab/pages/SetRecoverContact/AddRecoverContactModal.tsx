import { Dialog, DialogContent } from '@/components/ui/dialog';
import AddEmailContactFrom from './AddContactForm';
import FormConfig from './EmailFormConfig';
import { useForm } from 'react-hook-form';

export default function AddReoverContactModal({
  open,
  type,
  handleOnOpenChange,
}: {
  open: boolean;
  type?: string;
  handleOnOpenChange: () => void;
}) {
  const titleMapping = {
    Wallet: 'Add wallet address',
    Email: 'Email',
  };

  if (!type) return null;
  const getFormConfig = () => {
    if (type === 'Email') return FormConfig.Email;
    if (type === 'Wallet') return FormConfig.Wallet;
    return FormConfig.Email;
  };
  const formConfig = getFormConfig();
  const handleSubmit = (
    data: {
      email: string;
      confirm: string;
    } & {
      address: `0x${string}`;
      guardian: string;
    }
  ) => {
    formConfig.handleSubmit(data);
    handleOnOpenChange();
  };
  // @ts-ignore
  const form = useForm(formConfig.form as unknown);
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
          <AddEmailContactFrom
            form={form}
            formFields={formConfig.fields}
            handleSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
