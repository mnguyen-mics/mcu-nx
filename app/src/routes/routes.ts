import { homeRoutes } from './homeRoutes';
import { dashboardsRoutes } from './dashboardsRoutes';
import { NavigatorRoute } from './domain';
import { pluginRoutes } from './pluginRoutes';

const routes: NavigatorRoute[] = [...homeRoutes, ...pluginRoutes, ...dashboardsRoutes];

export default routes;
