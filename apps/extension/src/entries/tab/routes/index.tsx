import { TRoute } from '@/types/route';
import Launch from '../pages/Launch';
import Create from '../pages/Create';
import Success from '../pages/Success';

export const TAB_ROUTE_PATHS = {
  Launch: '/launch',
  Create: '/create',
  Recover: '/recover',
  Success: '/success',
} as const;

export const routes: TRoute[] = [
  { path: TAB_ROUTE_PATHS.Launch, component: Launch },
  { path: TAB_ROUTE_PATHS.Create, component: Create },
  // TODO: Recover
  { path: TAB_ROUTE_PATHS.Recover, component: () => <div>Recover</div> },
  { path: TAB_ROUTE_PATHS.Success, component: Success },
];

export default routes;
