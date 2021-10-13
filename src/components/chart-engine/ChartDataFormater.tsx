import { BarChart, PieChart, RadarChart } from '@mediarithmics-private/mcs-components-library';
import * as React from 'react';
import {
  isAggregateResult,
  isCountResult,
  OTQLBucket,
  OTQLResult,
} from '../../models/datamart/graphdb/OTQLResult';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import {
  BarChartOptions,
  ChartConfig,
  ChartType,
  PieChartOptions,
  RadarChartOptions,
  MetricChartOptions,
} from './ChartDataFetcher';
import { formatMetric } from '../../utils/MetricHelper';
import { Alert } from 'antd';
import { isUndefined, omit, omitBy } from 'lodash';
interface ChartDataFormaterProps {
  dataResult: OTQLResult;
  chartConfig: ChartConfig;
}

interface ChartDataFormaterState {
  dataset: Dataset;
  hasError: boolean;
}

type Props = ChartDataFormaterProps;

class ChartDataFormater extends React.Component<Props, ChartDataFormaterState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dataset: [],
      hasError: false,
    };
  }

  formatDatasetAsKeyValue(buckets: OTQLBucket[], xKey: string, yKey: string): Dataset {
    const dataset: any = buckets.map(buck => {
      return {
        [xKey]: buck.key as string,
        [yKey]: buck.count as number,
        buckets: this.formatDatasetAsKeyValue(
          buck.aggregations?.buckets[0]?.buckets || [],
          xKey,
          yKey,
        ),
      };
    });
    return dataset;
  }

  getXKeyForChart(
    type: ChartType,
    options?: PieChartOptions | RadarChartOptions | BarChartOptions | MetricChartOptions,
  ) {
    switch (type.toLowerCase()) {
      case 'pie':
        return 'key';
      case 'radar':
        return options && (options as RadarChartOptions).xKey
          ? (options as RadarChartOptions).xKey
          : 'key';
      case 'bars':
        return options && (options as BarChartOptions).xKey
          ? (options as BarChartOptions).xKey
          : 'key';
      default:
        return 'key';
    }
  }

  private renderAlert(msg: string): JSX.Element {
    return <Alert message='Error' description={msg} type='error' />;
  }

  renderChart(): JSX.Element {
    const { dataResult, chartConfig } = this.props;
    if (dataResult && isAggregateResult(dataResult.rows) && !isCountResult(dataResult.rows)) {
      const buckets = dataResult.rows[0]?.aggregations?.buckets[0]?.buckets || [];
      const options = chartConfig.options || {};
      const xKey = this.getXKeyForChart(chartConfig.type, chartConfig.options);
      const yKey = {
        key: 'value',
        message: 'count',
      };
      const withKeys = {
        ...options,
        yKeys: [yKey],
        xKey: xKey,
      };

      const sanitizedwithKeys = omitBy(withKeys, isUndefined);
      switch (chartConfig.type.toLowerCase()) {
        case 'pie':
          const pieDataset = this.formatDatasetAsKeyValue(buckets, xKey, yKey.key);
          return <PieChart innerRadius={false} dataset={pieDataset} {...sanitizedwithKeys} />;
        case 'radar':
          const radarDataset = this.formatDatasetAsKeyValue(buckets, xKey, yKey.key);
          return <RadarChart dataset={radarDataset as any} {...(withKeys as RadarChartOptions)} />;
        case 'bars':
          const barsDataset = this.formatDatasetAsKeyValue(buckets, xKey, yKey.key);
          const withoutyKey = omit(withKeys, ['yKeys']);
          return (
            <BarChart
              dataset={barsDataset as any}
              format={'count'}
              yKeys={[{ key: 'value', message: 'count' }]}
              {...withoutyKey}
            />
          );
        default:
          return this.renderAlert(
            `Dataset of type aggregation result doesn't match ${chartConfig.type.toLowerCase()} chart type`,
          );
      }
    } else if (isCountResult(dataResult.rows)) {
      if (chartConfig.type.toLowerCase() === 'metric') {
        const value = dataResult.rows;
        const opt = chartConfig.options as MetricChartOptions;
        return (
          <div className='mcs-dashboardMetric'>
            {formatMetric(
              value[0].count,
              opt && opt.format && opt.format === 'percentage' ? '0,0 %' : '0,0',
            )}
          </div>
        );
      } else {
        return this.renderAlert(
          `Dataset of type count result doesn't match ${chartConfig.type.toLowerCase()} chart type`,
        );
      }
    } else {
      return this.renderAlert(`Undefined dataset for ${chartConfig.type.toLowerCase()} chart`);
    }
  }

  render() {
    return this.renderChart();
  }
}

export default ChartDataFormater;
