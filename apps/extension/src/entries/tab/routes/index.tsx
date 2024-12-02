import { TRoute } from '@/types/route';
import Launch from '../pages/Launch';
import Create from '../pages/Create';
import Success from '../pages/Success';
import SetRecoverContact from '../pages/SetRecoverContact';
import RecoverAccount from '../pages/RecoverAccount';
import Recovery from '../pages/Recovery';

export const TAB_ROUTE_PATHS = {
  Launch: '/launch',
  Create: '/create',
  Recover: '/recover',
  Success: '/success',
  SetRecoverContact: '/set_recover',
  Recovery: '/recovery',
} as const;

export const routes: TRoute[] = [
  { path: TAB_ROUTE_PATHS.Launch, component: Launch },
  { path: TAB_ROUTE_PATHS.Create, component: Create },
  // TODO: Recover
  { path: TAB_ROUTE_PATHS.Recover, component: () => <RecoverAccount /> },
  { path: TAB_ROUTE_PATHS.Success, component: Success },
  { path: TAB_ROUTE_PATHS.SetRecoverContact, component: SetRecoverContact },
  { path: TAB_ROUTE_PATHS.Recovery, component: Recovery },
];

export default routes;
