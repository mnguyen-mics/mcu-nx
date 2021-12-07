import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import PluginsList from '../containers/Plugins/List/PluginsList';
import PluginVersionsDashboard from '../containers/Plugins/Dashboard/PluginVersionsDashboard';

export const pluginsDefinition: NavigatorDefinition = {
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
