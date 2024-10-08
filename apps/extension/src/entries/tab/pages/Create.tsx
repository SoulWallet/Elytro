import React, { useState } from 'react';
import TabLayout from '../components/TabLayout';
import { BackArrow } from '@/assets/icons/BackArrow';
import { PasswordSetter } from '../components/PasswordSetter';
import { navigateTo } from '@/utils/navigation';
import { TAB_ROUTE_PATHS } from '../routes';
import { SIDE_PANEL_ROUTE_PATHS } from '@/entries/side-panel/routes';
import useKeyringStore from '@/stores/keyring';

const Create: React.FC = () => {
  const { createNewOwner } = useKeyringStore();
  const [loading, setLoading] = useState(false);
  const goBack = () => {
    history.back();
  };

  const onCreateSuccess = () => {
    // open side panel here, cause sidePanel.open() only can be called in response to a user gesture.
    // navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Home);
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Home);

    setTimeout(() => {
      navigateTo('tab', TAB_ROUTE_PATHS.Success);
    }, 300);
  };

  const handleCreatePassword = async (pwd: string) => {
    setLoading(true);
    try {
      await createNewOwner(pwd);
      onCreateSuccess();
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
