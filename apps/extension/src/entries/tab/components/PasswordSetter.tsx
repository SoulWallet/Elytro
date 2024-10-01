import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EyeOnOff } from '@/assets/icons/EyeOnOff';
import { useState } from 'react';

const passwordForm = z
  .object({
    password: z
      .string()
      .min(6, {
        message:
          'The password should be more than 6 characters and include more than 1 capitalized letter.',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'The password should include more than 1 capitalized letter.',
      }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'], // path of error
  });

interface PasswordSetterProps {
  loading: boolean;
  onSubmit: (pwd: string) => void;
}

export function PasswordSetter({ onSubmit, loading }: PasswordSetterProps) {
  const form = useForm<z.infer<typeof passwordForm>>({
    resolver: zodResolver(passwordForm),
    mode: 'onChange',
  });
  const [isPwdVisible, setIsPwdVisible] = useState(false);

  const handleSubmit = async (data: z.infer<typeof passwordForm>) => {
    onSubmit(data.password);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-[416px] space-y-8"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={loading}
                    type={isPwdVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="bg-gray-50 border-none rounded-2xl p-4 h-14"
                  />
                  <EyeOnOff
                    className="absolute top-1/4 right-4"
                    onChangeVisible={(val) => setIsPwdVisible(val)}
                  />
                </div>
              </FormControl>

              {form.formState.errors.password ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  The password should be more than 6 characters and include more
                  than 1 capitalized letter.
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        {(loading ||
          (form.getValues('password')?.length &&
            form.formState.errors.password === undefined)) && (
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    type={isPwdVisible ? 'text' : 'password'}
                    placeholder="Enter password again"
                    className="bg-gray-50 border-none rounded-2xl p-4 h-14"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          className="w-full rounded-full h-14"
          disabled={loading}
        >
          {loading ? '加载中...' : '提交'}
        </Button>
      </form>
    </Form>
  );
}
