import CopyableText from '@/components/CopyableText';
import { TChainConfigItem } from '@/constants/chains';
import { formatAddressToShort } from '@/utils/format';

export default function Account({
  address,
  chain,
}: {
  address: TAccountInfo['address'];
  chain: TChainConfigItem;
}) {
  return (
    <div className="flex flex-row gap-2 items-center ">
      <div className="flex flex-col justify-center">
        <div className="text-xl font-medium text-gray-900">
          {chain.chainName}
        </div>
        {address ? (
          <CopyableText
            className="text-sm text-gray-500"
            text={formatAddressToShort(address)}
            originalText={address}
          />
        ) : null}
      </div>
    </div>
  );
}
