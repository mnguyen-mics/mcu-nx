import { homeRoutes } from './homeRoutes';
import { dashboardsRoutes } from './dashboardsRoutes';
import { NavigatorRoute } from './domain';
import { pluginRoutes } from './pluginRoutes';
import { jobsRoutes, jobRoutes } from './jobRoutes';

const routes: NavigatorRoute[] = [
  ...homeRoutes,
  ...pluginRoutes,
  ...dashboardsRoutes,
  ...jobsRoutes,
  ...jobRoutes,
];

export default routes;
