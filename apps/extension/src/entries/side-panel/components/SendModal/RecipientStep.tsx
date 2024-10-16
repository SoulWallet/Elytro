import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SUPPORTED_CHAIN_ICON_MAP } from '@/constants/chains';
import useAccountStore from '@/stores/account';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import questionIcon from '@/assets/icons/question.svg';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TxData } from '.';
import { isAddress } from 'viem';

export default function RecipientStep({
  checkIsValid,
  updateTxData,
}: {
  checkIsValid?: (isValid: boolean) => void;
  updateTxData: Dispatch<SetStateAction<TxData | undefined>>;
}) {
  const [address, setAddress] = useState('');
  const { chainType } = useAccountStore();
  useEffect(() => {
    if (checkIsValid) {
      checkIsValid(isAddress(address, { strict: false }));
      updateTxData((prev: TxData | undefined) => ({ ...prev, to: address }));
    }
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
    </div>
  );
}
