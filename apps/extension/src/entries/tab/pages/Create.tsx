import React, { useEffect, useState } from 'react';
import TabLayout from '../components/TabLayout';
import { PasswordSetter } from '../components/PasswordSetter';
import { navigateTo } from '@/utils/navigation';
import { toast } from '@/hooks/use-toast';
import { TAB_ROUTE_PATHS } from '../routes';
import { useKeyring } from '@/contexts/keyring';
import { SIDE_PANEL_ROUTE_PATHS } from '@/entries/side-panel/routes';
import { useWallet } from '@/contexts/wallet';
import { TChainConfigItem } from '@/constants/chains';
import { ArrowLeft } from 'lucide-react';
import { useChain } from '@/entries/side-panel/contexts/chain-context';
import ChainItem from '@/components/ChainItem';
import { Button } from '@/components/ui/button';

enum CreateStepEnum {
  SET_PASSWORD = 'SET_PASSWORD',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
}

/**
 * Progress Bar Step: a horizontal line with a circle in the middle
 */
const ProgressBarStep: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div
    className="flex-1 h-[3px] rounded-full bg-gray-900"
    style={{ opacity: isActive ? 1 : 0.2 }}
  />
);

const PasswordStep = ({ onNext }: { onNext: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { createNewOwner } = useKeyring();

  const handleCreatePassword = async (pwd: string) => {
    try {
      setLoading(true);
      await createNewOwner(pwd);

      onNext();
    } catch (error) {
      toast({
        title: 'Oops! Something went wrong. Try again later.',
        description: error?.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return <PasswordSetter onSubmit={handleCreatePassword} loading={loading} />;
};

const CreateAccountStep = ({ onNext }: { onNext: () => void }) => {
  const { chains, getChains } = useChain();
  const wallet = useWallet();
  const [selectedChain, setSelectedChain] = useState<TChainConfigItem | null>(
    null
  );

  useEffect(() => {
    getChains();
  }, []);

  const handleCreateAccount = async () => {
    if (!selectedChain) {
      toast({
        title: 'Please select a chain',
        description: 'Please select a chain to create your account',
      });
      return;
    }

    try {
      await wallet.createAccount(selectedChain.chainId);

      onNext();
    } catch (error) {
      toast({
        title: 'Oops! Something went wrong. Try again later.',
        description: error?.toString(),
      });
    }
  };

  const handleSelectChain = (chain: TChainConfigItem) => {
    setSelectedChain(chain);
  };

  return (
    <div className="flex flex-col gap-y-3xl">
      <div className="grid grid-cols-2 gap-lg">
        {chains.map((chain) => (
          <ChainItem
            key={chain.chainId}
            chain={chain}
            isSelected={selectedChain?.chainId === chain.chainId}
            onClick={() => handleSelectChain(chain)}
          />
        ))}
      </div>

      <Button onClick={handleCreateAccount} disabled={!selectedChain}>
        Next
      </Button>
    </div>
  );
};

const STEPS = {
  [CreateStepEnum.SET_PASSWORD]: {
    title: 'Create a local password',
    description: 'This is for accessing your account on this device',
    component: PasswordStep,
  },
  [CreateStepEnum.CREATE_ACCOUNT]: {
    title: 'Create account',
    description: 'Select your favorite chain for your first account address',
    component: CreateAccountStep,
  },
};

const Create: React.FC = () => {
  const [step, setStep] = useState(CreateStepEnum.SET_PASSWORD);

  const goBack = () => {
    if (step === CreateStepEnum.CREATE_ACCOUNT) {
      setStep(CreateStepEnum.SET_PASSWORD);
    } else {
      navigateTo('tab', TAB_ROUTE_PATHS.Launch);
    }
  };

  const { title, description, component: CurrentStepComponent } = STEPS[step];

  const handleNext = () => {
    if (step === CreateStepEnum.SET_PASSWORD) {
      setStep(CreateStepEnum.CREATE_ACCOUNT);
    } else if (step === CreateStepEnum.CREATE_ACCOUNT) {
      // open side panel here, cause sidePanel.open() only can be called in response to a user gesture.
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);

      setTimeout(() => {
        navigateTo('tab', TAB_ROUTE_PATHS.Success);
      }, 400);
    }
  };

  return (
    <TabLayout className="min-w-[480px] gap-y-3xl flex flex-col">
      {/* Back Arrow */}
      <ArrowLeft onClick={goBack} className="size-6" />

      {/* Progress Bar: two horizontal lines */}
      <div className="flex items-center justify-between gap-x-sm">
        <ProgressBarStep isActive={step === CreateStepEnum.SET_PASSWORD} />
        <ProgressBarStep isActive={step === CreateStepEnum.CREATE_ACCOUNT} />
      </div>

      {/* Title & Description */}
      <div className="flex flex-col gap-y-md">
        <div className="elytro-text-subtitle">{title}</div>
        <div className="elytro-text-small text-gray-600">{description}</div>
      </div>

      {/* Current Step */}
      <CurrentStepComponent onNext={handleNext} />
    </TabLayout>
  );
};

export default Create;
