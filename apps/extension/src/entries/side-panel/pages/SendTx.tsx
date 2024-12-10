import { formatEther, Hex, hexToBigInt, isAddress } from 'viem';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { ArrowRightLeftIcon, ChevronDown, CircleHelp } from 'lucide-react';
import DefaultTokenIcon from '@/assets/icons/ether.svg';
import { SUPPORTED_CHAIN_ICON_MAP } from '@/constants/chains';
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
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent } from '@/components/ui/select';
import SecondaryPageWrapper from '../components/SecondaryPageWrapper';
import { useAccount } from '../contexts/account-context';
import { useChain } from '../contexts/chain-context';
import FragmentedAddress from '../components/FragmentedAddress';

function SelectedToken({ token }: { token?: TokenDTO }) {
  if (!token)
    return (
      <div className="flex items-center">
        <div className="text-lg w-full text-left">Select a token</div>
        <ChevronDown className="text-gray-600" />
      </div>
    );
  return (
    <div className="flex items-center w-full">
      <img
        className="h-10 w-10"
        src={token.logoURI || DefaultTokenIcon}
        alt={token.name}
      />
      <div className="text-left ml-2">
        <div className="flex items-center">
          <div className="text-lg">{token.name}</div>
          <ChevronDown className="text-gray-600" />
        </div>

        <div className="text-gray-600">
          Balance: {formatEther(BigInt(token.tokenBalance))}
        </div>
      </div>
    </div>
  );
}

export default function SendTx() {
  const {
    tokenInfo: { tokens = [] },
    accountInfo: { address },
  } = useAccount();
  const { currentChain } = useChain();
  const [open, setOpen] = useState(false);
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
  const handleSelect = (item: TokenDTO) => {
    form.setValue('token', item);
    form.trigger('token');
    setOpen(false);
  };

  const price = useMemo(() => {
    const token = form.getValues('token');
    const amount = form.getValues('amount');
    if (!token) return 0;
    return (Number(amount) * token.price).toFixed(2);
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
                    <div className="bg-white px-3 py-4 rounded-md flex flex-row items-center">
                      <Input
                        className="text-5xl border-none"
                        placeholder="0"
                        disabled={!form.getValues('token')}
                        {...field}
                      />
                      <div className="bg-gray-300 p-2 rounded-sm">
                        <ArrowRightLeftIcon className="w-4 h-4" />
                      </div>
                      <div className="text-lg px-4 font-light text-gray-600">
                        ${price}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <div className="relative">
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} open={open}>
                        <SelectTrigger
                          needDropdown={false}
                          onClick={() => setOpen(!open)}
                          className="border-0"
                        >
                          <SelectedToken token={field.value as TokenDTO} />
                        </SelectTrigger>
                        <SelectContent
                          className="rounded-3xl bg-white overflow-hidden w-full mt-4"
                          onPointerDownOutside={() => setOpen(false)}
                        >
                          {tokens.map((item) => {
                            return (
                              <div
                                key={item.name}
                                onClick={() => handleSelect(item)}
                                className="flex items-center justify-between cursor-pointer hover:bg-gray-200 py-4 px-4"
                              >
                                <img
                                  className="h-10 w-10 mr-4"
                                  src={item.logoURI || DefaultTokenIcon}
                                  alt={item.name}
                                />
                                <div className="flex-1 text-lg">
                                  {item.name}
                                </div>
                                <div className="text-gray-400 text-lg">
                                  {formatEther(hexToBigInt(item.tokenBalance))}
                                </div>
                              </div>
                            );
                          })}
                        </SelectContent>
                      </Select>
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
                    <div className="bg-white rounded-md pl-5 py-4 flex items-center mb-4">
                      <img
                        className="w-6 h-6"
                        // TODO: config the chain icon in chain service
                        src={
                          currentChain?.chainId
                            ? SUPPORTED_CHAIN_ICON_MAP[currentChain.chainId]
                            : DefaultTokenIcon
                        }
                        alt={currentChain?.chainName}
                      />
                      <Input
                        className="text-lg border-none"
                        placeholder="Recipient address / ENS"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
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
