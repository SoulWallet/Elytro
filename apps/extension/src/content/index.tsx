console.log('Content script loaded');

import { mainnet } from '@wagmi/core/chains';
import { ethers } from 'ethers';

class Provider {
  request = () => {};
  sendAsync = () => {};
  send = () => {};
}

function announce() {
  const info = {
    uuid: 'uuidddd',
    name: 'elytro',
    icon: 'asdasd',
    rdns: 'com.example.wallet',
  };

  const provider = new Provider();
  console.log(provider);

  const detail = Object.freeze({
    info,
    provider: provider,
  });
  const event = new CustomEvent('eip6963:announceProvider', { detail });
  window.dispatchEvent(event);
}

announce();
