import {
  DateRange,
  Dimension,
  Metric,
  DimensionFilterClause,
} from '../../models/report/ReportRequestBody';
import { buildAnalyticsRequestBody } from './Common';

export type ActivitiesAnalyticsDimension =
  | 'date_yyyy_mm_dd'
  | 'channel_id'
  | 'channel_name'
  | 'device_form_factor'
  | 'device_browser_family'
  | 'device_os_family'
  | 'origin_source'
  | 'origin_channel'
  | 'resource_name'
  | 'number_of_confirmed_transactions'
  | 'event_type';

export type ActivitiesAnalyticsMetric =
  | 'users'
  | 'sessions'
  | 'avg_session_duration'
  | 'avg_number_of_user_events'
  | 'conversion_rate'
  | 'avg_number_of_transactions_per_user_point'
  | 'number_of_transactions'
  | 'avg_transaction_amount'
  | 'avg_revenue_per_user_point'
  | 'revenue';

export function buildActivitiesAnalyticsRequestBody(
  metrics: Array<Metric<ActivitiesAnalyticsMetric>>,
  dateRanges: DateRange[],
  dimensions?: Array<Dimension<ActivitiesAnalyticsDimension>>,
  dimensionFilterClauses?: DimensionFilterClause,
  sampling?: number,
) {
  return buildAnalyticsRequestBody<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension>(
    metrics,
    dateRanges,
    dimensions,
    dimensionFilterClauses,
    sampling,
  );
}
