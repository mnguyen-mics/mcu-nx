import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import BatchInstancesList from '../containers/Jobs/List/IntegrationBatchInstancesList';

export const jobsDefinition: NavigatorDefinition = {
  jobBatchInstanceList: {
    path: '/jobs/batch_instances',
    layout: 'main',
    contentComponent: BatchInstancesList,
  },
};

export const jobRoutes: NavigatorRoute[] = generateRoutesFromDefinition(jobsDefinition);
