import * as React from 'react';
import {
  AbstractDataset,
  AggregateDataset,
  CountDataset,
  getXKeyForChart,
} from '../../utils/ChartDataFormater';
import {
  Loading,
  PieChart,
  BarChart,
  RadarChart,
} from '@mediarithmics-private/mcs-components-library';
import { Alert } from 'antd';
import { lazyInject } from '../../inversify/inversify.config';
import { TYPES } from '../../constants/types';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { isUndefined, omitBy } from 'lodash';
import { formatMetric } from '../../utils/MetricHelper';
import {
  BarChartOptions,
  ChartConfig,
  ChartDatasetService,
  ChartOptions,
  ChartType,
  IChartDatasetService,
  MetricChartOptions,
  RadarChartOptions,
} from '../../services/ChartDatasetService';

interface YKey {
  key: string;
  message: string;
}

interface ChartProps {
  datamartId: string;
  chartConfig: ChartConfig;
  chartContainerStyle?: React.CSSProperties;
}

interface ChartState {
  formattedData?: AbstractDataset;
  loading: boolean;
  hasError: boolean;
}

type Props = ChartProps;
class Chart extends React.Component<Props, ChartState> {
  @lazyInject(TYPES.IQueryService)
  private _chartDatasetService: IChartDatasetService;

  private chartDatasetService(): IChartDatasetService {
    if (!this._chartDatasetService) this._chartDatasetService = new ChartDatasetService();

    return this._chartDatasetService;
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
    this.chartDatasetService()
      .fetchDataset(datamartId, chartConfig)
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

    const xKey = getXKeyForChart(
      chartConfig.type,
      chartConfig.options && (chartConfig.options as ChartOptions).xKey,
    );
    return (
      <div style={chartContainerStyle}>
        <div className={'mcs-chart_header'}>
          <h2 className={'mcs-chart_header_title'}>{chartConfig.title}</h2>
          {loading && <Loading className={'mcs-chart_header_loader'} isFullScreen={false} />}
        </div>
        <div className='mcs-chart_content_container'>
          {formattedData && this.renderChart(xKey, formattedData)}
        </div>
      </div>
    );
  }
}

export default Chart;
