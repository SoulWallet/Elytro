import { TokenDTO } from '@/hooks/use-tokens';
import { Select, SelectTrigger, SelectContent } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import { formatEther, hexToBigInt } from 'viem';
import DefaultTokenIcon from '@/assets/icons/ether.svg';
import { useState } from 'react';

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

export default function TokenSelector({
  tokens,
  onTokenChange,
}: {
  tokens: TokenDTO[];
  onTokenChange?: (token: TokenDTO) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenDTO | null>(null);
  const handleSelect = (item: TokenDTO) => {
    setSelectedToken(item);
    if (onTokenChange) {
      onTokenChange(item);
    }
    setOpen(false);
  };
  return (
    <Select open={open}>
      <SelectTrigger
        needDropdown={false}
        onClick={() => setOpen(!open)}
        className="border-0"
      >
        <SelectedToken token={selectedToken as TokenDTO} />
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
              <div className="flex-1 text-lg">{item.name}</div>
              <div className="text-gray-400 text-lg">
                {formatEther(hexToBigInt(item.tokenBalance))}
              </div>
            </div>
          );
        })}
      </SelectContent>
    </Select>
  );
}