import ReceiveIcon from '@/assets/icons/receive.svg';
import SendIcon from '@/assets/icons/send.svg';
import CallContractIcon from '@/assets/icons/callContract.svg';
import { Address, formatEther, Hex } from 'viem';
import { formatAddressToShort } from '@/utils/format';

export enum ActivityTypes {
  receive = 'Received',
  send = 'Sent',
  callContract = 'Call Contract',
  createWallet = 'Create Wallet',
}

export interface ActivityProps {
  type: ActivityTypes;
  id: Hex;
  from: Address;
  to: Address;
  value: bigint;
  timestamp: number;
}

const IconTypeMap = {
  [ActivityTypes.receive]: ReceiveIcon,
  [ActivityTypes.send]: SendIcon,
  [ActivityTypes.callContract]: CallContractIcon,
  [ActivityTypes.createWallet]: CallContractIcon,
};

export default function Activity({
  activity: { type, from, to, value },
}: {
  activity: ActivityProps;
}) {
  const genInfo = () => {
    if (type === ActivityTypes.send) return `Sent ${formatEther(value)}`;
    if (type === ActivityTypes.receive) return `Received ${formatEther(value)}`;
    if (type === ActivityTypes.createWallet) return 'Create Wallet';
    return 'Unknown Activity';
  };
  const genDesc = () => {
    if (type === ActivityTypes.send) return `To: ${formatAddressToShort(to)}`;
    if (type === ActivityTypes.receive)
      return `From: ${formatAddressToShort(from)}`;
    if (type === ActivityTypes.callContract)
      return `On: ${formatAddressToShort(to)}`;
    return null;
  };
  return (
    <div className="flex py-2">
      <img src={IconTypeMap[type]} alt={type} />
      <div className="ml-2">
        <div className="text-lg font-medium">{genInfo()}</div>
        <div className="text-gray-400">{genDesc()}</div>
      </div>
    </div>
  );
}
