import { AggregateDataset } from '../../models/dashboards/dataset/dataset_tree';
import { formatDate } from '../DateHelper';
import DatasetDateFormatter from '../transformations/FormatDatesTransformation';

const X_KEY = 'key';

const datasetDateFormatter = new DatasetDateFormatter((date, format) =>
  formatDate(date, format, true),
);

test('String value of date is unchanged', done => {
  const date = '2021-07-07 00:00:00';
  const formatted = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
  expect(date).toBe(formatted);
  done();
});

test('List of key / value dataset and timestamp keys', done => {
  const dataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      {
        key: '1638937721358',
        count: 2,
      },
      {
        key: '1638987721359',
        count: 3,
      },
      {
        key: '1638987721358',
        count: 6,
      },
    ],
  };

  const dateOptions = {
    format: 'YYYY-MM-DD hh:mm:ss',
  };

  const formatted = datasetDateFormatter.applyFormatDates(dataset, X_KEY, dateOptions);
  expect(formatted).toEqual({
    dataset: [
      {
        count: 2,
        key: '2021-12-08 04:28:41',
      },
      {
        count: 9,
        key: '2021-12-08 06:22:01',
      },
    ],
    metadata: {
      seriesTitles: ['count'],
    },
    type: 'aggregate',
  });
  done();
});

test('List of key / value dataset and date keys', done => {
  const dataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      {
        key: '2021-12-01 00:10:00',
        count: 2,
      },
      {
        key: '2021-12-02 00:00:00',
        count: 3,
      },
      {
        key: '2021-12-02 00:05:00',
        count: 6,
      },
    ],
  };

  const dateOptions = {
    format: 'YYYY-MM-DD hh',
  };

  const formatted = datasetDateFormatter.applyFormatDates(dataset, X_KEY, dateOptions);
  expect(formatted).toEqual({
    dataset: [
      {
        count: 2,
        key: '2021-12-01 12',
      },
      {
        count: 9,
        key: '2021-12-02 12',
      },
    ],
    metadata: {
      seriesTitles: ['count'],
    },
    type: 'aggregate',
  });
  done();
});

test('List of key / value dataset and invalid date keys', done => {
  const dataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      {
        key: '2021-12-0Y 00:10:00',
        count: 2,
      },
      {
        key: '2021-12-02 00:00:00',
        count: 3,
      },
      {
        key: '2021-12-02 00:05:00',
        count: 6,
      },
    ],
  };

  const dateOptions = {
    format: 'YYYY-MM-DD hh',
  };

  try {
    datasetDateFormatter.applyFormatDates(dataset, X_KEY, dateOptions);
    fail();
  } catch (e) {
    expect(e.message).toBe('Date 2021-12-0Y 00:10:00 is not formatted correctly');
    done();
  }
});

test('List of key / value multiple datasets and valid keys', done => {
  const dataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      {
        key: '2021-12-07 04:10:00',
        count1: 2,
        count2: 4,
      },
      {
        key: '1638937721358',
        count2: 3,
        count3: 6,
      },
      {
        key: '1638937721358',
        count2: 3,
        count3: 6,
      },
      {
        key: '2021-12-08 05:05:00',
        count3: 6,
      },
    ],
  };

  const dateOptions = {
    format: 'YYYY-MM-DD hh',
  };

  const formatted = datasetDateFormatter.applyFormatDates(dataset, X_KEY, dateOptions);
  expect(formatted).toEqual({
    dataset: [
      {
        count1: 2,
        count2: 4,
        key: '2021-12-07 04',
      },
      {
        count2: 6,
        count3: 12,
        key: '2021-12-08 04',
      },
      {
        count3: 6,
        key: '2021-12-08 05',
      },
    ],
    metadata: {
      seriesTitles: ['count'],
    },
    type: 'aggregate',
  });
  done();
});

test('Aggregate dataset with buckets formatted recursively', done => {
  const datapoint1: any = {
    key: '2021-12-07 00:10:00',
    count1: 2,
    count2: 4,
    buckets: [
      {
        key: '2021-12-07 00:10:00',
        count1: 2,
        count2: 4,
      },
      {
        key: '2021-12-08 00:10:00',
        count1: 3,
        count2: 5,
      },
    ],
  };

  const dateOptions = {
    buckets: {
      format: 'YYYY_MM_DD',
    },
  };

  const dataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      datapoint1,
      {
        key: '1638937721358',
        count2: 3,
        count3: 6,
      },
      {
        key: '1638937721358',
        count2: 3,
        count3: 6,
      },
      {
        key: '2021-12-08 00:05:00',
        count3: 6,
      },
    ],
  };

  const formatted = datasetDateFormatter.applyFormatDates(dataset, X_KEY, dateOptions);
  expect(formatted).toEqual({
    dataset: [
      {
        key: '2021-12-07 00:10:00',
        count1: 2,
        count2: 4,
        buckets: [
          {
            key: '2021_12_07',
            count1: 2,
            count2: 4,
          },
          {
            key: '2021_12_08',
            count1: 3,
            count2: 5,
          },
        ],
      },
      {
        key: '1638937721358',
        count2: 6,
        count3: 12,
      },
      {
        key: '2021-12-08 00:05:00',
        count3: 6,
      },
    ],
    metadata: {
      seriesTitles: ['count'],
    },
    type: 'aggregate',
  });
  done();
});

test('Aggregate dataset and dont lose buckets when the point is aggregated', done => {
  const datapoint1: any = {
    key: '1638937721358',
    count1: 2,
    count2: 4,
    buckets: [
      {
        key: '2021-12-07 00:10:00',
        count1: 2,
        count2: 4,
      },
      {
        key: '2021-12-08 00:10:00',
        count1: 3,
        count2: 5,
      },
    ],
  };

  const dateOptions = {
    buckets: {
      format: 'YYYY_MM_DD',
    },
  };

  const dataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      datapoint1,
      {
        key: '1638937721358',
        count2: 3,
        count3: 6,
      },
      {
        key: '1638937721358',
        count2: 3,
        count3: 6,
      },
      {
        key: '2021-12-08 00:05:00',
        count3: 6,
      },
    ],
  };

  const formatted = datasetDateFormatter.applyFormatDates(dataset, X_KEY, dateOptions);
  expect(formatted).toEqual({
    dataset: [
      {
        key: '1638937721358',
        count1: 2,
        count2: 10,
        count3: 12,
        buckets: [
          {
            key: '2021_12_07',
            count1: 2,
            count2: 4,
          },
          {
            key: '2021_12_08',
            count1: 3,
            count2: 5,
          },
        ],
      },
      {
        key: '2021-12-08 00:05:00',
        count3: 6,
      },
    ],
    metadata: {
      seriesTitles: ['count'],
    },
    type: 'aggregate',
  });
  done();
});
