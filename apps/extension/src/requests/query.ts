import { DocumentNode, gql } from '@apollo/client';
import { client } from './client';

// wrapped query function
export async function query<T>(
  queryDocument: DocumentNode,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const { data } = await client.query({
      query: queryDocument,
      variables,
    });
    return data as T;
  } catch (error) {
    console.error('Elytro: GraphQL Query Error:', error);
    throw error;
  }
}

export const query_simulated_op = gql`
  query Simulate($chainID: String!, $request: SimulateInput!) {
    simulate(chainID: $chainID, request: $request) {
      success
      result {
        assetChanges
        balanceChanges
        blockNumber
        cumulativeGasUsed
        gasUsed
        stateChanges {
          address
          balance {
            newValue
            previousValue
          }
          nonce {
            previousValue
            newValue
          }
        }
        status
        type
      }
    }
  }
`;
