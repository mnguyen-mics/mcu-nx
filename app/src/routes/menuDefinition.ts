import { generateMissingdefinitionItemFromRoute, NavigatorMenuDefinition } from './domain';
import { HomePage } from '../containers/Home';
import { DashboardsPage } from '../containers/Dashboards/List';
import { pluginsDefinition } from './pluginRoutes';
import { jobsDefinition } from './jobRoutes';

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
      ...generateMissingdefinitionItemFromRoute(pluginsDefinition.pluginsOverview),
      displayName: 'Overview',
    },
    {
      ...generateMissingdefinitionItemFromRoute(pluginsDefinition.pluginsList),
      displayName: 'Plugin List',
    },
  ],
};

const jobsMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'automation',
  displayName: 'Jobs',
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(jobsDefinition.jobBatchInstanceList),
      displayName: 'Batch Instances',
    },
  ],
};

const dashboardsMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'optimization',
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
  jobsMenuDefinition,
  dashboardsMenuDefinition,
];
