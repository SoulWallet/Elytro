import React from 'react';
import { Router as WouterRouter, Route, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { RouteConfig } from '../types/route';

interface RouterProps {
  routes: RouteConfig[];
}

const Router: React.FC<RouterProps> = ({ routes }) => {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            component={route.component}
          />
        ))}
      </Switch>
    </WouterRouter>
  );
};

export default Router;
