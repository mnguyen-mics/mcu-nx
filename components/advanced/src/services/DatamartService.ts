import ApiService, { DataListResponse, DataResponse } from './ApiService';
import { DatamartResource } from '../models/datamart/DatamartResource';
import { injectable } from 'inversify';

export interface IDatamartService {
  getDatamarts: (
    organisationId: string,
    options?: object,
  ) => Promise<DataListResponse<DatamartResource>>;

  getDatamart: (datamartId: string) => Promise<DataResponse<DatamartResource>>;
}

@injectable()
export default class DatamartService implements IDatamartService {
  getDatamarts(
    organisationId: string,
    options: object = {},
  ): Promise<DataListResponse<DatamartResource>> {
    const endpoint = 'datamarts';

    const params = {
      organisation_id: organisationId,
      allow_administrator: false,
      ...options,
    };

    return ApiService.getRequest(endpoint, params);
  }

  getDatamart(datamartId: string): Promise<DataResponse<DatamartResource>> {
    const endpoint = `datamarts/${datamartId}`;
    return ApiService.getRequest(endpoint);
  }
}
