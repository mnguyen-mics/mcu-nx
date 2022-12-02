import {
  buildResourcesUsageRequestBody,
  ResourcesUsageDimension,
} from './../../utils/analytics/ResourcesUsageReportHelper';
import ApiService from '../ApiService';
import { injectable } from 'inversify';
import { ReportViewResponse } from '../../models/report/ReportView';
import {
  ReportRequestBody,
  DimensionFilterClause,
  Metric,
  Dimension,
  DateRange,
  OrderBy,
} from '../../models/report/ReportRequestBody';
import { IAnalyticsService } from './AnalyticsService';
import { ResourcesUsageMetric } from '../../utils/analytics/ResourcesUsageReportHelper';

@injectable()
export class ResourcesUsageService
  implements IAnalyticsService<ResourcesUsageMetric, ResourcesUsageDimension>
{
  getAnalytics(
    datamartId: string,
    metrics: Array<Metric<ResourcesUsageMetric>>,
    dateRange: DateRange[],
    dimensions?: Array<Dimension<ResourcesUsageDimension>>,
    dimensionFilterClauses?: DimensionFilterClause,
    sampling?: number,
    orderBy?: OrderBy,
  ): Promise<ReportViewResponse> {
    const report: ReportRequestBody<ResourcesUsageMetric, ResourcesUsageDimension> =
      buildResourcesUsageRequestBody(
        metrics,
        dateRange,
        dimensions,
        dimensionFilterClauses,
        sampling,
        orderBy,
      );
    const endpoint = `platform_monitoring/resources_usage`;
    return ApiService.postRequest(endpoint, report);
  }
}
