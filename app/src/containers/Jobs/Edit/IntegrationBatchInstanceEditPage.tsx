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
  SpecificFieldsFunction,
  FormFieldWrapper,
  FormRadioGroupField,
  FormRadioGroup,
} from '@mediarithmics-private/advanced-components';
import { PluginContentOuterProps } from '@mediarithmics-private/advanced-components/lib/components/plugin-form/Edit/GenericPluginContent';
import { FieldValidatorsProps } from '@mediarithmics-private/advanced-components/lib/components/form/withValidators';
import {
  PluginInstance,
  PluginProperty,
  PluginResource,
} from '@mediarithmics-private/advanced-components/lib/models/plugin/Plugins';
import { Divider } from 'antd';

const IntegrationBatchFormPage = GenericPluginContent as React.ComponentClass<
  PluginContentOuterProps<IntegrationBatchResource>
>;

export interface IntegrationBatchInstanceEditPageProps {
  onClose: () => void;
  integrationBatchInstanceId?: string;
}

export interface BatchInstanceRouteParams {
  organisationId: string;
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
      execution_container_cpu_size: pluginInstance.execution_container_cpu_size,
      execution_container_ram_size: pluginInstance.execution_container_ram_size,
      execution_container_disk_size: pluginInstance.execution_container_disk_size,
      cron_status: pluginInstance.cron_status,
    };
    return result;
  };

  renderSpecificFields: SpecificFieldsFunction = (
    disabled: boolean,
    fieldNamePrefix: string,
    formChange?: (fieldName: string, value: string) => void,
  ) => {
    const {
      integrationBatchInstanceId,
      intl: { formatMessage },
    } = this.props;

    const fieldGridConfig = {
      labelCol: { span: 3 },
      wrapperCol: { span: 15, offset: 1 },
    };

    const radioElements = [
      {
        id: 'LOW',
        value: 'LOW',
        title: formatMessage(messages.executionContainerResourceSizeLow),
      },
      {
        id: 'MEDIUM',
        value: 'MEDIUM',
        title: formatMessage(messages.executionContainerResourceSizeMedium),
      },
      {
        id: 'LARGE',
        value: 'LARGE',
        title: formatMessage(messages.executionContainerResourceSizeLarge),
      },
      {
        id: 'XL',
        value: 'XL',
        title: formatMessage(messages.executionContainerResourceSizeExtraLarge),
      },
    ];

    const cpuFieldName = `${fieldNamePrefix}.execution_container_cpu_size`;
    const ramFieldName = `${fieldNamePrefix}.execution_container_ram_size`;
    const diskFieldName = `${fieldNamePrefix}.execution_container_disk_size`;

    if (!integrationBatchInstanceId && formChange) {
      formChange(cpuFieldName, 'LOW');
      formChange(ramFieldName, 'LOW');
      formChange(diskFieldName, 'LOW');
    }

    return (
      <div>
        <Divider />
        <div className='ant-row ant-row-space-between ant-row-middle section-header'>
          <div className='title-container'>
            <div className='title'>
              <span className=''>Technical Configuration</span>
            </div>
          </div>
        </div>
        <div>
          <FormFieldWrapper
            label={formatMessage(messages.cpuSize)}
            helpToolTipProps={{
              title: formatMessage(messages.cpuSizeTooltipMsg),
            }}
            {...fieldGridConfig}
          >
            <FormRadioGroupField
              groupClassName='mcs-cpuSize'
              name={cpuFieldName}
              component={FormRadioGroup}
              elements={radioElements}
            />
          </FormFieldWrapper>
          <FormFieldWrapper
            label={formatMessage(messages.ramSize)}
            helpToolTipProps={{
              title: formatMessage(messages.ramSizeTooltipMsg),
            }}
            {...fieldGridConfig}
          >
            <FormRadioGroupField
              groupClassName='mcs-ramSize'
              name={ramFieldName}
              component={FormRadioGroup}
              elements={radioElements}
            />
          </FormFieldWrapper>
          <FormFieldWrapper
            label={formatMessage(messages.diskSize)}
            helpToolTipProps={{
              title: formatMessage(messages.diskSizeTooltipMsg),
            }}
            {...fieldGridConfig}
          >
            <FormRadioGroupField
              groupClassName='mcs-diskSize'
              name={diskFieldName}
              component={FormRadioGroup}
              elements={radioElements}
            />
          </FormFieldWrapper>
        </div>
      </div>
    );
  };

  render() {
    const {
      intl: { formatMessage },
      integrationBatchInstanceId,
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
        pluginInstanceId={integrationBatchInstanceId}
        createPluginInstance={this.createPluginInstance}
        onSaveOrCreatePluginInstance={this.onSaveOrCreatePluginInstance}
        onClose={onClose}
        renderSpecificFields={this.renderSpecificFields}
      />
    );
  }
}

export default compose<Props, IntegrationBatchInstanceEditPageProps>(
  withRouter,
  injectIntl,
  withValidators,
)(IntegrationBatchInstanceEditPage);
