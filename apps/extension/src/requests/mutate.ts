import { client } from './client';
import { DocumentNode } from '@apollo/client';

// wrapped mutation function
export async function mutate<T>(
  mutationDocument: DocumentNode,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const { data } = await client.mutate({
      mutation: mutationDocument,
      variables,
    });
    return data as T;
  } catch (error) {
    console.error('Elytro: GraphQL Mutation Error:', error);
    throw error;
  }
}
