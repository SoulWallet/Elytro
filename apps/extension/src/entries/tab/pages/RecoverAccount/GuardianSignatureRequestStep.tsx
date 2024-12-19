import guardianImg from '@/assets/guardian.png';
import { Button } from '@/components/ui/button';
import { formatAddressToShort } from '@/utils/format';
import { CheckIcon, Clock, CopyIcon } from 'lucide-react';

const ConfirmTag = () => (
  <div className="flex h-[36px] bg-[#0E2D50] px-4 items-center rounded-full space-x-2 text-white">
    <CheckIcon className="w-4 h-4" />
    <div>Confirmed</div>
  </div>
);

const WaitingTag = () => (
  <div className="flex h-[36px] bg-gray-300 px-4 items-center rounded-full space-x-2 text-gray-600">
    <Clock className="w-4 h-4" />
    <div>Waiting</div>
  </div>
);

export default function GuardianSignatureRequestStep() {
  const mockWalletContacts = [
    {
      address: '0x833EEA04d137bbA18db63B96013a54487e698C31',
      confirmed: true,
    },
    {
      address: '0x833EEA04d137bbA18db63B96013a54487e698C31',
      eth: 'Helloworld.eth',
      confirmed: false,
    },
  ];
  const emailContacts = [
    {
      email: 'helloworld@gmail.com',
      confirmed: true,
    },
  ];
  return (
    <>
      <h3 className="text-3xl mb-4 font-semibold">
        Guardian signature request
      </h3>
      <div className="elytro-gradient-bg rounded-md flex justify-between p-6 items-end mb-8">
        <div>
          <div className="text-4xl">2</div>
          <div className="text-2xl">more confirmations needed to recover</div>
        </div>
        <img className="w-[120px]" src={guardianImg} alt="guardian" />
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r-1 pr-4">
          <h3 className="text-2xl font-semibold mb-6">
            Wallet recovery contact
          </h3>
          <div>
            <div className="space-y-4">
              {mockWalletContacts.map((wallet) => (
                <div
                  className="flex justify-between"
                  key={wallet.address || wallet.eth}
                >
                  <div className="flex items-center space-x-2">
                    <div>
                      {wallet.eth ? (
                        <>
                          <div className="text-2xl font-medium">
                            {wallet.eth}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatAddressToShort(wallet.address)}
                          </div>
                        </>
                      ) : (
                        <div className="text-2xl font-medium">
                          {formatAddressToShort(wallet.address)}
                        </div>
                      )}
                    </div>
                    <CopyIcon className="w-4 h-4 cursor-pointer text-gray-600" />
                  </div>
                  {wallet.confirmed ? <ConfirmTag /> : <WaitingTag />}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button className="w-full">Share link</Button>
              <div className="text-center">
                Ask them to connect wallet and sign the signature to recover for
                you.
              </div>
            </div>
          </div>
        </div>
        <div className="pl-4">
          <h3 className="text-2xl font-semibold">Email recovery contact</h3>
          <div className="mb-6">
            <div>
              {emailContacts.map((email) => (
                <div className="flex justify-between" key={email.email}>
                  <div className="text-2xl font-medium">{email.email}</div>
                  {email.confirmed ? <ConfirmTag /> : <WaitingTag />}
                </div>
              ))}
            </div>
            <Button className="w-full mt-6">Verify email</Button>
          </div>
        </div>
      </div>
    </>
  );
}
