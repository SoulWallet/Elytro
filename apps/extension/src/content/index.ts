import { mainnet } from '@wagmi/core/chains';
import { createPublicClient, http } from 'viem';

function onPageLoad() {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });
  const provider = new Proxy(publicClient, {});
  console.log(provider);
  (window as any).ethereum = provider;
  function announceProvider() {
    const info = {
      uuid: '350670db-19fa-4704-a166-e52e178b59d2',
      name: 'Example Wallet',
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
      rdns: 'com.example.wallet',
    };
    window.dispatchEvent(
      new CustomEvent('eip6963:announceProvider', {
        detail: Object.freeze({ info, provider }),
      })
    );
  }
  window.addEventListener('eip6963:requestProvider', () => {
    announceProvider();
  });
  announceProvider();
}
onPageLoad();
