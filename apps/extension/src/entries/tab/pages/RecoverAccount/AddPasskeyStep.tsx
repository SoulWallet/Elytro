import PasswordInput from '@/components/PasswordInputer';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface IProps {
  onBack: () => void;
  onContinue: () => void;
}

export default function AddpasskeyStep({ onBack, onContinue }: IProps) {
  const [isPwdVisible, setIsPwdVisible] = useState(false);
  const formResolverConfig = z
    .object({
      password: z.string(),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Password don't match",
      path: ['confirm'], // path of error
    });
  const form = useForm<z.infer<typeof formResolverConfig>>({
    resolver: zodResolver(formResolverConfig),
    mode: 'onChange',
  });
  return (
    <>
      <h3 className="text-3xl mb-4 font-semibold">Set password</h3>
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl className="bg-gray-200 px-4 py-8 rounded-lg">
                  <PasswordInput
                    field={field}
                    placeholder="Enter your password"
                    onPwdVisibleChange={setIsPwdVisible}
                  />
                </FormControl>
                <FormDescription>
                  The password should be more than 6 characters and include more
                  than 1 capitalized letter.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormControl className="bg-gray-200 px-4 py-8 rounded-lg">
                  <PasswordInput
                    field={field}
                    placeholder="Enter password again"
                    showEye={false}
                    outerPwdVisible={isPwdVisible}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
      <div className="mt-4 flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onContinue} disabled={!form.formState.isValid}>
          Continue
        </Button>
      </div>
    </>
  );
}
