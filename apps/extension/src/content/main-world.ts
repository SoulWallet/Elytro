import builtinProvider from '@/services/builtinProvider';

const generateUUID4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const mainWorld = () => {
  const info: EIP6963ProviderInfo = {
    uuid: generateUUID4(),
    name: 'Elytro Wallet',
    // TODO: Add Elytro logo
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
    rdns: 'com.elytro',
  };

  const elytroProvider = new Proxy(builtinProvider, {
    deleteProperty: () => {
      return true;
    },
  });

  const announceEvent: EIP6963AnnounceProviderEvent = new CustomEvent(
    'eip6963:announceProvider',
    { detail: Object.freeze({ info, provider: elytroProvider }) }
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
