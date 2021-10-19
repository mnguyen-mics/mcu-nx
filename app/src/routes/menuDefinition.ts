import { generateMissingdefinitionItemFromRoute, NavigatorMenuDefinition } from './domain';
import { HomePage } from '../containers/Home';
import { DashboardsPage } from '../containers/Dashboards';
import { pluginsDefinition } from './pluginRoutes';

const homeMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'users',
  displayName: 'Home',
  type: 'simple',
  ...generateMissingdefinitionItemFromRoute({
    path: '/home',
    layout: 'main',
    contentComponent: HomePage,
  }),
};

const pluginsMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'creative',
  displayName: 'Plugins',
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(pluginsDefinition.pluginBatchDefinitionList),
      displayName: 'Batch Definitions',
    },
  ],
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
  pluginsMenuDefinition,
  dashboardsMenuDefinition,
];
