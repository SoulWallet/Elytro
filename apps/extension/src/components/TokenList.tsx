import { TokenDTO } from '@/entries/side-panel/components/Assets';
import TokenItem from './TokenItem';
import { hexToNumber } from 'viem';

interface TokenListProps {
  data: TokenDTO[];
}

export default function TokenList({ data }: TokenListProps) {
  return (
    <div className="flex flex-col gap-y-2">
      {data.map((item) => (
        <TokenItem
          key={item.name}
          name={item.symbol || item.name}
          balance={hexToNumber(item.tokenBalance).toString()}
          price={(
            hexToNumber(item.tokenBalance) / Number(item.price)
          ).toString()}
          icon={item.logoURI}
        />
      ))}
    </div>
  );
}
