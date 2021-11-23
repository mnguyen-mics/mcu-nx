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
  emptyPeriodicTableMessage: {
    id: 'jobs.batchInstances.periodicList.emptyTable',
    defaultMessage: 'No periodic instance found.',
  },
  emptyNonPeriodicTableMessage: {
    id: 'jobs.batchInstances.nonPeriodicList.emptyTable',
    defaultMessage: 'No non-periodic instance found.',
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
  jobStatus: {
    id: 'jobs.batchExecutions.list.column.jobStatus',
    defaultMessage: 'Status',
  },
  jobStartDate: {
    id: 'jobs.batchExecutions.list.column.jobStartDate',
    defaultMessage: 'Start Date',
  },
  jobDuration: {
    id: 'jobs.batchExecutions.list.column.jobStajobDuration',
    defaultMessage: 'Duration',
  },
  pendingStatus: {
    id: 'jobs.batchExecutions.list.jobStatus.pending',
    defaultMessage: 'Pending',
  },
  runningStatus: {
    id: 'jobs.batchExecutions.list.jobStatus.running',
    defaultMessage: 'Running',
  },
  succeededStatus: {
    id: 'jobs.batchExecutions.list.jobStatus.succeeded',
    defaultMessage: 'Succeeded',
  },
  canceledStatus: {
    id: 'jobs.batchExecutions.list.jobStatus.canceled',
    defaultMessage: 'Canceled',
  },
  failedStatus: {
    id: 'jobs.batchExecutions.list.jobStatus.failed',
    defaultMessage: 'Failed',
  },
});
