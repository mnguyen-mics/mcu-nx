import {
  ReportRequestBody,
  DateRange,
  Dimension,
  Metric,
  DimensionFilterClause,
} from '../models/report/ReportRequestBody';
import McsMoment, { isNowFormat } from './McsMoment';

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
  | 'avg_number_of_transactions'
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
): ReportRequestBody<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension> {
  const UTC = !(isNowFormat(dateRanges[0].start_date) && isNowFormat(dateRanges[0].end_date));

  const formatedDateRange = [
    {
      start_date: new McsMoment(dateRanges[0].start_date)
        .toMoment()
        .utc(UTC)
        .startOf('day')
        .format()
        .replace('Z', ''),
      end_date: new McsMoment(dateRanges[0].end_date)
        .toMoment()
        .utc(UTC)
        .endOf('day')
        .format()
        .replace('Z', ''),
    },
  ];

  return buildReport(
    dimensions || [],
    metrics,
    formatedDateRange,
    dimensionFilterClauses,
    sampling,
  );
}

function buildReport(
  dimensions: Array<Dimension<ActivitiesAnalyticsDimension>>,
  metrics: Array<Metric<ActivitiesAnalyticsMetric>>,
  dateRanges: DateRange[],
  dimensionFilterClauses?: DimensionFilterClause,
  sampling?: number,
): ReportRequestBody<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension> {
  const report: ReportRequestBody<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension> = {
    date_ranges: dateRanges,
    dimensions,
    dimension_filter_clauses: dimensionFilterClauses,
    metrics: metrics,
    sample_factor: sampling || 1,
  };
  return report;
}
