import { ReduceType } from '../../models/dashboards/dataset/common';
import {
  AggregateDataset,
  CountDataset,
  AbstractDataset,
} from '../../models/dashboards/dataset/dataset_tree';

export function reduceDataset(
  xKey: string,
  dataset: AbstractDataset,
  reduceType: ReduceType,
): CountDataset {
  if (dataset.type === 'count') return dataset as CountDataset;

  const aggregateSourceDataset = dataset as AggregateDataset;
  const valuesKey = aggregateSourceDataset.metadata.seriesTitles[0];

  const sanitizedValues: number[] = aggregateSourceDataset.dataset
    .filter(line => typeof line[xKey] === 'string')
    .filter(line => typeof line[valuesKey] === 'number')
    .map(line => line[valuesKey] as number);

  let returnValue = 0;
  if (reduceType === 'avg')
    returnValue = sanitizedValues.reduce((a, b) => a + b, 0) / sanitizedValues.length;
  if (reduceType === 'count') returnValue = sanitizedValues.length;
  if (reduceType === 'first') returnValue = sanitizedValues[0];
  if (reduceType === 'last') returnValue = sanitizedValues[sanitizedValues.length - 1];
  if (reduceType === 'max') returnValue = Math.max(...sanitizedValues);
  if (reduceType === 'min') returnValue = Math.min(...sanitizedValues);
  if (reduceType === 'sum') returnValue = sanitizedValues.reduce((a, b) => a + b, 0);

  return {
    value: returnValue,
    type: 'count',
  };
}
