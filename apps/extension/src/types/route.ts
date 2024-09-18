import { ComponentType } from 'react';
import { PathPattern, RegexRouteParams, RouteComponentProps } from 'wouter';

export type TRoute = {
  path?: PathPattern;
  component?:
    | ComponentType<
        RouteComponentProps<
          RegexRouteParams | { [param: number]: string | undefined }
        >
      >
    | undefined;
};
