import { ReportView } from '../../models/report/ReportView';
import { formatDatasetAsKeyValueForReportView } from '../ChartDataFormater';

const X_KEY = 'key';

test('formatting of a simple reportview', () => {
  const reportView: ReportView = {
    columns_headers: ['hello', 'world'],
    rows: [
      ['1', 2],
      ['2', 3],
    ],
    items_per_page: 20,
    total_items: 2,
  };

  const dataset = formatDatasetAsKeyValueForReportView(X_KEY, reportView, ['hello'], '');
  expect(dataset).toEqual([
    { [X_KEY]: '1', world: 2, buckets: undefined },
    { [X_KEY]: '2', world: 3, buckets: undefined },
  ]);
});

test('formatting of a multiple dimensions reportview', () => {
  const reportView: ReportView = {
    columns_headers: ['city', 'date', 'metric1'],
    rows: [
      ['paris', '2021-10-22', 2],
      ['london', '2021-10-22', 4],
      ['london', '2021-10-23', 5],
      ['london', '2021-10-25', 4],
      ['prague', '2021-10-26', 6],
      ['london', '2021-10-26', 1],
      ['london', '2021-10-28', 6],
    ],
    items_per_page: 20,
    total_items: 2,
  };

  const dataset = formatDatasetAsKeyValueForReportView(X_KEY, reportView, ['date', 'city'], '');
  expect(dataset).toEqual([
    {
      [X_KEY]: '2021-10-22',
      metric1: 6,
      buckets: [
        {
          [X_KEY]: 'paris',
          metric1: 2,
        },
        {
          [X_KEY]: 'london',
          metric1: 4,
        },
      ],
    },
    {
      [X_KEY]: '2021-10-23',
      metric1: 5,
      buckets: [
        {
          [X_KEY]: 'london',
          metric1: 5,
        },
      ],
    },
    {
      [X_KEY]: '2021-10-25',
      metric1: 4,
      buckets: [
        {
          [X_KEY]: 'london',
          metric1: 4,
        },
      ],
    },
    {
      [X_KEY]: '2021-10-26',
      metric1: 7,
      buckets: [
        {
          [X_KEY]: 'prague',
          metric1: 6,
        },
        {
          [X_KEY]: 'london',
          metric1: 1,
        },
      ],
    },
    {
      [X_KEY]: '2021-10-28',
      metric1: 6,
      buckets: [
        {
          [X_KEY]: 'london',
          metric1: 6,
        },
      ],
    },
  ]);
});

test('formatting of a multiple dimensions, multiple metrics reportview', () => {
  const reportView: ReportView = {
    columns_headers: ['city', 'date', 'metric1', 'metric2'],
    rows: [
      ['paris', '2021-10-22', 2, 4],
      ['london', '2021-10-22', 4, 5],
      ['london', '2021-10-23', 5, 5],
      ['london', '2021-10-25', 4, 6],
      ['prague', '2021-10-26', 6, 7],
      ['london', '2021-10-26', 1, 8],
      ['london', '2021-10-28', 6, 1],
    ],
    items_per_page: 20,
    total_items: 2,
  };

  const dataset = formatDatasetAsKeyValueForReportView(X_KEY, reportView, ['date', 'city'], '');
  expect(dataset).toEqual([
    {
      [X_KEY]: '2021-10-22',
      metric1: 6,
      metric2: 9,
      buckets: [
        {
          [X_KEY]: 'paris',
          metric1: 2,
          metric2: 4,
        },
        {
          [X_KEY]: 'london',
          metric1: 4,
          metric2: 5,
        },
      ],
    },
    {
      [X_KEY]: '2021-10-23',
      metric1: 5,
      metric2: 5,
      buckets: [
        {
          [X_KEY]: 'london',
          metric1: 5,
          metric2: 5,
        },
      ],
    },
    {
      [X_KEY]: '2021-10-25',
      metric1: 4,
      metric2: 6,
      buckets: [
        {
          [X_KEY]: 'london',
          metric1: 4,
          metric2: 6,
        },
      ],
    },
    {
      [X_KEY]: '2021-10-26',
      metric1: 7,
      metric2: 15,
      buckets: [
        {
          [X_KEY]: 'prague',
          metric1: 6,
          metric2: 7,
        },
        {
          [X_KEY]: 'london',
          metric1: 1,
          metric2: 8,
        },
      ],
    },
    {
      [X_KEY]: '2021-10-28',
      metric1: 6,
      metric2: 1,
      buckets: [
        {
          [X_KEY]: 'london',
          metric1: 6,
          metric2: 1,
        },
      ],
    },
  ]);
});
