import { AggregateDataset } from '../ChartDataFormater';

export function percentages(xKey: string, dataset: AggregateDataset): AggregateDataset {
  const datasetTitle = dataset.metadata.seriesTitles[0];

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
