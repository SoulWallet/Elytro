import { TRoute } from '@/types/route';
import Launch from '../pages/Launch';
import Create from '../pages/Create';

export const TAB_ROUTE_PATHS = {
  Launch: '/launch',
  Create: '/create',
};

export const routes: TRoute[] = [
  { path: TAB_ROUTE_PATHS.Launch, component: Launch },
  { path: TAB_ROUTE_PATHS.Create, component: Create },
];

export default routes;
