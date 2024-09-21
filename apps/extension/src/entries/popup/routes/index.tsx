import Settings from '../pages/Settings';
import Home from '../pages/Home';
import { TRoute } from '@/types/route';

export const POPUP_ROUTE_PATHS = {
  Home: '/',
  Settings: '/settings',
} as const;

export const routes: TRoute[] = [
  {
    path: POPUP_ROUTE_PATHS.Home,
    component: Home,
  },
  {
    path: POPUP_ROUTE_PATHS.Settings,
    component: Settings,
  },
];
