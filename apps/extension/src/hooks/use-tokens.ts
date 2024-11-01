import { query } from '@/requests';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
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
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [tokens, setTokens] = useState<TokenDTO[]>([]);
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

  const getTokens = async (address: Address, chainId: Hex) => {
    setLoadingTokens(true);
    const data = await query<TokenQueryDTO>(tokens_query, { address, chainId });
    if (data?.tokens) {
      setTokens(data.tokens);
    }
    setLoadingTokens(false);
  };

  useEffect(() => {
    if (address && chainId) {
      getTokens(address as Address, chainId);
    }
  }, [address, chainId]);

  return {
    tokens,
    loadingTokens,
  };
}
