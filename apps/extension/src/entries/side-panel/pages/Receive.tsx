import { useAccount } from '../contexts/account-context';
import SecondaryPageWrapper from '../components/SecondaryPageWrapper';
import { ChevronDown, Copy } from 'lucide-react';
import {
  SUPPORTED_CHAIN_ICON_MAP,
  SUPPORTED_CHAIN_MAP,
  SupportedChainTypeEn,
} from '@/constants/chains';
import ReceiveAddressBadge from '../components/ReceiveAddressBadge';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeClipboard } from '@/utils/clipboard';

export default function Receive() {
  const {
    accountInfo: { address, chainType },
  } = useAccount();

  const chainInfo = SUPPORTED_CHAIN_MAP[chainType as SupportedChainTypeEn];

  const handleClickChainSelector = () => {
    alert('TODO: Chain selector?');
  };

  return (
    <SecondaryPageWrapper
      title="Receive"
      footer={
        <>
          {/* Copy Address */}
          <Button
            variant="secondary"
            size="large"
            className="fixed bottom-lg  left-lg right-lg"
            onClick={() => safeClipboard(address!)}
          >
            <Copy className="elytro-clickable-icon mr-2xs" />
            Copy Address
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-y-5 items-center w-full relative">
        {/* Chain info */}
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center gap-2  ">
            <img
              src={SUPPORTED_CHAIN_ICON_MAP[chainType as SupportedChainTypeEn]}
              alt={chainInfo.name}
              className="size-8 rounded-full border border-gray-50"
            />
            <div className="flex flex-col">
              <div className="elytro-text-bold-body">{chainInfo.name}</div>
              <div className="elytro-text-tiny-body text-gray-600">
                This address only accepts {chainInfo.name} assets.
              </div>
            </div>
          </div>

          <ChevronDown
            className="elytro-clickable-icon"
            onClick={handleClickChainSelector}
          />
        </div>

        <ReceiveAddressBadge address={address!} chainType={chainType} />

        <div className="flex flex-row items-center gap-2 w-full text-left">
          <CircleAlert className="elytro-clickable-icon size-3" />
          <div className="elytro-text-tiny-body text-gray-600">
            Copy address & paste it to your sender to receive tokens.
          </div>
        </div>
      </div>
    </SecondaryPageWrapper>
  );
}
