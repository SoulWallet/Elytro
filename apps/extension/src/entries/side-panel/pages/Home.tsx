import { useEffect } from 'react';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import { navigateTo } from '@/utils/navigation';
import useKeyringStore from '../stores/keyring';

export default function Home() {
  const { isLocked, resetFromKeyring } = useKeyringStore();

  useEffect(() => {
    resetFromKeyring();
  }, []);

  useEffect(() => {
    if (isLocked === null) return;

    if (isLocked) {
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Unlock);
    } else {
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
    }
  }, [isLocked]);

  return null;
}
