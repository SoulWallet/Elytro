import Settings from '../pages/Settings';
import { TRoute } from '@/types/route';
import Unlock from '../pages/Unlock';
import Dashboard from '../pages/Dashboard';
import Activate from '../pages/Activate';
import Receive from '../pages/Receive';

export const SIDE_PANEL_ROUTE_PATHS = {
  Home: '/',
  Settings: '/settings',
  Unlock: '/unlock',
  Dashboard: '/dashboard',
  Activate: '/activate',
  Receive: '/receive',
} as const;

export const routes: TRoute[] = [
  {
    path: SIDE_PANEL_ROUTE_PATHS.Home,
    component: Unlock,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Dashboard,
    component: Dashboard,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Settings,
    component: Settings,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Unlock,
    component: Unlock,
  },

  {
    path: SIDE_PANEL_ROUTE_PATHS.Activate,
    component: Activate,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Receive,
    component: Receive,
  },
];
