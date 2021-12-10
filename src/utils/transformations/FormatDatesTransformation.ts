import {
  Datapoint,
  Dataset,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { DateOptions } from '../../services/ChartDatasetService';
import { AbstractDataset, AggregateDataset } from '../ChartDataFormater';
import { formatDate } from '../DateHelper';

class DatasetDateFormatter {
  formatDate: (date: string, format: string) => Promise<string>;

  constructor(_formatDate: (date: string, format: string) => Promise<string>) {
    this.formatDate = _formatDate;
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
      result[datapoint[xKey] as string] = newAcc;
    });
    const aggregatedDataset: Dataset = [];
    Object.keys(result).forEach(k => {
      aggregatedDataset.push(result[k]);
    });
    return aggregatedDataset;
  }

  applyFormatDatesHelper(
    dataset: Dataset,
    xKey: string,
    dateOptions: DateOptions,
  ): Promise<Dataset> {
    const formattedDatesPromises = dataset.map(datapoint => {
      const formattedBucketsPromise: Promise<Dataset | undefined> =
        !!datapoint.buckets && !!dateOptions.buckets
          ? this.applyFormatDatesHelper(datapoint.buckets, xKey, dateOptions.buckets)
          : Promise.resolve(undefined);
      return formattedBucketsPromise.then((formattedBuckets: Dataset | undefined) => {
        return formatDate(datapoint[xKey] as string, dateOptions.format).then(formattedDate => {
          const newDatapoint: Datapoint = {
            ...datapoint,
            [xKey]: formattedDate,
          };
          if (!!formattedBuckets) newDatapoint.buckets = formattedBuckets;
          return newDatapoint;
        });
      });
    });
    return Promise.all(formattedDatesPromises).then(formattedDatesDataset => {
      return this.reaggregateByKey(formattedDatesDataset, xKey);
    });
  }

  applyFormatDates(
    dataset: AbstractDataset,
    xKey: string,
    dateOptions: DateOptions,
  ): Promise<AbstractDataset> {
    if (dataset.type === 'aggregate') {
      const aggregateDataset = dataset as AggregateDataset;
      return this.applyFormatDatesHelper(aggregateDataset.dataset, xKey, dateOptions).then(
        formattedDataset => {
          return {
            metadata: aggregateDataset.metadata,
            type: aggregateDataset.type,
            dataset: formattedDataset,
          };
        },
      );
    } else {
      return Promise.reject(
        `Dataset type ${dataset.type} is not compatible with format-dates transformation`,
      );
    }
  }
}
export default DatasetDateFormatter;
