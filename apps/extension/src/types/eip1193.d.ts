interface RequestArguments {
  readonly method: ProviderMethodType;
  readonly params?: readonly unknown[] | object;
}

interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

interface ProviderMessage {
  readonly type: string;
  readonly data: unknown;
}

interface EthSubscription extends ProviderMessage {
  readonly type: 'eth_subscription';
  readonly data: {
    readonly subscription: string;
    readonly result: unknown;
  };
}

interface ProviderConnectInfo {
  readonly chainId: string;
}

type ProviderEvent =
  | 'connect'
  | 'disconnect'
  | 'chainChanged'
  | 'accountsChanged'
  | 'message';
type ProviderMethodType =
  | 'eth_chainId' //!
  | 'eth_accounts' //!
  // | 'eth_subscribe'
  | 'eth_accounts' // !
  | 'eth_requestAccounts' // !
  | 'eth_sendTransaction' // !
  | 'eth_getBlockByNumber'
  | 'eth_signTypedData' // !
  | 'eth_signTypedDataV1' //!
  | 'eth_signTypedDataV3' // !
  | 'eth_signTypedDataV4' // !
  | 'net_version' // !
  | 'personal_sign' // !
  | 'eth_decrypt' // !
  | 'eth_getEncryptionPublicKey' // !
  | 'eth_getTransactionByHash';
// | 'wallet_addEthereumChain' // EIP-3085. Temporary not supported
// | 'wallet_switchEthereumChain' // EIP-3326. Temporary not supported
// | 'wallet_watchAsset' // Temporary not supported
// | 'wallet_registerOnboarding' //  Temporary not supported
// | 'wallet_requestPermissions' //  Temporary not supported
// | 'wallet_getPermissions' //  Temporary not supported
// | 'eth_sign'// dangerous. not support
// | 'personal_ecRecover'
// | 'web3_clientVersion' // .

interface Eip1193Provider extends EventEmitter {
  request(args: RequestArguments): Promise<unknown>;

  on(event: string, listener: (message: ProviderMessage) => void): void;
  removeListener(
    event: string,
    listener: (message: ProviderMessage) => void
  ): void;
  onMessage(listener: (message: ProviderMessage) => void): void;
  removeMessageListener(listener: (message: ProviderMessage) => void): void;

  /**
   * @deprecated
   */
  // sendAsync(args: RequestArguments): Promise<void>;
  // send(args: RequestArguments): Promise<unknown>;
  // close(): Promise<void>;
  // networkChanged(networkId: string): Promise<void>;
  // notification(type: string, params: object): Promise<void>;
}
