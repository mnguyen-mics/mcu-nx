import { AggregateDataset } from '../../models/dashboards/dataset/dataset_tree';
import { indexDataset } from '../transformations/IndexTranformation';

const aggregate: AggregateDataset = {
  dataset: [
    {
      key: '1234',
      'audience-segment': 12,
    },
    {
      key: '1235',
      'audience-segment': 14,
    },
    {
      key: '1236',
      'audience-segment': 17,
    },
    {
      key: '1237',
      'audience-segment': 18,
    },
    {
      key: '1238',
      'audience-segment': 45,
    },
    {
      key: '1239',
      'audience-segment': 1,
    },
  ],
  metadata: {
    seriesTitles: ['audience-segment'],
  },
  type: 'aggregate',
};

const reference: AggregateDataset = {
  dataset: [
    {
      key: '1234',
      'audience-segment': 40,
    },
    {
      key: '1235',
      'audience-segment': 20,
    },
    {
      key: '1236',
      'audience-segment': 10,
    },
    {
      key: '1237',
      'audience-segment': 3,
    },
    {
      key: '1238',
      'audience-segment': 10,
    },
    {
      key: '1239',
      'audience-segment': 100,
    },
  ],
  metadata: {
    seriesTitles: ['audience-segment'],
  },
  type: 'aggregate',
};

test('Index transformation with empty datasets', done => {
  const xKey = 'key';
  const emptyAggregate: AggregateDataset = {
    dataset: [],
    metadata: {
      seriesTitles: [],
    },

    type: 'aggregate',
  };
  const emptyReference: AggregateDataset = {
    dataset: [],
    metadata: {
      seriesTitles: [],
    },
    type: 'aggregate',
  };
  const result = indexDataset(emptyAggregate, emptyReference, xKey, {
    limit: 5,
  }) as AggregateDataset;
  expect(result.dataset.length).toBe(0);
  done();
});

test('Index transformation with datasets with limit', done => {
  const xKey = 'key';
  const limit = 5;
  const result = indexDataset(aggregate, reference, xKey, {
    limit: limit,
  }) as AggregateDataset;
  expect(result.dataset.length).toBe(limit);
  expect(result).toEqual({
    type: 'aggregate',
    dataset: [
      {
        key: '1237',
        'audience-segment-percentage': 16.82,
        'audience-segment-count': 18,
        'audience-segment': 1025.61,
      },
      {
        key: '1238',
        'audience-segment-percentage': 42.06,
        'audience-segment-count': 45,
        'audience-segment': 770.33,
      },
      {
        key: '1236',
        'audience-segment-percentage': 15.89,
        'audience-segment-count': 17,
        'audience-segment': 291.03,
      },
      {
        key: '1235',
        'audience-segment-percentage': 13.08,
        'audience-segment-count': 14,
        'audience-segment': 119.67,
      },
      {
        key: '1234',
        'audience-segment-percentage': 11.21,
        'audience-segment-count': 12,
        'audience-segment': 51.28,
      },
    ],
    metadata: {
      seriesTitles: ['audience-segment'],
    },
  });
  done();
});

test('Index transformation with datasets with ordering', done => {
  const xKey = 'key';
  const result = indexDataset(aggregate, reference, xKey, {
    limit: 5,
    sort: 'ascending',
  }) as AggregateDataset;
  expect(result).toEqual({
    type: 'aggregate',
    dataset: [
      {
        key: '1239',
        'audience-segment-percentage': 0.93,
        'audience-segment-count': 1,
        'audience-segment': 1.7,
      },
      {
        key: '1234',
        'audience-segment-percentage': 11.21,
        'audience-segment-count': 12,
        'audience-segment': 51.28,
      },
      {
        key: '1235',
        'audience-segment-percentage': 13.08,
        'audience-segment-count': 14,
        'audience-segment': 119.67,
      },
      {
        key: '1236',
        'audience-segment-percentage': 15.89,
        'audience-segment-count': 17,
        'audience-segment': 291.03,
      },
      {
        key: '1238',
        'audience-segment-percentage': 42.06,
        'audience-segment-count': 45,
        'audience-segment': 770.33,
      },
    ],
    metadata: {
      seriesTitles: ['audience-segment'],
    },
  });
  done();
});

test('Index transformation with datasets with ordering with minimum percentage', done => {
  const xKey = 'key';
  const result = indexDataset(aggregate, reference, xKey, {
    limit: 5,
    sort: 'ascending',
    minimum_percentage: 3,
  }) as AggregateDataset;
  expect(result).toEqual({
    type: 'aggregate',
    dataset: [
      {
        key: '1234',
        'audience-segment-percentage': 11.21,
        'audience-segment-count': 12,
        'audience-segment': 51.28,
      },
      {
        key: '1235',
        'audience-segment-percentage': 13.08,
        'audience-segment-count': 14,
        'audience-segment': 119.67,
      },
      {
        key: '1236',
        'audience-segment-percentage': 15.89,
        'audience-segment-count': 17,
        'audience-segment': 291.03,
      },
      {
        key: '1238',
        'audience-segment-percentage': 42.06,
        'audience-segment-count': 45,
        'audience-segment': 770.33,
      },
      {
        'audience-segment': 1025.61,
        'audience-segment-count': 18,
        'audience-segment-percentage': 16.82,
        key: '1237',
      },
    ],
    metadata: {
      seriesTitles: ['audience-segment'],
    },
  });
  done();
});
