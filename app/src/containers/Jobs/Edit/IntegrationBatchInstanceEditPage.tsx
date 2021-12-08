import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import messages from '../messages';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  withValidators,
  IntegrationBatchResource,
  GenericPluginContent,
  lazyInject,
  TYPES,
  IIntegrationBatchService,
} from '@mediarithmics-private/advanced-components';
import { PluginContentOuterProps } from '@mediarithmics-private/advanced-components/lib/components/plugin-form/Edit/GenericPluginContent';
import { FieldValidatorsProps } from '@mediarithmics-private/advanced-components/lib/components/form/withValidators';
import {
  PluginInstance,
  PluginProperty,
  PluginResource,
} from '@mediarithmics-private/advanced-components/lib/models/plugin/Plugins';

const IntegrationBatchFormPage = GenericPluginContent as React.ComponentClass<
  PluginContentOuterProps<IntegrationBatchResource>
>;

export interface IntegrationBatchInstanceEditPageProps {
  onClose: () => void;
}

export interface BatchInstanceRouteParams {
  organisationId: string;
  batchInstanceId?: string;
}

type Props = IntegrationBatchInstanceEditPageProps &
  RouteComponentProps<BatchInstanceRouteParams> &
  FieldValidatorsProps &
  InjectedIntlProps;

class IntegrationBatchInstanceEditPage extends React.Component<Props> {
  @lazyInject(TYPES.IIntegrationBatchService)
  private _integrationBatchService: IIntegrationBatchService;

  onSaveOrCreatePluginInstance = (
    pluginInstance: IntegrationBatchResource,
    properties: PluginProperty[],
  ) => {
    const {
      match: {
        params: { organisationId },
      },
      history,
      onClose,
    } = this.props;
    history.push(`/o/${organisationId}/jobs/integration_batch_instances/${pluginInstance.id}`);
    onClose();
  };

  createPluginInstance = (
    organisationId: string,
    plugin: PluginResource,
    pluginInstance: IntegrationBatchResource,
  ): PluginInstance => {
    const result: Omit<IntegrationBatchResource, 'id'> = {
      version_id: pluginInstance.version_id,
      version_value: pluginInstance.version_value,
      artifact_id: plugin.artifact_id,
      group_id: plugin.group_id,
      organisation_id: organisationId,
      name: pluginInstance.name,
      creation_ts: pluginInstance.creation_ts,
      created_by: pluginInstance.created_by,
      last_modified_by: pluginInstance.last_modified_by,
      last_modified_ts: pluginInstance.last_modified_ts,
      archived: pluginInstance.archived,
      cron: pluginInstance.cron,
      cron_status: pluginInstance.cron_status,
    };
    return result;
  };
  render() {
    const {
      intl: { formatMessage },
      match: {
        params: { batchInstanceId },
      },
      onClose,
    } = this.props;

    const breadcrumbPaths = (integrationBatchInstance?: IntegrationBatchResource) => [
      formatMessage(messages.jobBatchInstances),
      integrationBatchInstance
        ? formatMessage(messages.editBatchInstance, {
            name: integrationBatchInstance.name,
          })
        : formatMessage(messages.newBatchInstance),
    ];

    return (
      <IntegrationBatchFormPage
        pluginType={'INTEGRATION_BATCH'}
        listTitle={messages.jobBatchInstances}
        listSubTitle={messages.newBatchInstance}
        breadcrumbPaths={breadcrumbPaths}
        pluginInstanceService={this._integrationBatchService}
        pluginInstanceId={batchInstanceId}
        createPluginInstance={this.createPluginInstance}
        onSaveOrCreatePluginInstance={this.onSaveOrCreatePluginInstance}
        onClose={onClose}
      />
    );
  }
}

export default compose<Props, IntegrationBatchInstanceEditPageProps>(
  withRouter,
  injectIntl,
  withValidators,
)(IntegrationBatchInstanceEditPage);
