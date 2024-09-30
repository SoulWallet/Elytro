import builtinProvider from '@/services/builtinProvider';
import { v4 as uuidv4 } from 'uuid';
const mainWorld = () => {
  const info: EIP6963ProviderInfo = {
    uuid: uuidv4(),
    name: 'Elytro Wallet',
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
    rdns: 'com.wallet.elytro',
  };
  const announceEvent: EIP6963AnnounceProviderEvent = new CustomEvent(
    'eip6963:announceProvider',
    { detail: Object.freeze({ info, provider: builtinProvider }) }
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
