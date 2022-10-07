import {
  DateRange,
  Dimension,
  Metric,
  DimensionFilterClause,
  OrderBy,
} from '../../models/report/ReportRequestBody';
import { buildAnalyticsRequestBody } from './Common';

export type ResourcesUsageDimension =
  | 'community_id'
  | 'date_time'
  | 'execution_id'
  | 'organisation_id'
  | 'resource_id'
  | 'source'
  | 'sub_source';

export type ResourcesUsageMetric = 'scan_cost' | 'read_cost' | 'write_cost';

export function buildResourcesUsageRequestBody(
  metrics: Array<Metric<ResourcesUsageMetric>>,
  dateRanges: DateRange[],
  dimensions?: Array<Dimension<ResourcesUsageDimension>>,
  dimensionFilterClauses?: DimensionFilterClause,
  sampling?: number,
  orderBy?: OrderBy,
) {
  return buildAnalyticsRequestBody<ResourcesUsageMetric, ResourcesUsageDimension>(
    metrics,
    dateRanges,
    dimensions,
    dimensionFilterClauses,
    sampling,
    orderBy,
  );
}
