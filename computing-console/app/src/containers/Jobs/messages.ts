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
  editBatchInstance: {
    id: 'jobs.batchInstances.list.actionBar.editBatchInstance',
    defaultMessage: 'Edit {name}',
  },
  name: {
    id: 'jobs.batchInstances.list.name',
    defaultMessage: 'Name',
  },
  edit: {
    id: 'jobs.batchInstances.list.edit',
    defaultMessage: 'Edit',
  },
  save: {
    id: 'jobs.batchInstances.form.save',
    defaultMessage: 'Save',
  },
  run: {
    id: 'jobs.batchInstances.actionbar.run',
    defaultMessage: 'Run',
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
  executionContainerResourceSizeLow: {
    id: 'plugins.batchInstances.editPage.executionContainerResourceSize.low',
    defaultMessage: 'Low',
  },
  executionContainerResourceSizeMedium: {
    id: 'plugins.batchInstances.editPage.executionContainerResourceSize.low',
    defaultMessage: 'Medium',
  },
  executionContainerResourceSizeLarge: {
    id: 'plugins.batchInstances.editPage.executionContainerResourceSize.low',
    defaultMessage: 'Large',
  },
  executionContainerResourceSizeExtraLarge: {
    id: 'plugins.batchInstances.editPage.executionContainerResourceSize.low',
    defaultMessage: 'Extra-Large',
  },
  cpuSize: {
    id: 'plugins.batchInstances.editPage.technicalConfiguration.cpuSize',
    defaultMessage: 'Cpu size',
  },
  ramSize: {
    id: 'plugins.batchInstances.editPage.technicalConfiguration.ramSize',
    defaultMessage: 'Ram size',
  },
  diskSize: {
    id: 'plugins.batchInstances.editPage.technicalConfiguration.diskSize',
    defaultMessage: 'Disk size',
  },
  cpuSizeTooltipMsg: {
    id: 'plugins.batchInstances.editPage.technicalConfiguration.cpuSize.toolTipMessage',
    defaultMessage:
      'Low: between 1 and 2 cores, Medium: between 2 and 4 cores, Large: between 4 and 8 cores, Extra-large: between 8 and 16 cores.',
  },
  ramSizeTooltipMsg: {
    id: 'plugins.batchInstances.editPage.technicalConfiguration.ramSize.toolTipMessage',
    defaultMessage:
      'Low: between 2 Go and 4 Go, Medium: between 4 Go and 8 Go, Large: between 8 Go and 16 Go, Extra-large: between 16 Go and 32 Go.',
  },
  diskSizeTooltipMsg: {
    id: 'plugins.batchInstances.editPage.technicalConfiguration.diskSize.toolTipMessage',
    defaultMessage: 'Low: 30 Go,  Medium: 100 Go, Large: 500 Go, Extra-large: 1 To.',
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
  for: {
    id: 'plugins.batchExecutions.dashboard.title.for',
    defaultMessage: 'for',
  },
  newExecution: {
    id: 'plugins.batchExecutions.dashboard.newExecution',
    defaultMessage: 'New Integration Batch Instance execution',
  },
  modalStartDateContent: {
    id: 'plugins.batchExecutions.dashboard.modalStartDateContent',
    defaultMessage: 'Please select a date time to start your next execution: ',
  },
  newExecutionSuccessMessage: {
    id: 'plugins.batchExecutions.dashboard.newExecutionSuccessMessage',
    defaultMessage: 'Your new execution has been successfully created!',
  },
  newStatusMessage: {
    id: 'plugins.batchExecutions.dashboard.newStatusMessage',
    defaultMessage: 'Your Integration Batch Instance status has been successfully updated!',
  },
  pauseBatchInstance: {
    id: 'plugins.batchExecutions.dashboard.pauseBatchInstance',
    defaultMessage: 'Pause Batch Instance',
  },
  activateBatchInstance: {
    id: 'plugins.batchExecutions.dashboard.activateBatchInstance',
    defaultMessage: 'Activate Batch Instance',
  },
  planExecutions: {
    id: 'plugins.batchExecutions.dashboard.planExecutions',
    defaultMessage: 'Plan Executions',
  },
  or: {
    id: 'plugins.batchExecutions.form.or',
    defaultMessage: 'Or',
  },
  periodicityTooltip: {
    id: 'plugins.batchExecutions.form.periodicityTooltip',
    defaultMessage:
      'Double click on a dropdown option to automatically select / unselect a periodicity',
  },
});
