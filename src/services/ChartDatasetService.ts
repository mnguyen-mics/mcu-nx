import {
  AbstractDataset,
  AggregateDataset,
  CountDataset,
  formatDataset,
  getXKeyForChart,
} from '../utils/ChartDataFormater';
import { IQueryService, QueryService } from './QueryService';
import { injectable } from 'inversify';
import { PieChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/pie-chart/PieChart';
import { RadarChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/radar-chart';
import { BarChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/bar-chart/BarChart';
import { lazyInject } from '../inversify/inversify.config';
import { TYPES } from '../constants/types';
import {
  Datapoint,
  Dataset,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { OTQLResult } from '../models/datamart/graphdb/OTQLResult';

export type ChartType = 'pie' | 'bars' | 'radar' | 'metric';
export type SourceType = 'otql' | 'join' | 'to-list';

const DEFAULT_Y_KEY = {
  key: 'value',
  message: 'count',
};

interface AbstractSource {
  type: SourceType;
  series_title?: string;
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
  @lazyInject(TYPES.IQueryService)
  private _queryService: IQueryService;

  private queryService(): IQueryService {
    if (!this._queryService) this._queryService = new QueryService();

    return this._queryService;
  }

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
    if (sourceType === 'otql') {
      const otqlSource = source as OTQLSource;
      return this.executeOtqlQuery(datamartId, otqlSource).then(res => {
        return formatDataset(res, xKey, seriesTitle);
      });
    } else if (sourceType === 'join') {
      const aggregationSource = source as AggregationSource;
      const childSources = aggregationSource.sources;
      return Promise.all(
        childSources.map(s => this.fetchDatasetForSource(datamartId, chartType, xKey, s)),
      ).then(datasets => {
        return this.aggregateDatasets(xKey, datasets as AggregateDataset[]);
      });
    } else if (sourceType === 'to-list') {
      const aggregationSource = source as AggregationSource;
      const childSources = aggregationSource.sources;
      return Promise.all(
        childSources.map(s => this.fetchDatasetForSource(datamartId, chartType, xKey, s)),
      ).then(datasets => {
        return this.aggregateCountsIntoList(xKey, datasets as CountDataset[], childSources);
      });
    } else {
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
    return this.queryService()
      .getQuery(datamartId, queryId)
      .then(q => {
        return this.fetchOtqlDataByQueryText(datamartId, q.data.query_text);
      });
  }

  private fetchOtqlDataByQueryText(datamartId: string, queryText: string): Promise<OTQLResult> {
    return this.queryService()
      .runOTQLQuery(datamartId, queryText, {
        use_cache: true,
      })
      .then(otqlResultResp => otqlResultResp.data);
  }
}
