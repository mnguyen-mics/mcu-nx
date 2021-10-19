import {
  isAggregateResult,
  isCountResult,
  OTQLBucket,
  OTQLResult,
} from '../../models/datamart/graphdb/OTQLResult';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import {
  BarChartOptions,
  ChartConfig,
  ChartType,
  PieChartOptions,
  RadarChartOptions,
  MetricChartOptions,
} from './ChartDataFetcher';

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

export function formatDatasetAsKeyValue(
  buckets: OTQLBucket[],
  xKey: string,
  yKey: string,
): Dataset {
  const dataset: any = buckets.map(buck => {
    return {
      [xKey]: buck.key as string,
      [yKey]: buck.count as number,
      buckets: formatDatasetAsKeyValue(buck.aggregations?.buckets[0]?.buckets || [], xKey, yKey),
    };
  });
  return dataset;
}

export function getXKeyForChart(
  type: ChartType,
  options?: PieChartOptions | RadarChartOptions | BarChartOptions | MetricChartOptions,
) {
  switch (type.toLowerCase()) {
    case 'pie':
      return 'key';
    case 'radar':
      return options && (options as RadarChartOptions).xKey
        ? (options as RadarChartOptions).xKey
        : 'key';
    case 'bars':
      return options && (options as BarChartOptions).xKey
        ? (options as BarChartOptions).xKey
        : 'key';
    default:
      return 'key';
  }
}

export function formatDataset(
  dataResult: OTQLResult,
  chartConfig: ChartConfig,
  seriesTitle: string,
): AbstractDataset | undefined {
  if (dataResult && isAggregateResult(dataResult.rows) && !isCountResult(dataResult.rows)) {
    const buckets = dataResult.rows[0]?.aggregations?.buckets[0]?.buckets || [];

    const xKey = getXKeyForChart(chartConfig.type, chartConfig.options);
    const yKey = {
      key: seriesTitle,
      message: seriesTitle,
    };
    const dataset = formatDatasetAsKeyValue(buckets, xKey, yKey.key);
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
