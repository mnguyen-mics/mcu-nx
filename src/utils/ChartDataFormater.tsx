import {
  isAggregateResult,
  isCountResult,
  OTQLBucket,
  OTQLResult,
} from '../models/datamart/graphdb/OTQLResult';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { ChartType } from '../services/ChartDatasetService';
import { ReportView } from '../models/report/ReportView';
import {
  ActivitiesAnalyticsDimension,
  ActivitiesAnalyticsMetric,
} from './ActivitiesAnalyticsReportHelper';
import { normalizeReportView } from './MetricHelper';

type DatasetType = 'aggregate' | 'count';

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
    return {
      [xKey]: buck.key as string,
      [yKey]: buck.count as number,
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
  datas: ReportView,
  xKey: string,
  yKey: string,
  metricName: ActivitiesAnalyticsMetric,
  dimensionName: ActivitiesAnalyticsDimension,
): Dataset {
  const normalizedReportView = normalizeReportView(datas);

  const dataset: any = normalizedReportView.map(data => {
    return {
      [xKey]: data[dimensionName],
      [yKey]: data[metricName],
    };
  });
  return dataset;
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
  seriesTitle: string,
  metric: ActivitiesAnalyticsMetric,
  dimension?: ActivitiesAnalyticsDimension,
): AbstractDataset | undefined {
  if (dimension) {
    const yKey = {
      key: seriesTitle,
      message: seriesTitle,
    };
    const dataset = formatDatasetAsKeyValueForReportView(
      dataResult,
      xKey,
      yKey.key,
      metric,
      dimension,
    );
    return {
      metadata: {
        seriesTitles: [seriesTitle],
      },
      type: 'aggregate',
      dataset: dataset,
    } as AggregateDataset;
  } else {
    const normalizedReportView = normalizeReportView(dataResult);

    const value = normalizedReportView[0][metric];
    return {
      type: 'count',
      value: value,
    } as CountDataset;
  }
}
