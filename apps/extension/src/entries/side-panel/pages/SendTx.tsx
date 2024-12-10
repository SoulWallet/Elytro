import { formatEther, Hex, hexToBigInt, isAddress } from 'viem';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { CircleHelp } from 'lucide-react';
import { Transaction } from '@soulwallet/sdk';
import { Button } from '@/components/ui/button';
import { TokenDTO } from '@/hooks/use-tokens';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import SecondaryPageWrapper from '../components/SecondaryPageWrapper';
import { useAccount } from '../contexts/account-context';
import { useChain } from '../contexts/chain-context';
import FragmentedAddress from '../components/FragmentedAddress';
import AddressInput from '../components/AddressInput';
import TokenSelector from '../components/TokenSelector';
import AmountInput from '../components/AmountInput';

export default function SendTx() {
  const {
    tokenInfo: { tokens = [] },
    accountInfo: { address },
  } = useAccount();
  const { currentChain } = useChain();
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
    to: z.string().refine((address) => isAddress(address), {
      message: 'Please give a valid address.',
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
  const handleTokenSelect = (item: TokenDTO) => {
    form.setValue('token', item);
    form.trigger('token');
  };

  const price = useMemo(() => {
    const token = form.getValues('token');
    const amount = form.getValues('amount');
    if (!token) return 0;
    const result = Number(amount) * token.price;
    return result ? result.toFixed(2) : 0;
  }, [form.getValues('token'), form.getValues('amount')]);

  const handleContinue = () => {
    if (!address) {
      console.error('Address is undefined');
      return;
    }
    const txParams: Transaction = {
      to: form.getValues('to'),
      data: '',
      value: form.getValues('amount').toString(),
      gasLimit: '0x0',
    };
    console.log(txParams);
  };
  return (
    <SecondaryPageWrapper
      title="Send"
      footer={
        <Button
          variant="secondary"
          size="large"
          className="fixed bottom-lg  left-lg right-lg"
          disabled={!form.formState.isValid}
          onClick={handleContinue}
        >
          Continue
        </Button>
      }
    >
      <div>
        <Form {...form}>
          <div className="bg-light-green p-5 rounded-lg mb-4">
            <h3 className="text-xl font-semibold mb-4">Sending</h3>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormControl>
                    <AmountInput
                      field={field}
                      isDisabled={!form.getValues('token')}
                      price={price}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={() => (
                <div className="relative">
                  <FormItem>
                    <FormControl>
                      <TokenSelector
                        tokens={tokens}
                        onTokenChange={handleTokenSelect}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <Button
                    disabled={!form.getValues('token')}
                    className="absolute right-0 top-0 text-lg bg-green"
                    size="tiny"
                    onClick={() => handleFillMax()}
                  >
                    Max
                  </Button>
                </div>
              )}
            />
          </div>
          <div className="bg-light-blue p-5 rounded-lg mb-4">
            <h3 className="text-xl font-semibold mb-4">To</h3>
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AddressInput field={field} currentChain={currentChain} />
                  </FormControl>
                  <FormMessage className="pb-2" />
                </FormItem>
              )}
            />
            <div className="flex text-gray-750">
              <CircleHelp className="w-4 h-4 text-gray-750 mr-2" />
              You tokens will be lost if the recipient is not on the same
              network.
            </div>
          </div>
        </Form>
        <div className="p-5 bg-gray-150 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-semibold text-base text-gray-750">
              From account
            </div>
            <FragmentedAddress
              address={address}
              chainId={currentChain?.chainId || 1}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="font-semibold text-base text-gray-750">
              Network cost
            </div>
            <div className="text-gray-600 text-base font-light">
              To be calculated
            </div>
          </div>
        </div>
      </div>
    </SecondaryPageWrapper>
  );
}
