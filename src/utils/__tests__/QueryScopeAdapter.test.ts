import {
  QueryResource,
  QueryTranslationRequest,
  QueryTranslationResource,
} from '../../models/datamart/DatamartResource';
import { OTQLResult, QueryPrecisionMode } from '../../models/datamart/graphdb/OTQLResult';
import { SegmentScope } from '../../models/datamart/graphdb/Scope';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';
import { DataResponse } from '../../services/ApiService';
import { IQueryService } from '../../services/QueryService';
import { QueryScopeAdapter } from '../QueryScopeAdapter';
import { QueryFragment } from '../source/DataSourceHelper';

const WHERE_CLAUSE1 = 'activity_events { app_id = 1 }';
const JOIN_CLAUSE = 'UserSegment WHERE id = "123"';
const QUERY1 = `select {id} from UserPoint where ${WHERE_CLAUSE1}`;

class QueryServiceMock implements IQueryService {
  getQuery(datamartId: string, queryId: string): Promise<DataResponse<QueryResource>> {
    return Promise.reject('Not implemented');
  }

  runOTQLQuery(
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
  ): Promise<DataResponse<OTQLResult>> {
    return Promise.reject('Not implemented');
  }

  private printExpression(exp: any) {
    if (exp.type === 'OBJECT') {
      const printedExpressions = exp.expressions
        .map((e: any) => this.printExpression(e))
        .join(` ${exp.boolean_operator} `);
      return `${exp.field} { ${printedExpressions} }`;
    } else if (exp.type === 'FIELD') {
      return `${exp.field} = ${exp.comparison.values[0]}`;
    } else if (exp.type === 'GROUP') {
      return exp.expressions
        .map((e: any) => this.printExpression(e))
        .join(` ${exp.boolean_operator} `);
    }
  }

  /**
   * A non exhaustive json otql to otql converter for the sake of testing
   * @param doc
   */
  private print(doc: any): string {
    return `select {id} from ${doc.from} where ${this.printExpression(doc.where)}`;
  }

  private formatResponse<T>(data: T): DataResponse<T> {
    const result: any = {
      data: data,
    };
    return result;
  }

  translateQuery(
    datamartId: string,
    query: QueryTranslationRequest,
  ): Promise<DataResponse<QueryTranslationResource>> {
    let result: any;
    if (query.input_query_language === 'JSON_OTQL') {
      result = {
        output_query_text: this.print(JSON.parse(query.input_query_text)),
      };
    }
    return Promise.resolve(this.formatResponse(result));
  }
}

test('test the query is correctly scoped', cb => {
  const queryServiceMock = new QueryServiceMock();
  const adapter = new QueryScopeAdapter(queryServiceMock);
  const queryResource1: QueryResource = {
    id: 'xxx',
    datamart_id: 'xxx',
    query_text: QUERY1,
    query_language: 'OTQL',
  };
  const scope: SegmentScope = {
    type: 'SEGMENT',
    segmentId: '123',
  };
  const resultQueryPromise = adapter.scopeQueryWithWhereClause('123', {}, queryResource1, scope);
  resultQueryPromise.then(query => {
    expect(query).toBe(`select {id} from UserPoint where ${WHERE_CLAUSE1} JOIN ${JOIN_CLAUSE}`);
    cb();
  });
});

test('test the query is correctly non scoped', cb => {
  const queryServiceMock = new QueryServiceMock();
  const adapter = new QueryScopeAdapter(queryServiceMock);
  const queryResource1: QueryResource = {
    id: 'xxx',
    datamart_id: 'xxx',
    query_text: QUERY1,
    query_language: 'OTQL',
  };
  const resultQueryPromise = adapter.scopeQueryWithWhereClause(
    '123',
    {},
    queryResource1,
    undefined,
  );
  resultQueryPromise.then(query => {
    expect(query).toBe(`select {id} from UserPoint where ${WHERE_CLAUSE1}`);
    cb();
  });
});

test('test the query is correctly formatted with query fragment', cb => {
  const queryServiceMock = new QueryServiceMock();
  const adapter = new QueryScopeAdapter(queryServiceMock);
  const queryResource1: QueryResource = {
    id: 'xxx',
    datamart_id: 'xxx',
    query_text: QUERY1,
    query_language: 'OTQL',
  };
  const scope: SegmentScope = {
    type: 'SEGMENT',
    segmentId: '123',
  };

  const queryFragment: QueryFragment = {
    compartments: [
      {
        type: 'otql',
        starting_object_type: 'UserPoint',
        fragment: 'profiles {compartment_id IN ["1234"]}',
      },
    ],
  };
  const resultQueryPromise = adapter.scopeQueryWithWhereClause(
    '123',
    queryFragment,
    queryResource1,
    scope,
  );
  resultQueryPromise.then(query => {
    expect(query).toBe(
      `select {id} from UserPoint where ${WHERE_CLAUSE1} AND profiles {compartment_id IN [\"1234\"]} JOIN ${JOIN_CLAUSE}`,
    );
    cb();
  });
});

test('test the query is correctly not to be formatted with query fragment', cb => {
  const queryServiceMock = new QueryServiceMock();
  const adapter = new QueryScopeAdapter(queryServiceMock);
  const queryResource1: QueryResource = {
    id: 'xxx',
    datamart_id: 'xxx',
    query_text: QUERY1,
    query_language: 'OTQL',
  };
  const scope: SegmentScope = {
    type: 'SEGMENT',
    segmentId: '123',
  };

  const queryFragment: QueryFragment = {
    compartments: [
      {
        type: 'otql',
        starting_object_type: 'UserProfile',
        fragment: 'profiles {compartment_id IN ["1234"]}',
      },
    ],
  };
  const resultQueryPromise = adapter.scopeQueryWithWhereClause(
    '123',
    queryFragment,
    queryResource1,
    scope,
  );
  resultQueryPromise.then(query => {
    expect(query).toBe(`select {id} from UserPoint where ${WHERE_CLAUSE1} JOIN ${JOIN_CLAUSE}`);
    cb();
  });
});
