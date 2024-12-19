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
    accountInfo: { isDeployed, address, balance },
    updateTokens,
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
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.SendTx);
  };

  const onClickReceive = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Receive);
  };

  if (!currentChain || !address) {
    return <Spin isLoading />;
  }

  // const { integerPart, decimalPart } = formatBalance(balance, {
  //   threshold: 0.001,
  //   maxDecimalLength: 8,
  // });

  const reloadAccount = async () => {
    await updateAccount();
    await updateTokens();
  };

  return (
    <div className="flex flex-col p-sm pb-0 ">
      {/* Chain & Address */}
      <div className="flex flex-row gap-2 w-full items-center justify-between mb-lg">
        <Account
          chain={currentChain!}
          account={{
            address,
            balance,
          }}
        />
        <div className="flex flex-row gap-lg">
          <Ellipsis className="elytro-clickable-icon" onClick={onClickMore} />
          <RefreshCcw
            className="elytro-clickable-icon"
            onClick={reloadAccount}
          />
        </div>
      </div>

      {/* TODO: NOT SHOW BALANCE FOR NOW */}
      {/* Balance: $XX.xx */}
      {/* <div className="my-sm py-1 elytro-text-hero">
        <span>{integerPart}</span>
        <span className=" text-gray-450">.{decimalPart}</span> ETH
      </div> */}

      {/* Actions */}
      <div>
        <div className="flex flex-row gap-sm">
          {isDeployed ? (
            <>
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
            </>
          ) : (
            <ActivateButton />
          )}
        </div>
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
