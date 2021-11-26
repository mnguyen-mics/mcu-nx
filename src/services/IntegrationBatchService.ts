import { injectable } from 'inversify';
import { CronStatus, IntegrationBatchResource } from '../models/plugin/Plugins';
import PluginInstanceService from './PluginInstanceService';
import ApiService, { DataListResponse, DataResponse, StatusCode } from './ApiService';
import { PaginatedApiParam } from '../utils/ApiHelper';
import {
  // ExternalModelName,
  // JobExecutionPublicStatus,
  PublicJobExecutionResource,
} from '../models/job/jobs';
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
  getAllInstanceFilterProperties: () => Promise<DataListResponse<string>>;
  getBatchInstanceExecutions: (
    batchInstanceId: string,
    options: IntegrationBatchInstanceOptions,
  ) => Promise<DataListResponse<PublicJobExecutionResource>>;
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
    const endpoint = `integration_batch_instances/${id}`;
    return ApiService.getRequest(endpoint);
  }

  getBatchInstanceExecutions(
    integrationBatchId: string,
  ): Promise<DataListResponse<PublicJobExecutionResource>> {
    return Promise.resolve({
      status: 'ok' as StatusCode,
      count: 0,
      data: [],
    });

    // const endpoint = `integration_batch_instances/${integrationBatchId}/executions`;
    // return ApiService.getRequest(endpoint);

    // Route does not exist in backend
    // Mock to test:
    // return Promise.resolve({
    //   status: 'ok' as StatusCode,
    //   count: 3,
    //   data: [
    //     {
    //       id: '1',
    //       status: 'SUCCEEDED' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       start_date: 1637085198120,
    //       duration: 176500000,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //     {
    //       id: '2',
    //       status: 'FAILED' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       start_date: 1637091181000,
    //       duration: 9999,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //     {
    //       id: '3',
    //       status: 'CANCELED' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       start_date: 1637086188452,
    //       duration: 123,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //     {
    //       id: '4',
    //       status: 'PENDING' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //     {
    //       id: '5',
    //       status: 'RUNNING' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       start_date: 1637087188452,
    //       duration: 107613,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //   ],
    // });
  }

  getBatchInstanceExecutionsForOrganisation(
    organisationId: string,
    options: PaginatedApiParam,
  ): Promise<DataListResponse<PublicJobExecutionResource>> {
    return Promise.resolve({
      status: 'ok' as StatusCode,
      count: 0,
      data: [],
    });

    // const params = {
    //   organisation_id : organisationId,
    //   ...options,
    // };

    // const endpoint = `integration_batch_instances.executions`;
    // return ApiService.getRequest(endpoint, params);

    // Route does not exist in backend
    // Mock to test:
    // return Promise.resolve({
    //   status: 'ok' as StatusCode,
    //   count: 5,
    //   data: [
    //     {
    //       id: '1',
    //       status: 'SUCCEEDED' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       start_date: 1637085198120,
    //       duration: 176500000,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //     {
    //       id: '2',
    //       status: 'FAILED' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       start_date: 1637091181000,
    //       duration: 9999,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //     {
    //       id: '3',
    //       status: 'CANCELED' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       start_date: 1637086188452,
    //       duration: 123,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //     {
    //       id: '4',
    //       status: 'PENDING' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //     {
    //       id: '5',
    //       status: 'RUNNING' as JobExecutionPublicStatus,
    //       creation_date: 0,
    //       start_date: 1637087188452,
    //       duration: 107613,
    //       external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
    //     },
    //   ],
    // });
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
