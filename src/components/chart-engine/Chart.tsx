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
  ChartApiOptions,
  ChartConfig,
  ChartDatasetService,
  ChartOptions,
  ChartType,
  IChartDatasetService,
  MetricChartFormat,
  MetricChartOptions,
  RadarChartOptions,
} from '../../services/ChartDatasetService';
import { keysToCamel } from '../../utils/CaseUtils';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import { DashboardFilterQueryFragments } from '../../models/customDashboards/customDashboards';

interface YKey {
  key: string;
  message: string;
}

export interface QueryFragment {
  [key: string]: DashboardFilterQueryFragments[];
}

interface ChartProps {
  datamartId: string;
  chartConfig: ChartConfig;
  chartContainerStyle?: React.CSSProperties;
  scope?: AbstractScope;
  queryFragment?: QueryFragment;
}

interface ErrorContext {
  description: string;
}

interface ChartState {
  formattedData?: AbstractDataset;
  loading: boolean;
  errorContext?: ErrorContext;
}

type Props = ChartProps;
class Chart extends React.Component<Props, ChartState> {
  @lazyInject(TYPES.IChartDatasetService)
  private _chartDatasetService: IChartDatasetService;

  private chartDatasetService(): IChartDatasetService {
    if (!this._chartDatasetService) this._chartDatasetService = new ChartDatasetService();

    return this._chartDatasetService;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      errorContext: undefined,
    };
  }

  componentDidMount() {
    const { datamartId, chartConfig, scope, queryFragment } = this.props;
    this.chartDatasetService()
      .fetchDataset(datamartId, chartConfig, scope, queryFragment)
      .then(formattedData => {
        this.setState({
          formattedData: formattedData,
          loading: false,
        });
      })
      .catch(e => {
        this.setState({
          errorContext: {
            description: e,
          },
          loading: false,
        });
      });
  }

  pieChartAdaptValueKey(yKey: string, dataset: Dataset) {
    dataset.forEach(datapoint => {
      const value = datapoint[yKey];
      datapoint.value = value;
      if (yKey !== 'value') delete datapoint[yKey];
    });
  }

  renderAggregateChart(xKey: string, yKeys: YKey[], dataset: Dataset) {
    const { chartConfig } = this.props;
    const options: ChartApiOptions = chartConfig.options || {};
    const formattedOptions: ChartOptions = keysToCamel(options) as ChartOptions;
    const withKeys = {
      ...formattedOptions,
      yKeys: yKeys,
      xKey: xKey,
    };
    const sanitizedwithKeys = omitBy(withKeys, isUndefined);
    switch (chartConfig.type.toLowerCase()) {
      case 'pie':
        // Pie charts do not allow yKey parameter for some reason, and want y value
        // to be passed explicitely as 'value'
        this.pieChartAdaptValueKey(yKeys[0].key, dataset);
        return <PieChart innerRadius={false} dataset={dataset} {...sanitizedwithKeys} />;
      case 'radar':
        return (
          <RadarChart dataset={dataset as any} {...(sanitizedwithKeys as RadarChartOptions)} />
        );
      case 'bars':
        return <BarChart dataset={dataset as any} {...(sanitizedwithKeys as BarChartOptions)} />;
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

  getFormat(format?: MetricChartFormat) {
    switch (format) {
      case 'count':
        return '0,0';
      case 'percentage':
        return '0,0.00 %';
      case 'float':
        return '0,0.00';
      default:
        return '0,0';
    }
  }

  renderMetricChart(count: number) {
    const { chartConfig } = this.props;
    const opt = chartConfig.options as MetricChartOptions;
    return (
      <div className='mcs-dashboardMetric'>
        {formatMetric(count, opt && this.getFormat(opt.format))}
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
    const { formattedData, loading, errorContext } = this.state;
    const { chartConfig, chartContainerStyle } = this.props;
    if (!!errorContext) {
      return (
        <Alert
          message='Error'
          description={`Cannot fetch data for chart: ${errorContext.description}`}
          type='error'
          showIcon={true}
        />
      );
    }

    const xKey = getXKeyForChart(
      chartConfig.type,
      chartConfig.options && (chartConfig.options as ChartApiOptions).xKey,
    );
    return (
      <div style={chartContainerStyle} className={'mcs-chart'}>
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
