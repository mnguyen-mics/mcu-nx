import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import IntegrationBatchDefinitionsList from '../containers/Plugins/List/IntegrationBatchDefinitionsList';
import IntegrationBatchDefinitionDashboard from '../containers/Plugins/Dashboard/IntegrationBatchDefinitionDashboard';

export const pluginsDefinition: NavigatorDefinition = {
  pluginBatchDefinitionList: {
    path: '/plugins/integration_batch_definitions',
    layout: 'main',
    contentComponent: IntegrationBatchDefinitionsList,
  },
  pluginBatchDefinitionDashboard: {
    path: '/plugins/integration_batch_definitions/:pluginId',
    layout: 'main',
    contentComponent: IntegrationBatchDefinitionDashboard,
  },
};

export const pluginRoutes: NavigatorRoute[] = generateRoutesFromDefinition(pluginsDefinition);
