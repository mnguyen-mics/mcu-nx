import PluginInstanceService from './PluginInstanceService';
import { injectable } from 'inversify';
import { CronStatus, IntegrationBatchResource } from '../models/plugin/plugins';
import {
  DataListResponse,
  StatusCode,
} from '@mediarithmics-private/advanced-components/lib/services/ApiService';
import { PaginatedApiParam } from '../utils/ApiHelper';
// import {
//   ExternalModelName,
//   JobExecutionStatus,
//   PublicJobExecutionResource,
// } from '../models/job/jobs';

export interface BatchInstanceOptions extends PaginatedApiParam {
  group_id?: string;
  artifact_id?: string;
  cronStatus?: CronStatus[];
}

export interface IBatchService extends PluginInstanceService<IntegrationBatchResource> {
  getBatchInstances: (
    organisationId: string,
    options: BatchInstanceOptions,
  ) => Promise<DataListResponse<IntegrationBatchResource>>;
  getAllInstanceFilterProperties: () => Promise<DataListResponse<string>>;
  // getBatchInstanceExecutions: (
  //   batchInstanceId: string,
  // ) => Promise<DataListResponse<PublicJobExecutionResource>>;
}

@injectable()
export class BatchService
  extends PluginInstanceService<IntegrationBatchResource>
  implements IBatchService
{
  constructor() {
    super('integration_batch_instances');
  }

  getBatchInstances(
    organisationId: string,
    options: BatchInstanceOptions = {},
  ): Promise<DataListResponse<IntegrationBatchResource>> {
    const params = {
      organisation_id: organisationId,
      ...options,
    };
    return this.getInstances(params);
  }

  // getBatchInstanceExecutions(
  //   integrationBatchId: string,
  // ): Promise<DataListResponse<PublicJobExecutionResource>> {
  //   // Route does not exist in backend
  //   // Mock to test:
  //   return Promise.resolve({
  //     status: 'ok' as StatusCode,
  //     count: 4,
  //     data: [
  //       {
  //         id: '1',
  //         status: 'SUCCESS' as JobExecutionStatus,
  //         creation_date: 0,
  //         external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
  //       },
  //       {
  //         id: '1',
  //         status: 'FAILED' as JobExecutionStatus,
  //         creation_date: 0,
  //         external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
  //       },
  //       {
  //         id: '1',
  //         status: 'SUCCESS' as JobExecutionStatus,
  //         creation_date: 0,
  //         external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
  //       },
  //       {
  //         id: '1',
  //         status: 'FAILED' as JobExecutionStatus,
  //         creation_date: 0,
  //         external_model_name: 'PUBLIC_DATAMART' as ExternalModelName,
  //       },
  //     ],
  //   });
  // }

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
}
