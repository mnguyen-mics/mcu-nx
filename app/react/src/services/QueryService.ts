import ApiService, { DataResponse } from './ApiService';
import { QueryResource } from '../models/datamart/DatamartResource';

const queryService = {
  getQuery(datamartId: string, queryId: string): Promise<DataResponse<QueryResource>> {
    const endpoint = `datamarts/${datamartId}/queries/${queryId}`;
    return ApiService.getRequest(endpoint);
  },
  createQuery(datamartId: string, queryId: string, query: Partial<QueryResource>): Promise<DataResponse<QueryResource>> {
    const endpoint = `datamarts/${datamartId}/queries/${queryId}`;
    return ApiService.postRequest(endpoint, query);
  },
  updateQuery(datamartId: string, queryId: string, query: Partial<QueryResource>): Promise<DataResponse<QueryResource>> {
    const endpoint = `datamarts/${datamartId}/queries/${queryId}`;
    return ApiService.postRequest(endpoint, query);
  },
};

export default queryService;
