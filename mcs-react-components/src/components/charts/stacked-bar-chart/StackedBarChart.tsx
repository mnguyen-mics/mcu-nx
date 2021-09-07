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
} from '../utils';
import { uniqueId, omitBy, isUndefined } from 'lodash';

HighchartsDrilldown(Highcharts);

type Bar = 'bar';

export interface StackedBarChartProps {
  dataset: Dataset;
  enableDrilldown?: boolean;
  options: StackedBarChartOptions;
  height?: number;
  reducePadding?: boolean;
  stacking?: boolean;
  plotLineValue?: number;
}

export interface StackedBarChartOptions {
  colors?: string[];
  yKeys: YKey[];
  xKey: string;
  showLegend?: boolean; // Should add position: bottom | top
  type?: string;
  format: Format;
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
        count: d[`${y.key}-count`],
      };
      if (enableDrilldown && !!d.buckets)
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

  formatSeriesForStacking = (yKey: string) => {
    const tmpObject = this.getSeriesForStacking(this.props.dataset, yKey);
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

  getSeriesForStacking = (dataset: Datapoint[], yKey: string) => {
    const acc: any = {};
    dataset.forEach(d => {
      const buckets = d.buckets || [];
      buckets.forEach(b => {
        const currentValue = acc[b.xKey as string];
        acc[b.xKey as string] = currentValue ? currentValue : {};
        acc[b.xKey as string][d.xKey as string] = {
          y: b[yKey],
          count: b[`${yKey}-count`],
        };
      });
    });
    return acc;
  };

  render() {
    const {
      dataset,
      enableDrilldown,
      options: { colors, xKey, yKeys, showLegend, type, format },
      reducePadding,
      height,
      stacking,
      plotLineValue,
    } = this.props;

    const definedColors = colors || defaultColors;

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
    const seriesForStacking = this.formatSeriesForStacking(
      yKeys[0].key,
    ) as Highcharts.SeriesOptionsType[];
    // TODO: Handle multiple yKeys
    const drilldown = !!enableDrilldown
      ? buildDrilldownTree<Bar>('bar', datasetWithDrilldownIds, [], xKey, yKeys[0].key)
      : [];

    let plotOptionsForColumn = {};

    if (reducePadding && (stacking || enableDrilldown || !this.hasSubBucket())) {
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
      colors: this.hasSubBucket() && !enableDrilldown ? undefined : definedColors,
      plotOptions: {
        column: plotOptionsForColumn,
      },
      xAxis: {
        type: 'category',
        labels: { style: { fontWeight: '500' } },
      },
      series: !enableDrilldown && this.hasSubBucket() ? seriesForStacking : series,
      drilldown: {
        activeAxisLabelStyle: {
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
        ...generateTooltip(true, format),
      },
      yAxis: {
        plotLines: plotLines,
      },
      legend: {
        enabled: showLegend === undefined ? false : showLegend,
      },
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

export default compose<Props, StackedBarChartProps>()(StackedBarChart);
