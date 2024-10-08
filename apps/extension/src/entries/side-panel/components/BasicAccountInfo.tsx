import { SUPPORTED_CHAIN_ICON_MAP } from '@/constants/chains';
import useAccountStore from '@/stores/account';
import { ArrowDownLeft, ArrowUpRight, Ellipsis } from 'lucide-react';
import CopyableText from '@/components/CopyableText';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import { navigateTo } from '@/utils/navigation';
import ActionButton from './ActionButton';
import { Button } from '@/components/ui/button';
import { formatAddressToShort } from '@/utils/format';
import walletClient from '@/services/walletClient';

export default function BasicAccountInfo() {
  const { currentChainType, address, isActivated } = useAccountStore();

  if (!address || !currentChainType) {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Home);
  }

  const onClickMore = () => {
    console.log('onClickMore');
  };

  const onClickSend = () => {
    console.log('onClickSend');
  };

  const onClickReceive = () => {
    console.log('onClickReceive');
  };

  const onClickActivate = () => {
    // todo: check if valid for sponsor
    walletClient.activateAddress(
      (userOp) => {
        console.log('Sponsored', userOp);
      },
      (userOp) => {
        console.log('Not Sponsored', userOp);
      }
    );
  };

  return (
    <div className="flex flex-col p-6">
      {/* Chain & Address */}
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-2 w-full items-center">
          <div className="flex flex-row gap-2 items-center w-full">
            <img
              className="w-10 h-10"
              src={SUPPORTED_CHAIN_ICON_MAP[currentChainType]}
            ></img>
            <div className="flex flex-col justify-center">
              <div className="text-xl font-medium text-gray-900">
                {currentChainType}
              </div>
              <CopyableText
                className="text-sm text-gray-500"
                text={formatAddressToShort(address)}
                originalText={address}
              />
            </div>
          </div>
          <Ellipsis className="w-6 h-6 text-gray-900" onClick={onClickMore} />
        </div>
      </div>
      {/* Balance: $XX.xx */}
      <div className="mt-6 text-5xl font-medium py-1">
        <span className=" text-gray-900">$20</span>
        <span className=" text-gray-200">.00</span>
      </div>

      {/* Actions */}
      {isActivated ? (
        <div className="grid grid-cols-2 gap-2 mt-2 ">
          <ActionButton
            icon={<ArrowDownLeft />}
            label="Send"
            onClick={onClickSend}
          />
          <ActionButton
            icon={<ArrowUpRight />}
            label="Receive"
            onClick={onClickReceive}
          />
        </div>
      ) : (
        <Button
          className="bg-elytro-btn-bg text-gray-900 hover:bg-blue-200 h-12"
          onClick={onClickActivate}
        >
          Activate account
        </Button>
      )}
    </div>
  );
}
