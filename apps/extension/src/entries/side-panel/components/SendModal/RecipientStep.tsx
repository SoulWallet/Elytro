import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SUPPORTED_CHAIN_ICON_MAP } from '@/constants/chains';
import useAccountStore from '@/stores/account';
import { useEffect, useState } from 'react';
import questionIcon from '@/assets/icons/question.svg';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function RecipientStep({
  checkIsValid,
}: {
  checkIsValid?: (valid: boolean) => void;
}) {
  const [address, setAddress] = useState('');
  const { chainType } = useAccountStore();
  useEffect(() => {
    if (checkIsValid) checkIsValid(Boolean(address));
  }, [address]);
  return (
    <div className="space-y-4">
      <h3 className="text-3xl">Recipient</h3>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">To</Label>
        <div className="bg-gray-200 py-3 rounded-md border-none flex flex-row items-center font-medium text-lg">
          <Input
            className="text-lg"
            placeholder="Input address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <img src={questionIcon} alt="question icon" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Network tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
