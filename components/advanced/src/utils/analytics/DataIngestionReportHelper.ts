import {
  DateRange,
  Dimension,
  Metric,
  DimensionFilterClause,
  OrderBy,
} from '../../models/report/ReportRequestBody';
import { buildAnalyticsRequestBody } from './Common';

export type DataIngestionDimension =
  | 'community_id'
  | 'organisation_id'
  | 'datamart_id'
  | 'date_time'
  | 'date_yyyy_mm_dd'
  | 'date_yyyy_mm_dd_hh'
  | 'date_yyyy_mm_dd_hh_mm'
  | 'event_ts'
  | 'event_name'
  | 'channel_id'
  | 'pipeline_step'
  | 'error_type';

export type DataIngestionMetric = 'event_count' | 'error_count';

export function buildDataIngestionRequestBody(
  metrics: Array<Metric<DataIngestionMetric>>,
  dateRanges: DateRange[],
  dimensions?: Array<Dimension<DataIngestionDimension>>,
  dimensionFilterClauses?: DimensionFilterClause,
  sampling?: number,
  orderBy?: OrderBy,
) {
  return buildAnalyticsRequestBody<DataIngestionMetric, DataIngestionDimension>(
    metrics,
    dateRanges,
    dimensions,
    dimensionFilterClauses,
    sampling,
    orderBy,
  );
}
