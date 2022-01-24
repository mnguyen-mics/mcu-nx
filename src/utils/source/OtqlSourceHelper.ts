import { QueryFragment } from '../../components/chart-engine/Chart';
import { QueryLanguage, QueryShape } from '../../models/datamart/DatamartResource';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import { OTQLSource } from '../../services/ChartDatasetService';
import { QueryService } from '../../services/QueryService';
import { QueryScopeAdapter } from '../QueryScopeAdapter';

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
    return queryService.getQuery(datamartId, otqlSource.query_id).then(res => res.data);
  } else {
    return Promise.reject('No query defined for otql type source');
  }
}

export function fetchAndFormatQuery(
  queryService: QueryService,
  queryScopeAdapter: QueryScopeAdapter,
  datamartId: string,
  otqlSource: OTQLSource,
  scope?: AbstractScope,
  queryFragment?: QueryFragment,
): Promise<string> {
  const otqlScope = queryScopeAdapter.buildScopeOtqlQuery(datamartId, scope);
  return fetchOtqlQuery(queryService, datamartId, otqlSource).then(dashboardQueryResource => {
    return queryScopeAdapter.scopeQueryWithWhereClause(
      datamartId,
      queryFragment || {},
      dashboardQueryResource,
      otqlScope,
    );
  });
}
