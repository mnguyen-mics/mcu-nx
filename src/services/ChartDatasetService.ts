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
  AggregateDataset,
  AnalyticsDataset,
  CountDataset,
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

export type ChartType = 'pie' | 'bars' | 'radar' | 'metric' | 'area' | 'line' | 'table';

export interface ManagedChartConfig {
  id?: string;
  title: string;
  type: ChartType;
  colors?: string[];
  options?: ChartApiOptions;
}

export type ChartConfig = ManagedChartConfig & DataSource;

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

export type ChartApiOptions = (
  | PieChartApiProps
  | RadarChartApiProps
  | BarChartApiProps
  | MetricChartApiProps
  | AreaChartApiProps
  | TableChartApiOptions
) &
  WithOptionalXKey;

export type PieChartOptions = Omit<PieChartProps, 'dataset' | 'colors'>;
export type RadarChartOptions = Omit<RadarChartProps, 'dataset' | 'colors'>;
export type BarChartOptions = Omit<BarChartProps, 'dataset' | 'colors'>;
export type MetricChartOptions = Omit<MetricChartProps, 'dataset' | 'colors'>;
export type AreaChartOptions = Omit<AreaChartProps, 'dataset' | 'colors'>;
export type TableChartOptions = Omit<TableChartProps, 'dataset' | 'colors'>;
interface WithOptionalXKey {
  xKey?: string;
}
export type ChartOptions = (
  | PieChartOptions
  | RadarChartOptions
  | BarChartOptions
  | MetricChartOptions
  | AreaChartOptions
  | TableChartOptions
) &
  WithOptionalXKey;

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

type AnalyticsType = 'collections' | 'activities';

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
                  use_cache: true,
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
        ).catch(e => {
          return e;
        });
      })
      .then(res => {
        return res.data;
      })
      .catch(e => {
        return e;
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
    xKey: string,
    source: AbstractSource,
    queryExecutionSource: QueryExecutionSource,
    queryExecutionSubSource: QueryExecutionSubSource,
    providedScope?: AbstractScope,
    queryFragment?: QueryFragment,
  ): Promise<AbstractDatasetTree | undefined> {
    const sourceType = source.type.toLowerCase();
    const seriesTitle = source.series_title || DEFAULT_Y_KEY.key;

    if (sourceType === 'otql') {
      const otqlSource = source as OTQLSource;
      const scope = this.getScope(otqlSource.adapt_to_scope, providedScope);
      const queryDatamartId = otqlSource.datamart_id || datamartId;
      const dataset = await this.executeOtqlQuery(
        queryDatamartId,
        otqlSource,
        queryExecutionSource,
        queryExecutionSubSource,
        scope,
        queryFragment,
      )
        .then(res => {
          return formatDatasetForOtql(res, xKey, seriesTitle);
        })
        .catch(e => {
          return e;
        });
      return {
        ...source,
        dataset: dataset,
      } as OTQLDataset;
    } else if (sourceType === 'activities_analytics') {
      return this.fetchActivitiesAnalytics(
        datamartId,
        source as AnalyticsSource<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension>,
        xKey,
        providedScope,
        queryFragment,
      ).then(analyticsDataset => {
        return {
          ...source,
          dataset: analyticsDataset,
        } as AnalyticsDataset;
      });
    } else if (sourceType === 'collection_volumes') {
      return this.fetchCollectionVolumes(
        datamartId,
        source as AnalyticsSource<CollectionVolumesMetric, CollectionVolumesDimension>,
        xKey,
        providedScope,
      ).then(volumesDataset => {
        return {
          ...source,
          dataset: volumesDataset,
        } as AnalyticsDataset;
      });
    } else if (sourceType === 'data_file') {
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
            if (chartType.toLowerCase() === 'metric') {
              return {
                value: datasetFromDataFile[0],
                type: 'count',
              } as CountDataset;
            }
            return {
              ...source,
              metadata: {
                seriesTitles: [seriesTitle],
              },
              dataset: datasetFromDataFile[0],
              type: 'aggregate',
            } as AggregateDataset;
          });
        })
        .catch(() => {
          Promise.reject(`Cannot retrieve datafile: ${datafileSource.uri}`);
          return undefined;
        })
        .then(d => {
          return {
            type: 'data_file',
            dataset: d,
          };
        });
    } else {
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
          ),
        ),
      )
        .then(childDatasets => {
          return childDatasets.filter(x => !!x).map(x => x as AbstractDatasetTree);
        })
        .then(definedChildren => {
          return {
            ...source,
            children: definedChildren,
          } as AbstractDatasetTree;
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
    ).catch(e => {
      return e;
    });
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
