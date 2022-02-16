import * as React from 'react';
import {
  AbstractDataset,
  AggregateDataset,
  CountDataset,
  getXKeyForChart,
} from '../../utils/ChartDataFormater';
import { PieChart, BarChart, RadarChart } from '@mediarithmics-private/mcs-components-library';
import { Alert, Spin } from 'antd';
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
import { InjectedDrawerProps } from '../..';
import ChartMetadataInfo from './ChartMetadataInfo';
import { IQueryService, QueryService } from '../../services/QueryService';
import { QueryScopeAdapter } from '../../utils/QueryScopeAdapter';
import {
  ArrowDownOutlined,
  ArrowsAltOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import cuid from 'cuid';
import { extractOtqlQueriesHelper, QueryFragment } from '../../utils/source/OtqlSourceHelper';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { injectDrawer } from '../drawer';

const messages = defineMessages({
  stillLoading: {
    id: 'chart.stillLoading',
    defaultMessage: 'Still loading...',
  },
});

interface YKey {
  key: string;
  message: string;
}

interface ChartProps {
  datamartId: string;
  organisationId: string;
  chartConfig: ChartConfig;
  chartContainerStyle?: React.CSSProperties;
  scope?: AbstractScope;
  queryFragment?: QueryFragment;
  onClickEdit?: () => void;
  onClickMove?: (direction: 'up' | 'down') => void;
  onClickDelete?: () => void;
}

interface ErrorContext {
  description: string;
}

interface ChartState {
  formattedData?: AbstractDataset;
  loading: boolean;
  stillLoading: boolean;
  errorContext?: ErrorContext;
}

type Props = InjectedDrawerProps & InjectedIntlProps & ChartProps;

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
      stillLoading: false,
      errorContext: undefined,
    };
  }

  componentDidMount() {
    const { datamartId, organisationId, chartConfig, scope, queryFragment } = this.props;
    this.chartDatasetService()
      .fetchDataset(datamartId, organisationId, chartConfig, scope, queryFragment)
      .then(formattedData => {
        this.setState({
          formattedData: formattedData,
          loading: false,
          stillLoading: false,
        });
      })
      .catch(e => {
        this.setState({
          errorContext: {
            description: e,
          },
          loading: false,
          stillLoading: false,
        });
      });

    this.checkIfStillLoading();
  }

  checkIfStillLoading() {
    setTimeout(() => {
      this.setState(state => {
        return {
          stillLoading: state.loading,
        };
      });
    }, 6000);
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

  private queryService: IQueryService = new QueryService();
  private scopeAdapter: QueryScopeAdapter = new QueryScopeAdapter(this.queryService);

  async extractOtqlQueriesFromDataset() {
    const { chartConfig, datamartId, scope, queryFragment } = this.props;

    return extractOtqlQueriesHelper(
      chartConfig.dataset,
      datamartId,
      this.queryService,
      this.scopeAdapter,
      scope,
      queryFragment,
    );
  }

  async closeDrawer() {
    this.props.closeNextDrawer();
  }

  async openDrawer(title: string, formattedData?: AbstractDataset) {
    let _dataset: Dataset = [];
    if (formattedData && formattedData.type === 'aggregate') {
      const aggregateDataset = formattedData as AggregateDataset;
      if (aggregateDataset.dataset && aggregateDataset.dataset.length)
        _dataset = aggregateDataset.dataset;
    } else if (formattedData && formattedData.type === 'count') {
      const countDataset = formattedData as CountDataset;
      _dataset = [
        {
          key: 'count',
          value: countDataset.value,
        },
      ];
    }
    const queries = await this.extractOtqlQueriesFromDataset();
    if (queries) {
      this.props.openNextDrawer(ChartMetadataInfo, {
        size: 'small',
        className: 'mcs-chartMetaDataInfo_drawer',
        additionalProps: {
          onCloseDrawer: this.closeDrawer.bind(this),
          title: title,
          datainfo: {
            dataset: _dataset,
          },
          query_infos: queries.map(x => {
            return {
              query_text: x.queryText,
            };
          }),
        },
      });
    }
  }

  render() {
    const { formattedData, loading, stillLoading, errorContext } = this.state;
    const { chartConfig, chartContainerStyle, intl, onClickEdit, onClickMove, onClickDelete } =
      this.props;
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

    const xKey = getXKeyForChart(chartConfig.type, chartConfig.options && chartConfig.options.xKey);

    const openDrawer = () => this.openDrawer(chartConfig.title, formattedData);
    const onClickMoveUp = onClickMove ? () => onClickMove('up') : undefined;
    const onClickMoveDown = onClickMove ? () => onClickMove('down') : undefined;

    return (
      <div style={chartContainerStyle} className={'mcs-chart'}>
        <div className={'mcs-chart_header'}>
          <span
            style={{ cursor: 'pointer' }}
            className={'mcs-chart_header_title'}
            onClick={onClickEdit ? onClickEdit : openDrawer}
          >
            <span className='mcs-chart_header_text'>{chartConfig.title}</span>
            {!onClickEdit ? (
              <ArrowsAltOutlined className={'mcs-chartIcon mcs-hoverableIcon'} />
            ) : undefined}
          </span>
          {onClickEdit ? (
            <EditOutlined className={'mcs-chartIcon mcs-chart_edit'} onClick={onClickEdit} />
          ) : undefined}
          {onClickMoveUp && onClickMoveDown
            ? [
                <ArrowUpOutlined
                  key={cuid()}
                  className={'mcs-chartIcon mcs-chart_arrow_up'}
                  onClick={onClickMoveUp}
                />,
                <ArrowDownOutlined
                  key={cuid()}
                  className={'mcs-chartIcon mcs-chart_arrow_down'}
                  onClick={onClickMoveDown}
                />,
              ]
            : undefined}
          {onClickDelete ? (
            <DeleteOutlined className={'mcs-chartIcon mcs-chart_delete'} onClick={onClickDelete} />
          ) : undefined}
        </div>
        <div className='mcs-chart_content_container'>
          {loading && (
            <Spin
              className={'mcs-loading mcs-chart_header_loader'}
              tip={stillLoading ? intl.formatMessage(messages.stillLoading) : undefined}
            />
          )}
          {formattedData && this.renderChart(xKey, formattedData)}
        </div>
      </div>
    );
  }
}

export default compose<Props, ChartProps>(injectIntl, injectDrawer)(Chart);
