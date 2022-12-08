// TODO type accordingly here once the rework of
// dashboard typings is done in ADV components library

import { InjectedFeaturesProps } from '@mediarithmics-private/advanced-components/lib/components/Features';

function formatDate(dateToFormat: Date) {
  return `${dateToFormat.getFullYear()}-${
    dateToFormat.getMonth() + 1
  }-${dateToFormat.getDate()} ${dateToFormat.getHours()}:${dateToFormat.getMinutes()}:${dateToFormat.getMinutes()}`;
}

const getDefaultSections = (datamartId: string, hasFeatureProps: InjectedFeaturesProps) => {
  const now = new Date();
  const last30Days = new Date();
  last30Days.setDate(now.getDate() - 30);
  const dashboards = [
    {
      cards: [
        {
          x: 0,
          charts: [
            {
              options: {
                hide_x_axis: false,
                type: 'area',
                legend: {
                  enabled: true,
                  position: 'right',
                },
              },
              dataset: {
                type: 'format-dates',
                sources: [
                  {
                    type: 'join',
                    sources: [
                      {
                        type: 'collection_volumes',
                        query_json: {
                          dimensions: [
                            {
                              name: 'date_time',
                            },
                          ],
                          dimension_filter_clauses: {
                            operator: 'AND',
                            filters: [
                              {
                                dimension_name: 'datamart_id',
                                operator: 'EXACT',
                                expressions: [datamartId],
                              },
                              {
                                dimension_name: 'collection',
                                operator: 'EXACT',
                                expressions: ['UserPoint'],
                              },
                            ],
                          },
                          metrics: [
                            {
                              expression: 'count',
                            },
                          ],
                        },
                        series_title: 'UserPoint',
                      },
                      {
                        type: 'collection_volumes',
                        query_json: {
                          dimensions: [
                            {
                              name: 'date_time',
                            },
                          ],
                          dimension_filter_clauses: {
                            operator: 'AND',
                            filters: [
                              {
                                dimension_name: 'datamart_id',
                                operator: 'EXACT',
                                expressions: [datamartId],
                              },
                              {
                                dimension_name: 'collection',
                                operator: 'EXACT',
                                expressions: ['UserProfile'],
                              },
                            ],
                          },
                          metrics: [
                            {
                              expression: 'count',
                            },
                          ],
                        },
                        series_title: 'UserProfile',
                      },
                      {
                        type: 'collection_volumes',
                        query_json: {
                          dimensions: [
                            {
                              name: 'date_time',
                            },
                          ],
                          dimension_filter_clauses: {
                            operator: 'AND',
                            filters: [
                              {
                                dimension_name: 'datamart_id',
                                operator: 'EXACT',
                                expressions: [datamartId],
                              },
                              {
                                dimension_name: 'collection',
                                operator: 'EXACT',
                                expressions: ['UserAccount'],
                              },
                            ],
                          },
                          metrics: [
                            {
                              expression: 'count',
                            },
                          ],
                        },
                        series_title: 'UserAccount',
                      },
                      {
                        type: 'collection_volumes',
                        query_json: {
                          dimensions: [
                            {
                              name: 'date_time',
                            },
                          ],
                          dimension_filter_clauses: {
                            operator: 'AND',
                            filters: [
                              {
                                dimension_name: 'datamart_id',
                                operator: 'EXACT',
                                expressions: [datamartId],
                              },
                              {
                                dimension_name: 'collection',
                                operator: 'EXACT',
                                expressions: ['UserEmail'],
                              },
                            ],
                          },
                          metrics: [
                            {
                              expression: 'count',
                            },
                          ],
                        },
                        series_title: 'UserEmail',
                      },
                      {
                        type: 'collection_volumes',
                        query_json: {
                          dimensions: [
                            {
                              name: 'date_time',
                            },
                          ],
                          dimension_filter_clauses: {
                            operator: 'AND',
                            filters: [
                              {
                                dimension_name: 'datamart_id',
                                operator: 'EXACT',
                                expressions: [datamartId],
                              },
                              {
                                dimension_name: 'collection',
                                operator: 'EXACT',
                                expressions: ['UserDevicePoint'],
                              },
                            ],
                          },
                          metrics: [
                            {
                              expression: 'count',
                            },
                          ],
                        },
                        series_title: 'UserDevicePoint',
                      },
                    ],
                  },
                ],
                date_options: {
                  format: 'YYYY-MM-DD',
                },
              },
              title: 'User points, user identifiers & user profiles',
              type: 'line',
            },
          ],
          y: 0,
          h: 5,
          layout: 'horizontal',
          w: 12,
        },
      ],
    },
    {
      cards: [
        {
          x: 0,
          charts: [
            {
              options: {
                hide_x_axis: false,
                legend: {
                  enabled: true,
                  position: 'right',
                },
                type: 'area',
              },
              dataset: {
                type: 'format-dates',
                sources: [
                  {
                    type: 'join',
                    sources: [
                      {
                        type: 'collection_volumes',
                        query_json: {
                          dimensions: [
                            {
                              name: 'date_time',
                            },
                          ],
                          dimension_filter_clauses: {
                            operator: 'AND',
                            filters: [
                              {
                                dimension_name: 'datamart_id',
                                operator: 'EXACT',
                                expressions: [datamartId],
                              },
                              {
                                dimension_name: 'collection',
                                operator: 'EXACT',
                                expressions: ['UserActivity'],
                              },
                            ],
                          },
                          metrics: [
                            {
                              expression: 'count',
                            },
                          ],
                        },
                        series_title: 'UserActivity',
                      },
                      {
                        type: 'collection_volumes',
                        query_json: {
                          dimensions: [
                            {
                              name: 'date_time',
                            },
                          ],
                          dimension_filter_clauses: {
                            operator: 'AND',
                            filters: [
                              {
                                dimension_name: 'datamart_id',
                                operator: 'EXACT',
                                expressions: [datamartId],
                              },
                              {
                                dimension_name: 'collection',
                                operator: 'EXACT',
                                expressions: ['UserEvent'],
                              },
                            ],
                          },
                          metrics: [
                            {
                              expression: 'count',
                            },
                          ],
                        },
                        series_title: 'UserEvent',
                      },
                    ],
                  },
                ],
                date_options: {
                  format: 'YYYY-MM-DD',
                },
              },
              title: 'User activities & user events',
              type: 'line',
            },
          ],
          y: 0,
          h: 5,
          layout: 'horizontal',
          w: 12,
        },
      ],
    },
  ] as any;

  if (hasFeatureProps.hasFeature('standard-dashboards_data-ingestion')) {
    dashboards.push({
      cards: [
        {
          x: 0,
          y: 0,
          h: 7,
          w: 12,
          charts: [
            {
              dataset: {
                type: 'JOIN',
                sources: [
                  {
                    type: 'data_ingestion',
                    series_title: 'JS_TAG',
                    query_json: {
                      date_ranges: [
                        {
                          start_date: formatDate(last30Days),
                          end_date: formatDate(now),
                        },
                      ],
                      dimensions: [
                        {
                          name: 'event_name',
                        },
                      ],
                      dimension_filter_clauses: {
                        operator: 'AND',
                        filters: [
                          {
                            dimension_name: 'datamart_id',
                            operator: 'EXACT',
                            expressions: [datamartId],
                          },
                          {
                            dimension_name: 'pipeline_step',
                            operator: 'EXACT',
                            expressions: ['JS_TAG'],
                          },
                        ],
                      },
                      metrics: [
                        {
                          expression: 'event_count',
                        },
                      ],
                    },
                  },
                  {
                    type: 'data_ingestion',
                    series_title: 'API',
                    query_json: {
                      date_ranges: [
                        {
                          start_date: formatDate(last30Days),
                          end_date: formatDate(now),
                        },
                      ],
                      dimensions: [
                        {
                          name: 'event_name',
                        },
                      ],
                      dimension_filter_clauses: {
                        operator: 'AND',
                        filters: [
                          {
                            dimension_name: 'datamart_id',
                            operator: 'EXACT',
                            expressions: [datamartId],
                          },
                          {
                            dimension_name: 'pipeline_step',
                            operator: 'EXACT',
                            expressions: ['API'],
                          },
                        ],
                      },
                      metrics: [
                        {
                          expression: 'event_count',
                        },
                      ],
                    },
                  },
                  {
                    type: 'data_ingestion',
                    series_title: 'DOCUMENT_IMPORT',
                    query_json: {
                      date_ranges: [
                        {
                          start_date: formatDate(last30Days),
                          end_date: formatDate(now),
                        },
                      ],
                      dimensions: [
                        {
                          name: 'event_name',
                        },
                      ],
                      dimension_filter_clauses: {
                        operator: 'AND',
                        filters: [
                          {
                            dimension_name: 'datamart_id',
                            operator: 'EXACT',
                            expressions: [datamartId],
                          },
                          {
                            dimension_name: 'pipeline_step',
                            operator: 'EXACT',
                            expressions: ['DOCUMENT_IMPORT'],
                          },
                        ],
                      },
                      metrics: [
                        {
                          expression: 'event_count',
                        },
                      ],
                    },
                  },
                  {
                    type: 'data_ingestion',
                    series_title: 'EVENT_RULES',
                    query_json: {
                      date_ranges: [
                        {
                          start_date: formatDate(last30Days),
                          end_date: formatDate(now),
                        },
                      ],
                      dimensions: [
                        {
                          name: 'event_name',
                        },
                      ],
                      dimension_filter_clauses: {
                        operator: 'AND',
                        filters: [
                          {
                            dimension_name: 'datamart_id',
                            operator: 'EXACT',
                            expressions: [datamartId],
                          },
                          {
                            dimension_name: 'pipeline_step',
                            operator: 'EXACT',
                            expressions: ['EVENT_RULES'],
                          },
                        ],
                      },
                      metrics: [
                        {
                          expression: 'event_count',
                        },
                      ],
                    },
                  },
                  {
                    type: 'data_ingestion',
                    series_title: 'ACTIVITY_ANALYZER',
                    query_json: {
                      date_ranges: [
                        {
                          start_date: formatDate(last30Days),
                          end_date: formatDate(now),
                        },
                      ],
                      dimensions: [
                        {
                          name: 'event_name',
                        },
                      ],
                      dimension_filter_clauses: {
                        operator: 'AND',
                        filters: [
                          {
                            dimension_name: 'datamart_id',
                            operator: 'EXACT',
                            expressions: [datamartId],
                          },
                          {
                            dimension_name: 'pipeline_step',
                            operator: 'EXACT',
                            expressions: ['ACTIVITY_ANALYZER'],
                          },
                        ],
                      },
                      metrics: [
                        {
                          expression: 'event_count',
                        },
                      ],
                    },
                  },
                  {
                    type: 'data_ingestion',
                    series_title: 'DOCUMENT_STORE',
                    query_json: {
                      date_ranges: [
                        {
                          start_date: formatDate(last30Days),
                          end_date: formatDate(now),
                        },
                      ],
                      dimensions: [
                        {
                          name: 'event_name',
                        },
                      ],
                      dimension_filter_clauses: {
                        operator: 'AND',
                        filters: [
                          {
                            dimension_name: 'datamart_id',
                            operator: 'EXACT',
                            expressions: [datamartId],
                          },
                          {
                            dimension_name: 'pipeline_step',
                            operator: 'EXACT',
                            expressions: ['DOCUMENT_STORE'],
                          },
                        ],
                      },
                      metrics: [
                        {
                          expression: 'event_count',
                        },
                      ],
                    },
                  },
                ],
              },

              title: 'Events ingestion on last 30 days',
              type: 'table',
            },
          ],
        },
      ],
    });
  }

  return { sections: dashboards } as any;
};

export default getDefaultSections;
