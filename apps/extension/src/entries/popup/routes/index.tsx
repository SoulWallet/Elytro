import { RouteConfig } from "@/types/route";
import Home from "../pages/Home";
import Settings from "../pages/Settings";

const routes: RouteConfig[] = [
  { path: "/", component: Home, exact: true },
  { path: "/home", component: Home },
  { path: "/settings", component: Settings },
];

export default routes;
