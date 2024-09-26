import builtinProvider from '@/services/builtinProvider';

const mainWorld = () => {
  const info: EIP6963ProviderInfo = {
    uuid: '806298fa-67fb-457e-ab0d-d6fde72ff1b9',
    name: 'Elytro Wallet Example',
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
    rdns: 'com.wallet.elytro',
  };

  const announceEvent: EIP6963AnnounceProviderEvent = new CustomEvent(
    'eip6963:announceProvider',
    { detail: Object.freeze({ info, provider: builtinProvider.client }) }
  );

  const announce = () => {
    window.dispatchEvent(announceEvent);
  };

  window.addEventListener('eip6963:requestProvider', () => {
    announce();
  });

  announce();
};

mainWorld();
