import { QueryLanguage, QueryResource, QueryShape } from '../../models/datamart/DatamartResource';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import { QueryService, IQueryService } from '../../services/QueryService';
import { QueryScopeAdapter } from '../QueryScopeAdapter';
import { DashboardFilterQueryFragments } from '../../models/customDashboards/customDashboards';
import {
  ActivitiesAnalyticsDimension,
  ActivitiesAnalyticsMetric,
} from '../analytics/ActivitiesAnalyticsReportHelper';
import {
  AbstractSource,
  AggregationSource,
  AnalyticsSource,
  OTQLSource,
} from '../../models/dashboards/dataset/datasource_tree';
import { SourceType } from '../../models/dashboards/dataset/common';

const mapOtqlQueries: Map<string, QueryResource> = new Map();

export function fetchOtqlQuery(
  queryService: QueryService,
  datamartId: string,
  otqlSource: OTQLSource,
): Promise<QueryShape> {
  if (otqlSource.query_text) {
    const resource = {
      datamart_id: datamartId,
      query_text: otqlSource.query_text,
      query_language: 'OTQL' as QueryLanguage,
    };
    return Promise.resolve(resource);
  } else if (otqlSource.query_id) {
    const cachedOtqlQuery = mapOtqlQueries.get(otqlSource.query_id);
    if (cachedOtqlQuery) return Promise.resolve(cachedOtqlQuery);
    else
      return queryService.getQuery(datamartId, otqlSource.query_id).then(res => {
        if (otqlSource.query_id) mapOtqlQueries.set(otqlSource.query_id, res.data);
        return res.data;
      });
  } else {
    return Promise.reject('No query defined for otql type source');
  }
}
export interface QueryInfo {
  queryId?: string;
  queryType: SourceType;
  queryText: string;
}

export function fetchAndFormatQuery(
  queryService: QueryService,
  queryScopeAdapter: QueryScopeAdapter,
  datamartId: string,
  otqlSource: OTQLSource,
  scope?: AbstractScope,
  queryFragment?: QueryFragment,
): Promise<QueryInfo> {
  return fetchOtqlQuery(queryService, datamartId, otqlSource).then(dashboardQueryResource => {
    return queryScopeAdapter
      .scopeQueryWithWhereClause(datamartId, queryFragment || {}, dashboardQueryResource, scope)
      .then(adaptedQueryText => {
        return {
          queryId: otqlSource.query_id ? otqlSource.query_id : '0',
          queryText: adaptedQueryText,
          queryType: otqlSource.type,
        };
      });
  });
}

export interface QueryFragment {
  [key: string]: DashboardFilterQueryFragments[];
}

export async function extractQueriesHelper(
  source: AbstractSource,
  datamartId: string,
  queryService: IQueryService,
  scopeAdapter: QueryScopeAdapter,
  scope?: AbstractScope,
  queryFragment?: QueryFragment,
): Promise<QueryInfo[]> {
  switch (source.type.toLocaleLowerCase()) {
    case 'ratio':
    case 'join':
    case 'to-list':
    case 'index':
    case 'format-dates':
    case 'to-percentages':
    case 'reduce':
      const joinSource = source as AggregationSource;
      const childSources = joinSource.sources.map(_source =>
        extractQueriesHelper(_source, datamartId, queryService, scopeAdapter, scope, queryFragment),
      );
      return Promise.all(childSources).then(results => {
        return results.reduce((acc: QueryInfo[], x: QueryInfo[]) => {
          return x.concat(acc);
        }, []);
      });
    case 'otql':
      const otqlSource = source as OTQLSource;
      const _datamartId = otqlSource.datamart_id || datamartId;
      const scopedQueryInfo = await fetchAndFormatQuery(
        queryService,
        scopeAdapter,
        _datamartId,
        otqlSource,
        scope,
        queryFragment,
      );
      return scopedQueryInfo ? [scopedQueryInfo] : [];
    case 'activities_analytics':
    case 'collection_volumes':
    case 'resources_usage':
      const analyticsSource = source as AnalyticsSource<
        ActivitiesAnalyticsMetric,
        ActivitiesAnalyticsDimension
      >;
      const queryJson = analyticsSource.query_json;
      return [
        {
          queryText: JSON.stringify(queryJson, null, 2),
          queryType: analyticsSource.type,
        },
      ];
    default:
      return [];
  }
}
