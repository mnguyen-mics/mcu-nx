import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import BatchDefinitionsList from '../containers/Plugins/List/BatchDefinitionList';

export const pluginsDefinition: NavigatorDefinition = {
  pluginBatchDefinitionList: {
    path: '/plugins/batch_definitions',
    layout: 'main',
    contentComponent: BatchDefinitionsList,
  },
};

export const pluginRoutes: NavigatorRoute[] = generateRoutesFromDefinition(pluginsDefinition);
