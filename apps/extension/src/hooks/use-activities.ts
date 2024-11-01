import { query } from '@/requests';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Address, Hex } from 'viem';
import dayjs from 'dayjs';

interface ActivitiesDTO {
  transactions: TransactionDTO[];
}

interface opListDTO {
  sender: Address;
  nonce: Hex;
  factory: Address;
  factoryData: Hex;
  callData: Hex;
  callGasLimit: Hex;
  verificationGasLimit: Hex;
  preVerificationGas: Hex;
  maxFeePerGas: Hex;
  maxPriorityFeePerGas: Hex;
  paymaster: Hex;
  paymasterVerificationGasLimit: Hex;
  paymasterPostOpGasLimit: Hex;
  paymasterData: Hex;
  signature: Hex;
}

interface ListDTO {
  asset_from: Address;
  asset_to: Address;
  asset_value: Hex;
  token_address: Address;
}

interface TransactionDTO {
  type: string;
  opHash: Hex;
  blockNumber: number;
  timestamp: number;
  txhash: Hex;
  opList: opListDTO[];
  list: ListDTO[];
}

export interface AggregatedTransaction {
  date: string;
  transactions: TransactionDTO[];
}

export default function useActivities(address?: Address, chainId?: Hex) {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<AggregatedTransaction[]>([]);
  const aggregateByDay = (
    transactions: TransactionDTO[]
  ): AggregatedTransaction[] => {
    const aggregatedData: { [key: string]: AggregatedTransaction } = {};

    transactions.forEach((transaction) => {
      // timestamp is second
      const date = dayjs.unix(transaction.timestamp).format('YYYY/MM/DD');

      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date: date,
          transactions: [],
        };
      }

      aggregatedData[date].transactions.push(transaction);
    });

    return Object.values(aggregatedData);
  };
  const query_activities = gql`
    query Transactions($address: String!, $chainId: String!) {
      transactions(address: $address, chainID: $chainId) {
        type
        opHash
        blockNumber
        timestamp
        txhash
        opList {
          sender
          nonce
          factory
          factoryData
          callData
          callGasLimit
          verificationGasLimit
          preVerificationGas
          maxFeePerGas
          maxPriorityFeePerGas
          paymaster
          paymasterVerificationGasLimit
          paymasterPostOpGasLimit
          paymasterData
          signature
        }
        list {
          asset_from
          asset_to
          asset_value
          token_address
        }
      }
    }
  `;

  const getActivities = async () => {
    setLoading(true);
    const data = await query<ActivitiesDTO>(query_activities, {
      address,
      chainId,
    });
    const aggAcitivities = aggregateByDay(data.transactions);
    setActivities(aggAcitivities);
    setLoading(false);
  };

  useEffect(() => {
    if (address) {
      getActivities();
    }
  }, [address, chainId]);

  return {
    loadingActivities: loading,
    activities,
  };
}
