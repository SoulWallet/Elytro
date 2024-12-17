import { UserOpType } from '../../contexts/tx-context';
import InfoCard from '../InfoCard';
import { formatEther } from 'viem';
import FragmentedAddress from '../FragmentedAddress';
import { formatBalance } from '@/utils/format';
import { DecodeResult } from '@soulwallet/decoder';
import TokenAmountItem from '../TokenAmountItem';
import DecodeDetail from './DecodeDetail';
import { useMemo } from 'react';
import { cn } from '@/utils/shadcn/utils';

const { InfoCardItem, InfoCardWrapper } = InfoCard;

interface IUserOpDetailProps {
  session?: TDAppInfo;
  opType: UserOpType;
  calcResult: Nullable<TUserOperationPreFundResult>;
  chainId: number;
  decodedUserOp: Nullable<DecodeResult>;
}

const UserOpTitleMap = {
  [UserOpType.DeployWallet]: 'Activate account',
  [UserOpType.SendTransaction]: "You' are sending",
  [UserOpType.ApproveTransaction]: 'Confirm Transaction',
};

const formatGasUsed = (gasUsed?: string) => {
  return gasUsed
    ? formatBalance(formatEther(BigInt(gasUsed)), {
        maxDecimalLength: 4,
      }).fullDisplay
    : '--';
};

export function UserOpDetail({
  opType,
  calcResult,
  chainId,
  decodedUserOp,
}: IUserOpDetailProps) {
  const DetailContent = useMemo(() => {
    if (opType === UserOpType.SendTransaction) {
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
            chainId={chainId}
            className="bg-gray-150 px-lg py-md rounded-md"
          />
        </>
      );
    }

    if (opType === UserOpType.ApproveTransaction) {
      return <DecodeDetail decodedUserOp={decodedUserOp} />;
    }

    return null;
  }, [opType, decodedUserOp]);

  return (
    <div className="flex flex-col w-full gap-y-md">
      {/* UserOp Title */}
      <div className="flex items-center justify-between">
        <span className="elytro-text-bold-body">{UserOpTitleMap[opType]}</span>

        {/* Advanced view: for deploy wallet no need to show */}
        {opType === UserOpType.DeployWallet ? null : (
          <span className="elytro-text-tiny-body text-gray-750">
            Advanced view
          </span>
        )}
      </div>

      {/* DApp Info: no need for sending transaction */}
      <div className="flex flex-col gap-y-sm">{DetailContent}</div>

      {/* UserOp Pay Info */}
      <InfoCardWrapper>
        <InfoCardItem
          label="From account"
          content={
            <FragmentedAddress
              address={decodedUserOp?.from}
              chainId={chainId}
            />
          }
        />

        {/* Network cost: unit ETH */}
        <InfoCardItem
          label="Network cost"
          content={
            <span className="elytro-text-small-bold text-gray-600">
              {calcResult?.hasSponsored && (
                <span className="px-xs py-3xs bg-light-green elytro-text-tiny-body mr-sm rounded-xs">
                  Sponsored
                </span>
              )}
              <span
                className={cn({ 'line-through': calcResult?.hasSponsored })}
              >
                {formatGasUsed(calcResult?.gasUsed)} ETH
              </span>
            </span>
          }
        />
      </InfoCardWrapper>
    </div>
  );
}
