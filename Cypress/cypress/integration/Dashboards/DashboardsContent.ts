export const dashboardContent = `{
    sections: [
      {
        title: 'First Section',
        cards: [
          {
            x: 0,
            y: 0,
            w: 12,
            h: 3,
            layout: 'horizontal',
            charts: [
              {
                title: 'Pie',
                type: 'pie',
                dataset: {
                  type: 'get-decorators',
                  sources: [
                    {
                      type: 'otql',
                      series_title: 'datamart',
                      query_id: 'queryId',
                    },
                  ],
                  decorators_options: {
                    model_type: 'CHANNELS',
                  },
                },
                options: {
                  legend: {
                    enabled: true,
                    position: 'right',
                  },
                  xKey: 'key',
                  format: 'count',
                  yKeys: [
                    {
                      key: 'value',
                      message: 'count',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  }`;

export const wisywigCardContent = () => {
  return {
    sections: [
      {
        title: 'First Section',
        cards: [
          {
            x: 0,
            y: 0,
            w: 12,
            h: 3,
            layout: 'horizontal',
            charts: [
              {
                title: 'Metric 1',
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
              },
              {
                title: 'Metric 2',
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
              },
              {
                title: 'Metric 3',
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
              },
            ],
          },
        ],
      },
      {
        title: 'First Section',
        cards: [
          {
            x: 0,
            y: 0,
            w: 12,
            h: 3,
            layout: 'horizontal',
            charts: [
              {
                title: 'Metric 4',
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
              },
              {
                title: 'Metric 5',
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
              },
            ],
          },
        ],
      },
    ],
  };
};

export const editAdjustmentsDashboardContent = (queryId: string) => {
  return {
    sections: [
      {
        title: 'First Section',
        cards: [
          {
            x: 0,
            y: 0,
            w: 12,
            h: 3,
            layout: 'horizontal',
            charts: [
              {
                title: 'Index',
                type: 'bars',
                dataset: {
                  type: 'index',
                  sources: [
                    {
                      type: 'otql',
                      series_title: 'datamart',
                      query_id: `${queryId}`,
                    },
                    {
                      type: 'otql',
                      series_title: 'segment',
                      query_id: `${queryId}`,
                    },
                  ],
                  options: {
                    minimum_percentage: 0,
                  },
                },
                options: {
                  format: 'index',
                  legend: {
                    position: 'bottom',
                    enabled: true,
                  },
                  bigBars: true,
                  stacking: false,
                  plotLineValue: 100,
                },
              },
            ],
          },
        ],
      },
    ],
  };
};

export const dragAndDropContent = () => {
  return {
    sections: [
      {
        title: 'First Section',
        cards: [
          {
            x: 0,
            y: 0,
            w: 3,
            h: 3,
            layout: 'horizontal',
            charts: [
              {
                title: 'Metrics',
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
              },
            ],
          },
        ],
      },
    ],
  };
};
