import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import PluginsList from '../containers/Plugins/List/PluginsList';
import PluginsOverviewPage from '../containers/Plugins/Overview/PluginsOverviewPage';
import PluginPage from '../containers/Plugins/Dashboard/PluginPage';

export const pluginsDefinition: NavigatorDefinition = {
  pluginsOverview: {
    path: '/plugins/overview',
    layout: 'main',
    contentComponent: PluginsOverviewPage,
  },
  pluginsList: {
    path: '/plugins',
    layout: 'main',
    contentComponent: PluginsList,
  },
  pluginVersionsDashboard: {
    path: '/plugins/:pluginId',
    layout: 'main',
    contentComponent: PluginPage,
  },
};

export const pluginRoutes: NavigatorRoute[] = generateRoutesFromDefinition(pluginsDefinition);
