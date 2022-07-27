import * as React from 'react';
import { getXKeyForChart } from '../../utils/ChartDataFormater';
import {
  PieChart,
  BarChart,
  RadarChart,
  AreaChart,
  McsIcon,
  MetricChart,
} from '@mediarithmics-private/mcs-components-library';
import { Alert, Spin, Table } from 'antd';
import { isUndefined, omitBy } from 'lodash';
import { formatMetric } from '../../utils/MetricHelper';
import {
  AreaChartOptions,
  BarChartOptions,
  ChartApiOptions,
  ChartOptions,
  ChartType,
  ManagedChartConfig,
  MetricChartOptions,
  RadarChartOptions,
  TableChartOptions,
} from '../../services/ChartDatasetService';
import { keysToCamel } from '../../utils/CaseUtils';
import { InjectedDrawerProps } from '../..';
import {
  ArrowDownOutlined,
  ArrowsAltOutlined,
  ArrowUpOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import cuid from 'cuid';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { injectDrawer } from '../drawer';
import {
  AbstractDataset,
  AggregateDataset,
  CountDataset,
} from '../../models/dashboards/dataset/dataset_tree';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { ColumnsType } from 'antd/lib/table';
import { MetricChartFormat } from '@mediarithmics-private/mcs-components-library/lib/components/charts/metric-chart/MetricChart';

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

type Layout = 'vertical' | 'horizontal';

interface ManagedChartProps {
  formattedData?: AbstractDataset;
  chartConfig: ManagedChartConfig;
  showButtonUp?: boolean;
  showButtonDown?: boolean;
  layout?: Layout;
  chartContainerStyle?: React.CSSProperties;
  onClickEdit?: () => void;
  onClickMove?: (direction: 'up' | 'down') => void;
  onClickDelete?: () => void;
  openDrawer?: () => void;
  loading: boolean;
  stillLoading: boolean;
  errorContext?: ErrorContext;
}

interface ErrorContext {
  description: string;
}

/**
 * Managed chart differs from standalone chart in the fact it receives
 * a hydrated dataset tree, but it still handles
 */

type Props = InjectedDrawerProps & InjectedIntlProps & ManagedChartProps;
class ManagedChart extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      stillLoading: false,
      errorContext: undefined,
    };
  }

  adaptDatasetForPieChart(xKey: string, yKeys: YKey[], dataset: Dataset) {
    const newDataset: Dataset = JSON.parse(JSON.stringify(dataset));
    newDataset.forEach(datapoint => {
      const value = yKeys?.find(yKey => Object.keys(datapoint).includes(yKey.key))?.key;
      datapoint.key = datapoint[xKey];
      datapoint.value = value ? datapoint[`${value}`] : undefined;
      if (xKey !== 'key') delete datapoint[xKey];
    });
    return newDataset;
  }

  renderMetricData = (value: string | number, numeralFormat: string, currency: string = '') => {
    const unlocalizedMoneyPrefix = currency === 'EUR' ? '€ ' : '';
    return formatMetric(value, numeralFormat, unlocalizedMoneyPrefix);
  };

  renderAggregateChart(xKey: string, yKeys: YKey[], dataset: Dataset) {
    const { chartConfig } = this.props;
    const options: ChartApiOptions = chartConfig.options || {};
    const formattedOptions: ChartOptions = keysToCamel(options) as ChartOptions;
    const withKeys = {
      ...formattedOptions,
      yKeys: yKeys,
      xKey: xKey,
    };

    const getSorter = (key: string) => {
      const sorter = (a: any, b: any) => {
        if (key === 'key') {
          return typeof a.key === 'string' &&
            typeof b.key === 'string' &&
            !isNaN(Date.parse(a.key)) &&
            !isNaN(Date.parse(b.key))
            ? Date.parse(a.key) - Date.parse(b.key)
            : a.key.length - b.key.length;
        } else {
          return a.count - b.count;
        }
      };
      return sorter;
    };

    const renderTableChart = (tableChartOptions: TableChartOptions) => {
      const getColumns = () => {
        const columns: ColumnsType<object> = yKeys
          .map(yKey => {
            return {
              title: yKey.message,
              dataIndex: yKey.key,
              key: yKey.key,
              sorter: getSorter(yKey.key),
              render: (text: string) => <span>{this.renderMetricData(text, '0,0')}</span>,
            };
          })
          .concat({
            render: (text: string, record: any) => {
              if (tableChartOptions?.bucketHasData(record)) {
                return (
                  <div className='float-right'>
                    <McsIcon type='chevron-right' />
                  </div>
                );
              }
              return null;
            },
          } as any);
        columns.unshift({
          title: 'Key',
          dataIndex: 'key',
          key: 'key',
          sorter: getSorter('key'),
        });
        return columns;
      };
      return (
        <Table
          columns={getColumns()}
          className='mcs-aggregationRendered_table'
          onRow={tableChartOptions.handleOnRow}
          rowClassName={tableChartOptions.getRowClassName}
          dataSource={dataset as any}
          pagination={{
            size: 'small',
            showSizeChanger: true,
            hideOnSinglePage: true,
          }}
        />
      );
    };

    const sanitizedwithKeys = omitBy(withKeys, isUndefined);
    switch (chartConfig.type.toLowerCase()) {
      case 'pie':
        // Pie charts do not allow yKey parameter for some reason, and want y value
        // to be passed explicitely as 'value'

        return (
          <PieChart
            innerRadius={false}
            dataset={this.adaptDatasetForPieChart(xKey, yKeys, dataset)}
            {...sanitizedwithKeys}
          />
        );
      case 'radar':
        return <RadarChart dataset={dataset} {...(sanitizedwithKeys as RadarChartOptions)} />;
      case 'bars':
        return <BarChart dataset={dataset as any} {...(sanitizedwithKeys as BarChartOptions)} />;
      case 'table':
        const tableChartOptions = formattedOptions as TableChartOptions;
        return renderTableChart(tableChartOptions);
      case 'area':
      case 'line':
        return <AreaChart dataset={dataset as any} {...(sanitizedwithKeys as AreaChartOptions)} />;
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
    const formattingFn = (c: number) => {
      return formatMetric(c, opt && this.getFormat(opt.format));
    }

    return (
      <MetricChart value={count} formattingFn={formattingFn} />
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
      !(
        chartType === 'bars' ||
        chartType === 'radar' ||
        chartType === 'pie' ||
        chartType === 'area' ||
        chartType === 'line' ||
        chartType === 'table'
      )
    ) {
      return this.renderAlert(
        `Dataset of type aggregation result doesn't match ${chartConfig.type.toLowerCase()} chart type`,
      );
    } else if (datasetType === 'count') {
      const countDataset = dataset as CountDataset;
      if (chartType !== 'metric') {
        return this.renderAlert(
          `Dataset of type count result doesn't match ${chartConfig.type.toLowerCase()} chart type`,
        );
      } else return this.renderMetricChart(countDataset.value);
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
    } else {
      return undefined;
    }
  }

  renderUpIcon(onClickMoveUp: () => void, layout?: Layout, showButton?: boolean) {
    if (!showButton) return undefined;
    else
      return layout && layout === 'horizontal' ? (
        <ArrowLeftOutlined
          key={cuid()}
          className={'mcs-chartIcon mcs-chart_arrow_up'}
          onClick={onClickMoveUp}
        />
      ) : (
        <ArrowUpOutlined
          key={cuid()}
          className={'mcs-chartIcon mcs-chart_arrow_up'}
          onClick={onClickMoveUp}
        />
      );
  }

  renderDownIcon(onClickMoveDown: () => void, layout?: Layout, showButton?: boolean) {
    if (!showButton) return undefined;
    else
      return layout && layout === 'horizontal' ? (
        <ArrowRightOutlined
          key={cuid()}
          className={'mcs-chartIcon mcs-chart_arrow_down'}
          onClick={onClickMoveDown}
        />
      ) : (
        <ArrowDownOutlined
          key={cuid()}
          className={'mcs-chartIcon mcs-chart_arrow_down'}
          onClick={onClickMoveDown}
        />
      );
  }

  render() {
    const {
      chartConfig,
      chartContainerStyle,
      intl,
      onClickEdit,
      onClickMove,
      onClickDelete,
      showButtonDown,
      showButtonUp,
      layout,
      formattedData,
      loading,
      stillLoading,
      errorContext,
    } = this.props;
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

    const onClickMoveUp = onClickMove ? () => onClickMove('up') : undefined;
    const onClickMoveDown = onClickMove ? () => onClickMove('down') : undefined;

    return (
      <div style={chartContainerStyle} className={'mcs-chart'}>
        <div className={'mcs-chart_header'}>
          <span
            style={{ cursor: 'pointer' }}
            className={'mcs-chart_header_title'}
            onClick={onClickEdit ? onClickEdit : this.props.openDrawer}
          >
            <span className='mcs-chart_header_text'>{chartConfig.title}</span>
            {!onClickEdit && !!chartConfig.title ? (
              <ArrowsAltOutlined className={'mcs-chartIcon mcs-hoverableIcon'} />
            ) : undefined}
          </span>
          <span className='mcs-chart_header_editBtns'>
            {onClickEdit ? (
              <EditOutlined className={'mcs-chartIcon mcs-chart_edit'} onClick={onClickEdit} />
            ) : undefined}
            {onClickMoveUp && onClickMoveDown
              ? [
                  this.renderUpIcon(onClickMoveUp, layout, showButtonUp),
                  this.renderDownIcon(onClickMoveDown, layout, showButtonDown),
                ]
              : undefined}
            {onClickDelete ? (
              <DeleteOutlined
                className={'mcs-chartIcon mcs-chart_delete'}
                onClick={onClickDelete}
              />
            ) : undefined}
          </span>
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

export default compose<Props, ManagedChartProps>(injectIntl, injectDrawer)(ManagedChart);
