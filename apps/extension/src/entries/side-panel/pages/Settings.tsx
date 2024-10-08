import { TAB_ROUTE_PATHS } from '@/entries/tab/routes';
import { navigateTo } from '@/utils/navigation';
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div
      onClick={() => {
        navigateTo('tab', TAB_ROUTE_PATHS.Create);
      }}
    >
      Settings
    </div>
  );
};

export default Settings;
