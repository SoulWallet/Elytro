import React, { useState } from 'react';
import TabLayout from '../components/TabLayout';
import { BackArrow } from '@/assets/icons/BackArrow';
import { PasswordSetter } from '../components/PasswordSetter';
import { navigateTo } from '@/utils/navigation';
import { TAB_ROUTE_PATHS } from '../routes';
import { useToast } from '@/hooks/use-toast';
import walletClient from '@/services/walletClient';
import keyring from '@/services/keyring';
import { SIDE_PANEL_ROUTE_PATHS } from '@/entries/side-panel/routes';

const Create: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const goBack = () => {
    history.back();
  };

  const onCreateSuccess = () => {
    navigateTo('tab', TAB_ROUTE_PATHS.Success);
    // open side panel here, cause sidePanel.open() only can be called in response to a user gesture.
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Home);
  };

  const handleCreatePassword = async (pwd: string) => {
    setLoading(true);
    try {
      await keyring.createNewOwner(pwd);

      // // TODO: create elytro wallet address. Encounter blocking issue, comment out for now
      await walletClient.createWalletAddress();

      onCreateSuccess();
    } catch (error) {
      keyring.reset();
      toast({
        title: 'Oops! Something went wrong. Try again later.',
        description: error?.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabLayout>
      {/* Back Arrow */}
      <BackArrow onClick={goBack} className="w-6 h-6" />
      {/* Create password */}
      <div className="flex flex-col  p-4 gay-y-8">
        <div className="text-3xl mb-4">Set Password</div>
        <PasswordSetter onSubmit={handleCreatePassword} loading={loading} />
      </div>
    </TabLayout>
  );
};

export default Create;
