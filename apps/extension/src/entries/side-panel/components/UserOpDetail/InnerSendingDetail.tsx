import TokenAmountItem from '../TokenAmountItem';
import FragmentedAddress from '../FragmentedAddress';
import { DecodeResult } from '@soulwallet/decoder';

interface IInnerSendingDetailProps {
  decodedUserOp: Nullable<DecodeResult>;
}

export default function InnerSendingDetail({
  decodedUserOp,
}: IInnerSendingDetailProps) {
  return (
    <>
      <div className="flex items-center justify-between p-2xs">
        <TokenAmountItem
          {...decodedUserOp?.fromInfo}
          amount={decodedUserOp?.value?.toString()}
        />
        {/* TODO: no token price API. */}
        <span className="elytro-text-smaller-body text-gray-600">--</span>
      </div>

      <div className="elytro-text-bold-body">To</div>

      <FragmentedAddress
        address={decodedUserOp?.to}
        chainId={decodedUserOp?.toInfo?.chainId}
        className="bg-gray-150 px-lg py-md rounded-md"
      />
    </>
  );
}
