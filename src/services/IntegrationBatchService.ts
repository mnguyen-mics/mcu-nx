import { injectable } from 'inversify';
import { CronStatus, IntegrationBatchResource } from '../models/plugin/Plugins';
import PluginInstanceService from './PluginInstanceService';
import ApiService, { DataListResponse, DataResponse, StatusCode } from './ApiService';
import { PaginatedApiParam } from '../utils/ApiHelper';
import { PublicJobExecutionResource } from '../models/job/jobs';
import { PluginLayout } from '../models/plugin/PluginLayout';

export interface IntegrationBatchInstanceOptions extends PaginatedApiParam {
  group_id?: string;
  artifact_id?: string;
  cron_status?: CronStatus;
  is_periodic?: boolean;
}

export interface IIntegrationBatchService extends PluginInstanceService<IntegrationBatchResource> {
  getIntegrationBatchInstance: (id: string) => Promise<DataResponse<IntegrationBatchResource>>;
  getIntegrationBatchInstances: (
    organisationId: string,
    options: IntegrationBatchInstanceOptions,
  ) => Promise<DataListResponse<IntegrationBatchResource>>;
  updateIntegrationBatchInstance: (
    id: string,
    instanceResource: Partial<IntegrationBatchResource>,
  ) => Promise<DataResponse<IntegrationBatchResource>>;
  getAllInstanceFilterProperties: () => Promise<DataListResponse<string>>;
  getBatchInstanceExecutions: (
    batchInstanceId: string,
    options: IntegrationBatchInstanceOptions,
  ) => Promise<DataListResponse<PublicJobExecutionResource>>;
  createIntegrationBatchInstanceExecution: (
    instanceId: string,
    executionResource: Partial<PublicJobExecutionResource>,
  ) => Promise<DataResponse<PublicJobExecutionResource>>;
  getBatchInstanceExecutionsForOrganisation: (
    organisationId: string,
    options: PaginatedApiParam,
  ) => Promise<DataListResponse<PublicJobExecutionResource>>;
  getLocalizedPluginLayout(pInstanceId: string): Promise<PluginLayout | null>;
}

@injectable()
export default class IntegrationBatchService
  extends PluginInstanceService<IntegrationBatchResource>
  implements IIntegrationBatchService
{
  constructor() {
    super('integration_batch_instances');
  }

  getIntegrationBatchInstances(
    organisationId: string,
    options: IntegrationBatchInstanceOptions = {},
  ): Promise<DataListResponse<IntegrationBatchResource>> {
    const params = {
      organisation_id: organisationId,
      ...options,
    };
    return this.getInstances(params);
  }

  getIntegrationBatchInstance(id: string): Promise<DataResponse<IntegrationBatchResource>> {
    return this.getInstanceById(id);
  }

  updateIntegrationBatchInstance(
    id: string,
    instanceResource: Partial<IntegrationBatchResource>,
  ): Promise<DataResponse<IntegrationBatchResource>> {
    return this.updatePluginInstance(id, instanceResource);
  }

  getBatchInstanceExecutions(
    integrationBatchId: string,
    options: PaginatedApiParam = {},
  ): Promise<DataListResponse<PublicJobExecutionResource>> {
    const endpoint = `integration_batch_instances/${integrationBatchId}/executions`;

    return ApiService.getRequest(endpoint, options);
  }

  createIntegrationBatchInstanceExecution(
    instanceId: string,
    executionResource: Partial<PublicJobExecutionResource>,
  ): Promise<DataResponse<PublicJobExecutionResource>> {
    const endpoint = `integration_batch_instances/${instanceId}/executions`;

    return ApiService.postRequest(endpoint, executionResource);
  }

  getBatchInstanceExecutionsForOrganisation(
    organisationId: string,
    options: PaginatedApiParam = {},
  ): Promise<DataListResponse<PublicJobExecutionResource>> {
    const endpoint = `integration_batch_instances.executions`;
    const params = {
      organisation_id: organisationId,
      ...options,
    };

    return ApiService.getRequest(endpoint, params);
  }

  getAllInstanceFilterProperties() {
    // Route does not exist in backend
    // Mock to test:
    return Promise.resolve({
      status: 'ok' as StatusCode,
      count: 6,
      data: [
        'com.organisation.batchs',
        'com.mediarithmics.batchs',
        '1.2.3-lts',
        '7.9.9-lts',
        '1.8.0',
        'com.organisation.batchs',
        'com.mediarithmics.batchs',
        '1.2.3-lts',
        '7.9.9-lts',
        '1.8.0',
      ],
    });
  }
  getLocalizedPluginLayout(pInstanceId: string): Promise<PluginLayout | null> {
    return this.getInstanceById(pInstanceId).then(res => {
      const visitAnalyzer = res.data;
      return this._pluginService
        .findPluginFromVersionId(visitAnalyzer.version_id)
        .then(pluginResourceRes => {
          const pluginResource = pluginResourceRes.data;
          return this._pluginService.getLocalizedPluginLayout(
            pluginResource.id,
            visitAnalyzer.version_id,
          );
        });
    });
  }
}
