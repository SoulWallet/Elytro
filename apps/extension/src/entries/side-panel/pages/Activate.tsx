import { BackArrow } from '@/assets/icons/BackArrow';
import CardWrapper from '@/components/CardWrapper';
import { Button } from '@/components/ui/button';
import useAccountStore from '@/stores/account';

export default function Activate() {
  const { isActivated } = useAccountStore();

  return (
    <div className="bg-gray-50 p-4 flex-grow">
      <BackArrow onClick={() => history.back()} />
      <h1 className="text-2xl font-medium my-10">Activate account</h1>

      <CardWrapper>
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-gray-50 rounded-full w-6 h-6 flex items-center justify-center text-black">
            1
          </span>
          <span className="text-gray-900 text-lg">Deposit ETH</span>
        </div>
        <div className="text-gray-500 text-sm  my-4">
          Deposit any amount of ETH. The ETH will be used as gas for account
          activation.
        </div>
        <Button>Deposit</Button>
      </CardWrapper>
    </div>
  );
}
