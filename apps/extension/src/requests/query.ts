import { DocumentNode } from '@apollo/client';
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
