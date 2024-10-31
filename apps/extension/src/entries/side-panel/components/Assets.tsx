import TokenList from '@/components/TokenList';
import { Skeleton } from '@/components/ui/skeleton';
import { gql, useQuery } from '@apollo/client';
import { Hex, toHex } from 'viem';
import { useAccount } from '../contexts/account-context';
import { SUPPORTED_CHAIN_MAP } from '@/constants/chains';
import EmptyAsset from '@/components/EmptyAsset';

export interface TokenDTO {
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tokenBalance: Hex;
  price: number;
}

interface TokenQueryDTO {
  tokens: TokenDTO[];
}

export default function Assets() {
  const {
    accountInfo: { address, chainType },
  } = useAccount();

  const chainId = toHex(
    SUPPORTED_CHAIN_MAP[chainType as keyof typeof SUPPORTED_CHAIN_MAP].id
  );

  const tokens_query = gql`
    query TokensQuery($address: String!, $chainId: String!) {
      tokens(address: $address, chainID: $chainId) {
        decimals
        logoURI
        name
        symbol
        tokenBalance
        price
      }
    }
  `;

  const { data, loading } = useQuery<TokenQueryDTO>(tokens_query, {
    variables: { address, chainId },
  });

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-[40px]" />
        <Skeleton className="w-full h-[40px]" />
        <Skeleton className="w-full h-[40px]" />
      </div>
    );

  if (data && data.tokens) return <TokenList data={data.tokens} />;

  return (
    <div className="flex justify-center min-h-[50vh] items-center">
      <EmptyAsset />
    </div>
  );
}
