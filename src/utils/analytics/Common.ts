import {
  ReportRequestBody,
  DateRange,
  Dimension,
  Metric,
  DimensionFilterClause,
  OrderBy,
} from '../../models/report/ReportRequestBody';
import McsMoment, { isNowFormat } from '../McsMoment';

export function checkIsDateInvalid(formattedDate: string, date: string) {
  if (formattedDate === 'Invalid date') {
    throw new Error(`Date '${date}' is not formatted correctly`);
  }
}

export function buildAnalyticsRequestBody<M, D>(
  metrics: Array<Metric<M>>,
  dateRanges: DateRange[],
  dimensions?: Array<Dimension<D>>,
  dimensionFilterClauses?: DimensionFilterClause,
  sampling?: number,
  orderBy?: OrderBy,
): ReportRequestBody<M, D> {
  const UTC = !(isNowFormat(dateRanges[0].start_date) && isNowFormat(dateRanges[0].end_date));

  const formatedDateRange = [
    {
      start_date: isNowFormat(dateRanges[0].start_date)
        ? dateRanges[0].start_date
        : new McsMoment(dateRanges[0].start_date)
            .toMoment()
            .utc(UTC)
            .startOf('day')
            .format()
            .replace('Z', ''),
      end_date: isNowFormat(dateRanges[0].end_date)
        ? dateRanges[0].end_date
        : new McsMoment(dateRanges[0].end_date)
            .toMoment()
            .utc(UTC)
            .endOf('day')
            .format()
            .replace('Z', ''),
    },
  ];

  checkIsDateInvalid(formatedDateRange[0].start_date, dateRanges[0].start_date);
  checkIsDateInvalid(formatedDateRange[0].end_date, dateRanges[0].end_date);

  return buildReport<M, D>(
    dimensions || [],
    metrics,
    formatedDateRange,
    dimensionFilterClauses,
    sampling,
    orderBy,
  );
}

function buildReport<M, D>(
  dimensions: Array<Dimension<D>>,
  metrics: Array<Metric<M>>,
  dateRanges: DateRange[],
  dimensionFilterClauses?: DimensionFilterClause,
  sampling?: number,
  orderBy?: OrderBy,
): ReportRequestBody<M, D> {
  const report: ReportRequestBody<M, D> = {
    date_ranges: dateRanges,
    dimensions,
    dimension_filter_clauses: dimensionFilterClauses,
    metrics: metrics,
    sample_factor: sampling || 1,
    order_by: orderBy,
  };
  return report;
}
