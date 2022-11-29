import { AggregateDataset } from '../../models/dashboards/dataset/dataset_tree';
import { Datapoint } from '../../../node_modules/@mediarithmics-private/mcs-components-library/lib/components/charts/utils.d';

export function percentages(xKey: string, dataset: AggregateDataset): AggregateDataset {
  return uniteSeries(
    dataset.metadata.seriesTitles.map(datasetTitle => {
      return percentagesBySerie(xKey, dataset, datasetTitle);
    }),
  );
}

export function percentagesBySerie(
  xKey: string,
  dataset: AggregateDataset,
  datasetTitle: string,
): AggregateDataset {
  const sanitizedDataset = dataset.dataset.filter(line => typeof line[datasetTitle] === 'number');
  const datasetTotalValue = sanitizedDataset
    .map(line => {
      return line[datasetTitle];
    })
    .reduce((a: number, b: number) => a + b, 0) as number;
  const percentageDataset = sanitizedDataset.map(line => {
    const lineValue = line[datasetTitle] as number;
    const linePercentage =
      datasetTotalValue !== 0 ? (lineValue / datasetTotalValue) * 100 : undefined;
    return {
      [xKey]: line[xKey],
      [datasetTitle]: linePercentage ? parseFloat(linePercentage?.toFixed(2)) : undefined,
      [`${datasetTitle}-count`]: lineValue,
    };
  });

  return {
    metadata: {
      seriesTitles: [datasetTitle],
    },
    dataset: percentageDataset,
    type: 'aggregate',
  };
}

export function uniteSeries(datasets: AggregateDataset[]): AggregateDataset {
  if (datasets.length > 0) {
    const keys = datasets[0].dataset.map(line => line.key);

    const resultDataset = keys.map(key => {
      return uniteLines(
        datasets
          .map(dataset => {
            return dataset.dataset.find(line => line.key === key);
          })
          .filter(line => line !== undefined) as Datapoint[],
      );
    });

    return {
      metadata: {
        seriesTitles: datasets.map(dataset => dataset.metadata.seriesTitles[0]),
      },
      type: datasets[0].type,
      dataset: resultDataset,
    } as AggregateDataset;
  } else {
    return {
      metadata: {
        seriesTitles: [],
      },
      dataset: [],
      type: 'aggregate',
    } as AggregateDataset;
  }
}

export function uniteLines(datapoints: Datapoint[]): Datapoint {
  return datapoints.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      ...currentValue,
    };
  }, {});
}
