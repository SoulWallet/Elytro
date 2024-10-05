import { PublicClient } from 'viem';

export async function getFeeData(client: PublicClient) {
  const gasPrice = await client.getGasPrice();

  const latestBlock = await client.getBlock({ blockTag: 'latest' });

  const baseFeePerGas = latestBlock.baseFeePerGas;

  const maxPriorityFeePerGas = 2n * 10n ** 9n; // 2 Gwei

  const maxFeePerGas = baseFeePerGas
    ? baseFeePerGas + maxPriorityFeePerGas
    : null;

  return {
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
  };
}
