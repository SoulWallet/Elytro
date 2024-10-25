import ReceiveIcon from '@/assets/icons/receive.svg';
import SendIcon from '@/assets/icons/send.svg';
import CallContractIcon from '@/assets/icons/callContract.svg';

export enum ActivityTypes {
  receive = 'receive',
  send = 'send',
  callContract = 'callContract',
}

export interface ActivityProps {
  id: string;
  type: ActivityTypes;
  info: unknown;
  address: string; // todo: maybe need mapped
}

const IconTypeMap = {
  [ActivityTypes.receive]: ReceiveIcon,
  [ActivityTypes.send]: SendIcon,
  [ActivityTypes.callContract]: CallContractIcon,
};

const ActivityTitleMap = {
  [ActivityTypes.receive]: 'Received ${value} USDC',
  [ActivityTypes.send]: 'Sent ${value} USDC',
  [ActivityTypes.callContract]: 'Call contract',
};
const ActivityDescMap = {
  [ActivityTypes.callContract]: 'On',
  [ActivityTypes.receive]: 'From',
  [ActivityTypes.send]: 'To',
};

export default function Activity({
  activity: { type, address },
}: {
  activity: ActivityProps;
}) {
  return (
    <div className="flex py-2">
      <img src={IconTypeMap[type]} alt={type} />
      <div className="ml-2">
        <div className="text-lg font-medium">
          {ActivityTitleMap[type] ?? 'Unknown Activity'}
        </div>
        <div className="text-gray-400">
          {ActivityDescMap[type]
            ? `${ActivityDescMap[type]}: ${address}`
            : 'Unknown Activity'}
        </div>
      </div>
    </div>
  );
}
