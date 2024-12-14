import { TSessionData } from '@/constants/session';
import { UserOpType } from '../../contexts/tx-context';
import SessionCard from '../SessionCard';
import InfoCard from '../InfoCard';
import { formatEther } from 'viem';
import FragmentedAddress from '../FragmentedAddress';
import { formatBalance, formatTokenAmount } from '@/utils/format';
import { DecodeResult } from '@soulwallet/decoder';

interface IUserOpDetailProps {
  session?: TSessionData;
  opType: UserOpType;
  userOp: ElytroUserOperation;
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
    ? formatBalance(formatEther(BigInt(gasUsed))).fullDisplay
    : '--';
};

export function UserOpDetail({
  opType,
  session,
  userOp,
  calcResult,
  chainId,
  decodedUserOp,
}: IUserOpDetailProps) {
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
      {opType === UserOpType.SendTransaction ? (
        <div className="flex flex-col gap-y-sm">
          <div className="flex items-center justify-between p-2xs">
            <span className="flex items-center gap-x-sm elytro-text-bold-body">
              {/* TODO: no fromInfo. no logo & name */}
              <img
                className="size-6"
                src={decodedUserOp?.fromInfo?.logoURI}
                alt={decodedUserOp?.fromInfo?.name}
              />
              <span>
                {formatTokenAmount(decodedUserOp?.value.toString())}
                {decodedUserOp?.fromInfo?.symbol}
              </span>
            </span>

            {/* TODO: no token price API. */}
            <span className="elytro-text-smaller-body text-gray-600">--</span>
          </div>

          <div className="elytro-text-bold-body">To</div>

          <FragmentedAddress
            address={userOp?.sender}
            chainId={chainId}
            className="bg-gray-150 px-lg py-md rounded-md"
          />
        </div>
      ) : null}

      {opType === UserOpType.ApproveTransaction && (
        <div>
          <SessionCard session={session} />
          {/* TODO: show transaction info */}
        </div>
      )}

      {/* UserOp Pay Info */}
      <InfoCard.InfoCardWrapper>
        <InfoCard.InfoCardItem label="From account">
          <FragmentedAddress address={userOp?.sender} chainId={chainId} />
        </InfoCard.InfoCardItem>

        {/* Network cost: unit ETH */}
        <InfoCard.InfoCardItem label="Network cost">
          <span className="elytro-text-bold-body text-gray-600">
            {formatGasUsed(calcResult?.gasUsed)} ETH
          </span>
        </InfoCard.InfoCardItem>

        {/* Sponsor info: 
          UI draft want users are able to choose to pay with their own ETH. 
          but for now, once you get sponsored, you can't go back */}
        {calcResult?.hasSponsored ? (
          <InfoCard.InfoCardItem label="Sponsored by">
            Elytro
          </InfoCard.InfoCardItem>
        ) : null}
      </InfoCard.InfoCardWrapper>
    </div>
  );
}
