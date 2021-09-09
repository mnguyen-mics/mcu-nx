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
  defaultColors,
  Format,
  Legend,
  buildLegendOptions,
} from '../utils';
import { uniqueId, omitBy, isUndefined } from 'lodash';

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
  format: Format;
}

type YKey = { key: string; message: string };

type Props = BarChartProps;

class BarChart extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
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

    if (bigBars && (stacking || drilldown || !this.hasSubBucket())) {
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
        height: height ? height : BASE_CHART_HEIGHT,
      },
      title: {
        text: '',
      },
      lang: {
        drillUpText: 'Back',
      },
      colors: this.hasSubBucket() && !drilldown ? undefined : definedColors,
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
        ...generateTooltip(true, format),
      },
      yAxis: {
        plotLines: plotLines,
      },
      legend: buildLegendOptions(legend),
    };

    const sanitizedOptions = omitBy(options, isUndefined);
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={sanitizedOptions}
        style={{ width: '100%' }}
      />
    );
  }
}

export default compose<Props, BarChartProps>()(BarChart);
