import PageProvider from '@/background/provider/pageProvider';

const generateUUID4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const mainWorld = () => {
  const info: EIP6963ProviderInfo = {
    uuid: generateUUID4(),
    name: 'Elytro',
    // TODO: Add Elytro logo
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
    rdns: 'com.elytro',
  };

  if (window.process) {
    //! todo: remove this when not testing with https://metamask.github.io/test-dapp/
    // temp workaround for @metamask/post-message-stream - readable-stream when using https://metamask.github.io/test-dapp/
    window.process.nextTick = (callback, ...args) => {
      if (typeof callback !== 'function') {
        throw new TypeError('Callback must be a function');
      }
      Promise.resolve().then(() => callback(...args));
    };
  }

  const injectedProvider = new Proxy(new PageProvider(), {
    deleteProperty: () => {
      return true;
    },
    // get: (target, prop, receiver) => {
    //   if (typeof target[prop] === 'function') {
    //     return (...args) => {
    //       return target[prop](...args);
    //     };
    //   }
    //   return Reflect.get(target, prop, receiver);
    // },
  });

  const announceEvent: EIP6963AnnounceProviderEvent = new CustomEvent(
    'eip6963:announceProvider',
    { detail: Object.freeze({ info, provider: injectedProvider }) }
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
