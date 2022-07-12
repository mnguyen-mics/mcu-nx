import { SourceType } from '../../../models/dashboards/dataset/common';
import { ChartType } from '../../../services/ChartDatasetService';

export const propsMetric = {
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
                },
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
                },
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
                },
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
                },
              },
            ],
          },
        ],
      },
    ],
    available_filters: [
      {
        technical_name: 'compartments',
        title: 'Compartment',
        values_retrieve_method: 'query',
        values_query: 'SELECT compartments {id @map} FROM UserProfile',
        multi_select: true,
        query_fragments: [
          {
            type: 'OTQL',
            starting_object_type: 'UserPoint',
            fragment: 'profiles {compartment_id IN $values}',
          },
          {
            type: 'OTQL',
            starting_object_type: 'UserProfile',
            fragment: 'compartment_id IN $values',
          },
        ],
      },
      {
        technical_name: 'compartments1',
        title: 'Compartment1',
        values_retrieve_method: 'query',
        values_query: 'SELECT compartments {id @map} FROM UserProfile',
        multi_select: true,
        query_fragments: [
          {
            type: 'OTQL',
            starting_object_type: 'UserPoint',
            fragment: 'profiles {compartment_id1 IN $values}',
          },
          {
            type: 'OTQL',
            starting_object_type: 'UserProfile',
            fragment: 'compartment_id1 IN $values',
          },
        ],
      },
    ],
  },
};

export const props = {
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
                  type: 'bars' as ChartType,
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
                  options: {},
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

export const propsAnalytics1 = {
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

export const propsAnalytics2 = {
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
                  type: 'format-dates',
                  date_options: {
                    format: 'YY_MM',
                  },
                  sources: [
                    {
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
                  ],
                  options: {},
                },
              },
            ],
            y: 0,
            h: 1,
            layout: 'vertical',
            w: 12,
          },
        ],
      },
    ],
  },
};

export const propsAnalytics3 = {
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
                  type: 'format-dates',
                  date_options: {
                    format: 'YY_MM',
                  },
                  sources: [
                    {
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
                  ],
                  options: {
                    hide_x_axis: true,
                    hide_y_axis: true,
                  },
                },
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
                options: {
                  hide_x_axis: true,
                  hide_y_axis: true,
                },
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
                options: {
                  hide_x_axis: true,
                  hide_y_axis: true,
                },
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
                options: {
                  hide_x_axis: true,
                  hide_y_axis: true,
                },
              },
              {
                title: 'Collections volumes',
                type: 'metric',
                dataset: {
                  type: 'collection_volumes',
                  query_json: {
                    dimensions: [],
                    metrics: [
                      {
                        expression: 'count',
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
            layout: 'horizontal',
            w: 12,
          },
        ],
      },
    ],
    available_filters: [
      {
        technical_name: 'compartments',
        title: 'Compartment',
        values_retrieve_method: 'query',
        values_query: 'SELECT compartments {id @map} FROM UserProfile',
        multi_select: true,
        query_fragments: [
          {
            type: 'OTQL',
            starting_object_type: 'UserPoint',
            fragment: 'profiles {compartment_id IN $values}',
          },
          {
            type: 'OTQL',
            starting_object_type: 'UserProfile',
            fragment: 'compartment_id IN $values',
          },
          {
            type: 'activities_analytics',
            fragment: [
              {
                dimension_name: 'segment_id',
                operator: 'IN_LIST',
                not: false,
                expressions: '$values',
              },
            ],
          },
        ],
      },
      {
        technical_name: 'compartments1',
        title: 'Compartment1',
        values_retrieve_method: 'query',
        values_query: 'SELECT compartments {id @map} FROM UserProfile',
        multi_select: true,
        query_fragments: [
          {
            type: 'OTQL',
            starting_object_type: 'UserPoint',
            fragment: 'profiles {compartment_id1 IN $values}',
          },
          {
            type: 'OTQL',
            starting_object_type: 'UserProfile',
            fragment: 'compartment_id1 IN $values',
          },
          {
            type: 'activities_analytics',
            fragment: [
              {
                dimension_name: 'segment_id',
                operator: 'IN_LIST',
                not: false,
                expressions: '$values',
              },
            ],
          },
        ],
      },
    ],
  },
};

export const propsAnalytics4 = {
  datamart_id: '1418',
  schema: {
    sections: [
      {
        title: 'Analytics metric with get-decorators transformation',
        cards: [
          {
            x: 0,
            charts: [
              {
                title: 'Site visits per day per channel',
                type: 'Bars' as ChartType,
                dataset: {
                  type: 'get-decorators',
                  sources: [
                    {
                      type: 'activities_analytics',
                      query_json: {
                        dimensions: [{ name: 'date_yyyy_mm_dd' }, { name: 'channel_id' }],
                        dimension_filter_clauses: {
                          operator: 'OR',
                          filters: [
                            {
                              dimension_name: 'type',
                              operator: 'EXACT',
                              expressions: ['SITE_VISIT'],
                            },
                          ],
                        },
                        metrics: [{ expression: 'sessions' }],
                      },
                    },
                  ],
                  decorators_options: { buckets: { model_type: 'CHANNELS' } },
                },
                options: {
                  stacking: true,
                  hide_x_axis: true,
                },
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
