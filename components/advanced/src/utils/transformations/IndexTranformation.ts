import { IndexOptions } from '../../models/dashboards/dataset/common';
import { AbstractDataset, AggregateDataset } from '../../models/dashboards/dataset/dataset_tree';
import { percentages } from './PercentagesTransformation';

export function indexDataset(
  sourceDataset: AggregateDataset,
  toBeComparedWithDataset: AggregateDataset,
  xKey: string,
  indexOptions: IndexOptions,
): AbstractDataset | undefined {
  const sourceTitle = sourceDataset.metadata.seriesTitles[0];
  const comparedDatasetTitle = toBeComparedWithDataset.metadata.seriesTitles[0];

  const toBeComparedWithPercentageDataset = percentages(xKey, toBeComparedWithDataset);

  const sourcePercentageDataset = percentages(xKey, sourceDataset);

  const minimumPercentage = indexOptions.minimum_percentage || 0;
  const sourceIndexDataset = sourcePercentageDataset.dataset
    .filter(line => (line[sourceTitle] || 0) >= minimumPercentage)
    .map(line => {
      const lineValue = line[`${sourceTitle}-count`] as number;
      const linePercentage = line[sourceTitle] as number;
      const toBecomparedWithPercentageLine = toBeComparedWithPercentageDataset.dataset.find(
        comparedLine => comparedLine[xKey] === line[xKey],
      );
      const toBeComparedWithPercentage =
        toBecomparedWithPercentageLine && toBecomparedWithPercentageLine[comparedDatasetTitle]
          ? (toBecomparedWithPercentageLine[comparedDatasetTitle] as number)
          : 0;
      const lineIndex =
        toBeComparedWithPercentage !== 0 && linePercentage
          ? (linePercentage / toBeComparedWithPercentage) * 100
          : 0;
      return {
        [xKey]: line[xKey],
        [`${sourceTitle}-percentage`]: linePercentage
          ? parseFloat(linePercentage?.toFixed(2))
          : undefined,
        [`${sourceTitle}-count`]: lineValue,
        [sourceTitle]: parseFloat(lineIndex?.toFixed(2)),
      };
    });

  const limit = indexOptions.limit || 10;
  const orderFunction =
    indexOptions.sort?.toLocaleLowerCase() === 'ascending'
      ? (a: number, b: number) => a - b
      : (a: number, b: number) => b - a;
  const refinedIndexDataset = sourceIndexDataset
    .sort((a, b) => {
      const firstIndex = a[sourceTitle] as number;
      const secondIndex = b[sourceTitle] as number;
      return orderFunction(firstIndex, secondIndex);
    })
    .slice(0, limit);
  return {
    type: 'aggregate',
    dataset: refinedIndexDataset,
    metadata: { seriesTitles: [sourceTitle] },
  } as AggregateDataset;
}
