import { ReactElement } from "react";

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}
