import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { compose } from 'recompose';
import {
  generateTooltip,
  BASE_CHART_HEIGHT,
  Datapoint,
  Dataset,
  buildDrilldownTree,
  WithSubBuckets,
  Format,
  defaultColors,
} from '../utils';
import { uniqueId } from 'lodash';

interface TextProps {
  value?: string;
  text?: string;
}

type Pie = 'pie';

export interface DonutChartOptionsProps {
  innerRadius: boolean;
  isHalf: boolean;
  text?: TextProps;
  colors?: string[];
  showTooltip?: boolean;
  showLabels?: boolean;
  showHover?: boolean;
  format: Format;
}

export interface DonutChartProps {
  dataset: Dataset;
  options: DonutChartOptionsProps;
  enableDrilldown?: boolean;
  height?: number;
}

type Props = DonutChartProps;

class DonutChart extends React.Component<Props, {}> {
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
    enableDrilldown: boolean,
    xKey: string,
    yKey: string,
    showLabels?: boolean,
  ): Highcharts.SeriesPieOptions => {
    return {
      type: 'pie',
      name: '',
      innerSize: innerRadius ? '65%' : '0%',
      data: dataset.map((d: Datapoint, i: number) => {
        const drilldownId = enableDrilldown && !!d.buckets ? uniqueId() : undefined;
        return {
          name: d[xKey] as string,
          y: d[yKey] as number,
          count: d[`${yKey}-count`],
          selected: showLabels ? !showLabels : true,
          color: colors[i % colors.length],
          drilldown: drilldownId,
          buckets: d.buckets,
        };
      }),
    };
  };

  render() {
    const {
      dataset,
      options: { innerRadius, isHalf, text, colors, showTooltip, showLabels, format },
      height,
      enableDrilldown,
    } = this.props;
    const xKey = 'key';
    const yKey = 'value';

    const series = this.formatSeries(
      dataset,
      innerRadius,
      colors,
      !!enableDrilldown,
      xKey,
      yKey,
      showLabels,
    );
    const seriesData: Dataset = this.initDrilldownIds(
      series.data as Highcharts.SeriesPieDataOptions[],
    );
    const seriesPieOptions: Highcharts.SeriesPieOptions = {
      type: 'pie',
      innerSize: innerRadius ? '65%' : '0%',
    };
    const drilldown = !!enableDrilldown
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
            enabled: showLabels ? showLabels : false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: 'rgba(0, 0, 0, 0.65)',
            },
          },
          startAngle: isHalf ? -90 : 0,
          endAngle: isHalf ? 90 : 0,
          center: ['50%', '50%'],
          size: showLabels ? '80%' : '100%',
          selected: true,
        },
      },
      series: [series],
      drilldown: {
        activeDataLabelStyle: {
          textDecoration: 'none',
          color: '#00A1DF',
          fontWeight: '500',
        },
        series: drilldown,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        ...generateTooltip(showTooltip ? showTooltip : false, format),
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

export default compose<Props, DonutChartProps>()(DonutChart);
