import { BackArrow } from '@/assets/icons/BackArrow';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import NetworkEditor from './NetworkEditor';
import { useChain } from '../../contexts/chain-context';
import { TChainConfigItem } from '@/constants/chains';

export default function NetworkSetting({ onBack }: { onBack: () => void }) {
  const { chains } = useChain();
  const [editingNetwork, setEditingNetwork] = useState<TChainConfigItem | null>(
    null
  );

  return (
    <>
      {editingNetwork ? null : (
        <div className="absolute top-6 left-6 cursor-pointer" onClick={onBack}>
          <BackArrow />
        </div>
      )}
      <h3 className="text-3xl mb-10">
        {editingNetwork ? editingNetwork.chainName : 'Network'}
      </h3>
      {editingNetwork ? (
        <NetworkEditor
          network={editingNetwork}
          onCancel={() => setEditingNetwork(null)}
        />
      ) : (
        <ul className="space-y-2">
          {chains.map((chain) => (
            <li
              key={chain.id}
              className="bg-gray-50 rounded-md px-4 py-6 flex items-center justify-between cursor-pointer"
              onClick={() => setEditingNetwork(chain)}
            >
              <div className="text-lg font-medium">{chain.chainName}</div>
              <ChevronRight />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
