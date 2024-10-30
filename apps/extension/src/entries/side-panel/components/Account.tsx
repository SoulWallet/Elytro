import CopyableText from '@/components/CopyableText';
import { SUPPORTED_CHAIN_ICON_MAP } from '@/constants/chains';
import { formatAddressToShort } from '@/utils/format';

export default function Account({
  address,
  chainType,
}: {
  address: TAccountInfo['address'];
  chainType: TAccountInfo['chainType'];
}) {
  return (
    <div className="flex flex-row gap-2 items-center ">
      <img
        className="w-10 h-10"
        src={
          SUPPORTED_CHAIN_ICON_MAP[
            chainType as keyof typeof SUPPORTED_CHAIN_ICON_MAP
          ]
        }
      />
      <div className="flex flex-col justify-center">
        <div
          className="text-xl font-medium text-gray-900"
          data-testid="chain_name"
        >
          {chainType}
        </div>
        <CopyableText
          className="text-sm text-gray-500"
          text={formatAddressToShort(address)}
          originalText={address}
        />
      </div>
    </div>
  );
}
