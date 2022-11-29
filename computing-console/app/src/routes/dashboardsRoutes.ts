import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import DashboardsPage from '../containers/Dashboards/List/DashboardsPage';
import EditDashboardPage from '../containers/Dashboards/Edit/EditDashboardPage';

export const dashboardsDefinition: NavigatorDefinition = {
  dashboards: {
    path: '/dashboards',
    layout: 'main',
    contentComponent: DashboardsPage,
  },
  dashboardCreate: {
    path: '/dashboards/create',
    layout: 'edit',
    editComponent: EditDashboardPage,
  },
  dashboardEdit: {
    path: '/dashboards/edit/:dashboardId',
    layout: 'edit',
    editComponent: EditDashboardPage,
  },
};

export const dashboardsRoutes: NavigatorRoute[] =
  generateRoutesFromDefinition(dashboardsDefinition);
