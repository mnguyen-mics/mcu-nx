import { homeRoutes } from './homeRoutes';
import { dashboardsRoutes } from './dashboardsRoutes';
import { NavigatorRoute } from './domain';

const routes: NavigatorRoute[] = [...homeRoutes, ...dashboardsRoutes];

export default routes;
