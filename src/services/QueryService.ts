import ApiService, { DataResponse } from './ApiService';
import { OTQLResult, QueryPrecisionMode } from '../models/datamart/graphdb/OTQLResult';
import { injectable } from 'inversify';
import { QueryResource } from '../models/datamart/DatamartResource';

export interface IQueryService {
  getQuery: (datamartId: string, queryId: string) => Promise<DataResponse<QueryResource>>;

  runOTQLQuery: (
    datamartId: string,
    query: string,
    options?: {
      index_name?: string;
      query_id?: string;
      limit?: number;
      offset?: number;
      graphql_select?: boolean;
      use_cache?: boolean;
      precision?: QueryPrecisionMode;
      content_type?: string;
    },
  ) => Promise<DataResponse<OTQLResult>>;
}

@injectable()
export class QueryService implements IQueryService {
  getQuery(datamartId: string, queryId: string): Promise<DataResponse<QueryResource>> {
    const endpoint = `datamarts/${datamartId}/queries/${queryId}`;
    return ApiService.getRequest(endpoint);
  }
  runOTQLQuery(
    datamartId: string,
    query: string,
    options: {
      index_name?: string;
      query_id?: string;
      limit?: number;
      offset?: number;
      graphql_select?: boolean;
      use_cache?: boolean;
      precision?: QueryPrecisionMode;
      content_type?: string;
    } = {},
  ): Promise<DataResponse<OTQLResult>> {
    const endpoint = `datamarts/${datamartId}/query_executions/otql`;

    const headers = {
      'Content-Type': `${
        options.content_type ? options.content_type : 'text/plain; charset=utf-8'
      }`,
    }; // to finish
    return ApiService.postRequest(endpoint, query, options, headers);
  }
}
