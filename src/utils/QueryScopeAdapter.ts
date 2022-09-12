import { QueryShape, QueryTranslationRequest } from '../models/datamart/DatamartResource';
import { AbstractScope, SegmentScope } from '../models/datamart/graphdb/Scope';
import { DimensionFilter } from '../models/report/ReportRequestBody';
import { IQueryService } from '../services/QueryService';
import { QueryFragment } from './source/DataSourceHelper';

export class QueryScopeAdapter {
  queryService: IQueryService;

  constructor(queryService: IQueryService) {
    this.queryService = queryService;
  }

  private convertToOtql(datamartId: string, query: QueryShape): Promise<string> {
    const queryTranslationRequest: QueryTranslationRequest = {
      input_query_language: 'JSON_OTQL',
      output_query_language: 'OTQL',
      input_query_language_subtype: query.query_language_subtype,
      input_query_text: query.query_text,
    };
    if (query.query_language === 'JSON_OTQL') {
      return this.queryService.translateQuery(datamartId, queryTranslationRequest).then(res => {
        return res.data.output_query_text;
      });
    } else if (query.query_language === 'OTQL') {
      return Promise.resolve(query.query_text);
    } else {
      return Promise.reject(`Unknown query language ${query.query_language}`);
    }
  }

  private hasWhereClause(text: string) {
    return text.toLowerCase().indexOf('where') > -1;
  }

  private extractOtqlWhereClause(text: string): string {
    const formattedText = text.toLowerCase();
    const wherePosition = formattedText.indexOf('where');
    const whereClause = text.substr(wherePosition + 5, formattedText.length);
    return whereClause;
  }

  private extractOtqlFromClause(text: string): string {
    const formattedText = text.toLowerCase();
    const fromPosition = formattedText.indexOf('from');
    const wherePosition = formattedText.indexOf('where');
    const fromClause = text.substr(
      fromPosition + 4,
      wherePosition === -1 ? formattedText.length : wherePosition,
    );
    return fromClause;
  }

  buildScopeAnalyticsQuery(
    datamartId: string,
    scope?: AbstractScope,
  ): Promise<DimensionFilter | undefined> {
    if (!scope) return Promise.resolve(undefined);

    if (scope.type === 'SEGMENT') {
      const segmentScope = scope as SegmentScope;
      return Promise.resolve({
        dimension_name: 'segment_id',
        expressions: [segmentScope.segmentId],
        operator: 'EXACT',
      });
    } else {
      return Promise.reject('Unhandled scope type for analytics query');
    }
  }

  buildScopeOtqlQuery(datamartId: string, scope?: AbstractScope): Promise<string | undefined> {
    if (scope && scope.query) return this.convertToOtql(datamartId, scope.query);
    else return new Promise(resolve => resolve(undefined));
  }

  private appendAdditionalQuery(query: string, additionalQuery?: string) {
    if (!additionalQuery) return query;
    if (this.hasWhereClause(query)) {
      return `${query} AND ${additionalQuery}`;
    } else {
      return `${query} WHERE ${additionalQuery}`;
    }
  }

  private appendJoinClause(query: string, scope?: AbstractScope) {
    if (scope && scope.type === 'SEGMENT') {
      const segmentScope = scope as SegmentScope;
      return `${query} JOIN UserSegment WHERE id = "${segmentScope.segmentId}"`;
    } else return query;
  }

  scopeQueryWithWhereClause(
    datamartId: string,
    queryFragment: QueryFragment,
    dashboardQuery: QueryShape,
    scope?: AbstractScope,
  ): Promise<string> {
    const dashboardOtqlQueryPromise = this.convertToOtql(datamartId, dashboardQuery);
    const sourceOtqlQueryPromise: Promise<string | undefined> = this.buildScopeOtqlQuery(
      datamartId,
      scope,
    );
    return Promise.all([dashboardOtqlQueryPromise, sourceOtqlQueryPromise]).then(
      ([dashboardOtqlQuery, sourceOtqlQuery]) => {
        const additionalQuery =
          sourceOtqlQuery && this.hasWhereClause(sourceOtqlQuery)
            ? this.extractOtqlWhereClause(sourceOtqlQuery)
            : undefined;
        let scopedQuery = this.appendAdditionalQuery(dashboardOtqlQuery, additionalQuery);

        if (Object.keys(queryFragment).length > 0) {
          for (const [key, value] of Object.entries(queryFragment)) {
            if (key && value.length > 0) {
              value.forEach(f => {
                const matchingStartingObjectType = this.extractOtqlFromClause(scopedQuery).indexOf(
                  f.starting_object_type,
                );
                if (matchingStartingObjectType !== -1) {
                  scopedQuery = this.appendAdditionalQuery(scopedQuery, f.fragment as string);
                }
              });
            }
          }
        }
        scopedQuery = this.appendJoinClause(scopedQuery, scope);
        return scopedQuery;
      },
    );
  }
}
