import { RouteConfig } from "@/types/route";
import Launch from "../pages/Launch";
import Create from "../pages/Create";

const routes: RouteConfig[] = [
  { path: "/", component: Launch, exact: true },
  { path: "/launch", component: Launch },
  { path: "/create", component: Create },
];

export default routes;
