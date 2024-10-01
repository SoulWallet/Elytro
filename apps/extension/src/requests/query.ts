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
  query Simulate($chain: String!, $request: SimulateInput!) {
    simulate(chain: $chain, request: $request) {
      success
      result {
        status
        gasUsed
        cumulativeGasUsed
        blockNumber
        type
        stateChanges {
          address
          balance {
            previousValue
            newValue
          }
          nonce {
            newValue
            previousValue
          }
        }
        assetChanges
        balanceChanges
      }
    }
  }
`;
