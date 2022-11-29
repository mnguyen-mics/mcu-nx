import { generateMissingdefinitionItemFromRoute, NavigatorMenuDefinition } from './domain';
import { HomePage } from '../containers/Home';
import { DashboardsPage } from '../containers/Dashboards/List';
import { jobsDefinition } from './jobRoutes';
import PluginsList from '../containers/Plugins/List/PluginsList';

const homeMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'home',
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
  type: 'simple',

  ...generateMissingdefinitionItemFromRoute({
    path: '/plugins',
    layout: 'main',
    contentComponent: PluginsList,
  }),
};

const jobsMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'automation',
  displayName: 'Jobs',
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(jobsDefinition.jobBatchInstanceList),
      displayName: 'Batch instances',
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
