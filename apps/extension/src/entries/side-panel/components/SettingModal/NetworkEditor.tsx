import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chain } from 'viem';

export default function NetworkEditor({
  network,
  onCancel,
}: {
  network: Chain;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">Chian ID</Label>
        <div className="bg-gray-200 py-3 rounded-md border-none flex flex-row items-center font-medium text-lg">
          <Input
            className="text-lg"
            placeholder="Input address"
            value={network.id}
            disabled
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">RPC</Label>
        <div className="bg-gray-200 py-3 rounded-md border-none flex flex-row items-center font-medium text-lg">
          <Input
            className="text-lg"
            placeholder="Input address"
            value={network.rpcUrls.default.http[0]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">Currency Symbol</Label>
        <div className="bg-gray-200 py-3 rounded-md border-none flex flex-row items-center font-medium text-lg">
          <Input
            className="text-lg"
            placeholder="Input address"
            value={network.nativeCurrency.symbol}
            disabled
          />
        </div>
      </div>
      <div className="absolute bottom-6 flex left-6 right-6 space-x-2">
        <Button
          className="flex-1 rounded-full h-20"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button className="flex-1 rounded-full h-20">Save</Button>
      </div>
    </div>
  );
}
