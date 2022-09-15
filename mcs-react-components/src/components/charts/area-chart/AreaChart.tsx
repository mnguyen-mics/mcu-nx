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
  OnDragEnd,
  defaultColors,
  Format,
  Legend,
  Tooltip,
  Dataset,
  buildLegendOptions,
  generateDraggable,
  Datapoint,
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
  doubleYAxis?: boolean;
}

type Props = AreaChartProps;

class AreaChart extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};

    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        thousandsSep: ',',
      },
    });
  }

  formatKeyValue = (xKey: XKey | string, data: Datapoint, isDateKey: boolean) => {
    if (isTypeofXKey(xKey)) {
      return this.formatDateToTs(data[xKey.key] as string, xKey);
    } else {
      const key = data[xKey];
      if (isDateKey) {
        return this.formatDateToTsForXKeyType(
          key as string,
          data.hour_of_day
            ? (data.hour_of_day as number)
            : data.hour
            ? (data.hour as number)
            : undefined,
        );
      } else return key;
    }
  };

  formatSeries = (
    dataset: Dataset,
    xKey: XKey | string,
    yKeys: YKey[],
    isDateKey: boolean,
    colors: string[] = defaultColors,
    type: Type = 'area',
  ): Highcharts.SeriesOptionsType[] => {
    const { doubleYAxis } = this.props;

    return yKeys.map((y, i) => {
      return {
        type: type as any,
        connectNulls: true,
        data: dataset.map(data => {
          const yValue = data[y.key];
          return [
            this.formatKeyValue(xKey, data, isDateKey),
            yValue && typeof yValue === 'string' ? parseFloat(yValue) : yValue,
          ];
        }),
        name: y.message,
        color: colors[i],
        yAxis: doubleYAxis ? i : undefined,
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

  checkSerieKeyIsDate = (xKey: string, dataset: Dataset): boolean => {
    let result = true;
    dataset.forEach(point => {
      const key = point[xKey];
      if (!moment(key as string).isValid()) result = false;
    });
    return result;
  };

  render() {
    const {
      dataset,
      xKey,
      yKeys,
      colors,
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
      doubleYAxis,
    } = this.props;

    const isDateKeys = !isTypeofXKey(xKey) ? this.checkSerieKeyIsDate(xKey, dataset) : false;

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
      : isDateKeys
      ? {
          month: { main: '%e. %b' },
          year: { main: '%b' },
        }
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
        height: height,
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
            type: !isDateKeys ? 'category' : 'datetime',
            dateTimeLabelFormats: xAxisDateTimeLabelFormatsOptions,
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
      yAxis: yKeys.map((yKey, i) => {
        const yAxisResource: Highcharts.YAxisOptions = {
          title: {
            text: '',
          },
        };
        if (i === 0) {
          return {
            ...yAxisResource,
            plotLines: plotLines,
            visible: !hideYAxis,
            ...generateYAxisGridLine(),
          };
        } else if (i === 1) {
          return {
            ...yAxisResource,
            opposite: true,
            visible: !!doubleYAxis && !hideYAxis,
          };
        } else {
          return {
            ...yAxisResource,
            visible: false,
          };
        }
      }),
      series: this.formatSeries(dataset, xKey, yKeys, isDateKeys, colors, type),
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

    if (hideXAxis) {
      optionsWithoutAxis.xAxis = {
        type: (optionsWithoutAxis.xAxis as Highcharts.XAxisOptions).type,
        visible: false,
      };
    }

    const sanitizedOptions = omitBy(hideXAxis ? optionsWithoutAxis : options, isUndefined);

    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={sanitizedOptions}
        containerProps={{ style: { height: '100%' } }}
      />
    );
  }
}

export default compose<Props, AreaChartProps>()(AreaChart);
