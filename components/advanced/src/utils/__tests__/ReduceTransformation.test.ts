import { AggregateDataset, CountDataset } from '../../models/dashboards/dataset/dataset_tree';
import { reduceDataset } from '../transformations/ReduceTransformation';

const DEFAULT_X_KEY = 'key';

test('Count dataset is returned as is', done => {
  const testValue = 98767890;
  const dataset: CountDataset = {
    type: 'count',
    value: testValue,
  };
  expect(reduceDataset(DEFAULT_X_KEY, dataset, 'first')).toEqual({
    value: testValue,
    type: 'count',
  });
  done();
});

test('Empty dataset returns 0', done => {
  const testDataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [],
  };
  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'sum')).toEqual({
    value: 0,
    type: 'count',
  });
  done();
});

test('Correct function is called', done => {
  const testDataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      {
        key: '1638937721358',
        count: 3,
      },
      {
        key: '1638987721359',
        count: 2,
      },
      {
        key: '1638987721358',
        count: 8,
      },
      {
        key: '1638987721358',
        count: 5,
      },
      {
        key: '1638987721358',
        count: 4,
      },
    ],
  };

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'sum')).toEqual({
    value: 22,
    type: 'count',
  });

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'min')).toEqual({
    value: 2,
    type: 'count',
  });

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'max')).toEqual({
    value: 8,
    type: 'count',
  });

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'last')).toEqual({
    value: 4,
    type: 'count',
  });

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'first')).toEqual({
    value: 3,
    type: 'count',
  });

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'count')).toEqual({
    value: 5,
    type: 'count',
  });

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'avg')).toEqual({
    value: 4.4,
    type: 'count',
  });

  done();
});

test('Source dataset is sanitized', done => {
  const testDataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      {
        key: '1638937721358',
        count: 3,
      },
      {
        key: '1638987721359',
        count: 2,
      },
      {
        key: '1638987721368',
        count: 'thisisastring',
      },
      {
        key: '1638987721378',
        count: Date.now().toString(),
      },
      {
        key: '1638987721328',
        count: true,
      },
      {
        key: '1638987721318',
        count: undefined,
      },
    ],
  };

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'sum')).toEqual({
    value: 5,
    type: 'count',
  });

  done();
});

test('Only data points with valid keys are kept', done => {
  const testDataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      {
        key: '1638937721358',
        count: 3,
      },
      {
        key: '1638987721359',
        count: 2,
      },
      {
        mykey: '1638987721368',
        count: 4,
      },
      {
        otherkey: '1638987721378',
        count: 5,
      },
      {
        justanotherkey: '1638987721328',
        count: 7,
      },
    ],
  };

  expect(reduceDataset('mykey', testDataset, 'sum')).toEqual({
    value: 4,
    type: 'count',
  });

  done();
});

test('Sub buckets are ignored', done => {
  const testDataset: any = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      {
        key: '1638937721358',
        count: 3,
        buckets: [
          {
            key: '1638937721358',
            count: 3,
          },
          {
            key: '1638937721358',
            count: 3,
          },
        ],
      },
      {
        key: '1638987721359',
        count: 2,
      },
    ],
  };

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'sum')).toEqual({
    value: 5,
    type: 'count',
  });

  done();
});

test('Cardinality buckets work', done => {
  const cardinalityDataset: any = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['value'],
    },
    dataset: [
      {
        key: 'cardinality_id',
        value: 4,
        buckets: [],
      },
    ],
  };

  expect(reduceDataset(DEFAULT_X_KEY, cardinalityDataset, 'first')).toEqual({
    value: 4,
    type: 'count',
  });

  done();
});

test('Correctly selects the correct series from data points', done => {
  const testDataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['anotherseries', 'count', 'value'],
    },
    dataset: [
      {
        key: '1638937721358',
        count: 3,
      },
      {
        key: '1638987721359',
        count: 2,
      },
      {
        key: '1638987721368',
        anotherseries: 5,
        count: 150,
        value: 280,
      },
      {
        key: '1638987721378',
        anotherseries: 6,
      },
      {
        key: '1638987721328',
        value: 7,
      },
    ],
  };

  expect(reduceDataset(DEFAULT_X_KEY, testDataset, 'sum')).toEqual({
    value: 11,
    type: 'count',
  });

  done();
});
