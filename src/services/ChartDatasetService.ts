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

import { BooleanOperator, DateRange, ReportRequestBody } from '../models/report/ReportRequestBody';
import {
  ActivitiesAnalyticsDimension,
  ActivitiesAnalyticsMetric,
} from '../utils/analytics/ActivitiesAnalyticsReportHelper';
import moment from 'moment';
import { AbstractScope } from '../models/datamart/graphdb/Scope';
import { QueryScopeAdapter } from '../utils/QueryScopeAdapter';
import { QueryLanguage, QueryShape } from '../models/datamart/DatamartResource';
import {
  CollectionVolumesDimension,
  CollectionVolumesMetric,
} from '../utils/analytics/CollectionVolumesReportHelper';
import { IAnalyticsService } from './analytics/AnalyticsService';
import DatasetDateFormatter from '../utils/transformations/FormatDatesTransformation';
import { formatDate } from '../utils/DateHelper';

export type ChartType = 'pie' | 'bars' | 'radar' | 'metric';
export type SourceType =
  | 'otql'
  | 'join'
  | 'to-list'
  | 'activities_analytics'
  | 'collection_volumes'
  | 'ratio'
  | 'format_dates';

const DEFAULT_Y_KEY = {
  key: 'value',
  message: 'count',
};
interface AbstractSource {
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

export declare type MetricChartFormat = 'percentage' | 'count';

export interface MetricChartProps {
  dataset: Dataset;
  format?: MetricChartFormat;
}
export interface AggregationSource extends AbstractSource {
  sources: AbstractSource[];
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
  source: AbstractSource;
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

  private fetchOtqlQuery(datamartId: string, otqlSource: OTQLSource): Promise<QueryShape> {
    if (otqlSource.query_text) {
      const resource = {
        datamart_id: datamartId,
        query_text: otqlSource.query_text,
        query_language: 'OTQL' as QueryLanguage,
      };
      return Promise.resolve(resource);
    } else if (otqlSource.query_id) {
      return this.queryService.getQuery(datamartId, otqlSource.query_id).then(res => res.data);
    } else {
      return Promise.reject('No query defined for otql type source');
    }
  }

  private executeOtqlQuery(
    datamartId: string,
    otqlSource: OTQLSource,
    scope?: AbstractScope,
  ): Promise<OTQLResult> {
    const otqlScope = this.scopeAdapter.buildScopeOtqlQuery(datamartId, scope);
    return this.fetchOtqlQuery(datamartId, otqlSource)
      .then(dashboardQueryResource => {
        return this.scopeAdapter.scopeQueryWithWhereClause(
          datamartId,
          dashboardQueryResource,
          otqlScope,
        );
      })
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
  ) {
    return this.fetchAnalytics(
      'activities' as AnalyticsType,
      datamartId,
      source,
      xKey,
      providedScope,
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
  ) {
    const analyticsDatamartId = source.datamart_id || datamartId;
    const analyticsSourceJson = source.query_json;

    const analyticsScopeFilter = await this.handleAnalyticsScope(
      analyticsDatamartId,
      this.shouldAdaptToScope<M, D>(type, source),
      providedScope,
    );

    const dateRanges: DateRange[] = analyticsSourceJson.date_ranges || this.defaultDateRange;
    const dashboardQueryFilters = analyticsSourceJson.dimension_filter_clauses?.filters || [];
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

  private fetchDatasetForSource(
    datamartId: string,
    chartType: ChartType,
    xKey: string,
    source: AbstractSource,
    providedScope?: AbstractScope,
  ): Promise<AbstractDataset | undefined> {
    const sourceType = source.type.toLowerCase();
    const seriesTitle = source.series_title || DEFAULT_Y_KEY.key;

    switch (sourceType) {
      case 'otql':
        const otqlSource = source as OTQLSource;
        const scope = this.getScope(otqlSource.adapt_to_scope, providedScope);
        const queryDatamartId = otqlSource.datamart_id || datamartId;

        return this.executeOtqlQuery(queryDatamartId, otqlSource, scope).then(res => {
          return formatDatasetForOtql(res, xKey, seriesTitle);
        });

      case 'join':
        const aggregationSource = source as AggregationSource;
        const childSources = aggregationSource.sources;
        return Promise.all(
          childSources.map(s =>
            this.fetchDatasetForSource(datamartId, chartType, xKey, s, providedScope),
          ),
        ).then(datasets => {
          return this.aggregateDatasets(xKey, datasets as AggregateDataset[]);
        });

      case 'to-list':
        const aggregationSource2 = source as AggregationSource;
        const childSources2 = aggregationSource2.sources;
        return Promise.all(
          childSources2.map(s =>
            this.fetchDatasetForSource(datamartId, chartType, xKey, s, providedScope),
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
          ).then(dataset => {
            return this.toPercentagesDataset(xKey, dataset as AggregateDataset);
          });
        else
          return Promise.reject(
            `Wrong number of arguments for to-percentages transformation, 1 expected ${childSources3.length} provided`,
          );

      case 'index':
        const percentageSources = source as AggregationSource;
        const childSources4 = percentageSources.sources;
        if (childSources4 && childSources4.length === 2) {
          return Promise.all(
            childSources4.map(s =>
              this.fetchDatasetForSource(datamartId, chartType, xKey, s, providedScope),
            ),
          ).then(datasets => {
            return this.indexDataset(
              datasets[0] as AggregateDataset,
              datasets[1] as AggregateDataset,
              xKey,
            );
          });
        } else {
          return Promise.reject(
            `Wrong number of arguments for to-percentages transformation, 2 expected ${childSources4.length} provided`,
          );
        }
      case 'activities_analytics':
        return this.fetchActivitiesAnalytics(
          datamartId,
          source as AnalyticsSource<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension>,
          xKey,
          providedScope,
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
        );
        const datasetTotal = this.fetchDatasetForSource(
          datamartId,
          chartType,
          xKey,
          ratioSource.sources[1],
          scope,
        );
        return Promise.all([datasetValue, datasetTotal]).then(datasets => {
          return this.ratioDataset(datasets[0] as CountDataset, datasets[1] as CountDataset);
        });

      case 'format_dates':
        const dateFormatSource = source as DateFormatSource;
        const format = dateFormatSource.date_options;
        const datasetToBeFormatted = this.fetchDatasetForSource(
          datamartId,
          chartType,
          xKey,
          dateFormatSource.source,
          scope,
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
  ): Promise<AbstractDataset | undefined> {
    const source = chartConfig.dataset;
    const chartType = chartConfig.type;
    const xKey = getXKeyForChart(
      chartType,
      chartConfig.options && (chartConfig.options as ChartOptions).xKey,
    );
    return this.fetchDatasetForSource(datamartId, chartType, xKey, source, providedScope);
  }

  private toPercentagesDataset(xKey: string, dataset: AggregateDataset): AggregateDataset {
    const datasetTitle = dataset.metadata.seriesTitles[0];

    const sanitizedDataset = dataset.dataset.filter(line => typeof line[datasetTitle] === 'number');
    const datasetTotalValue = sanitizedDataset
      .map(line => {
        return line[datasetTitle];
      })
      .reduce((a: number, b: number) => a + b, 0) as number;
    const percentageDataset = sanitizedDataset.map(line => {
      const lineValue = line[datasetTitle] as number;
      const linePercentage =
        datasetTotalValue !== 0 ? (lineValue / datasetTotalValue) * 100 : undefined;
      return {
        [xKey]: line[xKey],
        [datasetTitle]: linePercentage ? parseFloat(linePercentage?.toFixed(2)) : undefined,
        [`${datasetTitle}-count`]: lineValue,
      };
    });

    return {
      metadata: {
        seriesTitles: [datasetTitle],
      },
      dataset: percentageDataset,
      type: 'aggregate',
    };
  }

  indexDataset(
    sourceDataset: AggregateDataset,
    toBeComparedWithDataset: AggregateDataset,
    xKey: string,
  ): AbstractDataset | undefined {
    const sourceTitles = sourceDataset.metadata.seriesTitles;

    const comparedDatasetTitle = toBeComparedWithDataset.metadata.seriesTitles[0];

    const toBeComparedWithPercentageDataset = this.toPercentagesDataset(
      xKey,
      toBeComparedWithDataset,
    );

    const sourcePercentageDataset = this.toPercentagesDataset(xKey, sourceDataset);

    const sourceIndexDataset = sourcePercentageDataset.dataset.map(line => {
      const lineValue = line[`${sourceTitles[0]}-count`] as number;
      const linePercentage = line[sourceTitles[0]] as number;
      const toBecomparedWithPercentageLine = toBeComparedWithPercentageDataset.dataset.find(
        comparedLine => comparedLine[xKey] === line[xKey],
      );
      const toBeComparedWithPercentage =
        toBecomparedWithPercentageLine && toBecomparedWithPercentageLine[comparedDatasetTitle]
          ? (toBecomparedWithPercentageLine[comparedDatasetTitle] as number)
          : 0;
      const lineIndex =
        toBeComparedWithPercentage !== 0 && linePercentage
          ? (linePercentage / toBeComparedWithPercentage) * 100
          : 0;
      return {
        [xKey]: line[xKey],
        [`${sourceTitles[0]}-percentage`]: linePercentage
          ? parseFloat(linePercentage?.toFixed(2))
          : undefined,
        [`${sourceTitles[0]}-count`]: lineValue,
        [sourceTitles[0]]: parseFloat(lineIndex?.toFixed(2)),
      };
    });

    const refinedIndexDataset = sourceIndexDataset
      .sort((a, b) => {
        const firstIndex = a[sourceTitles[0]] as number;
        const secondIndex = b[sourceTitles[0]] as number;
        return secondIndex - firstIndex;
      })
      .slice(0, 10);
    return {
      type: 'aggregate',
      dataset: refinedIndexDataset,
      metadata: { seriesTitles: sourceTitles },
    } as AggregateDataset;
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
