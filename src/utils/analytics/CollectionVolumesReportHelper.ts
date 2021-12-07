import {
  DateRange,
  Dimension,
  Metric,
  DimensionFilterClause,
} from '../../models/report/ReportRequestBody';
import { buildAnalyticsRequestBody } from './Common';

export type CollectionVolumesDimension =
  | 'organisation_id'
  | 'community_id'
  | 'collection'
  | 'date_time';

export type CollectionVolumesMetric = 'count';

export function buildCollectionVolumesRequestBody(
  metrics: Array<Metric<CollectionVolumesMetric>>,
  dateRanges: DateRange[],
  dimensions?: Array<Dimension<CollectionVolumesDimension>>,
  dimensionFilterClauses?: DimensionFilterClause,
  sampling?: number,
) {
  return buildAnalyticsRequestBody<CollectionVolumesMetric, CollectionVolumesDimension>(
    metrics,
    dateRanges,
    dimensions,
    dimensionFilterClauses,
    sampling,
  );
}
