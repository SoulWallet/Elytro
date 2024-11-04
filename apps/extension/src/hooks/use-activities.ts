import { query } from '@/requests';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Address, Hex } from 'viem';
import dayjs from 'dayjs';
import { elytroSDK } from '@/background/services/sdk';
import {
  ActivityProps,
  ActivityTypes,
} from '@/entries/side-panel/components/Activities/Activity';

export const ZeroAddress: string = '0x0000000000000000000000000000000000000000';

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
  asset_value: string;
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
  activities: ActivityProps[];
}

export default function useActivities(address?: Address, chainId?: Hex) {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<AggregatedTransaction[]>([]);
  const aggregateByDay = (
    transactions: ActivityProps[]
  ): AggregatedTransaction[] => {
    const aggregatedData: { [key: string]: AggregatedTransaction } = {};

    transactions.forEach((transaction) => {
      // timestamp is second
      const date = dayjs.unix(transaction.timestamp).format('YYYY/MM/DD');

      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date: date,
          activities: [],
        };
      }

      aggregatedData[date].activities.push(transaction);
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
    if (data) {
      const resolvedData = (
        await Promise.allSettled(
          data.transactions.map(async (tx) => await activityResolver(tx))
        )
      )
        .filter((res) => res.status === 'fulfilled' && res.value)
        .map((res) => (res as PromiseFulfilledResult<ActivityProps>).value);
      const aggAcitivities = aggregateByDay(resolvedData);
      setActivities(aggAcitivities);
    }

    setLoading(false);
  };

  const activityResolver = async (
    tx: TransactionDTO
  ): Promise<ActivityProps> => {
    if (tx.type === 'op' && tx.opList.length) {
      const op = await elytroSDK.getDecodedUserOperation(tx.opList[0]);
      if (op) {
        return {
          type: ActivityTypes.send,
          id: tx.txhash,
          from: op[0].from as Hex,
          to: op[0].to as Hex,
          value: op[0].value,
          timestamp: tx.timestamp,
        };
      }
      return {
        type: ActivityTypes.createWallet,
        id: tx.txhash,
        from: tx.opList[0].sender,
        to: '' as Hex,
        value: BigInt(0),
        timestamp: tx.timestamp,
      };
    } else {
      return {
        type: ActivityTypes.receive,
        id: tx.txhash,
        from: tx.list[0].asset_from,
        to: tx.list[0].asset_to,
        value: BigInt(tx.list[0].asset_value),
        timestamp: tx.timestamp,
      };
    }
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
