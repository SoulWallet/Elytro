import { SUPPORTED_CHAIN_ICON_MAP, TChainConfigItem } from '@/constants/chains';
import { Copy } from 'lucide-react';
import { safeClipboard } from '@/utils/clipboard';
import { MouseEventHandler } from 'react';

export default function Account({
  address,
  chain,
}: {
  address: TAccountInfo['address'];
  chain: TChainConfigItem;
}) {
  const handleClickCopy: MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    safeClipboard(address || '');
  };

  return (
    <div className="flex flex-row gap-2 items-center bg-white rounded-sm p-sm cursor-pointer hover:bg-gray-200">
      <img className="w-5 h-5" src={SUPPORTED_CHAIN_ICON_MAP[chain.chainId]} />
      <div className="elytro-text-small-bold ">{chain.chainName}</div>

      <Copy onClick={handleClickCopy} className="w-3 h-3" />
    </div>
  );
}
