import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import PluginsList from '../containers/Plugins/List/PluginsList';
import PluginVersionsDashboard from '../containers/Plugins/Dashboard/PluginVersionsDashboard';
import PluginsOverviewPage from '../containers/Plugins/Overview/PluginsOverviewPage';

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
    contentComponent: PluginVersionsDashboard,
  },
};

export const pluginRoutes: NavigatorRoute[] = generateRoutesFromDefinition(pluginsDefinition);
