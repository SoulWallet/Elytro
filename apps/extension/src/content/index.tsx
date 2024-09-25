console.log('Content script loaded');

import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

function announce() {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const info = {
    uuid: '350670db-19fa-4704-a166-e52e178b59d2',
    name: 'soulwallet',
    icon: 'asdasd',
    rdns: 'com.example.wallet',
  };
  const detail = Object.freeze({
    info,
    provider: publicClient,
  });
  const event = new CustomEvent('eip6963:announceProvider', { detail });
  console.log(event);
  window.dispatchEvent(event);
}

announce();
