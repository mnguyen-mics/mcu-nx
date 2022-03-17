import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { compose } from 'recompose';
import {
  Datapoint,
  Dataset,
  buildDrilldownTree,
  WithSubBuckets,
  defaultColors,
  PieChartFormat,
} from '../utils';
import { uniqueId } from 'lodash';

type Pie = 'pie';

export interface PieDataLabels {
  enabled?: boolean;
  distance?: number;
  format?: string;
  filter?: Highcharts.DataLabelsFilterOptionsObject;
}

export interface PieChartLegend {
  enabled: boolean;
  position: 'bottom' | 'right';
}
export interface PieChartProps {
  height?: number;
  dataset: Dataset;
  legend?: PieChartLegend;
  colors?: string[];
  drilldown?: boolean;
  innerRadius: boolean;
  isHalf?: boolean;
  dataLabels?: PieDataLabels;
  tooltip?: Tooltip;
  format?: PieChartFormat;
}

interface Tooltip {
  format: string;
}

type Props = PieChartProps;

class PieChart extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  initDrilldownIds = (dataset: Highcharts.SeriesPieDataOptions[]): Dataset => {
    return dataset.map((d: Highcharts.SeriesPieDataOptions) => {
      const withBuckets: WithSubBuckets = d as WithSubBuckets;
      const datapoint = {
        name: d.name,
        y: d.y as number,
        drilldown: d.drilldown,
        buckets: withBuckets.buckets,
      };
      return datapoint as Datapoint;
    });
  };

  formatSeries = (
    dataset: Dataset,
    innerRadius: boolean,
    colors: string[] = defaultColors,
    drilldown: boolean,
    xKey: string,
    yKey: string,
    showLabels: boolean,
  ): Highcharts.SeriesPieOptions => {
    return {
      type: 'pie',
      name: '',
      innerSize: innerRadius ? '65%' : '0%',
      data: dataset.map((d: Datapoint, i: number) => {
        const drilldownId = drilldown && !!d.buckets ? uniqueId() : undefined;
        return {
          name: d[xKey] as string,
          y: d[yKey] as number,
          count: d[`${yKey}-count`],
          selected: showLabels,
          color: colors[i % colors.length],
          drilldown: drilldownId,
          buckets: d.buckets,
        };
      }),
    };
  };

  formatDataLabel = (): string => {
    const { legend, dataLabels, format } = this.props;
    if (dataLabels?.format) return dataLabels?.format;
    return `${!!legend?.enabled ? '' : '{point.name}: '}${
      format !== 'count' ? '{point.percentage:.2f}%' : '{point.y}'
    }`;
  };

  formatTooltip = (): string => {
    const { legend, tooltip, format } = this.props;
    if (tooltip) return tooltip.format;
    return `${!!legend?.enabled ? '' : '{point.name}: '}${
      format !== 'count' ? '{point.percentage:.2f}%' : '{point.y}'
    }`;
  };

  render() {
    const { dataset, height, legend, colors, drilldown, innerRadius, isHalf, dataLabels } =
      this.props;
    const xKey = 'key';
    const yKey = 'value';

    const chartColors = colors || defaultColors;

    const series = this.formatSeries(
      dataset,
      innerRadius,
      chartColors,
      !!drilldown,
      xKey,
      yKey,
      dataLabels ? !!dataLabels.enabled : true,
    );
    const seriesData: Dataset = this.initDrilldownIds(
      series.data as Highcharts.SeriesPieDataOptions[],
    );
    const seriesPieOptions: Highcharts.SeriesPieOptions = {
      type: 'pie',
      innerSize: innerRadius ? '65%' : '0%',
    };
    const drilldownTree = !!drilldown
      ? buildDrilldownTree<Pie>('pie', seriesData, [], xKey, yKey, seriesPieOptions)
      : [];

    const options: Highcharts.Options = {
      chart: {
        backgroundColor: 'none',
        plotBackgroundColor: undefined,
        plotBorderWidth: undefined,
        plotShadow: false,
        type: 'pie',
        animation: false,
        height,
        style: { fontFamily: '' },
      },
      xAxis: {
        labels: {
          style: {
            fontWeight: '500',
          },
        },
      },
      lang: {
        drillUpText: 'Back',
      },
      title: {
        text: '',
        align: 'center',
        verticalAlign: 'middle',
        y: isHalf ? -30 : -5,
      },
      colors: colors || defaultColors,
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: typeof dataLabels?.enabled === 'boolean' ? dataLabels?.enabled : true,
            format: this.formatDataLabel(),
            filter: dataLabels?.filter,
            style: {
              color: 'rgba(0, 0, 0, 0.65)',
              fontWeight: 'normal',
              fontFamily: drilldown ? 'LLCircularWeb-Medium' : 'LLCircularWeb-Book',
            },
          },
          startAngle: isHalf ? -90 : 0,
          endAngle: isHalf ? 90 : 0,
          selected: true,
          showInLegend: !!legend?.enabled,
        },
      },
      legend: {
        verticalAlign: legend?.position === 'right' ? 'middle' : 'bottom',
        align: legend?.position === 'right' ? legend?.position : 'center',
        layout: 'vertical',
      },
      series: [series],
      drilldown: {
        activeDataLabelStyle: {
          textDecoration: 'none',
          color: '#00A1DF',
          fontWeight: '500',
        },
        series: drilldownTree,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        pointFormat: this.formatTooltip(),
      },
    };

    // Passing undefined as distance value breaks the chart
    if (dataLabels?.distance !== undefined && options && options?.plotOptions?.pie?.dataLabels) {
      options.plotOptions.pie.dataLabels.distance = dataLabels?.distance;
    }

    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { height: '100%' } }}
      />
    );
  }
}

export default compose<Props, PieChartProps>()(PieChart);
