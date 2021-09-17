import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import DashboardsPage from '../containers/dashboards/DashboardsPage';

export const dashboardsDefinition: NavigatorDefinition = {
  dashboards: {
    path: '/dashboards',
    layout: 'main',
    contentComponent: DashboardsPage,
  },
};

export const dashboardsRoutes: NavigatorRoute[] =
  generateRoutesFromDefinition(dashboardsDefinition);
