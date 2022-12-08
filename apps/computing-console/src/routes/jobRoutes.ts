import IntegrationBatchInstanceOverview from '../containers/Jobs/List/IntegrationBatchInstanceOverview';
import IntegrationBatchInstancesPage from '../containers/Jobs/List/IntegrationBatchInstancesPage';
import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';

export const jobsDefinition: NavigatorDefinition = {
  jobBatchInstanceList: {
    path: '/jobs/integration_batch_instances',
    layout: 'main',
    contentComponent: IntegrationBatchInstancesPage,
  },
};

export const jobDefinition: NavigatorDefinition = {
  jobBatchInstanceList: {
    path: '/jobs/integration_batch_instances/:batchInstanceId',
    layout: 'main',
    contentComponent: IntegrationBatchInstanceOverview,
  },
};

export const jobsRoutes: NavigatorRoute[] = generateRoutesFromDefinition(jobsDefinition);
export const jobRoutes: NavigatorRoute[] = generateRoutesFromDefinition(jobDefinition);
