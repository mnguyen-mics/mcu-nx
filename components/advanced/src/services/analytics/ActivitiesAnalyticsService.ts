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
import {
  buildActivitiesAnalyticsRequestBody,
  ActivitiesAnalyticsDimension,
  ActivitiesAnalyticsMetric,
} from '../../utils/analytics/ActivitiesAnalyticsReportHelper';
import { IAnalyticsService } from './AnalyticsService';

@injectable()
export class ActivitiesAnalyticsService
  implements IAnalyticsService<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension>
{
  getAnalytics(
    datamartId: string,
    metrics: Array<Metric<ActivitiesAnalyticsMetric>>,
    dateRange: DateRange[],
    dimensions?: Array<Dimension<ActivitiesAnalyticsDimension>>,
    dimensionFilterClauses?: DimensionFilterClause,
    sampling?: number,
    orderBy?: OrderBy,
  ): Promise<ReportViewResponse> {
    try {
      const report: ReportRequestBody<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension> =
        buildActivitiesAnalyticsRequestBody(
          metrics,
          dateRange,
          dimensions,
          dimensionFilterClauses,
          sampling,
          orderBy,
        );

      const endpoint = `datamarts/${datamartId}/user_activities_analytics`;
      return ApiService.postRequest(endpoint, report);
    } catch (error) {
      if (error && error.message) {
        return Promise.reject(error.message);
      } else {
        return Promise.reject('error');
      }
    }
  }
}
