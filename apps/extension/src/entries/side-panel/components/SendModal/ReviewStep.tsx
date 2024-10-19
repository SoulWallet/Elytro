import { Label } from '@/components/ui/label';
import { useAccount } from '../../contexts/account-context';
import { SUPPORTED_CHAIN_ICON_MAP } from '@/constants/chains';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import questionIcon from '@/assets/icons/question.svg';
import { TxData } from '.';
import { ChevronRight } from 'lucide-react';

export default function ReviewStep({ txData }: { txData?: TxData }) {
  const {
    accountInfo: { chainType },
  } = useAccount();
  const handleAddress = () => {
    const address = txData?.to as string;
    const prefix = address.slice(0, 6);
    const suffix = address.slice(address.length - 6, address.length);
    const middle = address.slice(6, address.length - 6);
    return (
      <>
        <span>{prefix}</span>
        <span className="text-gray-300">{middle}</span>
        <span>{suffix}</span>
      </>
    );
  };
  return (
    <div className="space-y-4">
      <h3 className="text-3xl">Recipient</h3>
      <div className="space-y-2">
        {txData ? (
          <>
            <Label className="text-gray-400 font-normal">Token</Label>
            <div className="py-3 flex flex-row items-center font-medium text-lg">
              <img
                className="h-10 w-10 mr-4"
                src={txData.token?.icon}
                alt={txData.token?.name}
              />
              <div className="text-2xl">{txData.token?.balance} ETH</div>
            </div>
          </>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">To</Label>
        <div className="text-2xl font-medium break-all">{handleAddress()}</div>
      </div>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">Network</Label>
        <div className="flex flex-row items-center font-medium text-lg space-x-2">
          <img
            className="w-10 h-10"
            src={
              SUPPORTED_CHAIN_ICON_MAP[
                chainType as keyof typeof SUPPORTED_CHAIN_ICON_MAP
              ]
            }
            alt={chainType}
          />
          <div>{chainType}</div>
          <Tooltip>
            <TooltipTrigger>
              <img src={questionIcon} alt="question icon" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Network tooltip</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">Fee</Label>
        <div className="text-2xl font-medium break-all">
          <div className="flex items-center">
            <span className="text-gray-300 line-through">0.02 ETH</span>
            <ChevronRight />
          </div>
          <div className="text-sm font-normal text-gray-700">
            Sponsored by Soul Wallet
          </div>
        </div>
      </div>
    </div>
  );
}
