import {
  AbstractDataset,
  AggregateDataset,
  CountDataset,
  formatDatasetForOtql,
  formatDatasetForReportView,
  getXKeyForChart,
} from '../utils/ChartDataFormater';
import { IQueryService, QueryService } from './QueryService';
import { injectable } from 'inversify';
import {
  PieChartLegend,
  PieChartProps,
  PieDataLabels,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/pie-chart/PieChart';
import { RadarChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/radar-chart';
import { BarChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/bar-chart/BarChart';
import {
  Datapoint,
  Dataset,
  Format,
  Legend,
  PieChartFormat,
  Tooltip,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { OTQLResult, QueryPrecisionMode } from '../models/datamart/graphdb/OTQLResult';
import { ActivitiesAnalyticsService } from './analytics/ActivitiesAnalyticsService';

import { CollectionVolumesService } from './analytics/CollectionVolumesService';

import {
  BooleanOperator,
  DateRange,
  DimensionFilter,
  ReportRequestBody,
} from '../models/report/ReportRequestBody';
import {
  ActivitiesAnalyticsDimension,
  ActivitiesAnalyticsMetric,
} from '../utils/analytics/ActivitiesAnalyticsReportHelper';
import moment from 'moment';
import { AbstractScope } from '../models/datamart/graphdb/Scope';
import { QueryScopeAdapter } from '../utils/QueryScopeAdapter';
import {
  CollectionVolumesDimension,
  CollectionVolumesMetric,
} from '../utils/analytics/CollectionVolumesReportHelper';
import { IAnalyticsService } from './analytics/AnalyticsService';
import DatasetDateFormatter from '../utils/transformations/FormatDatesTransformation';
import { formatDate } from '../utils/DateHelper';
import { QueryFragment } from '../components/chart-engine/Chart';
import { percentages } from '../utils/transformations/PercentagesTransformation';
import { indexDataset } from '../utils/transformations/IndexTranformation';
import { fetchAndFormatQuery } from '../utils/source/OtqlSourceHelper';

export type ChartType = 'pie' | 'bars' | 'radar' | 'metric';
export type SourceType =
  | 'otql'
  | 'join'
  | 'to-list'
  | 'index'
  | 'to-percentages'
  | 'activities_analytics'
  | 'collection_volumes'
  | 'ratio'
  | 'format-dates';

const DEFAULT_Y_KEY = {
  key: 'value',
  message: 'count',
};
export interface AbstractSource {
  type: SourceType;
  series_title?: string;
}
export interface AnalyticsSource<M, D> extends AbstractSource {
  query_json: ReportRequestBody<M, D>;
  adapt_to_scope?: boolean;
  datamart_id?: string;
}
export interface OTQLSource extends AbstractSource {
  query_text?: string;
  query_id?: string;
  precision?: QueryPrecisionMode;
  adapt_to_scope?: boolean;
  datamart_id?: string;
}

export declare type MetricChartFormat = 'percentage' | 'count' | 'float';

export interface MetricChartProps {
  dataset: Dataset;
  format?: MetricChartFormat;
}

export interface AggregationSource extends AbstractSource {
  sources: AbstractSource[];
}

export type Order = `descending` | `ascending`;

export interface IndexOptions {
  minimum_percentage?: number;
  sort?: Order;
  limit?: number;
}

export interface IndexSource extends AbstractSource {
  sources: AbstractSource[];
  options: IndexOptions;
}

export interface RatioSource extends AbstractSource {
  sources: AbstractSource[];
}

export interface DateOptions {
  format?: string;
  buckets?: DateOptions;
}

export interface DateFormatSource extends AbstractSource {
  date_options: DateOptions;
  sources: AbstractSource[];
}

export type PieChartOptions = Omit<PieChartProps, 'dataset' | 'colors'>;
export type RadarChartOptions = Omit<RadarChartProps, 'dataset' | 'colors'>;
export type BarChartOptions = Omit<BarChartProps, 'dataset' | 'colors'>;
export type MetricChartOptions = Omit<MetricChartProps, 'dataset' | 'colors'>;
interface WithOptionalXKey {
  xKey?: string;
}
export type ChartOptions = (
  | PieChartOptions
  | RadarChartOptions
  | BarChartOptions
  | MetricChartOptions
) &
  WithOptionalXKey;

export interface ChartConfig {
  title: string;
  type: ChartType;
  colors?: string[];
  dataset: AbstractSource;
  options?: ChartApiOptions;
}

interface PieChartApiProps {
  height?: number;
  legend?: PieChartLegend;
  drilldown?: boolean;
  inner_radius: boolean;
  is_half?: boolean;
  data_labels?: PieDataLabels;
  tooltip?: Tooltip;
  format?: PieChartFormat;
}

interface RadarChartApiProps {
  height?: number;
  data_labels?: PieDataLabels;
  tooltip?: Tooltip;
  format?: Format;
  legend?: Legend;
}

interface BarChartApiProps {
  drilldown?: boolean;
  height?: number;
  big_bars?: boolean;
  stacking?: boolean;
  plot_line_value?: number;
  legend?: Legend;
  type?: string;
  tooltip?: Tooltip;
  format: Format;
  hide_x_axis?: boolean;
  hide_y_axis?: boolean;
}

interface MetricChartApiProps {
  format?: MetricChartFormat;
}

export type ChartApiOptions = (
  | PieChartApiProps
  | RadarChartApiProps
  | BarChartApiProps
  | MetricChartApiProps
) &
  WithOptionalXKey;

export interface IChartDatasetService {
  fetchDataset(
    datamartId: string,
    chartConfig: ChartConfig,
    scope?: AbstractScope,
    queryFragment?: QueryFragment,
  ): Promise<AbstractDataset | undefined>;
}

type AnalyticsType = 'collections' | 'activities';

@injectable()
export class ChartDatasetService implements IChartDatasetService {
  // TODO: Put back injection for this service
  private queryService: IQueryService = new QueryService();
  private scopeAdapter: QueryScopeAdapter = new QueryScopeAdapter(this.queryService);

  private datasetDateFormatter: DatasetDateFormatter = new DatasetDateFormatter((date, format) =>
    formatDate(date, format),
  );

  private activitiesAnalyticsService: IAnalyticsService<
    ActivitiesAnalyticsMetric,
    ActivitiesAnalyticsDimension
  > = new ActivitiesAnalyticsService();

  private collectionsAnalyticsService: IAnalyticsService<
    CollectionVolumesMetric,
    CollectionVolumesDimension
  > = new CollectionVolumesService();

  private defaultDateRange: DateRange[] = [
    {
      start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    },
  ];

  private executeOtqlQuery(
    datamartId: string,
    otqlSource: OTQLSource,
    scope?: AbstractScope,
    queryFragment?: QueryFragment,
  ): Promise<OTQLResult> {
    return fetchAndFormatQuery(
      this.queryService,
      this.scopeAdapter,
      datamartId,
      otqlSource,
      scope,
      queryFragment,
    )
      .then(adaptedQueryText => {
        return this.queryService.runOTQLQuery(datamartId, adaptedQueryText, {
          precision: otqlSource.precision,
          use_cache: true,
        });
      })
      .then(res => {
        return res.data;
      });
  }

  private getScope(adaptToScope?: boolean, providedScope?: AbstractScope) {
    const shouldAdaptToScope = adaptToScope === undefined ? true : adaptToScope;
    return shouldAdaptToScope ? providedScope : undefined;
  }

  private getAnalyticsService<M, D>(type: AnalyticsType) {
    if (type === 'activities') return this.activitiesAnalyticsService;
    else if (type === 'collections') return this.collectionsAnalyticsService;
    return this.activitiesAnalyticsService;
  }

  private fetchActivitiesAnalytics(
    datamartId: string,
    source: AnalyticsSource<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension>,
    xKey: string,
    providedScope?: AbstractScope,
    queryFragment?: QueryFragment,
  ) {
    return this.fetchAnalytics(
      'activities' as AnalyticsType,
      datamartId,
      source,
      xKey,
      providedScope,
      queryFragment,
    );
  }

  private fetchCollectionVolumes(
    datamartId: string,
    source: AnalyticsSource<CollectionVolumesMetric, CollectionVolumesDimension>,
    xKey: string,
    providedScope?: AbstractScope,
  ) {
    return this.fetchAnalytics(
      'collections' as AnalyticsType,
      datamartId,
      source,
      xKey,
      providedScope,
    );
  }

  private handleAnalyticsScope(
    datamartId: string,
    adaptToScope?: boolean,
    providedScope?: AbstractScope,
  ) {
    const analyticsScope = this.getScope(adaptToScope, providedScope);

    return this.scopeAdapter.buildScopeAnalyticsQuery(datamartId, analyticsScope);
  }

  private shouldAdaptToScope<M, D>(type: AnalyticsType, source: AnalyticsSource<M, D>) {
    return type === 'activities' && source?.adapt_to_scope;
  }

  private async fetchAnalytics<M extends string, D extends string>(
    type: AnalyticsType,
    datamartId: string,
    source: AnalyticsSource<M, D>,
    xKey: string,
    providedScope?: AbstractScope,
    queryFragment?: QueryFragment,
  ) {
    const analyticsDatamartId = source.datamart_id || datamartId;
    const analyticsSourceJson = source.query_json;

    const analyticsScopeFilter = await this.handleAnalyticsScope(
      analyticsDatamartId,
      this.shouldAdaptToScope<M, D>(type, source),
      providedScope,
    );

    const dateRanges: DateRange[] = analyticsSourceJson.date_ranges || this.defaultDateRange;
    let dashboardQueryFilters = analyticsSourceJson.dimension_filter_clauses?.filters || [];
    if (queryFragment && Object.keys(queryFragment).length > 0) {
      for (const [key, value] of Object.entries(queryFragment)) {
        if (key && value.length > 0) {
          value.forEach(f => {
            if (f.type.toLocaleLowerCase() === 'activities_analytics') {
              dashboardQueryFilters = dashboardQueryFilters.concat(f.fragment as DimensionFilter[]);
            }
          });
        }
      }
    }

    const scopingQueryFilters = analyticsScopeFilter ? [analyticsScopeFilter] : [];
    const queryFilters = dashboardQueryFilters.concat(scopingQueryFilters);
    const scopedDimensionFilterClauses =
      queryFilters.length > 0
        ? {
            operator: 'AND' as BooleanOperator,
            filters: queryFilters,
          }
        : undefined;
    const analyticsResult = await (
      this.getAnalyticsService(type) as IAnalyticsService<M, D>
    ).getAnalytics(
      analyticsDatamartId,
      analyticsSourceJson.metrics,
      dateRanges,
      analyticsSourceJson.dimensions,
      scopedDimensionFilterClauses,
    );
    const metricNames = analyticsSourceJson.metrics.map(m => m.expression.toLocaleLowerCase());
    const dimensionNames = analyticsSourceJson.dimensions.map(d => d.name.toLocaleLowerCase());
    return formatDatasetForReportView(
      analyticsResult.data.report_view,
      xKey,
      metricNames,
      dimensionNames,
      source.series_title,
    );
  }

  private computeIndex(
    datamartId: string,
    indexSource: IndexSource,
    chartType: ChartType,
    xKey: string,
    providedScope?: AbstractScope,
  ) {
    const childSources4 = indexSource.sources;
    if (childSources4 && childSources4.length === 2) {
      return Promise.all(
        childSources4.map(s =>
          this.fetchDatasetForSource(datamartId, chartType, xKey, s, providedScope),
        ),
      ).then(datasets => {
        return indexDataset(
          datasets[0] as AggregateDataset,
          datasets[1] as AggregateDataset,
          xKey,
          indexSource.options,
        );
      });
    } else {
      return Promise.reject(
        `Wrong number of arguments for to-percentages transformation, 2 expected ${childSources4.length} provided`,
      );
    }
  }

  private fetchDatasetForSource(
    datamartId: string,
    chartType: ChartType,
    xKey: string,
    source: AbstractSource,
    providedScope?: AbstractScope,
    queryFragment?: QueryFragment,
  ): Promise<AbstractDataset | undefined> {
    const sourceType = source.type.toLowerCase();
    const seriesTitle = source.series_title || DEFAULT_Y_KEY.key;

    switch (sourceType) {
      case 'otql':
        const otqlSource = source as OTQLSource;
        const scope = this.getScope(otqlSource.adapt_to_scope, providedScope);
        const queryDatamartId = otqlSource.datamart_id || datamartId;
        return this.executeOtqlQuery(queryDatamartId, otqlSource, scope, queryFragment).then(
          res => {
            return formatDatasetForOtql(res, xKey, seriesTitle);
          },
        );

      case 'join':
        const aggregationSource = source as AggregationSource;
        const childSources = aggregationSource.sources;
        return Promise.all(
          childSources.map(s =>
            this.fetchDatasetForSource(
              datamartId,
              chartType,
              xKey,
              s,
              providedScope,
              queryFragment,
            ),
          ),
        ).then(datasets => {
          return this.aggregateDatasets(xKey, datasets as AggregateDataset[]);
        });

      case 'to-list':
        const aggregationSource2 = source as AggregationSource;
        const childSources2 = aggregationSource2.sources;
        return Promise.all(
          childSources2.map(s =>
            this.fetchDatasetForSource(
              datamartId,
              chartType,
              xKey,
              s,
              providedScope,
              queryFragment,
            ),
          ),
        ).then(datasets => {
          return this.aggregateCountsIntoList(
            xKey,
            datasets as CountDataset[],
            childSources2,
            source.series_title,
          );
        });

      case 'to-percentages':
        const aggregationSource3 = source as AggregationSource;
        const childSources3 = aggregationSource3.sources;
        if (childSources3.length === 1)
          return this.fetchDatasetForSource(
            datamartId,
            chartType,
            xKey,
            childSources3[0],
            providedScope,
            queryFragment,
          ).then(dataset => {
            return percentages(xKey, dataset as AggregateDataset);
          });
        else
          return Promise.reject(
            `Wrong number of arguments for to-percentages transformation, 1 expected ${childSources3.length} provided`,
          );

      case 'index':
        const indexSource = source as IndexSource;
        return this.computeIndex(datamartId, indexSource, chartType, xKey, providedScope);

      case 'activities_analytics':
        return this.fetchActivitiesAnalytics(
          datamartId,
          source as AnalyticsSource<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension>,
          xKey,
          providedScope,
          queryFragment,
        );
      case 'collection_volumes':
        return this.fetchCollectionVolumes(
          datamartId,
          source as AnalyticsSource<CollectionVolumesMetric, CollectionVolumesDimension>,
          xKey,
          providedScope,
        );
      case 'ratio':
        const ratioSource = source as RatioSource;
        const datasetValue = this.fetchDatasetForSource(
          datamartId,
          chartType,
          xKey,
          ratioSource.sources[0],
          scope,
          queryFragment,
        );
        const datasetTotal = this.fetchDatasetForSource(
          datamartId,
          chartType,
          xKey,
          ratioSource.sources[1],
          scope,
          queryFragment,
        );
        return Promise.all([datasetValue, datasetTotal]).then(datasets => {
          return this.ratioDataset(datasets[0] as CountDataset, datasets[1] as CountDataset);
        });

      case 'format-dates':
        const dateFormatSource = source as DateFormatSource;
        const format = dateFormatSource.date_options;
        const datasetToBeFormatted = this.fetchDatasetForSource(
          datamartId,
          chartType,
          xKey,
          dateFormatSource.sources[0],
          scope,
          queryFragment,
        );
        return datasetToBeFormatted.then(result => {
          if (result) return this.datasetDateFormatter.applyFormatDates(result, xKey, format);
          else return Promise.resolve(undefined);
        });
      default:
        return Promise.reject(`Unknown source type ${sourceType}`);
    }
  }

  fetchDataset(
    datamartId: string,
    chartConfig: ChartConfig,
    providedScope?: AbstractScope,
    queryFragment?: QueryFragment,
  ): Promise<AbstractDataset | undefined> {
    const source = chartConfig.dataset;
    const chartType = chartConfig.type;
    const xKey = getXKeyForChart(
      chartType,
      chartConfig.options && (chartConfig.options as ChartOptions).xKey,
    );
    return this.fetchDatasetForSource(
      datamartId,
      chartType,
      xKey,
      source,
      providedScope,
      queryFragment,
    );
  }

  private ratioDataset(
    datasetValue: CountDataset | undefined,
    datasetTotal: CountDataset | undefined,
  ): CountDataset | undefined {
    if (
      !datasetValue ||
      datasetValue.type !== 'count' ||
      !datasetTotal ||
      datasetTotal.type !== 'count' ||
      datasetTotal.value === 0
    )
      return undefined;
    else {
      return {
        value: datasetValue.value / datasetTotal.value,
        type: 'count',
      };
    }
  }

  private aggregateCountsIntoList(
    xKey: string,
    datasets: Array<CountDataset | undefined>,
    sources: AbstractSource[],
    listSeriesTitle?: string,
  ): AggregateDataset | undefined {
    const dataset = datasets.map((d: CountDataset, index: number) => {
      return {
        [xKey]: sources[index].series_title,
        [listSeriesTitle || DEFAULT_Y_KEY.key]: d.value,
      };
    });

    return {
      dataset: dataset,
      metadata: {
        seriesTitles: [listSeriesTitle || DEFAULT_Y_KEY.key],
      },
      type: 'aggregate',
    };
  }

  private aggregateDatasets(
    xKey: string,
    datasets: Array<AggregateDataset | undefined>,
  ): AggregateDataset | undefined {
    type DatasetAcc = { [key: string]: Datapoint };
    const datasetAcc: DatasetAcc = {};

    const seriesTitles = datasets.map(d => d?.metadata.seriesTitles[0]);
    datasets.forEach(dataset => {
      if (!!dataset) {
        dataset.dataset.forEach(datapoint => {
          const categoryKey = datapoint[xKey] as string;
          const current = datasetAcc[categoryKey];
          datasetAcc[categoryKey] = {
            ...current,
            ...datapoint,
          };
        });
      }
    });

    const newDataset: Datapoint[] = [];
    Object.entries(datasetAcc).forEach(field => {
      const fieldValue = field[1];
      newDataset.push(fieldValue as Datapoint);
    });

    return {
      metadata: {
        seriesTitles: seriesTitles,
      },
      type: 'aggregate',
      dataset: newDataset,
    } as AggregateDataset;
  }
}
