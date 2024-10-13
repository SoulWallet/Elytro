import { Router, Route, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { TRoute } from '@/types/route';

interface HashRouterProps {
  routes: TRoute[];
}

function HashRouter({ routes }: HashRouterProps) {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        {routes.map(({ path, component }) => (
          <Route key={path as string} path={path} component={component} />
        ))}
      </Switch>
    </Router>
  );
}

export default HashRouter;
