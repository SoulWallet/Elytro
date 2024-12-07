import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import TickCircle from '@/assets/icons/tickCircle.svg';
import { TChainConfigItem } from '@/constants/chains';

export default function NetworkEditor({
  network,
  onCancel,
}: {
  network: TChainConfigItem;
  onCancel: () => void;
}) {
  const { toast } = useToast();

  const mockBundlers = [
    {
      name: 'Bundler 01',
    },
    {
      name: 'Bundler 02',
    },
  ];

  const onSave = () => {
    onCancel();
    toast({
      description: (
        <div className="flex">
          <img className="mr-2" src={TickCircle} />
          {network.name} Network updated
        </div>
      ),
      className: 'bg-green-900 border-none text-green-50 text-2xl py-8',
    });
  };
  const [bundler, setBundler] = useState('');
  const [customBundler, setCustomBundler] = useState('');
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">Chian ID</Label>
        <div className="bg-gray-200 py-3 rounded-md border-none flex flex-row items-center font-medium text-lg">
          <Input
            className="text-lg"
            placeholder="Input address"
            value={network.chainId}
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
            value={network.rpcUrl}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">Currency Symbol</Label>
        <div className="bg-gray-200 py-3 rounded-md border-none flex flex-row items-center font-medium text-lg">
          <Input
            className="text-lg"
            placeholder="Input address"
            value={network.currencySymbol.symbol}
            disabled
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-gray-400 font-normal">Bundler</Label>
        <Select value={bundler} onValueChange={(value) => setBundler(value)}>
          <SelectTrigger className="bg-gray-200 py-8 rounded-md border-none flex flex-row items-center font-medium text-lg">
            <SelectValue placeholder="Select a bundler" />
          </SelectTrigger>
          <SelectContent>
            {mockBundlers.map((item) => (
              <SelectItem
                key={item.name}
                value={item.name}
                className="py-4 cursor-pointer"
              >
                {item.name}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem value="customize" className="py-4 cursor-pointer">
              Customize
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {bundler === 'customize' ? (
        <div className="space-y-2">
          <div className="bg-gray-200 py-3 rounded-md border-none flex flex-row items-center font-medium text-lg">
            <Input
              className="text-lg"
              placeholder="Input address"
              value={customBundler}
              onChange={(e) => setCustomBundler(e.target.value)}
            />
          </div>
        </div>
      ) : null}
      <div className="absolute bottom-6 flex left-6 right-6 space-x-2">
        <Button
          className="flex-1 rounded-full h-20 text-2xl"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 rounded-full h-20 text-2xl"
          onClick={onSave}
          disabled={!bundler}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
