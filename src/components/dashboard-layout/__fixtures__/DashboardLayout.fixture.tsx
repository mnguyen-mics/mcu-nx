import React from 'react';
import DashboardLayout from '../DashboardLayout';
import { FetchMock } from '@react-mock/fetch';
import { LocalStorageMock } from '@react-mock/localstorage';
import {
  MockedData,
  MockedMetricData,
  MockedAnalytics,
  MockedAnalytics2,
  MockedAnalyticsMetrics,
} from '../../chart-engine/MockedData';
import { ChartType, MetricChartOptions, SourceType } from '../../../services/ChartDatasetService';
import { Provider } from 'react-redux';
import { IocProvider } from '../../..';
import configureStore from '../../../redux/store';
import { container } from '../../../inversify/inversify.config';

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
              {
                title: 'Test percentage value (%)',
                type: 'metric' as ChartType,
                dataset: {
                  type: 'ratio' as SourceType,
                  sources: [
                    {
                      type: 'otql' as SourceType,
                      query_id: '50174',
                    },
                    {
                      type: 'otql' as SourceType,
                      query_id: '50175',
                    },
                  ],
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
                      precision: 'LOWER_PRECISION',
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
                options: {
                  is_half: true,
                  inner_radius: true,
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
                  big_bars: false,
                  plot_line_value: 25000000,
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
                  type: 'join',
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
          {
            x: 6,
            y: 4,
            w: 6,
            h: 4,
            charts: [
              {
                title: 'Top 10 purchase intents',
                type: 'radar' as ChartType,
                dataset: {
                  type: 'to-percentages',
                  sources: [
                    {
                      type: 'otql' as SourceType,
                      series_title: 'segment',
                      query_id: '50173',
                    },
                  ],
                },
                options: {
                  format: 'percentage',
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
                  type: 'index',
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

const propsAnalytics1 = {
  datamart_id: '1416',
  schema: {
    sections: [
      {
        title: 'Analytics metric',
        cards: [
          {
            x: 0,
            charts: [
              {
                title: 'Active users',
                type: 'Metric',
                dataset: {
                  type: 'activities_analytics',
                  query_json: {
                    dimensions: [],
                    metrics: [
                      {
                        expression: 'users',
                      },
                    ],
                  },
                },
                options: {},
              },
            ],
            y: 0,
            h: 2,
            layout: 'vertical',
            w: 4,
          },
        ],
      },
    ],
  },
};

const propsAnalytics2 = {
  datamart_id: '1414',
  schema: {
    sections: [
      {
        title: '',
        cards: [
          {
            x: 0,
            charts: [
              {
                title: 'Active users',
                type: 'Metric',
                dataset: {
                  type: 'activities_analytics',
                  query_json: {
                    dimensions: [],
                    metrics: [
                      {
                        expression: 'users',
                      },
                    ],
                  },
                },
                options: {},
              },

              {
                title: 'Sessions per day',
                type: 'Bars',
                dataset: {
                  type: 'activities_analytics',
                  query_json: {
                    dimensions: [
                      {
                        name: 'date_yyyy_mm_dd',
                      },
                    ],
                    metrics: [
                      {
                        expression: 'sessions',
                      },
                    ],
                  },
                },
                options: {},
              },
            ],
            y: 0,
            h: 4,
            layout: 'vertical',
            w: 12,
          },
        ],
      },
    ],
  },
};

const propsAnalytics3 = {
  datamart_id: '1417',
  schema: {
    sections: [
      {
        title: '',
        cards: [
          {
            x: 0,
            charts: [
              {
                title: 'Sessions per day',
                type: 'Bars',
                dataset: {
                  type: 'activities_analytics',
                  query_json: {
                    dimensions: [
                      {
                        name: 'date_yyyy_mm_dd',
                      },
                      {
                        name: 'city',
                      },
                    ],
                    metrics: [
                      {
                        expression: 'sessions',
                      },
                    ],
                  },
                },
                options: {},
              },
            ],
            y: 0,
            h: 5,
            layout: 'vertical',
            w: 4,
          },
          {
            x: 0,
            charts: [
              {
                title: 'Sessions per day',
                type: 'Bars',
                dataset: {
                  type: 'activities_analytics',
                  query_json: {
                    dimensions: [
                      {
                        name: 'date_yyyy_mm_dd',
                      },
                    ],
                    metrics: [
                      {
                        expression: 'sessions',
                      },
                    ],
                  },
                },
                options: {
                  hide_x_axis: true,
                  hide_y_axis: true,
                },
              },
            ],
            y: 0,
            h: 5,
            layout: 'vertical',
            w: 4,
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
];
const store = configureStore();
export default {
  component: (
    <Provider store={store}>
      <IocProvider container={container}>
        <LocalStorageMock items={{ access_token: 're4lt0k3n' }}>
          <FetchMock mocks={fetchmockOptions}>
            <DashboardLayout {...propsMetric} />
            <DashboardLayout {...props} />
            <DashboardLayout {...propsAnalytics1} />
            <DashboardLayout {...propsAnalytics2} />
            <DashboardLayout {...propsAnalytics3} />
          </FetchMock>
        </LocalStorageMock>
      </IocProvider>
    </Provider>
  ),
};
