import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import IntegrationBatchInstancesPage from '../containers/Jobs/List/IntegrationBatchInstancesPage';

export const jobsDefinition: NavigatorDefinition = {
  jobBatchInstanceList: {
    path: '/jobs/integration_batch_instances',
    layout: 'main',
    contentComponent: IntegrationBatchInstancesPage,
  },
};

export const jobRoutes: NavigatorRoute[] = generateRoutesFromDefinition(jobsDefinition);
