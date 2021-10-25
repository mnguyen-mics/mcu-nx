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
import { PieChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/pie-chart/PieChart';
import { RadarChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/radar-chart';
import { BarChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/bar-chart/BarChart';
import {
  Datapoint,
  Dataset,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { OTQLResult } from '../models/datamart/graphdb/OTQLResult';
import {
  ActivitiesAnalyticsService,
  IActivitiesAnalyticsService,
} from './ActivitiesAnalyticsService';
import { DateRange, ReportRequestBody } from '../models/report/ReportRequestBody';
import {
  ActivitiesAnalyticsDimension,
  ActivitiesAnalyticsMetric,
} from '../utils/ActivitiesAnalyticsReportHelper';
import moment from 'moment';

export type ChartType = 'pie' | 'bars' | 'radar' | 'metric';
export type SourceType = 'otql' | 'join' | 'to-list' | 'activities_analytics';

const DEFAULT_Y_KEY = {
  key: 'value',
  message: 'count',
};
interface AbstractSource {
  type: SourceType;
  series_title?: string;
}
export interface ActivitiesAnalyticsSource extends AbstractSource {
  query_json: ReportRequestBody<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension>;
}
export interface OTQLSource extends AbstractSource {
  query_text?: string;
  query_id?: string;
}

export declare type MetricChartFormat = 'percentage' | 'count';

export interface MetricChartProps {
  dataset: Dataset;
  format?: MetricChartFormat;
}
export interface AggregationSource extends AbstractSource {
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
  options?: ChartOptions;
}

export interface IChartDatasetService {
  fetchDataset(datamartId: string, chartConfig: ChartConfig): Promise<AbstractDataset | undefined>;
}

@injectable()
export class ChartDatasetService implements IChartDatasetService {
  // TODO: Put back injection for this service
  private queryService: IQueryService = new QueryService();
  private activitiesAnalyticsService: IActivitiesAnalyticsService =
    new ActivitiesAnalyticsService();

  private defaultDateRange: DateRange[] = [
    {
      start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    },
  ];

  private executeOtqlQuery(datamartId: string, otqlSource: OTQLSource): Promise<OTQLResult> {
    if (otqlSource.query_text) {
      return this.fetchOtqlDataByQueryText(datamartId, otqlSource.query_text);
    } else if (otqlSource.query_id) {
      return this.fetchOtqlDataByQueryId(datamartId, otqlSource.query_id);
    } else {
      return new Promise((resolve, reject) => reject('No query defined for otql type source'));
    }
  }

  private fetchDatasetForSource(
    datamartId: string,
    chartType: ChartType,
    xKey: string,
    source: AbstractSource,
  ): Promise<AbstractDataset | undefined> {
    const sourceType = source.type.toLowerCase();
    const seriesTitle = source.series_title ? source.series_title : DEFAULT_Y_KEY.key;

    switch (sourceType) {
      case 'otql':
        const otqlSource = source as OTQLSource;
        return this.executeOtqlQuery(datamartId, otqlSource).then(res => {
          return formatDatasetForOtql(res, xKey, seriesTitle);
        });

      case 'join':
        const aggregationSource = source as AggregationSource;
        const childSources = aggregationSource.sources;
        return Promise.all(
          childSources.map(s => this.fetchDatasetForSource(datamartId, chartType, xKey, s)),
        ).then(datasets => {
          return this.aggregateDatasets(xKey, datasets as AggregateDataset[]);
        });

      case 'to-list':
        const aggregationSource2 = source as AggregationSource;
        const childSources2 = aggregationSource2.sources;
        return Promise.all(
          childSources2.map(s => this.fetchDatasetForSource(datamartId, chartType, xKey, s)),
        ).then(datasets => {
          return this.aggregateCountsIntoList(xKey, datasets as CountDataset[], childSources2);
        });

      case 'to-percentages':
        const aggregationSource3 = source as AggregationSource;
        const childSources3 = aggregationSource3.sources;
        if (childSources3.length === 1)
          return this.fetchDatasetForSource(datamartId, chartType, xKey, childSources3[0]).then(
            dataset => {
              return this.toPercentagesDataset(xKey, dataset as AggregateDataset);
            },
          );
        else
          return new Promise((resolve, reject) =>
            reject(
              `Wrong number of arguments for to-percentages transformation, 1 expected ${childSources3.length} provided`,
            ),
          );

      case 'index':
        const percentageSources = source as AggregationSource;
        const childSources4 = percentageSources.sources;
        if (childSources4 && childSources4.length === 2) {
          return Promise.all(
            childSources4.map(s => this.fetchDatasetForSource(datamartId, chartType, xKey, s)),
          ).then(datasets => {
            return this.indexDataset(
              datasets[0] as AggregateDataset,
              datasets[1] as AggregateDataset,
              xKey,
            );
          });
        } else {
          return new Promise((resolve, reject) =>
            reject(
              `Wrong number of arguments for to-percentages transformation, 2 expected ${childSources.length} provided`,
            ),
          );
        }
      case 'activities_analytics':
        const activitiesAnalyticsSource = source as ActivitiesAnalyticsSource;
        const activitiesAnalyticsSourceJson = activitiesAnalyticsSource.query_json;

        const dateRanges: DateRange[] =
          activitiesAnalyticsSourceJson.date_ranges || this.defaultDateRange;

        return this.activitiesAnalyticsService
          .getAnalytics(
            datamartId,
            activitiesAnalyticsSourceJson.metrics,
            dateRanges,
            activitiesAnalyticsSourceJson.dimensions,
            activitiesAnalyticsSourceJson.dimension_filter_clauses,
          )
          .then(res => {
            return formatDatasetForReportView(
              res.data.report_view,
              !!activitiesAnalyticsSourceJson.dimensions.length,
              xKey,
              activitiesAnalyticsSourceJson.metrics[0],
              activitiesAnalyticsSourceJson.dimensions[0],
              seriesTitle,
            );
          });
      default:
        return new Promise((resolve, reject) => reject(`Unknown source type ${sourceType}`));
    }
  }

  fetchDataset(datamartId: string, chartConfig: ChartConfig): Promise<AbstractDataset | undefined> {
    const source = chartConfig.dataset;
    const chartType = chartConfig.type;
    const xKey = getXKeyForChart(
      chartType,
      chartConfig.options && (chartConfig.options as ChartOptions).xKey,
    );
    return this.fetchDatasetForSource(datamartId, chartType, xKey, source);
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

  private aggregateCountsIntoList(
    xKey: string,
    datasets: Array<CountDataset | undefined>,
    sources: AbstractSource[],
  ): AggregateDataset | undefined {
    const dataset = datasets.map((d: CountDataset, index: number) => {
      return {
        [xKey]: sources[index].series_title,
        [DEFAULT_Y_KEY.key]: d.value,
      };
    });
    return {
      dataset: dataset,
      metadata: {
        seriesTitles: [DEFAULT_Y_KEY.key],
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

  private fetchOtqlDataByQueryId(datamartId: string, queryId: string): Promise<OTQLResult> {
    return this.queryService.getQuery(datamartId, queryId).then(q => {
      return this.fetchOtqlDataByQueryText(datamartId, q.data.query_text);
    });
  }

  private fetchOtqlDataByQueryText(datamartId: string, queryText: string): Promise<OTQLResult> {
    return this.queryService
      .runOTQLQuery(datamartId, queryText, {
        use_cache: true,
      })
      .then(otqlResultResp => otqlResultResp.data);
  }
}
