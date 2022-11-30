import {
  Datapoint,
  Dataset,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { Index } from '@mediarithmics-private/mcs-components-library/lib/utils';
import numeral from 'numeral';
import { ReportView } from '../models/report/ReportView';
export function formatMetric(
  value: any,
  numeralFormat: string,
  prefix: string = '',
  suffix: string = '',
) {
  if (value !== undefined && !isNaN(value)) {
    return `${prefix}${numeral(value).format(numeralFormat)}${suffix}`;
  }
  return '-';
}

/**
 * Normalize a reportView to an object like the following :
 *
 * {
 *  columns_headers:["campaign_id","impressions","clicks"]
 *  rows: [["1812",4,0],["1814",38258,86]]
 * }
 *
 * TO
 *
 * [
 *  {
 *    campaign_id: "1812",
 *    impressions: 4
 *  },
 *  ...
 * ]
 *
 * @param {Object} reportView an object coming from performance api
 * @return {Object} normalized object
 */
export function normalizeReportView<T = Index<any>>(reportView: ReportView): T[] {
  const headers = reportView.columns_headers;
  const rows = reportView.rows;
  return rows.map(row => {
    return headers.reduce(
      (acc, header, index) => ({
        ...acc,
        [header]: row[index],
      }),
      {},
    );
  }) as T[];
}

export function sumMetrics(datapoints: Datapoint[], dimensions: string[]): Datapoint {
  return datapoints.reduce((acc, datapoint) => {
    let nextAcc = acc;
    Object.keys(datapoint).forEach((fieldKey: string) => {
      if (dimensions.indexOf(fieldKey) === -1) {
        const currentValue = (acc[fieldKey] as number) || undefined;
        const toAdd = (datapoint[fieldKey] as number) || undefined;
        nextAcc = {
          ...nextAcc,
          [fieldKey]:
            currentValue === undefined && toAdd === undefined
              ? undefined
              : (currentValue || 0) + (toAdd || 0),
        };
      }
    });
    return nextAcc;
  }, {});
}

export function bucketizeReportView(
  xKey: string,
  dataset: Dataset,
  dimensions: string[],
): Dataset | undefined {
  if (dimensions.length === 0) return undefined;
  else {
    const currentDimension = dimensions[0].toLowerCase() as string;
    const leftDimensions = dimensions.splice(1);
    let childDatasets: { [key: string]: any[] } = {};
    // Group datapoints by current dimension
    dataset.forEach(datapoint => {
      const currentAcc = childDatasets[datapoint[currentDimension] as string] || [];
      childDatasets = {
        ...childDatasets,
        [datapoint[currentDimension] as string]: currentAcc.concat([datapoint]),
      };
      delete datapoint[currentDimension];
    });
    // Apply the grouping recursively on children datasets, while summing metrics at each level
    return Object.keys(childDatasets).reduce((acc: any, key: string) => {
      const metrics = sumMetrics(childDatasets[key], leftDimensions);
      return acc.concat([
        {
          [xKey]: key,
          ...metrics,
          buckets: bucketizeReportView(xKey, childDatasets[key], leftDimensions),
        },
      ]);
    }, []);
  }
}
