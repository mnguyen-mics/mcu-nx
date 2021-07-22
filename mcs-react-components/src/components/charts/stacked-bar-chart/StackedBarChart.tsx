import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import HighchartsReact from 'highcharts-react-official';
import { compose } from 'recompose';
import {
  generateTooltip,
  BASE_CHART_HEIGHT,
  Dataset,
  Datapoint,
  buildDrilldownTree,
} from '../utils';
import { uniqueId } from 'lodash';

HighchartsDrilldown(Highcharts);

type Bar = 'bar';

export interface StackedBarChartProps {
  dataset: Dataset;
  enableDrilldown?: boolean;
  options: StackedBarChartOptions;
  height?: number;
  reducePadding?: boolean;
  stacking?: boolean;
}

export interface StackedBarChartOptions {
  colors: string[];
  yKeys: YKey[];
  xKey: string;
  showLegend?: boolean;
  type?: string;
  yAxisTilte?: string;
  chartOptions?: Highcharts.Options;
}

type YKey = { key: string; message: string };

type Props = StackedBarChartProps;

class StackedBarChart extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  formatSerieData = (dataset: Dataset, y: YKey, xKey: string, enableDrilldown: boolean) => {
    return dataset.map((d: Datapoint) => {
      const datapoint = {
        name: d[xKey],
        id: d[xKey] as string,
        y: d[y.key] ? (d[y.key] as number) : 0,
      };
      if (enableDrilldown && !!d.buckets)
        return {
          ...datapoint,
          drilldown: d.drilldown,
        };
      else return datapoint;
    });
  };

  formatSeries = (
    dataset: Dataset,
    yKeys: YKey[],
    xKey: string,
    enableDrilldown: boolean,
  ): Highcharts.SeriesOptionsType[] => {
    return yKeys.map(y => {
      return {
        name: y.message,
        data: this.formatSerieData(dataset, y, xKey, enableDrilldown),
        type: 'column' as any,
      };
    });
  };

  render() {
    const {
      dataset,
      enableDrilldown,
      options: { colors, xKey, yKeys, showLegend, type, chartOptions },
      reducePadding,
      height,
      stacking,
    } = this.props;

    let datasetWithDrilldownIds = dataset;
    if (!!enableDrilldown) {
      datasetWithDrilldownIds = dataset.map(d => {
        const drilldownId = uniqueId();
        return {
          ...d,
          drilldown: drilldownId,
        };
      }) as Dataset;
    }
    const series = this.formatSeries(datasetWithDrilldownIds, yKeys, xKey, !!enableDrilldown);
    // TODO: Handle multiple yKeys
    const drilldown = !!enableDrilldown
      ? buildDrilldownTree<Bar>('bar', datasetWithDrilldownIds, [], xKey, yKeys[0].key)
      : [];

    let plotOptionsForColumn = {};

    if (reducePadding) {
      plotOptionsForColumn = {
        ...plotOptionsForColumn,
        pointPadding: 0.05,
        groupPadding: 0,
      };
    }

    if (stacking) {
      plotOptionsForColumn = {
        ...plotOptionsForColumn,
        stacking: 'normal',
      };
    }

    const options: Highcharts.Options = {
      ...this.props.options,
      chart: {
        type: type || 'column',
        height: height ? height : BASE_CHART_HEIGHT,
      },
      title: {
        text: '',
      },
      lang: {
        drillUpText: 'Back',
      },
      colors: colors,
      plotOptions: {
        column: plotOptionsForColumn,
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        ...chartOptions?.yAxis,
        title: (chartOptions?.yAxis as Highcharts.YAxisOptions)?.title || { text: '' },
      },
      series: series,
      drilldown: {
        activeAxisLabelStyle: {
          textDecoration: 'none',
          color: '#00A1DF',
        },
        series: drilldown,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        ...generateTooltip(),
      },
      legend: {
        enabled: showLegend === undefined ? false : showLegend,
      },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} style={{ width: '100%' }} />;
  }
}

export default compose<Props, StackedBarChartProps>()(StackedBarChart);
