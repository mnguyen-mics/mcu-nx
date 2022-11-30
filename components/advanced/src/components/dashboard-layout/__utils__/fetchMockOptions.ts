import {
  MockedAnalytics,
  MockedAnalytics2,
  MockedAnalyticsMetrics,
  MockedCollectionMetrics,
  MockedData,
  MockedFetchChannels,
  MockedFetchSessionsByChannels,
  MockedMetricData,
} from '../../chart-engine/MockedData';

export const fetchmockOptions = [
  {
    matcher: 'glob:/undefined/v1/datamarts/*/user_account_compartments/*',
    response: {
      data: [
        {
          id: 1,
          organisation_id: 1,
          token: 'myToken',
          name: 'myCompartment',
          archived: false,
        },
      ],
      count: 1,
      total: 1,
      first_result: 0,
      max_results: 50,
    },
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/*/queries/*',
    response: { data: { query_text: 'Select @count() from UserPoint', query_language: 'OTQL' } },
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1414/query_executions/otql?use_cache=true*',
    response: MockedData,
  },
  {
    matcher:
      'glob:/undefined/v1/datamarts/1415/query_executions/otql?precision=LOWER_PRECISION&use_cache=true*',
    response: MockedMetricData,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1415/query_executions/otql?use_cache=true*',
    response: MockedMetricData,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1414/user_activities_analytics*',
    response: MockedAnalytics,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1417/user_activities_analytics*',
    response: MockedAnalytics2,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1416/user_activities_analytics*',
    response: MockedAnalyticsMetrics,
  },
  {
    matcher: 'glob:/undefined/v1/platform_monitoring/collections*',
    response: MockedCollectionMetrics,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/*/query_executions/otql*',
    response: MockedData,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1418/user_activities_analytics*',
    response: MockedFetchSessionsByChannels,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1418/channels',
    response: MockedFetchChannels,
  },
];
