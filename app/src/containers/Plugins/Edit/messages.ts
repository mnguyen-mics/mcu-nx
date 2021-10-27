import { defineMessages } from 'react-intl';

export default defineMessages({
  pluginType: {
    id: 'plugin.type',
    defaultMessage: 'Plugins type',
  },
  integrationBatchType: {
    id: 'plugin.integrationBatch.type',
    defaultMessage: 'INTEGRATION_BATCH',
  },
  organisation: {
    id: 'plugin.integrationBatch.edit.organisation',
    defaultMessage: 'Organisation',
  },
  organisationDescription: {
    id: 'plugin.integrationBatch.edit.organisationDescription',
    defaultMessage:
      'The plugin will be available in the selected organisation and all its sub-organisations. Use organisation 100 to make the plugin available for all organisations.',
  },
  groupId: {
    id: 'plugin.integrationBatch.edit.groupId',
    defaultMessage: 'Group Id',
  },
  groupIdDescription: {
    id: 'plugin.integrationBatch.edit.groupIdDescription',
    defaultMessage: 'Used to group plugins, usually by customer and type.',
  },
  groupIdSample: {
    id: 'plugin.integrationBatch.edit.groupIdSample',
    defaultMessage:
      'Sample : com.mycustomer.batches for a plugin specific to mycustomer, and com.mediarithmic.batches for a shared plugin.',
  },
  artifactId: {
    id: 'plugin.integrationBatch.edit.artifactId',
    defaultMessage: 'Artifact Id',
  },
  artifactIdDescription: {
    id: 'plugin.integrationBatch.edit.artifactIdDescription',
    defaultMessage: 'Unique identifier for your plugin. Don’t repeat the group Id.',
  },
});
