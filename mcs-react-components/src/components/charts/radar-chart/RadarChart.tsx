import * as React from 'react';
import Highcharts, { DataLabelsFilterOptionsObject, SeriesAreaOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Dataset, defaultColors, generateTooltip, Tooltip } from '../utils';

require('highcharts/highcharts-more')(Highcharts);

export interface RadarChartProps {
  height?: number;
  dataset: Dataset;
  xKey: string;
  yKeys: YKeys[];
  dataLabels?: DataLabels;
  tooltip?: Tooltip;
  format?: Format;
  legend?: Legend;
  colors?: string[];
}

type Format = 'count' | 'percentage';

type Legend = {
  enabled: boolean;
  position?: 'bottom' | 'right';
};

type YKeys = {
  key: string;
  message: string;
};

type DataLabels = {
  enabled?: boolean;
  format?: string;
  filter?: DataLabelsFilterOptionsObject;
};

type Props = RadarChartProps;

class RadarChart extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        thousandsSep: ',',
      },
    });
  }

  formatDataset = (dataset: Dataset, yKeys: YKeys[], xKey: string, format: Format = 'count') => {
    if (format === 'count')
      return yKeys.map(yKey => {
        return {
          name: yKey.message,
          type: yKeys.length > 1 ? 'line' : 'area',
          data: dataset.map(line => {
            return { name: line[xKey]?.toString(), y: line[yKey.key] as number };
          }),
        };
      });
    else
      return yKeys.map(yKey => {
        return {
          name: yKey.message,
          type: yKeys.length > 1 ? 'line' : 'area',
          data: dataset.map(line => {
            return {
              name: line[xKey]?.toString(),
              y: line[yKey.key] as number,
              count: line[`${yKey.key}-count`] as number,
            };
          }),
        };
      });
  };

  render() {
    const { height, dataset, xKey, yKeys, dataLabels, tooltip, format, legend, colors } =
      this.props;

    const options: Highcharts.Options = {
      chart: {
        polar: true,
        height: height,
        backgroundColor: 'none',
      },
      colors: colors || defaultColors,
      title: {
        text: '',
      },
      xAxis: {
        type: 'category',
        tickmarkPlacement: 'on',
        lineWidth: 0,
        gridLineDashStyle: 'Dash',
        labels: {
          overflow: 'justify',
        },
      },
      yAxis: {
        gridLineInterpolation: 'polygon',
        gridLineDashStyle: 'Dash',
        lineWidth: 0,
        min: 0,
      },
      series: this.formatDataset(dataset, yKeys, xKey, format) as SeriesAreaOptions[],
      credits: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillOpacity: 0.2,
          lineWidth: 1,
          dataLabels: {
            enabled: dataLabels?.enabled === false ? false : true,
            filter: dataLabels?.filter,
            format: dataLabels?.format
              ? dataLabels?.format
              : format
              ? format === 'count'
                ? '{point.y}'
                : '{point.y}%'
              : '{point.y}',
          },
        },
        line: {
          lineWidth: 1,
          dataLabels: {
            enabled: dataLabels?.enabled === false ? false : true,
            filter: dataLabels?.filter,
            format: dataLabels?.format
              ? dataLabels?.format
              : format
              ? format === 'count'
                ? '{point.y}'
                : '{point.y}%'
              : '{point.y}',
          },
        },
      },
      legend: {
        enabled: legend?.enabled ? true : false,
        align: legend?.position ? (legend?.position === 'bottom' ? 'center' : 'right') : 'center',
        verticalAlign: legend?.position && legend?.position === 'right' ? 'middle' : 'bottom',
        layout: legend?.position && legend.position === 'right' ? 'vertical' : 'horizontal',
      },
      tooltip: {
        ...generateTooltip(true, format, tooltip?.format),
      },
    };
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { height: '100%' } }}
      />
    );
  }
}

export default RadarChart;
