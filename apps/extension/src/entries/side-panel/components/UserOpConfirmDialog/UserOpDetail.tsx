import { TSessionData } from '@/constants/session';
import { UserOpType } from '../../contexts/dialog-context';
import SessionCard from '../SessionCard';
import InfoCard from '../InfoCard';
import { formatEther } from 'viem';
import FragmentedAddress from '../FragmentedAddress';

interface IUserOpDetailProps {
  session?: TSessionData;
  opType: UserOpType;
  userOp: ElytroUserOperation;
  calcResult: Nullable<TUserOperationPreFundResult>;
  chainId: number;
}

const UserOpTitleMap = {
  [UserOpType.DeployWallet]: 'Activate account',
  [UserOpType.SendTransaction]: "You' are sending",
  [UserOpType.ApproveTransaction]: 'Confirm Transaction',
};

const formatGasUsed = (gasUsed?: string) => {
  return gasUsed ? Number(formatEther(BigInt(gasUsed))).toFixed(4) : '--';
};

export function UserOpDetail({
  opType,
  session,
  userOp,
  calcResult,
  chainId,
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
      {opType === UserOpType.SendTransaction ? null : (
        <SessionCard session={session} />
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
