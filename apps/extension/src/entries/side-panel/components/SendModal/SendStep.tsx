import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent } from '@/components/ui/select';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ETHIcon from '@/assets/icons/ether.svg';
import { TxData } from '.';
export interface TokenProps {
  name: string;
  balance: string | number;
  icon: string;
}

function SelectedToken({ token }: { token?: TokenProps }) {
  if (!token)
    return <div className="text-gray-400 text-lg">Select a token</div>;
  return (
    <div className="flex items-center">
      <img className="h-10 w-10" src={token.icon} alt={token.name} />
      <div className="text-left ml-2">
        <div className="text-lg">{token.name}</div>
        <div className="text-gray-400">{token.balance} Avail.</div>
      </div>
    </div>
  );
}

export default function SendStep({
  checkIsValid,
  updateTxData,
}: {
  checkIsValid?: (valid: boolean) => void;
  updateTxData: Dispatch<SetStateAction<TxData | undefined>>;
}) {
  const [token, setToken] = useState<TokenProps | undefined>();
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const tokens = [
    {
      name: 'ETH',
      balance: 12.123123,
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501425',
    },
    {
      name: 'USDC',
      balance: 2.123123,
      icon: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694',
    },
    {
      name: 'USDT',
      balance: 0.123123,
      icon: ETHIcon,
    },
  ];
  const handleSelect = (item: TokenProps) => {
    setToken(item);
    setOpen(false);
  };
  const handleFillMax = () => {
    if (token) {
      setAmount(token.balance.toString());
    }
  };
  useEffect(() => {
    const tokenValid = Boolean(token);
    const amountValid = Boolean(amount);
    const valid = tokenValid && amountValid;
    if (checkIsValid) {
      checkIsValid(valid);
      updateTxData((prev: TxData | undefined) => {
        if (prev) {
          return { ...prev, token, amount };
        } else {
          return prev;
        }
      });
    }
  }, [token, amount]);
  return (
    <div className="space-y-4">
      <h3 className="text-3xl">Send</h3>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">Token</Label>
        <Select open={open}>
          <SelectTrigger
            onClick={() => setOpen(!open)}
            className="bg-gray-200 py-8 rounded-md border-none"
          >
            <SelectedToken token={token} />
          </SelectTrigger>
          <SelectContent
            className="rounded-3xl"
            onPointerDownOutside={() => setOpen(false)}
          >
            {tokens.map((item) => (
              <div
                onClick={() => handleSelect(item)}
                key={item.name}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-200 py-4 px-4"
              >
                <img
                  className="h-10 w-10 mr-4"
                  src={item.icon}
                  alt={item.name}
                />
                <div className="flex-1 text-lg">{item.name}</div>
                <div className="text-gray-400 text-lg">{item.balance}</div>
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">Amount</Label>
        <div className="bg-gray-200 py-3 rounded-md border-none flex flex-row items-center font-medium text-lg">
          <Input
            className="text-lg"
            placeholder="Input amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <div className="text-gray-400">ETH</div>
          <Button
            disabled={!token}
            variant="ghost"
            className="text-lg hover:bg-transparent"
            onClick={handleFillMax}
          >
            Max
          </Button>
        </div>
      </div>
    </div>
  );
}
