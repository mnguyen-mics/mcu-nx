import {
  isAggregateResult,
  isCountResult,
  OTQLBucket,
  OTQLResult,
} from '../models/datamart/graphdb/OTQLResult';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { ChartType } from '../services/ChartDatasetService';
import { ReportView } from '../models/report/ReportView';
import { bucketizeReportView, normalizeReportView } from './MetricHelper';
import { omit } from 'lodash';

export type DatasetType = 'aggregate' | 'count';

export abstract class AbstractDataset {
  type: DatasetType;
}

interface DatasetMetadata {
  seriesTitles: string[];
}

export interface AggregateDataset extends AbstractDataset {
  metadata: DatasetMetadata;
  dataset: Dataset;
}

export interface CountDataset extends AbstractDataset {
  value: number;
}

export function formatDatasetAsKeyValueForOtql(
  buckets: OTQLBucket[],
  xKey: string,
  yKey: string,
): Dataset {
  const dataset: any = buckets.map(buck => {
    const value = buck.aggregations?.metrics[0] ? buck.aggregations.metrics[0].value : buck.count;
    return {
      [xKey]: buck.key as string,
      [yKey]: value as number,
      buckets: formatDatasetAsKeyValueForOtql(
        buck.aggregations?.buckets[0]?.buckets || [],
        xKey,
        yKey,
      ),
    };
  });
  return dataset;
}

export function formatDatasetAsKeyValueForReportView(
  xKey: string,
  datas: ReportView,
  dimensions: string[],
  metric: string,
  seriesTitle?: string,
): Dataset {
  const normalizedReportView = normalizeReportView(datas);

  if (seriesTitle) {
    const normalizeReportViewWithSeriesTitle = normalizedReportView.map(rv => {
      return omit(
        {
          ...rv,
          [seriesTitle]: rv[metric],
        },
        [metric],
      );
    });
    return (
      bucketizeReportView(xKey, normalizeReportViewWithSeriesTitle, dimensions) ||
      normalizeReportViewWithSeriesTitle
    );
  }

  return bucketizeReportView(xKey, normalizedReportView, dimensions) || normalizedReportView;
}

export function getXKeyForChart(type: ChartType, xKey?: string) {
  switch (type.toLowerCase()) {
    case 'pie':
      return 'key';
    case 'radar':
      return xKey ? xKey : 'key';
    case 'bars':
      return xKey ? xKey : 'key';
    default:
      return 'key';
  }
}

export function formatDatasetForOtql(
  dataResult: OTQLResult,
  xKey: string,
  seriesTitle: string,
): AbstractDataset | undefined {
  if (dataResult && isAggregateResult(dataResult.rows) && !isCountResult(dataResult.rows)) {
    const buckets = dataResult.rows[0]?.aggregations?.buckets[0]?.buckets || [];

    const yKey = {
      key: seriesTitle,
      message: seriesTitle,
    };
    const dataset = formatDatasetAsKeyValueForOtql(buckets, xKey, yKey.key);

    return {
      metadata: {
        seriesTitles: [seriesTitle],
      },
      type: 'aggregate',
      dataset: dataset,
    } as AggregateDataset;
  } else if (isCountResult(dataResult.rows)) {
    const value = dataResult.rows[0].count;
    return {
      type: 'count',
      value: value,
    } as CountDataset;
  } else {
    return undefined;
  }
}

export function formatDatasetForReportView(
  dataResult: ReportView,
  xKey: string,
  metricNames: string[],
  dimensionNames: string[],
  seriesTitle?: string,
): AbstractDataset | undefined {
  if (dimensionNames.length > 0) {
    const dataset = formatDatasetAsKeyValueForReportView(
      xKey,
      dataResult,
      dimensionNames,
      metricNames[0],
      seriesTitle,
    );
    return {
      metadata: {
        seriesTitles: metricNames.map(m => seriesTitle || m.toLocaleLowerCase()),
      },
      type: 'aggregate',
      dataset: dataset,
    } as AggregateDataset;
  } else {
    const normalizedReportView = normalizeReportView(dataResult);

    const value = normalizedReportView[0][metricNames[0]];
    return {
      type: 'count',
      value: value,
    } as CountDataset;
  }
}
