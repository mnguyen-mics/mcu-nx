import { ReportViewResponse } from '../../models/report/ReportView';
import {
  DimensionFilterClause,
  Metric,
  Dimension,
  DateRange,
} from '../../models/report/ReportRequestBody';

export interface IAnalyticsService<M, D> {
  getAnalytics: (
    datamartId: string,
    metrics: Array<Metric<M>>,
    dateRanges: DateRange[],
    dimensions?: Array<Dimension<D>>,
    dimensionFilterClauses?: DimensionFilterClause,
    sampling?: number,
  ) => Promise<ReportViewResponse>;
}
