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
  defaultColors,
  Format,
  Legend,
  Tooltip,
  Dataset,
  buildLegendOptions,
  generateDraggable,
} from '../utils';
import { cloneDeep, omitBy, isUndefined } from 'lodash';

type YKey = { key: string; message: string };
type XKeyMode = 'DAY' | 'HOUR' | 'DEFAULT';
type Type = 'area' | 'line';
type XKey = { key: string; mode: XKeyMode };

function isTypeofXKey(xkey: XKey | string): xkey is XKey {
  return (xkey as XKey).key !== undefined;
}

export interface AreaChartProps {
  height?: number;
  dataset: Dataset;
  format: Format;
  legend?: Legend;
  colors?: string[];
  yKeys: YKey[];
  xKey: XKey | string;
  hideXAxis?: boolean;
  hideYAxis?: boolean;
  type?: Type;
  plotLineValue?: number;
  tooltip?: Tooltip;
  isDraggable?: boolean;
  onDragEnd?: OnDragEnd;
  doubleYaxis?: boolean;
  style?: React.CSSProperties;
}

type Props = AreaChartProps;

class AreaChart extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  formatSeries = (
    dataset: Dataset,
    xKey: XKey | string,
    yKeys: YKey[],
    colors: string[] = defaultColors,
    type: Type = 'area',
  ): Highcharts.SeriesOptionsType[] => {
    return yKeys.map((y, i) => {
      return {
        type: type as any,
        data: dataset.map(data => {
          const yValue = data[y.key];
          return [
            !isTypeofXKey(xKey)
              ? this.formatDateToTsForXKeyType(
                  data[xKey] as string,
                  data.hour_of_day
                    ? (data.hour_of_day as number)
                    : data.hour
                    ? (data.hour as number)
                    : undefined,
                )
              : this.formatDateToTs(data[xKey.key] as string, xKey),
            yValue && typeof yValue === 'string' ? parseFloat(yValue) : yValue,
          ];
        }),
        name: y.message,
        color: colors[i],
        yAxis: i,
        fillOpacity: 0.5,
        fillColor:
          type === 'area'
            ? {
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
              }
            : undefined,
      };
    });
  };

  formatDateToTs = (date: string, xKey: XKey) => {
    if (xKey.mode === 'DAY') {
      return moment(date).utc().seconds(0).hours(24).milliseconds(0).minutes(0).valueOf();
    } else if (xKey.mode === 'HOUR') {
      return moment(date).utc().valueOf();
    } else return date;
  };

  formatDateToTsForXKeyType = (date: string, hour?: number) => {
    return moment(date)
      .utc()
      .seconds(0)
      .hours((hour ? hour : 0) + 24)
      .milliseconds(0)
      .minutes(0)
      .valueOf();
  };

  render() {
    const {
      dataset,
      xKey,
      yKeys,
      colors,
      style,
      height,
      format,
      tooltip,
      legend,
      hideXAxis,
      hideYAxis,
      type,
      plotLineValue,
      isDraggable,
      onDragEnd,
      doubleYaxis,
    } = this.props;

    const xAxisDateTimeLabelFormatsOptions:
      | Highcharts.XAxisDateTimeLabelFormatsOptions
      | undefined = isTypeofXKey(xKey)
      ? xKey.mode === 'DAY'
        ? {
            month: { main: '%e. %b' },
            year: { main: '%b' },
          }
        : xKey.mode === 'HOUR'
        ? {
            minute: '%H:%M',
            hour: '%H:%M',
          }
        : undefined
      : undefined;
    const plotLines = plotLineValue
      ? [
          {
            color: '#3c3c3c',
            width: 2,
            value: plotLineValue,
          },
        ]
      : [];

    const options: Highcharts.Options = {
      chart: {
        height: height || BASE_CHART_HEIGHT,
        backgroundColor: 'none',
        type: type,
        ...(isDraggable ? generateDraggable(onDragEnd) : {}),
      },
      title: {
        text: '',
      },
      colors: colors || defaultColors,
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
      xAxis: !isTypeofXKey(xKey)
        ? {
            type: 'datetime',
            dateTimeLabelFormats: {
              month: { main: '%e. %b' },
              year: { main: '%b' },
            },
            ...generateXAxisGridLine(),
          }
        : {
            type: xKey.mode === 'DAY' || xKey.mode === 'HOUR' ? 'datetime' : 'category',
            dateTimeLabelFormats: xAxisDateTimeLabelFormatsOptions,
            ...generateXAxisGridLine(),
          },
      time: {
        useUTC: !isTypeofXKey(xKey) ? true : xKey.mode === 'DAY',
      },
      yAxis: [
        {
          plotLines: plotLines,
          title: {
            text: yKeys[0].message,
          },
          ...generateYAxisGridLine(),
        },
        {
          title: {
            text: yKeys[1]?.message,
          },
          opposite: true,
          visible: !!doubleYaxis,
        },
      ],
      series: this.formatSeries(dataset, xKey, yKeys, colors, type),
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        ...generateTooltip(true, format, tooltip?.format),
      },
      legend: buildLegendOptions(legend),
    };

    // Introducing XAxis and YAxis hidden visibility property broke
    // the classic display even if the hidden visibility
    // is falsy. So we need to create a specific options in this case.
    const optionsWithoutAxis = cloneDeep(options);

    if (hideYAxis) {
      optionsWithoutAxis.yAxis = {
        visible: false,
      };
    }

    if (hideXAxis) {
      optionsWithoutAxis.xAxis = {
        visible: false,
      };
    }

    const sanitizedOptions = omitBy(
      hideXAxis || hideYAxis ? optionsWithoutAxis : options,
      isUndefined,
    );

    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={sanitizedOptions}
        style={{ width: '100%', ...style }}
      />
    );
  }
}

export default compose<Props, AreaChartProps>()(AreaChart);
