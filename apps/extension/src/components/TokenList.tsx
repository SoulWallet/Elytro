import TokenItem, { TokenItemProps } from './TokenItem';

interface TokenListProps {
  data: TokenItemProps[];
}

export default function TokenList({ data }: TokenListProps) {
  return (
    <div className="flex flex-col gap-y-2">
      {data.map((item) => (
        <TokenItem key={item.name} {...item} />
      ))}
    </div>
  );
}
