import { useAccount } from '../contexts/account-context';
import EmptyAsset from '@/components/EmptyAsset';
import { Skeleton } from '@/components/ui/skeleton';
import TokenItem from '@/components/TokenItem';

export default function Assets() {
  const {
    tokenInfo: { tokens, loadingTokens },
  } = useAccount();

  if (loadingTokens)
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-[40px]" />
        <Skeleton className="w-full h-[40px]" />
        <Skeleton className="w-full h-[40px]" />
      </div>
    );

  if (tokens)
    return (
      <div className="flex flex-col gap-y-2">
        {tokens.map((item) => {
          return <TokenItem key={item.name} token={item} />;
        })}
      </div>
    );

  return (
    <div className="flex justify-center min-h-[50vh] items-center">
      <EmptyAsset />
    </div>
  );
}
