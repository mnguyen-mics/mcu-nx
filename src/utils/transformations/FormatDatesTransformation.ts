import {
  Datapoint,
  Dataset,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { DateOptions } from '../../models/dashboards/dataset/common';
import { AbstractDataset, AggregateDataset } from '../../models/dashboards/dataset/dataset_tree';
import { formatDate } from '../DateHelper';

class DatasetDateFormatter {
  formatDate: (date: string, format: string) => string;

  constructor(_formatDate: (date: string, format: string) => string) {
    this.formatDate = _formatDate;
  }

  addSkippedValues(from: Datapoint, to: Datapoint): void {
    Object.keys(from).forEach(key => {
      if (!to[key]) to[key] = from[key];
    });
  }

  reaggregateByKey(dataset: Dataset, xKey: string) {
    const result: { [k: string]: any } = {};
    dataset.forEach(datapoint => {
      const currentAcc = result[datapoint[xKey] as string] || {};
      const newAcc: { [k: string]: any } = {};
      Object.keys(datapoint).forEach(key => {
        if (typeof datapoint[key] === 'number' && key !== xKey) {
          const currentValue = currentAcc[key] || 0;
          newAcc[key] = currentValue + datapoint[key];
        } else {
          newAcc[key] = datapoint[key];
        }
      });
      newAcc[xKey] = datapoint[xKey];
      this.addSkippedValues(currentAcc, newAcc);
      result[datapoint[xKey] as string] = newAcc;
    });
    const aggregatedDataset: Dataset = [];
    Object.keys(result).forEach(k => {
      aggregatedDataset.push(result[k]);
    });
    return aggregatedDataset;
  }

  applyFormatDatesHelper(dataset: Dataset, xKey: string, dateOptions: DateOptions): Dataset {
    const formattedDates = dataset.map(datapoint => {
      const formattedBuckets: Dataset | undefined =
        !!datapoint.buckets && !!dateOptions.buckets
          ? this.applyFormatDatesHelper(datapoint.buckets, xKey, dateOptions.buckets)
          : undefined;
      const newDatapoint: Datapoint = {
        ...datapoint,
        [xKey]: formatDate(datapoint[xKey] as string, dateOptions.format),
      };
      if (!!formattedBuckets) newDatapoint.buckets = formattedBuckets;
      return newDatapoint;
    });
    return this.reaggregateByKey(formattedDates, xKey);
  }

  applyFormatDates(
    dataset: AbstractDataset,
    xKey: string,
    dateOptions: DateOptions,
  ): AbstractDataset {
    if (dataset.type === 'aggregate') {
      const aggregateDataset = dataset as AggregateDataset;
      return {
        metadata: aggregateDataset.metadata,
        type: aggregateDataset.type,
        dataset: this.applyFormatDatesHelper(aggregateDataset.dataset, xKey, dateOptions),
      } as AggregateDataset;
    } else {
      throw Error(
        `Dataset type ${dataset.type} is not compatible with format-dates transformation`,
      );
    }
  }
}
export default DatasetDateFormatter;
