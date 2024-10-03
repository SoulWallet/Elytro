import { client } from './client';
import { DocumentNode, gql } from '@apollo/client';

// wrapped mutation function
export async function mutate<T>(
  mutationDocument: DocumentNode,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const { data, errors } = await client.mutate({
      mutation: mutationDocument,
      variables,
    });

    if (errors) {
      throw errors;
    }
    return data as T;
  } catch (error) {
    console.error('Elytro: GraphQL Mutation Error:', error);
    throw error;
  }
}

export const mutate_sponsor_op = gql`
  mutation SponsorOp($input: SponsorOpInput!) {
    sponsorOp(input: $input) {
      callGasLimit
      paymaster
      paymasterData
      paymasterPostOpGasLimit
      paymasterVerificationGasLimit
      preVerificationGas
      verificationGasLimit
    }
  }
`;