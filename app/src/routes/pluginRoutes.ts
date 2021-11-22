import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import IntegrationBatchDefinitionList from '../containers/Plugins/List/IntegrationBatchDefinitionList';
import IntegrationBatchDefinitionDashboard from '../containers/Plugins/Dashboard/IntegrationBatchDefinitionDashboard';

export const pluginsDefinition: NavigatorDefinition = {
  pluginBatchDefinitionList: {
    path: '/plugins/batch_definitions',
    layout: 'main',
    contentComponent: IntegrationBatchDefinitionList,
  },
  pluginBatchDefinitionDashboard: {
    path: '/plugins/batch_definitions/:pluginId',
    layout: 'main',
    contentComponent: IntegrationBatchDefinitionDashboard,
  },
};

export const pluginRoutes: NavigatorRoute[] = generateRoutesFromDefinition(pluginsDefinition);
