import { ApolloProvider } from '@apollo/client';
import { client } from '@/requests/client';

interface IRequestProviderProps {
  children: React.ReactNode;
}

function RequestProvider({ children }: IRequestProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default RequestProvider;
