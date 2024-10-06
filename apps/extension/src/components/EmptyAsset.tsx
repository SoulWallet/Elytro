import emptyAsset from '@/assets/empty.png';
import { Button } from './ui/button';

export default function EmptyAsset() {
  return (
    <div className="flex flex-col items-center justify-center h-full flex-grow">
      <img src={emptyAsset} alt="empty" className="w-56 h-24" />
      <p className="text-lg text-gray-400 my-6">
        You don’t have any assets yet
      </p>
      <Button className="w-24 h-10 text-gray-900 bg-white border-gray-200 hover:bg-gray-200">
        Deposit
      </Button>
    </div>
  );
}
