import { UserOpType } from '../../contexts/dialog-context';
import DAppCard from '../DAppCard';
import InfoCard from '../InfoCard';

interface IUserOpDetailProps {
  dApp?: TDAppInfo;
  opType: UserOpType;
  userOp: ElytroUserOperation;
}

const UserOpTitleMap = {
  [UserOpType.DeployWallet]: 'Activate account',
  [UserOpType.SendTransaction]: "You' are sending",
  [UserOpType.ApproveTransaction]: 'Confirm Transaction',
};

export function UserOpDetail({ opType, dApp }: IUserOpDetailProps) {
  return (
    <div className="flex flex-col w-full gap-y-md">
      {/* UserOp Title */}
      <div className="flex items-center justify-between">
        <span className="elytro-text-bold-body">{UserOpTitleMap[opType]}</span>
        <span className="elytro-text-tiny-body text-gray-750">
          Advanced view
        </span>
      </div>

      {/* DApp Info */}
      <DAppCard dApp={dApp} />

      <InfoCard.InfoCardWrapper>
        <InfoCard.InfoCardItem label="From account">
          <span className="elytro-text-bold-body">{'test'}</span>
        </InfoCard.InfoCardItem>
      </InfoCard.InfoCardWrapper>
    </div>
  );
}
