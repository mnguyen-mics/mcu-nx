import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { compose } from 'recompose';
import {
  BASE_CHART_HEIGHT,
  Datapoint,
  Dataset,
  buildDrilldownTree,
  WithSubBuckets,
  defaultColors,
} from '../utils';
import { uniqueId } from 'lodash';

type Pie = 'pie';

export interface PieDataLabels {
  enabled: boolean;
  distance?: number;
  format?: string;
  filter?: Highcharts.DataLabelsFilterOptionsObject;
}

export interface PieChartLegend {
  enabled: boolean;
  position: 'bottom' | 'right';
}
export interface TextProps {
  value?: string;
  text?: string;
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
  tooltip?: string;
  text?: TextProps;
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
    const { legend, dataLabels, drilldown } = this.props;
    if (dataLabels?.format) return dataLabels?.format;
    if (drilldown) return `${!!legend?.enabled ? '' : '<b>{point.name}</b>: '}<b>{point.percentage:.2f} %</b>`;
    return `${!!legend?.enabled ? '' : '<b>{point.name}</b>: '}{point.percentage:.2f} %`;
  };

  formatTooltip = (): string => {
    const { legend, tooltip } = this.props;
    if (tooltip) return tooltip;
    return `${!!legend?.enabled ? '' : '{point.name}: '}{point.percentage:.2f} %`;
  };

  render() {
    const { dataset, height, legend, colors, drilldown, innerRadius, isHalf, dataLabels, text } =
      this.props;
    const xKey = 'key';
    const yKey = 'value';

    const chartColors = colors || [
      '#00a1df',
      '#fd7c12',
      '#00ab67',
      '#513fab',
      '#eb5c5d',
      '#003056',
      '#d9d9d9',
    ];

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
        plotBackgroundColor: undefined,
        plotBorderWidth: undefined,
        plotShadow: false,
        type: 'pie',
        animation: false,
        height: height,
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
        text: text ? `<div>${text.value}</div><br /><div>${text.text}</div>` : '',
        align: 'center',
        verticalAlign: 'middle',
        y: isHalf ? -30 : -5,
      },
      colors: colors || defaultColors,
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: dataLabels ? !!dataLabels.enabled : true,
            format: this.formatDataLabel(),
            distance: dataLabels?.distance || 0,
            filter: dataLabels?.filter,
            style: {
              color: 'rgba(0, 0, 0, 0.65)',
            },
          },
          startAngle: isHalf ? -90 : 0,
          endAngle: isHalf ? 90 : 0,
          selected: true,
          showInLegend: !!legend?.enabled,
        },
      },
      legend: {
        width: 90,
        itemWidth: 90,
        verticalAlign: legend?.position === 'bottom' ? legend?.position : 'top',
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

    return (
      <div
        style={{
          overflow: 'hidden',
          height: height || (isHalf ? BASE_CHART_HEIGHT / 2 : BASE_CHART_HEIGHT),
        }}
      >
        <HighchartsReact highcharts={Highcharts} options={options} style={{ width: '100%' }} />
      </div>
    );
  }
}

export default compose<Props, PieChartProps>()(PieChart);
