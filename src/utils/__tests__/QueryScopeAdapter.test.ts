import {
  QueryResource,
  QueryTranslationRequest,
  QueryTranslationResource,
} from '../../models/datamart/DatamartResource';
import { OTQLResult, QueryPrecisionMode } from '../../models/datamart/graphdb/OTQLResult';
import { DataResponse } from '../../services/ApiService';
import { IQueryService } from '../../services/QueryService';
import { QueryScopeAdapter } from '../QueryScopeAdapter';

const WHERE_CLAUSE1 = ' activity_events { app_id = 1 }';
const WHERE_CLAUSE2 = ' segments { id = 123 }';
const QUERY1 = `select {id} from UserPoint where${WHERE_CLAUSE1}`;
const QUERY2 = `select {id} from UserPoint where${WHERE_CLAUSE2}`;

const jsonOtqlQuery1 = {
  from: 'UserPoint',
  where: {
    type: 'GROUP',
    boolean_operator: 'OR',
    expressions: [
      {
        boolean_operator: 'OR',
        field: 'activity_events',
        type: 'OBJECT',
        expressions: [
          {
            type: 'FIELD',
            field: 'app_id',
            comparison: {
              type: 'STRING',
              operator: 'EQ',
              values: ['1'],
            },
          },
        ],
      },
    ],
  },
};

const jsonOtqlQuery2 = {
  from: 'UserPoint',
  where: {
    type: 'GROUP',
    boolean_operator: 'OR',
    expressions: [
      {
        boolean_operator: 'OR',
        field: 'segments',
        type: 'OBJECT',
        expressions: [
          {
            type: 'FIELD',
            field: 'id',
            comparison: {
              type: 'STRING',
              operator: 'EQ',
              values: ['123'],
            },
          },
        ],
      },
    ],
  },
};

class QueryServiceMock implements IQueryService {
  getQuery(datamartId: string, queryId: string): Promise<DataResponse<QueryResource>> {
    return Promise.reject('Not implemented');
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
    return Promise.reject('Not implemented');
  }

  private printExpression(exp: any) {
    if (exp.type === 'OBJECT') {
      const printedExpressions = exp.expressions
        .map(e => this.printExpression(e))
        .join(` ${exp.boolean_operator} `);
      return `${exp.field} { ${printedExpressions} }`;
    } else if (exp.type === 'FIELD') {
      return `${exp.field} = ${exp.comparison.values[0]}`;
    } else if (exp.type === 'GROUP') {
      return exp.expressions.map(e => this.printExpression(e)).join(` ${exp.boolean_operator} `);
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
  const queryResource2: QueryResource = {
    id: 'xxx',
    datamart_id: 'xxx',
    query_text: QUERY2,
    query_language: 'OTQL',
  };
  const resultQueryPromise = adapter.adaptToScope('123', queryResource1, queryResource2);
  resultQueryPromise.then(query => {
    expect(query).toBe(`select {id} from UserPoint where${WHERE_CLAUSE1} AND ${WHERE_CLAUSE2}`);
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
  const resultQueryPromise = adapter.adaptToScope('123', queryResource1, undefined);
  resultQueryPromise.then(query => {
    expect(query).toBe(`select {id} from UserPoint where${WHERE_CLAUSE1}`);
    cb();
  });
});
