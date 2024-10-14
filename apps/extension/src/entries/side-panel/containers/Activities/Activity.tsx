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
}

const IconTypeMap = {
  [ActivityTypes.receive]: ReceiveIcon,
  [ActivityTypes.send]: SendIcon,
  [ActivityTypes.callContract]: CallContractIcon,
};

export default function Activity({ activity }: { activity: ActivityProps }) {
  const genActivityTitle = (activity: ActivityProps) => {
    switch (activity.type) {
      case ActivityTypes.receive:
        return (
          <>
            <div>Recieved 1.12 USDC</div>
          </>
        );
      case ActivityTypes.send:
        return (
          <>
            <div>Send 1.12 USDC</div>
          </>
        );
      case ActivityTypes.callContract:
        return <div>Call contract</div>;
      default:
        return <div>Unknown Activity</div>;
    }
  };
  const genActivityDesc = (activity: ActivityProps) => {
    switch (activity.type) {
      case ActivityTypes.receive:
        return (
          <>
            <div>From: 0xjds…ysia8</div>
          </>
        );
      case ActivityTypes.send:
        return (
          <>
            <div>To: 0xjds…ysia8</div>
          </>
        );
      case ActivityTypes.callContract:
        return <div>On: 0xjds…ysia8</div>;
      default:
        return <div>Unknown Activity</div>;
    }
  };
  const handleActivityInfo = (activity: ActivityProps) => ({
    icon: IconTypeMap[activity.type],
    title: genActivityTitle(activity),
    desc: genActivityDesc(activity),
  });

  const displayData = handleActivityInfo(activity);
  return (
    <div className="flex py-2">
      <img src={displayData.icon} alt={activity.type} />
      <div className="ml-2">
        <div className="text-lg font-medium">{displayData.title}</div>
        <div className="text-gray-400">{displayData.desc}</div>
      </div>
    </div>
  );
}
