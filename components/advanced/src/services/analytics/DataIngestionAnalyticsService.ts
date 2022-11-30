import {
  DataIngestionMetric,
  DataIngestionDimension,
  buildDataIngestionRequestBody,
} from './../../utils/analytics/DataIngestionReportHelper';
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

@injectable()
export class DataIngestionAnalyticsService
  implements IAnalyticsService<DataIngestionMetric, DataIngestionDimension>
{
  getAnalytics(
    datamartId: string,
    metrics: Array<Metric<DataIngestionMetric>>,
    dateRange: DateRange[],
    dimensions?: Array<Dimension<DataIngestionDimension>>,
    dimensionFilterClauses?: DimensionFilterClause,
    sampling?: number,
    orderBy?: OrderBy,
  ): Promise<ReportViewResponse> {
    const report: ReportRequestBody<DataIngestionMetric, DataIngestionDimension> =
      buildDataIngestionRequestBody(
        metrics,
        dateRange,
        dimensions,
        dimensionFilterClauses,
        sampling,
        orderBy,
      );
    const endpoint = `platform_monitoring/data_ingestion`;
    return ApiService.postRequest(endpoint, report);
  }
}
