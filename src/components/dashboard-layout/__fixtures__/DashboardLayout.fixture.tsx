import React from 'react';
import DashboardLayout from '../DashboardLayout';
import { FetchMock } from '@react-mock/fetch';
import { LocalStorageMock } from '@react-mock/localstorage';
import { MockedData, MockedMetricData } from '../../chart-engine/MockedData';
import { SourceType, ChartType, MetricChartOptions } from '../../chart-engine/ChartDataFetcher';

const propsMetric = {
  datamart_id: '1415',
  schema: {
    sections: [
      {
        title: 'Summary',
        cards: [
          {
            x: 0,
            y: 0,
            w: 12,
            h: 1,
            layout: 'horizontal',
            charts: [
              {
                title: 'Total number of user points',
                type: 'metric' as ChartType,
                dataset: {
                  type: 'otql' as SourceType,
                  query_id: '50170',
                },
                options: {
                  xKey: 'key',
                } as MetricChartOptions,
              },
              {
                title: 'Overall income increase (%)',
                type: 'metric' as ChartType,
                dataset: {
                  type: 'otql' as SourceType,
                  query_id: '50170',
                },
                options: {
                  xKey: 'key',
                  format: 'percentage',
                } as MetricChartOptions,
              },
            ],
          },
          {
            x: 0,
            y: 1,
            w: 6,
            h: 4,
            layout: 'horizontal',
            charts: [
              {
                title: 'User point per interest',
                type: 'pie' as ChartType,
                dataset: {
                  type: 'to-list' as SourceType,
                  sources: [
                    {
                      type: 'otql',
                      series_title: 'automotive',
                      query_id: '50170',
                    },
                    {
                      type: 'otql',
                      series_title: 'fashion',
                      query_id: '50171',
                    },
                    {
                      type: 'otql',
                      series_title: 'home',
                      query_id: '50172',
                    },
                  ],
                },
                options: {
                  xKey: 'key',
                } as MetricChartOptions,
              },
            ],
          },
        ],
      },
    ],
  },
};

const props = {
  datamart_id: '1414',
  schema: {
    sections: [
      {
        title: 'General Information',
        cards: [
          {
            x: 0,
            y: 0,
            w: 12,
            h: 6,
            layout: 'horizontal',
            charts: [
              {
                title: 'Age range',
                type: 'pie' as ChartType,
                dataset: {
                  type: 'otql' as SourceType,
                  query_id: '50172',
                },
              },
            ],
          },
        ],
      },
      {
        title: 'Demographics',
        cards: [
          {
            x: 0,
            y: 0,
            w: 12,
            h: 4,
            charts: [
              {
                title: 'Gender',
                type: 'pie' as ChartType,
                dataset: {
                  type: 'otql' as SourceType,
                  query_id: '50168',
                },
                options: {
                  legend: {
                    enabled: true,
                    position: 'right',
                  },
                },
              },
            ],
          },
          {
            x: 0,
            y: 0,
            w: 6,
            h: 4,
            charts: [
              {
                title: 'Age range',
                type: 'pie' as ChartType,
                dataset: {
                  type: 'otql' as SourceType,
                  query_id: '50172',
                },
              },
            ],
          },
          {
            x: 6,
            y: 0,
            w: 6,
            h: 4,
            charts: [
              {
                title: 'Social class',
                type: 'bars' as ChartType,
                dataset: {
                  type: 'otql' as SourceType,
                  query_id: '50169',
                },
                options: {
                  type: 'bar' as ChartType,
                  xKey: 'key',
                },
              },
            ],
          },
        ],
      },
      {
        title: 'Behavioral',
        cards: [
          {
            x: 0,
            y: 0,
            w: 6,
            h: 4,
            charts: [
              {
                title: 'Top 10 interests',
                type: 'radar' as ChartType,
                dataset: {
                  type: 'otql' as SourceType,
                  query_id: '50167',
                },
                options: {
                  xKey: 'key',
                } as any,
              },
            ],
          },
          {
            x: 6,
            y: 0,
            w: 6,
            h: 4,
            charts: [
              {
                title: 'Top 10 purchase intents',
                type: 'bars' as ChartType,
                dataset: {
                  type: 'otql',
                  query_id: '50173',
                },
              },
            ],
          },
          {
            x: 0,
            y: 4,
            w: 6,
            h: 4,
            charts: [
              {
                title: 'Top 10 purchase intents',
                type: 'bars' as ChartType,
                dataset: {
                  type: 'zip',
                  sources: [
                    {
                      type: 'otql' as SourceType,
                      series_title: 'datamart',
                      query_id: '50172',
                    },
                    {
                      type: 'otql' as SourceType,
                      series_title: 'segment',
                      query_id: '50173',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

const fetchmockOptions = [
  {
    matcher: 'glob:/undefined/v1/datamarts/*/queries/*',
    response: { data: 'Select @count() from UserPoint' },
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1414/query_executions/otql*',
    response: MockedData,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1415/query_executions/otql*',
    response: MockedMetricData,
  },
];

export default {
  component: (
    <LocalStorageMock items={{ access_token: 're4lt0k3n' }}>
      <FetchMock mocks={fetchmockOptions}>
        <DashboardLayout {...propsMetric} />
        <DashboardLayout {...props} />
      </FetchMock>
    </LocalStorageMock>
  ),
};
