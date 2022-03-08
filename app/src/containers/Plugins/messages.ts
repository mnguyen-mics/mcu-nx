import { defineMessages } from 'react-intl';

export default defineMessages({
  plugins: {
    id: 'plugins.title',
    defaultMessage: 'Plugins',
  },
  pluginsOverview: {
    id: 'plugins.overview.title',
    defaultMessage: 'Overview',
  },
  pluginBatchDefinitions: {
    id: 'plugins.batchDefinitions.title',
    defaultMessage: 'Batch Definitions',
  },
  newPlugin: {
    id: 'plugins.list.actionBar.newPlugin',
    defaultMessage: 'New Plugin',
  },
  pluginId: {
    id: 'plugins.list.pluginId',
    defaultMessage: 'Id',
  },
  name: {
    id: 'plugins.list.name',
    defaultMessage: 'Name',
  },
  type: {
    id: 'plugins.list.type',
    defaultMessage: 'Type',
  },
  technicalName: {
    id: 'plugins.list.technicalName',
    defaultMessage: 'Technical Name',
  },
  edit: {
    id: 'plugins.list.edit',
    defaultMessage: 'Edit',
  },
  pluginType: {
    id: 'plugins.list.pluginType',
    defaultMessage: 'Plugin Type',
  },
  organisation: {
    id: 'plugins.list.column.organisation',
    defaultMessage: 'Organisation',
  },
  group: {
    id: 'plugins.list.column.group',
    defaultMessage: 'Group',
  },
  versionValue: {
    id: 'plugins.batchDefinitions.list.column.version_value',
    defaultMessage: 'Version Value',
  },
  buildTag: {
    id: 'plugins.list.column.build_tag',
    defaultMessage: 'Build Tag',
  },
  imageName: {
    id: 'plugins.batchDefinitions.list.column.image_name',
    defaultMessage: 'Image Name',
  },
  artifactId: {
    id: 'plugins.list.column.artifactId',
    defaultMessage: 'Artifact Id',
  },
  currentVersion: {
    id: 'plugins.list.column.currentVersion',
    defaultMessage: 'Current Version',
  },
  lastVersion: {
    id: 'plugins.list.column.lastVersion',
    defaultMessage: 'Last Version',
  },
  current: {
    id: 'plugins.list.column.current',
    defaultMessage: 'Current',
  },
  emptyTableMessage: {
    id: 'plugins.list.emptyTable',
    defaultMessage: 'No plugin found.',
  },
  emptyVersionMessage: {
    id: 'plugins.tab.emptyVersion',
    defaultMessage: 'No plugin version found.',
  },
  deployment: {
    id: 'plugins.tab.deployment',
    defaultMessage: 'Deployment',
  },
  deploymentRunningContainer: {
    id: 'plugins.tab.deployment.list.runningContainer',
    defaultMessage: 'Running Container',
  },
  deploymentRunningContainerName: {
    id: 'plugins.tab.deployment.list.name',
    defaultMessage: 'Name',
  },
  deploymentEmptyTable: {
    id: 'plugins.tab.deployment.list.emptyTable',
    defaultMessage: 'No container found.',
  },
  deploymentDeployModalTitle: {
    id: 'plugins.tab.deployment.deployModal.title',
    defaultMessage: 'Deploy plugin containers in version ',
  },
  deploymentDeployModalButton: {
    id: 'plugins.tab.deployment.deployModal.deployContainer',
    defaultMessage: 'Deploy containers',
  },
  deploymentDeployModalSuccess: {
    id: 'plugins.tab.deployment.deployModal.success',
    defaultMessage: 'Your plugin has been successfully deployed!',
  },
  deploymentUpgradeModalTitle: {
    id: 'plugins.tab.deployment.UpgradeModal.title',
    defaultMessage: 'Upgrade plugin containers in version ',
  },
  deploymentUpgradeModalButton: {
    id: 'plugins.tab.deployment.UpgradeModal.UpgradeContainer',
    defaultMessage: 'Upgrade containers',
  },
  deploymentUpgradeModalSuccess: {
    id: 'plugins.tab.deployment.UpgradeModal.success',
    defaultMessage: 'Your plugin has been successfully upgraded!',
  },
  deploymentTargetBuildTag: {
    id: 'plugins.tab.deployment.tagetBuildTag',
    defaultMessage: 'Please enter the build tag to use :',
  },
  deploymentMaintainerId: {
    id: 'plugins.tab.deployment.maintainerId',
    defaultMessage: 'You can provide a maintainer id (optional) :',
  },
  pluginEditDrawerTitle: {
    id: 'plugins.batchEditDrawer.title',
    defaultMessage: 'Plugins > New plugin',
  },
  image: {
    id: 'plugins.batchDefinitions.dashboard.versionTable.image',
    defaultMessage: 'Image',
  },
  instances: {
    id: 'plugins.batchDefinitions.dashboard.versionTable.instances',
    defaultMessage: 'Instances',
  },
  executions: {
    id: 'plugins.batchDefinitions.dashboard.versionTable.executions',
    defaultMessage: 'Executions',
  },
  newVersion: {
    id: 'plugins.batchDefinitions.dashboard.actionBar.newVersion',
    defaultMessage: 'New version',
  },
  backToPlugins: {
    id: 'plugins.batchDefinitions.dashboard.actionBar.backToPlugins',
    defaultMessage: 'Back To Plugins',
  },
  for: {
    id: 'plugins.batchDefinitions.dashboard.title.for',
    defaultMessage: 'for',
  },
  activeInstances: {
    id: 'plugins.batchDefinitions.dashboard.versionTable.activeInstances',
    defaultMessage: 'active instance(s)',
  },
  noProperties: {
    id: 'plugins.tab.properies.noProperties',
    defaultMessage: 'There is no property for this plugin version.',
  },
  properties: {
    id: 'plugins.tab.properies.title',
    defaultMessage: 'Properties',
  },
  pluginPageTitle: {
    id: 'plugins.title.sentence',
    defaultMessage: 'New instances are created on version ',
  },
  technicalConfiguration: {
    id: 'plugins.tab.technicalConfiguration',
    defaultMessage: 'Technical configuration',
  },
  addFileButton: {
    id: 'plugins.tab.addFileButton',
    defaultMessage: 'Add a technical configuration',
  },
  addLayoutButton: {
    id: 'plugins.tab.addLayoutFileButton',
    defaultMessage: 'Add a properties layout',
  },
  layout: {
    id: 'plugins.tab.layout.title',
    defaultMessage: 'Layout',
  },
  layoutEmptyTable: {
    id: 'plugins.tab.layout.emptyTable',
    defaultMessage: "You don't have any properties layout yet",
  },
  save: {
    id: 'plugins.tab.technicalConfiguration.save',
    defaultMessage: 'Save',
  },
  saveSuccess: {
    id: 'plugins.tab.technicalConfiguration.save.success',
    defaultMessage: 'Your configuration file has been successfully saved',
  },
  technicalConfigurationEmptyTable: {
    id: 'plugins.tab.technicalConfiguration.empty',
    defaultMessage: "You don't have any configuration file yet",
  },
  saveLayoutSuccess: {
    id: 'plugins.tab.propertiesLayout.saveSuccess',
    defaultMessage: 'Your property layout file has been successfully saved',
  },
  locale: {
    id: 'plugins.tab.propertiesLayout.locale',
    defaultMessage: 'Locale',
  },
  saveLayout: {
    id: 'plugins.tab.propertiesLayout.saveLayout',
    defaultMessage: 'Save',
  },
});
