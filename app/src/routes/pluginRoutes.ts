import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import BatchDefinitionsList from '../containers/Plugins/List/BatchDefinitionList';
import BatchDefinitionDashboard from '../containers/Plugins/Dashboard/BatchDefinitionDashboard';

export const pluginsDefinition: NavigatorDefinition = {
  pluginBatchDefinitionList: {
    path: '/plugins/batch_definitions',
    layout: 'main',
    contentComponent: BatchDefinitionsList,
  },
  pluginBatchDefinitionDashboard: {
    path: '/plugins/batch_definitions/:pluginId',
    layout: 'main',
    contentComponent: BatchDefinitionDashboard,
  },
};

export const pluginRoutes: NavigatorRoute[] = generateRoutesFromDefinition(pluginsDefinition);
