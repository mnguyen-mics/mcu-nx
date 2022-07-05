import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import HighchartsReact from 'highcharts-react-official';
import { compose } from 'recompose';
import {
  generateTooltip,
  Dataset,
  Datapoint,
  buildDrilldownTree,
  defaultColors,
  Format,
  Legend,
  buildLegendOptions,
  Tooltip,
} from '../utils';
import { uniqueId, omitBy, isUndefined, cloneDeep } from 'lodash';

HighchartsDrilldown(Highcharts);

type Bar = 'bar';

export interface BarChartProps {
  dataset: Dataset;
  drilldown?: boolean;
  height?: number;
  bigBars?: boolean;
  stacking?: boolean;
  plotLineValue?: number;
  colors?: string[];
  yKeys: YKey[];
  xKey: string;
  legend?: Legend;
  type?: string;
  tooltip?: Tooltip;
  format: Format;
  hideXAxis?: boolean;
  hideYAxis?: boolean;
}

type YKey = { key: string; message: string };

type Props = BarChartProps;

class BarChart extends React.Component<Props, {}> {
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

  formatSerieData = (dataset: Dataset, y: YKey, xKey: string, drilldown: boolean) => {
    return dataset.map((d: Datapoint) => {
      const datapoint = {
        name: d[xKey],
        id: d[xKey] as string,
        y: d[y.key] ? (d[y.key] as number) : 0,
        count: d[`${y.key}-count`],
        percentage: d[`${y.key}-percentage`],
      };
      if (drilldown && !!d.buckets)
        return {
          ...datapoint,
          drilldown: d.drilldown,
        };
      else return datapoint;
    });
  };

  hasSubBucket = () => {
    return this.props.dataset && this.props.dataset.find(d => d.buckets && d.buckets.length > 0);
  };

  formatSeries = (
    dataset: Dataset,
    yKeys: YKey[],
    xKey: string,
    drilldown: boolean,
  ): Highcharts.SeriesOptionsType[] => {
    return yKeys.map(y => {
      return {
        name: y.message,
        data: this.formatSerieData(dataset, y, xKey, drilldown),
        type: 'column' as any,
      };
    });
  };

  formatSeriesForStacking = (yKey: string, xKey: string) => {
    const tmpObject = this.getSeriesForStacking(this.props.dataset, yKey, xKey);
    const series = [];
    for (const x in tmpObject) {
      if (tmpObject.hasOwnProperty(x)) {
        const xObject = tmpObject[x];
        const xData = [];
        for (const y in xObject) {
          if (xObject.hasOwnProperty(y)) {
            xData.push({
              name: y,
              y: xObject[y].y,
              count: xObject[y].count,
            });
          }
        }
        series.push({
          name: x,
          data: xData,
          type: 'column' as any,
        });
      }
    }
    return series;
  };

  getSeriesForStacking = (dataset: Datapoint[], yKey: string, xKey: string) => {
    const acc: any = {};
    dataset.forEach(d => {
      const buckets = d.buckets || [];
      buckets.forEach(b => {
        const currentValue = acc[b[xKey] as string];
        acc[b[xKey] as string] = currentValue ? currentValue : {};
        acc[b[xKey] as string][d[xKey] as string] = {
          y: b[yKey],
          count: b[`${yKey}-count`],
          percentage: b[`${yKey}-percentage`],
        };
      });
    });
    return acc;
  };

  render() {
    const {
      dataset,
      drilldown,
      colors,
      xKey,
      yKeys,
      legend,
      type,
      format,
      bigBars,
      height,
      stacking,
      plotLineValue,
      tooltip,
      hideXAxis,
      hideYAxis,
    } = this.props;

    const definedColors = colors || defaultColors;

    let datasetWithDrilldownIds = dataset;
    if (!!drilldown) {
      datasetWithDrilldownIds = dataset.map(d => {
        const drilldownId = uniqueId();
        return {
          ...d,
          drilldown: drilldownId,
        };
      }) as Dataset;
    }
    const series = this.formatSeries(datasetWithDrilldownIds, yKeys, xKey, !!drilldown);
    const seriesForStacking = this.formatSeriesForStacking(
      yKeys[0].key,
      xKey,
    ) as Highcharts.SeriesOptionsType[];
    // TODO: Handle multiple yKeys
    const drilldownBuckets = !!drilldown
      ? buildDrilldownTree<Bar>('bar', datasetWithDrilldownIds, [], xKey, yKeys[0].key)
      : [];

    let plotOptionsForColumn = {};

    if (!(bigBars === false)) {
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
        type: type || 'column',
        height: height,
        backgroundColor: 'none',
      },
      title: {
        text: '',
      },
      lang: {
        drillUpText: 'Back',
      },
      colors: definedColors,
      plotOptions: {
        column: plotOptionsForColumn,
      },
      xAxis: {
        type: 'category',
        labels: { style: { fontWeight: '500' } },
      },
      series: !drilldown && this.hasSubBucket() ? seriesForStacking : series,
      drilldown: {
        activeAxisLabelStyle: {
          textDecoration: 'none',
          color: '#00A1DF',
          fontWeight: '500',
        },
        series: drilldownBuckets,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        ...generateTooltip(true, format, tooltip?.format),
      },
      yAxis: {
        plotLines: plotLines,
        title: {
          text: '',
        },
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
        containerProps={{ style: { height: '100%' } }}
      />
    );
  }
}

export default compose<Props, BarChartProps>()(BarChart);
