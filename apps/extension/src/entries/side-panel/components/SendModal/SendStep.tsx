import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent } from '@/components/ui/select';
import { useState } from 'react';
import { TokenDTO } from '@/hooks/use-tokens';
import { formatEther, Hex, hexToBigInt } from 'viem';
import { useElytroStep } from '@/components/steps/StepProvider';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { TxData } from '.';
import { useAccount } from '../../contexts/account-context';
export interface TokenProps {
  name: string;
  balance: string | number;
  icon: string;
}

function SelectedToken({ token }: { token?: TokenDTO }) {
  if (!token)
    return <div className="text-gray-400 text-lg">Select a token</div>;
  return (
    <div className="flex items-center">
      <img className="h-10 w-10" src={token.logoURI} alt={token.name} />
      <div className="text-left ml-2">
        <div className="text-lg">{token.name}</div>
        <div className="text-gray-400">
          {formatEther(BigInt(token.tokenBalance))} Avail.
        </div>
      </div>
    </div>
  );
}

export default function SendStep() {
  const {
    tokenInfo: { tokens = [] },
  } = useAccount();
  const [open, setOpen] = useState(false);
  const { handleContinue } = useElytroStep();
  const formResolverConfig = z.object({
    token: z.object({
      name: z.string(),
      logoURI: z.string(),
      tokenBalance: z.string(),
      decimals: z.number(),
      symbol: z.string(),
      price: z.number(),
    }),
    amount: z.string().superRefine((data, ctx) => {
      if (data === '' || isNaN(Number(data)) || Number(data) <= 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please input a valid amount',
        });
      }
      if (
        Number(data) >
        Number(
          formatEther(hexToBigInt(form.getValues('token').tokenBalance as Hex))
        )
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Insufficient balance',
        });
      }
    }),
  });
  const form = useForm<z.infer<typeof formResolverConfig>>({
    resolver: zodResolver(formResolverConfig),
    mode: 'onChange',
  });
  const handleFillMax = () => {
    const token = form.getValues('token');
    if (token) {
      form.setValue(
        'amount',
        formatEther(hexToBigInt(token.tokenBalance as Hex)).toString()
      );
      form.trigger('amount');
    }
  };
  const handleSelect = (item: TokenDTO) => {
    form.setValue('token', item);
    form.trigger('token');
    setOpen(false);
  };
  const handleComfirm = () => {
    const { token, amount } = form.getValues();
    handleContinue<TxData>({ token: token as TokenDTO, amount });
  };
  return (
    <div className="space-y-4">
      <h3 className="text-3xl">Send</h3>
      <div className="space-y-2">
        <Form {...form}>
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <Label className="text-gray-400 font-normal">Token</Label>
                <FormControl className="bg-gray-200 px-4 py-8 rounded-lg">
                  <Select onValueChange={field.onChange} open={open}>
                    <SelectTrigger
                      onClick={() => setOpen(!open)}
                      className="bg-gray-200 py-8 rounded-md border-none"
                    >
                      <SelectedToken token={field.value as TokenDTO} />
                    </SelectTrigger>
                    <SelectContent
                      className="rounded-3xl"
                      onPointerDownOutside={() => setOpen(false)}
                    >
                      {tokens.map((item) => (
                        <div
                          key={item.name}
                          onClick={() => handleSelect(item)}
                          className="flex items-center justify-between cursor-pointer hover:bg-gray-200 py-4 px-4"
                        >
                          <img
                            className="h-10 w-10 mr-4"
                            src={item.logoURI}
                            alt={item.name}
                          />
                          <div className="flex-1 text-lg">{item.name}</div>
                          <div className="text-gray-400 text-lg">
                            {formatEther(hexToBigInt(item.tokenBalance))}
                          </div>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <Label className="text-gray-400 font-normal">Amount</Label>
                <FormControl>
                  <div className="bg-gray-200 px-4 py-3 rounded-lg flex flex-row items-center font-medium text-lg">
                    <Input
                      className="text-lg"
                      placeholder="Input amount"
                      disabled={!form.getValues('token')}
                      {...field}
                    />
                    <div className="text-gray-400">ETH</div>
                    <Button
                      disabled={!form.getValues('token')}
                      variant="ghost"
                      className="text-lg hover:bg-transparent"
                      onClick={() => handleFillMax()}
                    >
                      Max
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <Button
          onClick={handleComfirm}
          disabled={!form.formState.isValid}
          className={`w-full p-8 rounded-full ${form.formState.isValid ? 'bg-[#0E2D50]' : 'bg-[#F2F3F5] text-[#676B75]'}`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
