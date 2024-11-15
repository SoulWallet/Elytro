import { gql, useQuery } from '@apollo/client';
import { Address, Hex } from 'viem';

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

export default function useTokens(address?: Address, chainId?: Hex) {
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

  const { loading, data, refetch } = useQuery<TokenQueryDTO>(tokens_query, {
    variables: { address, chainId },
  });

  return {
    tokens: data?.tokens || [],
    loadingTokens: loading,
    refetchTokens: refetch,
  };
}
