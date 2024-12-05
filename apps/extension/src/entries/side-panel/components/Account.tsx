import { SUPPORTED_CHAIN_ICON_MAP } from '@/constants/chains';
import { safeClipboard } from '@/utils/clipboard';
import { Copy } from 'lucide-react';
import { MouseEventHandler } from 'react';

export default function Account({
  address,
  chainType,
}: {
  address: TAccountInfo['address'];
  chainType: TAccountInfo['chainType'];
}) {
  const handleClickCopy: MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    safeClipboard(address || '');
  };

  return (
    <div className="flex flex-row gap-2 items-center bg-white rounded-sm p-sm cursor-pointer hover:bg-gray-200">
      <img
        className="w-5 h-5"
        src={
          SUPPORTED_CHAIN_ICON_MAP[
            chainType as keyof typeof SUPPORTED_CHAIN_ICON_MAP
          ]
        }
      />
      <div className="elytro-text-small-bold ">{chainType}</div>

      <Copy onClick={handleClickCopy} className="w-3 h-3" />
    </div>
  );
}
