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
import {
  AbstractDataset,
  AggregateDataset,
  CountDataset,
} from '../models/dashboards/dataset/dataset_tree';

export function formatDatasetAsKeyValueForOtql(
  buckets: OTQLBucket[] | undefined,
  xKey: string,
  yKey: string,
): Dataset | undefined {
  const dataset: any = !!buckets
    ? buckets.map(buck => {
        const value = buck.aggregations?.metrics[0]
          ? buck.aggregations.metrics[0].value
          : buck.count;
        return {
          [xKey]: buck.key as string,
          [yKey]: value as number,
          buckets: formatDatasetAsKeyValueForOtql(
            buck.aggregations?.buckets[0]?.buckets || undefined,
            xKey,
            yKey,
          ),
        };
      })
    : undefined;
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
    let buckets = dataResult.rows[0]?.aggregations?.buckets[0]?.buckets || undefined;

    if (dataResult.rows[0]?.aggregations?.metrics[0]?.metric_type === 'cardinality') {
      buckets = [
        {
          key: 'cardinality_id',
          count: dataResult.rows[0]?.aggregations?.metrics[0]?.value,
          aggregations: null,
        },
      ];
    } else if (dataResult.rows[0]?.aggregations?.metrics[0]?.metric_type === 'sum') {
      buckets = [
        {
          key: 'sum_price',
          count: dataResult.rows[0]?.aggregations?.metrics[0]?.value,
          aggregations: null,
        },
      ];
    }

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
      dataset: !!dataset ? dataset : [],
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
): AbstractDataset {
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
