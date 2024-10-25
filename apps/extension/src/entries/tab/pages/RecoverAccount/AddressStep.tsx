import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { z } from 'zod';

interface IProps {
  onContinue: () => void;
}

export default function AddressStep({ onContinue }: IProps) {
  const formResolverConfig = z.object({
    address: z
      .string()
      .refine((address) => isAddress(address), {
        message: 'Pleaase give a valid address.',
      }),
  });
  const form = useForm<z.infer<typeof formResolverConfig>>({
    resolver: zodResolver(formResolverConfig),
    mode: 'onChange',
  });
  return (
    <>
      <h3 className="text-3xl mb-4 font-semibold">Enter wallet address</h3>
      <Form {...form}>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormControl className="bg-gray-200 px-4 py-8 rounded-lg">
                <Input
                  className="text-lg"
                  placeholder="Username or wallet address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <div className="mt-4 flex justify-end">
        <Button onClick={onContinue} disabled={!form.formState.isValid}>
          Continue
        </Button>
      </div>
    </>
  );
}
