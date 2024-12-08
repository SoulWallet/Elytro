import {
  ArrowDownLeft,
  ArrowUpRight,
  Ellipsis,
  RefreshCcw,
} from 'lucide-react';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import { navigateTo } from '@/utils/navigation';
import ActionButton from './ActionButton';
import ActivateButton from './ActivateButton';
import SendModal from './SendModal';
import { useState } from 'react';
import SettingModal from './SettingModal';
import AccountsModal from './AccountsModal';
import Account from './Account';
import { useAccount } from '../contexts/account-context';
import { useChain } from '../contexts/chain-context';
import Spin from '@/components/Spin';

export default function BasicAccountInfo() {
  const {
    accountInfo: { isActivated, address, balance },
    updateAccount,
  } = useAccount();
  const { currentChain } = useChain();
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [openAccounts, setOpenAccounts] = useState(false);
  const onClickMore = () => {
    setOpenSetting(true);
  };

  const onClickSend = () => {
    setOpenSendModal(true);
  };

  const onClickReceive = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Receive);
  };

  if (!currentChain || !address) {
    return <Spin isLoading />;
  }

  return (
    <div className="flex flex-col p-sm">
      {/* Chain & Address */}
      <div className="flex flex-row gap-2 w-full items-center justify-between">
        <Account chain={currentChain!} address={address} />
        <div className="flex flex-row gap-lg">
          <Ellipsis className="elytro-clickable-icon" onClick={onClickMore} />
          <RefreshCcw
            className="elytro-clickable-icon"
            onClick={updateAccount}
          />
        </div>
      </div>

      {/* Balance: $XX.xx */}
      <div className="my-sm py-1 elytro-text-hero">
        <span>${balance?.split?.('.')?.[0]}</span>
        <span className=" text-gray-450">
          .{balance?.split?.('.')?.[1]?.slice(0, 3) || '000'}
        </span>
      </div>

      {/* Actions */}
      <div>
        {isActivated ? (
          <div className="flex flex-row gap-sm mt-sm ">
            <ActionButton
              className="bg-light-green"
              icon={<ArrowDownLeft />}
              label="Receive"
              onClick={onClickReceive}
            />
            <ActionButton
              icon={<ArrowUpRight />}
              label="Send"
              onClick={onClickSend}
            />
          </div>
        ) : (
          <ActivateButton />
        )}
      </div>

      <SendModal
        open={openSendModal}
        onOpenChange={() => setOpenSendModal(false)}
      />
      <SettingModal
        open={openSetting}
        onOpenChange={() => setOpenSetting(false)}
      />
      <AccountsModal
        open={openAccounts}
        onOpenChange={() => setOpenAccounts(false)}
      />
    </div>
  );
}
