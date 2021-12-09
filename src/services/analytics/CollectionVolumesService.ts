import ApiService from '../ApiService';
import { injectable } from 'inversify';
import { ReportViewResponse } from '../../models/report/ReportView';
import {
  ReportRequestBody,
  DimensionFilterClause,
  Metric,
  Dimension,
  DateRange,
} from '../../models/report/ReportRequestBody';
import {
  buildCollectionVolumesRequestBody,
  CollectionVolumesDimension,
  CollectionVolumesMetric,
} from '../../utils/analytics/CollectionVolumesReportHelper';
import { IAnalyticsService } from './AnalyticsService';

@injectable()
export class CollectionVolumesService
  implements IAnalyticsService<CollectionVolumesMetric, CollectionVolumesDimension>
{
  getAnalytics(
    datamartId: string,
    metrics: Array<Metric<CollectionVolumesMetric>>,
    dateRange: DateRange[],
    dimensions?: Array<Dimension<CollectionVolumesDimension>>,
    dimensionFilterClauses?: DimensionFilterClause,
    sampling?: number,
  ): Promise<ReportViewResponse> {
    const report: ReportRequestBody<CollectionVolumesMetric, CollectionVolumesDimension> =
      buildCollectionVolumesRequestBody(
        metrics,
        dateRange,
        dimensions,
        dimensionFilterClauses,
        sampling,
      );
    const endpoint = `platform_monitoring/collections`;
    return ApiService.postRequest(endpoint, report);
  }
}
