interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

type EIP6963AnnounceProviderEvent = CustomEvent<EIP6963ProviderDetail>;

// Request Event dispatched by a DApp
interface EIP6963RequestProviderEvent extends Event {
  type: 'eip6963:requestProvider';
}
