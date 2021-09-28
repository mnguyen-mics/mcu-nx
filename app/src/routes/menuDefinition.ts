import { generateMissingdefinitionItemFromRoute, NavigatorMenuDefinition } from './domain';
import { HomePage } from '../containers/home';
import { DashboardsPage } from '../containers/dashboards';

const homeMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'users',
  displayName: 'home',
  type: 'simple',
  ...generateMissingdefinitionItemFromRoute({
    path: '/home',
    layout: 'main',
    contentComponent: HomePage,
  }),
};

const dashboardsMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'library',
  displayName: 'Dashboards',
  type: 'simple',
  ...generateMissingdefinitionItemFromRoute({
    path: '/dashboards',
    layout: 'main',
    contentComponent: DashboardsPage,
  }),
};

export const menuDefinitions: NavigatorMenuDefinition[] = [
  homeMenuDefinition,
  dashboardsMenuDefinition,
];
