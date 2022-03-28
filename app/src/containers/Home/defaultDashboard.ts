// TODO type accordingly here once the rework of
// dashboard typings is done in ADV components library
const getDefaultSections = (datamartId: string) => {
  return {
    sections: [
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
                                  expressions: ['UserAgent'],
                                },
                              ],
                            },
                            metrics: [
                              {
                                expression: 'count',
                              },
                            ],
                          },
                          series_title: 'UserAgent',
                        },
                      ],
                    },
                  ],
                  date_options: {
                    format: 'YYYY-MM-DD',
                  },
                },
                title: 'User point, user identifiers & user profiles',
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
    ],
  } as any;
};

export default getDefaultSections;
