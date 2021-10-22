import { defineMessages } from 'react-intl';

export default defineMessages({
  jobs: {
    id: 'jobs.title',
    defaultMessage: 'Jobs',
  },
  jobBatchInstances: {
    id: 'jobs.batchInstances.title',
    defaultMessage: 'Batch Instances',
  },
  newBatchInstance: {
    id: 'jobs.batchInstances.list.actionBar.newBatchInstance',
    defaultMessage: 'New Batch Instance',
  },
  group: {
    id: 'jobs.batchInstances.list.column.group',
    defaultMessage: 'Group',
  },
  artifactId: {
    id: 'jobs.batchInstances.list.column.artifactId',
    defaultMessage: 'Artifact Id',
  },
  currentVersion: {
    id: 'jobs.batchInstances.list.column.currentVersion',
    defaultMessage: 'Current Version',
  },
  cronStatus: {
    id: 'jobs.batchInstances.list.column.cronStatus',
    defaultMessage: 'Cron Status',
  },
  cron: {
    id: 'jobs.batchInstances.list.column.cron',
    defaultMessage: 'Cron',
  },
  emptyTableMessage: {
    id: 'jobs.batchInstances.list.emptyTable',
    defaultMessage: 'No batch instance found.',
  },
  nonPeriodicInstances: {
    id: 'jobs.batchInstances.list.nonPeriodic.title',
    defaultMessage: 'Non-periodic Instances',
  },
  periodicInstances: {
    id: 'jobs.batchInstances.list.periodic.title',
    defaultMessage: 'Periodic Instances',
  },
  lastExecutions: {
    id: 'jobs.batchInstances.list.column.lastExecutions',
    defaultMessage: 'Last executions',
  },
});
