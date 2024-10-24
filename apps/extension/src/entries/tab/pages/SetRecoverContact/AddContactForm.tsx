import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

export interface FormFieldProps {
  name: string;
  placeholder: string;
  label?: string;
  description?: string;
}

interface IProps {
  formConfig?: unknown;
  formFields: FormFieldProps[];
  handleSubmit?: SubmitHandler<FieldValues>;
}

export default function AddEmailContactFrom({
  formConfig,
  formFields,
  handleSubmit,
}: IProps) {
  if (!formConfig) return null;
  const form = useForm(formConfig);
  const onSubmit = () => {
    if (handleSubmit) {
      const value = form.getValues();
      handleSubmit(value);
    }
  };
  return (
    <Form {...form}>
      <form className="mt-8 space-y-6 flex-1 relative">
        {formFields.map((formField: FormFieldProps) => (
          <FormField
            control={form.control}
            name={formField.name}
            key={formField.name}
            render={({ field }) => (
              <FormItem>
                {formField.label ? (
                  <FormLabel>{formField.label}</FormLabel>
                ) : null}
                <FormControl className="bg-gray-200 px-4 py-8 rounded-lg">
                  <Input
                    className="text-lg"
                    placeholder={formField.placeholder}
                    {...field}
                  />
                </FormControl>
                {formField.description ? (
                  <FormDescription>{formField.description}</FormDescription>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          className="absolute bottom-0 right-0 min-w-[200px]"
          type="submit"
          disabled={!form.formState.isValid}
          onClick={onSubmit}
        >
          Add
        </Button>
      </form>
    </Form>
  );
}
