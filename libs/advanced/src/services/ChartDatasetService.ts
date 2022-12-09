import { AnalyticsMetric, AnalyticsDimension } from './../utils/analytics/Common';
import { DataIngestionAnalyticsService } from './analytics/DataIngestionAnalyticsService';
import {
  DataIngestionMetric,
  DataIngestionDimension,
} from './../utils/analytics/DataIngestionReportHelper';
import { ResourcesUsageDimension } from './../utils/analytics/ResourcesUsageReportHelper';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from './../models/platformMetrics/QueryExecutionSource';
import {
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
  Format,
  Legend,
  PieChartFormat,
  Tooltip,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { OTQLBucket, OTQLResult } from '../models/datamart/graphdb/OTQLResult';
import { ActivitiesAnalyticsService } from './analytics/ActivitiesAnalyticsService';

import { CollectionVolumesService } from './analytics/CollectionVolumesService';

import { BooleanOperator, DateRange, DimensionFilter } from '../models/report/ReportRequestBody';
import {
  ActivitiesAnalyticsDimension,
  ActivitiesAnalyticsMetric,
} from '../utils/analytics/ActivitiesAnalyticsReportHelper';
import moment from 'moment';
import { AbstractScope, SegmentScope } from '../models/datamart/graphdb/Scope';
import { QueryScopeAdapter } from '../utils/QueryScopeAdapter';
import {
  CollectionVolumesDimension,
  CollectionVolumesMetric,
} from '../utils/analytics/CollectionVolumesReportHelper';
import { IAnalyticsService } from './analytics/AnalyticsService';
import { fetchAndFormatQuery, QueryFragment } from '../utils/source/DataSourceHelper';
import promiseRetry from 'promise-retry';
import DataFileService, { IDataFileService } from './DataFileService';
import jsonpath from 'jsonpath';
import { AreaChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/area-chart';
import {
  AbstractSource,
  AggregationSource,
  AnalyticsSource,
  DataFileSource,
  DataSource,
  OTQLSource,
} from '../models/dashboards/dataset/datasource_tree';
import {
  AbstractDataset,
  AbstractDatasetTree,
  OTQLDataset,
} from '../models/dashboards/dataset/dataset_tree';
import {
  DEFAULT_Y_KEY,
  TransformationProcessor,
} from '../utils/transformations/TransformationProcessor';
import {
  MetricChartFormat,
  MetricChartProps,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/metric-chart/MetricChart';
import { isTypeofXKey, XKey } from '@mediarithmics-private/mcs-components-library';
import { ResourcesUsageMetric } from '../utils/analytics/ResourcesUsageReportHelper';
import { ResourcesUsageService } from './analytics/ResourcesUsageService';
import { AnalyticsSourceType } from '../models/dashboards/dataset/common';

export type ChartType = 'pie' | 'bars' | 'radar' | 'metric' | 'area' | 'line' | 'table';

export interface ManagedChartConfig {
  id?: string;
  title: string;
  type: ChartType;
  colors?: string[];
  options?: ChartApiOptions;
  chart_id?: string;
  useCache?: boolean;
}

export interface ExternalChartConfig {
  id?: string;
  chart_id: string;
}

export type ChartConfig = ManagedChartConfig & DataSource;

export type ChartCommonConfig = ChartConfig | ExternalChartConfig;

export function isExternalChartConfig(config: ChartCommonConfig): config is ExternalChartConfig {
  return (config as ExternalChartConfig).chart_id !== undefined;
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

interface AreaChartApiProps {
  height?: number;
  stacking?: boolean;
  plot_line_value?: number;
  legend?: Legend;
  type?: string;
  tooltip?: Tooltip;
  format: Format;
  hide_x_axis?: boolean;
  hide_y_axis?: boolean;
  double_y_axis?: boolean;
}

interface TableChartApiOptions {
  handle_on_row: (record: OTQLBucket) => { onClick: React.MouseEventHandler<any> };
  bucket_has_data: (record: OTQLBucket) => boolean;
  get_row_className: (record: OTQLBucket) => string;
}

export interface TableChartProps {
  handleOnRow: (record: OTQLBucket) => { onClick: React.MouseEventHandler<any> };
  bucketHasData: (record: OTQLBucket) => boolean;
  getRowClassName: (record: OTQLBucket) => string;
}

interface MetricChartApiProps {
  value: number;
  format?: MetricChartFormat;
}

export type ChartApiOptions =
  | ((
      | PieChartApiProps
      | RadarChartApiProps
      | BarChartApiProps
      | MetricChartApiProps
      | TableChartApiOptions
    ) &
      WithOptionalXKey)
  | (AreaChartApiProps & WithOptionalComplexXKey);

export type PieChartOptions = Omit<PieChartProps, 'dataset' | 'colors'>;
export type RadarChartOptions = Omit<RadarChartProps, 'dataset' | 'colors'>;
export type BarChartOptions = Omit<BarChartProps, 'dataset' | 'colors'>;
export type MetricChartOptions = Omit<MetricChartProps, 'dataset' | 'colors'>;
export type AreaChartOptions = Omit<AreaChartProps, 'dataset' | 'colors'>;
export type TableChartOptions = Omit<TableChartProps, 'dataset' | 'colors'>;
export interface WithOptionalXKey {
  xKey?: string;
}

export interface WithOptionalComplexXKey {
  xKey?: string | XKey;
}

export type ChartOptions =
  | ((
      | PieChartOptions
      | RadarChartOptions
      | BarChartOptions
      | MetricChartOptions
      | TableChartOptions
    ) &
      WithOptionalXKey)
  | (AreaChartOptions & WithOptionalComplexXKey);

export interface IChartDatasetService {
  fetchDataset(
    datamartId: string,
    organisationId: string,
    chartConfig: ChartConfig,
    queryExecutionSource: QueryExecutionSource,
    queryExecutionSubSource: QueryExecutionSubSource,
    scope?: AbstractScope,
    queryFragment?: QueryFragment,
  ): Promise<AbstractDataset | undefined>;
}

@injectable()
export class ChartDatasetService implements IChartDatasetService {
  // TODO: Put back injection for this service
  private queryService: IQueryService = new QueryService();
  private scopeAdapter: QueryScopeAdapter = new QueryScopeAdapter(this.queryService);
  private transformationProcessor: TransformationProcessor = new TransformationProcessor();

  private dataFileService: IDataFileService = new DataFileService();

  private activitiesAnalyticsService: IAnalyticsService<
    ActivitiesAnalyticsMetric,
    ActivitiesAnalyticsDimension
  > = new ActivitiesAnalyticsService();

  private collectionsAnalyticsService: IAnalyticsService<
    CollectionVolumesMetric,
    CollectionVolumesDimension
  > = new CollectionVolumesService();

  private resourcesUsageService: IAnalyticsService<ResourcesUsageMetric, ResourcesUsageDimension> =
    new ResourcesUsageService();

  private dataIngestionAnalyticsService: IAnalyticsService<
    DataIngestionMetric,
    DataIngestionDimension
  > = new DataIngestionAnalyticsService();

  private defaultDateRange: DateRange[] = [
    {
      start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    },
  ];

  private executeOtqlQuery(
    datamartId: string,
    otqlSource: OTQLSource,
    queryExecutionSource: QueryExecutionSource,
    queryExecutionSubSource: QueryExecutionSubSource,
    scope?: AbstractScope,
    queryFragment?: QueryFragment,
    useCache?: boolean,
  ): Promise<OTQLResult> {
    return fetchAndFormatQuery(
      this.queryService,
      this.scopeAdapter,
      datamartId,
      otqlSource,
      scope,
      queryFragment,
    )
      .then(adaptedQueryInfo => {
        return promiseRetry(
          retry => {
            return this.queryService
              .runOTQLQuery(
                datamartId,
                adaptedQueryInfo.queryText,
                queryExecutionSource,
                queryExecutionSubSource,
                {
                  precision: otqlSource.precision,
                  use_cache: useCache,
                },
              )
              .catch(err => {
                if (err.error_code === 'SERVICE_UNAVAILABLE') {
                  retry(err);
                }
                throw err;
              });
          },
          { retries: 50 },
        );
      })
      .then(res => {
        return res.data;
      });
  }

  private getScope(adaptToScope?: boolean, providedScope?: AbstractScope) {
    const shouldAdaptToScope = adaptToScope === undefined ? true : adaptToScope;
    return shouldAdaptToScope ? providedScope : undefined;
  }

  private getAnalyticsService<M, D>(type: AnalyticsSourceType) {
    switch (type) {
      case 'activities_analytics':
        return this.activitiesAnalyticsService;
      case 'collection_volumes':
        return this.collectionsAnalyticsService;
      case 'resources_usage':
        return this.resourcesUsageService;
      case 'data_ingestion':
        return this.dataIngestionAnalyticsService;
      default:
        return this.activitiesAnalyticsService;
    }
  }

  private handleAnalyticsScope(
    datamartId: string,
    adaptToScope?: boolean,
    providedScope?: AbstractScope,
  ) {
    const analyticsScope = this.getScope(adaptToScope, providedScope);

    return this.scopeAdapter.buildScopeAnalyticsQuery(datamartId, analyticsScope);
  }

  private shouldAdaptToScope<M, D>(type: AnalyticsSourceType, source: AnalyticsSource<M, D>) {
    return type === 'activities_analytics' && source?.adapt_to_scope;
  }

  private async fetchAnalytics<M extends string, D extends string>(
    type: AnalyticsSourceType,
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
    return (this.getAnalyticsService(type) as IAnalyticsService<M, D>)
      .getAnalytics(
        analyticsDatamartId,
        analyticsSourceJson.metrics,
        dateRanges,
        analyticsSourceJson.dimensions,
        scopedDimensionFilterClauses,
        undefined,
        analyticsSourceJson.order_by,
      )
      .then(result => {
        const metricNames = analyticsSourceJson.metrics.map(m => m.expression.toLocaleLowerCase());
        const dimensionNames = analyticsSourceJson.dimensions.map(d => d.name.toLocaleLowerCase());
        return formatDatasetForReportView(
          result.data.report_view,
          xKey,
          metricNames,
          dimensionNames,
          source.series_title,
        );
      });
  }

  /**
   * Process to intermediary ast which has the same structure as the abstract source
   * but with all datasets hydrated
   */
  private async hydrateDatasets(
    datamartId: string,
    organisationId: string,
    chartType: ChartType,
    xKeyAlt: string | XKey,
    source: AbstractSource,
    queryExecutionSource: QueryExecutionSource,
    queryExecutionSubSource: QueryExecutionSubSource,
    providedScope?: AbstractScope,
    queryFragment?: QueryFragment,
    useCache?: boolean,
  ): Promise<AbstractDatasetTree | undefined> {
    const xKey = isTypeofXKey(xKeyAlt) ? xKeyAlt.key : xKeyAlt;
    const sourceType = source.type.toLowerCase();
    const seriesTitle = source.series_title || DEFAULT_Y_KEY.key;

    switch (sourceType) {
      case 'otql':
        const otqlSource = source as OTQLSource;
        const scope = this.getScope(otqlSource.adapt_to_scope, providedScope);
        const queryDatamartId = otqlSource.datamart_id || datamartId;
        const otqlRes = await this.executeOtqlQuery(
          queryDatamartId,
          otqlSource,
          queryExecutionSource,
          queryExecutionSubSource,
          scope,
          queryFragment,
          useCache,
        );
        const otqlDataset = formatDatasetForOtql(otqlRes, xKey, seriesTitle);
        return {
          ...source,
          dataset: otqlDataset,
        } as OTQLDataset;
      case 'activities_analytics':
      case 'collection_volumes':
      case 'data_ingestion':
      case 'resources_usage':
        return this.fetchAnalytics(
          sourceType,
          datamartId,
          source as AnalyticsSource<AnalyticsMetric, AnalyticsDimension>,
          xKey,
          providedScope,
          queryFragment,
        ).then(analyticsDataset => {
          return {
            ...source,
            dataset: analyticsDataset,
          };
        });
      case 'data_file':
        const datafileSource = source as DataFileSource;
        if (providedScope && providedScope.type === 'SEGMENT') {
          const segmentToken = '{SEGMENT_ID}';
          const segmentId = (providedScope as SegmentScope).segmentId;
          datafileSource.uri = datafileSource.uri.replace(segmentToken, segmentId);
          datafileSource.JSON_path = datafileSource.JSON_path.replace(segmentToken, segmentId);
        }
        return this.dataFileService
          .getDatafileData(datafileSource.uri)
          .then(res => {
            return this.readFileContent(res).then((fileContent: string) => {
              const fileContentJson = JSON.parse(fileContent);
              const datasetFromDataFile = jsonpath.query(fileContentJson, datafileSource.JSON_path);
              if (!datasetFromDataFile) return undefined;
              let dataset;
              if (chartType.toLowerCase() === 'metric') {
                dataset = {
                  value: datasetFromDataFile[0],
                  type: 'count',
                };
              }
              dataset = {
                ...source,
                metadata: {
                  seriesTitles: [seriesTitle],
                },
                dataset: datasetFromDataFile[0],
                type: 'aggregate',
              };
              return {
                type: 'data_file',
                dataset: dataset,
              } as AbstractDatasetTree;
            });
          })
          .catch(() => {
            Promise.reject(`Cannot retrieve datafile: ${datafileSource.uri}`);
            return undefined;
          });

      default:
        const aggregationSource = source as AggregationSource;
        const childSources = aggregationSource.sources;
        return Promise.all(
          childSources.map(s =>
            this.hydrateDatasets(
              datamartId,
              organisationId,
              chartType,
              xKey,
              s,
              queryExecutionSource,
              queryExecutionSubSource,
              providedScope,
              queryFragment,
              useCache,
            ),
          ),
        )
          .then(childDatasets => {
            return childDatasets.filter(x => !!x);
          })
          .then(definedChildren => {
            return {
              ...source,
              children: definedChildren,
            };
          });
    }
  }

  readFileContent = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent: any) => {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        return resolve(textFromFileLoaded);
      };

      fileReader.readAsText(file, 'UTF-8');
    });
  };

  async fetchDataset(
    datamartId: string,
    organisationId: string,
    chartConfig: ChartConfig,
    queryExecutionSource: QueryExecutionSource,
    queryExecutionSubSource: QueryExecutionSubSource,
    providedScope?: AbstractScope,
    queryFragment?: QueryFragment,
  ): Promise<AbstractDataset | undefined> {
    const source = chartConfig.dataset;
    const chartType = chartConfig.type;
    const xKey = getXKeyForChart(
      chartType,
      chartConfig.options && (chartConfig.options as ChartOptions).xKey,
    );
    const hydratedTree = await this.hydrateDatasets(
      datamartId,
      organisationId,
      chartType,
      xKey,
      source,
      queryExecutionSource,
      queryExecutionSubSource,
      providedScope,
      queryFragment,
      chartConfig.useCache,
    );
    if (!hydratedTree || typeof hydratedTree === 'string') {
      return Promise.reject(
        hydratedTree ? (hydratedTree as string) : 'Could not retrieve data for the chart',
      );
    } else {
      return this.transformationProcessor.applyTransformations(
        datamartId,
        organisationId,
        chartType,
        xKey,
        hydratedTree,
      );
    }
  }
}
