import ApiService, { DataResponse } from './ApiService';
import { OTQLResult, QueryPrecisionMode } from '../models/datamart/graphdb/OTQLResult';
import { injectable } from 'inversify';
import {
  QueryResource,
  QueryTranslationRequest,
  QueryTranslationResource,
} from '../models/datamart/DatamartResource';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../models/platformMetrics/QueryExecutionSource';
import { getOTQLSourceHeader } from './OTQLQuerySourceHeaderHelper';

export interface IQueryService {
  getQuery: (datamartId: string, queryId: string) => Promise<DataResponse<QueryResource>>;

  runOTQLQuery: (
    datamartId: string,
    query: string,
    source: QueryExecutionSource,
    subSource: QueryExecutionSubSource,
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

  translateQuery: (
    datamartId: string,
    query: QueryTranslationRequest,
  ) => Promise<DataResponse<QueryTranslationResource>>;
}

@injectable()
export class QueryService implements IQueryService {
  translateQuery(
    datamartId: string,
    query: QueryTranslationRequest,
  ): Promise<DataResponse<QueryTranslationResource>> {
    const endpoint = `datamarts/${datamartId}/query_translations`;
    return ApiService.postRequest(endpoint, query);
  }

  getQuery(datamartId: string, queryId: string): Promise<DataResponse<QueryResource>> {
    const endpoint = `datamarts/${datamartId}/queries/${queryId}`;
    return ApiService.getRequest(endpoint);
  }

  runOTQLQuery(
    datamartId: string,
    query: string,
    source: QueryExecutionSource,
    subSource: QueryExecutionSubSource,
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
      'X-MICS-OTQL-SOURCE': getOTQLSourceHeader(source, subSource),
    }; // to finish
    return ApiService.postRequest(endpoint, query, options, headers);
  }
}
