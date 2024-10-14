import { Button } from './ui/button';
import EmptyTip from './EmptyTip';

export default function EmptyAsset() {
  return (
    <EmptyTip tip="You don’t have any assets yet">
      <Button className="w-24 h-10 text-gray-900 bg-white border-gray-200 hover:bg-gray-200">
        Deposit
      </Button>
    </EmptyTip>
  );
}
