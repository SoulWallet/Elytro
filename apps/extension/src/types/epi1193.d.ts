type RequestArguments = {
  /** The RPC method to request. */
  method: string;
  params?: unknown[] | Record<string, unknown>;
};

interface EIP1193Provider {
  request: (args: RequestArguments) => Promise<unknown>;
}

interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}
