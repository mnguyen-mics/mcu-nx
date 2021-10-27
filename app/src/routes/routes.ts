import { homeRoutes } from './homeRoutes';
import { dashboardsRoutes } from './dashboardsRoutes';
import { NavigatorRoute } from './domain';
import { pluginRoutes } from './pluginRoutes';
import { jobRoutes } from './jobRoutes';

const routes: NavigatorRoute[] = [
  ...homeRoutes,
  ...pluginRoutes,
  ...dashboardsRoutes,
  ...jobRoutes,
];

export default routes;
