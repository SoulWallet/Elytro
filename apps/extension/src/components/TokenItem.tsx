import { formatEther, hexToBigInt } from 'viem';
import { TokenDTO } from '@/hooks/use-tokens';
import DefaultTokenIcon from '@/assets/icons/ether.svg';

export default function TokenItem({ token }: { token: TokenDTO }) {
  const balance = formatEther(hexToBigInt(token.tokenBalance));
  const price = token.price ? Number(balance) * Number(token.price) : 0;
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-x-2">
        <img
          src={token.logoURI || DefaultTokenIcon}
          alt={token.name}
          className="w-8 h-8"
        />
        <p className="text-2xl font-medium">{token.name}</p>
      </div>
      <div className="flex flex-col items-end gap-x-2">
        <p className="text-2xl font-medium text-gray-900">{balance}</p>
        <p className="text-sm font-medium text-gray-300">${price}</p>
      </div>
    </div>
  );
}
