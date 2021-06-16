import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { compose } from 'recompose';
import moment from 'moment';
import {
  AREA_OPACITY,
  generateXAxisGridLine,
  generateYAxisGridLine,
  generateTooltip,
  BASE_CHART_HEIGHT,
  OnDragEnd,
} from '../utils';

export interface StackedAreaChartProps {
  dataset: Dataset;
  options: ChartOptions;
  style?: React.CSSProperties;
}

type Dataset = Array<{ [key: string]: string | number | Date | undefined }>;

interface ChartOptions {
  colors: string[];
  yKeys: YKey[];
  xKey: XKey;
  isDraggable?: boolean;
  onDragEnd?: OnDragEnd;
}

type YKey = {
  key: string;
  message: string;
};

type XKey = {
  key: string;
  mode: XKeyMode;
};

type XKeyMode = 'DAY' | 'HOUR' | 'DEFAULT';

type Props = StackedAreaChartProps;

class StackedAreaChart extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  formatSeries = (
    dataset: Dataset,
    xKey: string,
    yKeys: YKey[],
    colors: string[],
  ): Highcharts.SeriesOptionsType[] => {
    return yKeys.map((y, i) => {
      return {
        type: 'area' as any,
        data: dataset.map(data => {
          const yValue = data[y.key];
          return [
            this.formatDateToTs(data[xKey] as string),
            yValue && typeof yValue === 'string' ? parseFloat(yValue) : yValue,
          ];
        }),
        name: y.message,
        color: colors[i],
        fillOpacity: 0.5,
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, (Highcharts as any).Color(colors[i]).setOpacity(AREA_OPACITY).get('rgba')],
            [1, (Highcharts as any).Color(colors[i]).setOpacity(0).get('rgba')],
          ],
        },
      };
    });
  };

  formatDateToTs = (date: string) => {
    const {
      options: {
        xKey: { mode },
      },
    } = this.props;

    if (mode === 'DAY') {
      return moment(date).utc().seconds(0).hours(24).milliseconds(0).minutes(0).valueOf();
    } else if (mode === 'HOUR') {
      return moment(date).utc().valueOf();
    } else return date;
  };

  render() {
    const {
      dataset,
      options: { xKey, yKeys, colors },
    } = this.props;

    const xAxisDateTimeLabelFormatsOptions:
      | Highcharts.XAxisDateTimeLabelFormatsOptions
      | undefined =
      xKey.mode === 'DAY'
        ? {
            month: { main: '%e. %b' },
            year: { main: '%b' },
          }
        : xKey.mode === 'HOUR'
        ? {
            minute: '%H:%M',
            hour: '%H:%M',
          }
        : undefined;

    const options: Highcharts.Options = {
      chart: {
        height: BASE_CHART_HEIGHT,
      },
      title: {
        text: '',
      },
      colors: colors,
      plotOptions: {
        area: {
          animation: true,
          marker: {
            radius: 4,
            symbol: 'circle',
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          // The Y axis value to serve as the base for the
          // area, for distinguishing between values above and below a threshold.
          // The area between the graph and the threshold is filled.
          threshold: 0,
        },
      },
      xAxis: {
        type: xKey.mode === 'DAY' || xKey.mode === 'HOUR' ? 'datetime' : 'category',
        dateTimeLabelFormats: xAxisDateTimeLabelFormatsOptions,
        ...generateXAxisGridLine(),
      },
      time: {
        useUTC: xKey.mode === 'DAY',
      },
      yAxis: {
        title: {
          text: null,
        },
        ...generateYAxisGridLine(),
      },
      series: this.formatSeries(dataset, xKey.key, yKeys, colors),
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        ...generateTooltip(),
      },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} style={{ width: '100%' }} />;
  }
}

export default compose<Props, StackedAreaChartProps>()(StackedAreaChart);
