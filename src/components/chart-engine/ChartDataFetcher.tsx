import * as React from 'react';
import {
  AbstractDataset,
  AggregateDataset,
  CountDataset,
  formatDataset,
  getXKeyForChart,
} from './ChartDataFormater';
import { IQueryService, QueryService } from '../../services/QueryService';
import {
  Loading,
  PieChart,
  BarChart,
  RadarChart,
} from '@mediarithmics-private/mcs-components-library';
import { PieChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/pie-chart/PieChart';
import { RadarChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/radar-chart';
import { BarChartProps } from '@mediarithmics-private/mcs-components-library/lib/components/charts/bar-chart/BarChart';
import { Alert } from 'antd';
import { lazyInject } from '../../inversify/inversify.config';
import { TYPES } from '../../constants/types';
import {
  Datapoint,
  Dataset,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { isUndefined, omitBy } from 'lodash';
import { formatMetric } from '../../utils/MetricHelper';
import { OTQLResult } from '../../models/datamart/graphdb/OTQLResult';

export type ChartType = 'pie' | 'bars' | 'radar' | 'metric';

interface YKey {
  key: string;
  message: string;
}

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

export interface ChartConfig {
  title: string;
  type: ChartType;
  colors?: string[];
  dataset: AbstractSource;
  options?: PieChartOptions | RadarChartOptions | BarChartOptions | MetricChartOptions;
}

interface ChartDataFetcherProps {
  datamartId: string;
  chartConfig: ChartConfig;
  chartContainerStyle?: React.CSSProperties;
}

interface ChartDataFetcherState {
  formattedData?: AbstractDataset;
  loading: boolean;
  hasError: boolean;
}

type Props = ChartDataFetcherProps;
class ChartDataFetcher extends React.Component<Props, ChartDataFetcherState> {
  @lazyInject(TYPES.IQueryService)
  private _queryService: IQueryService;

  private queryService(): IQueryService {
    if (!this._queryService) this._queryService = new QueryService();

    return this._queryService;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      hasError: false,
    };
  }

  componentDidMount() {
    const { datamartId, chartConfig } = this.props;
    this.buildDataset(datamartId, chartConfig.dataset)
      .then(formattedData => {
        this.setState({
          formattedData: formattedData,
          loading: false,
        });
      })
      .catch(e => {
        this.setState({
          hasError: true,
          loading: false,
        });
      });
  }

  executeOtqlQuery(otqlSource: OTQLSource): Promise<OTQLResult> {
    const { datamartId } = this.props;
    if (otqlSource.query_text) {
      return this.fetchOtqlDataByQueryText(datamartId, otqlSource.query_text);
    } else if (otqlSource.query_id) {
      return this.fetchOtqlDataByQueryId(datamartId, otqlSource.query_id);
    } else {
      return new Promise((resolve, reject) => reject('No query defined for otql type source'));
    }
  }

  buildDataset(datamartId: string, source: AbstractSource): Promise<AbstractDataset | undefined> {
    const { chartConfig } = this.props;
    const sourceType = source.type.toLowerCase();
    const seriesTitle = source.series_title ? source.series_title : DEFAULT_Y_KEY.key;
    if (sourceType === 'otql') {
      const otqlSource = source as OTQLSource;
      return this.executeOtqlQuery(otqlSource).then(res => {
        return formatDataset(res, chartConfig, seriesTitle);
      });
    } else if (sourceType === 'join') {
      const aggregationSource = source as AggregationSource;
      const childSources = aggregationSource.sources;
      return Promise.all(childSources.map(s => this.buildDataset(datamartId, s))).then(datasets => {
        return this.aggregateDatasets(datasets as AggregateDataset[]);
      });
    } else if (sourceType === 'to-list') {
      const aggregationSource = source as AggregationSource;
      const childSources = aggregationSource.sources;
      return Promise.all(childSources.map(s => this.buildDataset(datamartId, s))).then(datasets => {
        return this.aggregateCountsIntoList(datasets as CountDataset[], childSources);
      });
    } else {
      return new Promise((resolve, reject) => reject(`Unknown source type ${sourceType}`));
    }
  }

  aggregateCountsIntoList(
    datasets: Array<CountDataset | undefined>,
    sources: AbstractSource[],
  ): AggregateDataset | undefined {
    const { chartConfig } = this.props;
    const xKey = getXKeyForChart(chartConfig.type, chartConfig.options);
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

  aggregateDatasets(datasets: Array<AggregateDataset | undefined>): AggregateDataset | undefined {
    const { chartConfig } = this.props;
    const xKey = getXKeyForChart(chartConfig.type, chartConfig.options);

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

  fetchOtqlDataByQueryId(datamartId: string, queryId: string): Promise<OTQLResult> {
    return this.queryService()
      .getQuery(datamartId, queryId)
      .then(queryResp => queryResp.data)
      .then(q => {
        return this.fetchOtqlDataByQueryText(datamartId, q.query_text);
      });
  }

  fetchOtqlDataByQueryText(datamartId: string, queryText: string): Promise<OTQLResult> {
    return this.queryService()
      .runOTQLQuery(datamartId, queryText, {
        use_cache: true,
      })
      .then(otqlResultResp => otqlResultResp.data)
      .then(otqlResult => {
        return otqlResult;
      });
  }

  renderAggregateChart(xKey: string, yKeys: YKey[], dataset: Dataset) {
    const { chartConfig } = this.props;
    const options = chartConfig.options || {};
    const withKeys = {
      ...options,
      yKeys: yKeys,
      xKey: xKey,
    };
    const sanitizedwithKeys = omitBy(withKeys, isUndefined);
    switch (chartConfig.type.toLowerCase()) {
      case 'pie':
        return <PieChart innerRadius={false} dataset={dataset} {...sanitizedwithKeys} />;
      case 'radar':
        return (
          <RadarChart dataset={dataset as any} {...(sanitizedwithKeys as RadarChartOptions)} />
        );
      case 'bars':
        return (
          <BarChart
            dataset={dataset as any}
            {...(sanitizedwithKeys as BarChartOptions)}
            format={'count'}
          />
        );
      default:
        return (
          <Alert
            message='Error'
            description='Unknown chart type. Please check available charts types'
            type='error'
            showIcon={true}
          />
        );
    }
  }

  renderMetricChart(count: number) {
    const { chartConfig } = this.props;
    const opt = chartConfig.options as MetricChartOptions;
    return (
      <div className='mcs-dashboardMetric'>
        {formatMetric(count, opt && opt.format && opt.format === 'percentage' ? '0,0 %' : '0,0')}
      </div>
    );
  }

  private renderAlert(msg: string): JSX.Element {
    return <Alert message='Error' description={msg} type='error' />;
  }

  renderChart(xKey: string, dataset: AbstractDataset) {
    const { chartConfig } = this.props;
    const chartType = chartConfig.type.toLowerCase() as ChartType;
    const datasetType = dataset.type.toLowerCase();
    if (
      datasetType === 'aggregate' &&
      !(chartType === 'bars' || chartType === 'radar' || chartType === 'pie')
    ) {
      return this.renderAlert(
        `Dataset of type aggregation result doesn't match ${chartConfig.type.toLowerCase()} chart type`,
      );
    } else if (datasetType === 'count' && chartType !== 'metric') {
      return this.renderAlert(
        `Dataset of type count result doesn't match ${chartConfig.type.toLowerCase()} chart type`,
      );
    }

    if (dataset.type === 'aggregate') {
      const aggregateDataset = dataset as AggregateDataset;
      const yKeys = aggregateDataset.metadata.seriesTitles.map(x => {
        // A bit trivial, but it was the previous behaviour
        const message = x === 'value' ? 'count' : x;
        return {
          key: x,
          message: message,
        };
      });
      return this.renderAggregateChart(xKey, yKeys, aggregateDataset.dataset);
    } else if (dataset.type === 'count') {
      const countDataset = dataset as CountDataset;
      return this.renderMetricChart(countDataset.value);
    } else {
      return undefined;
    }
  }

  render() {
    const { formattedData, loading, hasError } = this.state;
    const { chartConfig, chartContainerStyle } = this.props;
    if (hasError) {
      return (
        <Alert
          message='Error'
          description='Cannot fetch data for chart'
          type='error'
          showIcon={true}
        />
      );
    }

    const xKey = getXKeyForChart(chartConfig.type, chartConfig.options);
    return (
      <div style={chartContainerStyle}>
        <div className={'mcs-chartDataFetcher_header'}>
          <h2 className={'mcs-chartDataFetcher_header_title'}>{chartConfig.title}</h2>
          {loading && (
            <Loading className={'mcs-chartDataFetcher_header_loader'} isFullScreen={false} />
          )}
        </div>
        <div className='mcs-chartDataFetcher_content_container'>
          {formattedData && this.renderChart(xKey, formattedData)}
        </div>
      </div>
    );
  }
}

export default ChartDataFetcher;
