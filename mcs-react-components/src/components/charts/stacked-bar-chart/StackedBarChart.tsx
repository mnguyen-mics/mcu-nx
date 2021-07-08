import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import HighchartsReact from 'highcharts-react-official';
import { compose } from 'recompose';
import { generateTooltip, BASE_CHART_HEIGHT } from '../utils';
import { uniqueId } from 'lodash';

HighchartsDrilldown(Highcharts);

export interface StackedBarChartProps {
  dataset: Dataset;
  enableDrilldown?: boolean;
  options: StackedBarChartOptions;
  height?: number;
  reducePadding?: boolean;
}

export type Datapoint = { [key: string]: string | number | Date | undefined } & WithDrilldownId &
  WithSubBuckets;
export type Dataset = Datapoint[];

export interface StackedBarChartOptions {
  colors: string[];
  yKeys: YKey[];
  xKey: string;
  showLegend?: boolean;
  type?: string;
  yAxisTilte?: string;
  chartOptions?: Highcharts.Options;
}

type YKey = { key: string; message: string };

type Props = StackedBarChartProps;

interface DrilldownNode {
  name: string;
  y: number;
  drilldown?: string;
}

interface DrilldownView {
  name: string;
  id: string;
  data: DrilldownNode[];
  type: 'bar';
}

interface WithDrilldownId {
  drilldown?: string;
}

interface WithSubBuckets {
  buckets?: Datapoint[];
}

interface DrilldownAccumulator {
  drilldownNodes: DrilldownView[];
  buckets: Datapoint[];
}

class StackedBarChart extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  buildDrilldownTree = (
    buckets: Datapoint[],
    currentState: DrilldownView[],
    xKey: string,
    yKey: string,
  ): DrilldownView[] => {
    if (!buckets || buckets.length === 0) {
      return currentState;
    } else {
      const initialAcc = {
        drilldownNodes: currentState,
        buckets: [],
      };
      const nextLevelBuckets: DrilldownAccumulator = buckets.reduce(
        (acc: DrilldownAccumulator, buck: Datapoint) => {
          const subBuckets: Dataset = ((buck.buckets as Datapoint[]) || []).map(b => {
            const nextDrilldownId = b.buckets ? uniqueId() : undefined;
            return {
              ...b,
              drilldown: nextDrilldownId,
            };
          }) as Dataset;
          const drilldownNode: DrilldownView = {
            id: buck.drilldown as string,
            name: buck[xKey] as string,
            type: 'bar' as 'bar',
            data: subBuckets.map((sub: Datapoint) => {
              return {
                name: sub[xKey] as string,
                drilldown: sub.drilldown,
                y: sub[yKey] as number,
              };
            }),
          };
          const nextDrilldownNodes = acc.drilldownNodes.concat([drilldownNode]);
          const nextBuckets = acc.buckets.concat(subBuckets);
          return {
            drilldownNodes: nextDrilldownNodes,
            buckets: nextBuckets,
          };
        },
        initialAcc,
      );
      return this.buildDrilldownTree(
        nextLevelBuckets.buckets,
        nextLevelBuckets.drilldownNodes,
        xKey,
        yKey,
      );
    }
  };

  formatSerieData = (dataset: Dataset, y: YKey, xKey: string, enableDrilldown: boolean) => {
    return dataset.map((d: Datapoint) => {
      const datapoint = {
        name: d[xKey],
        id: d[xKey] as string,
        y: d[y.key] ? (d[y.key] as number) : 0,
      };
      if (enableDrilldown)
        return {
          ...datapoint,
          drilldown: d.drilldown,
        };
      else return datapoint;
    });
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

  render() {
    const {
      dataset,
      enableDrilldown,
      options: { colors, xKey, yKeys, showLegend, type, chartOptions },
      reducePadding,
      height,
    } = this.props;

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
    // TODO: Handle multiple yKeys
    const drilldown = this.buildDrilldownTree(datasetWithDrilldownIds, [], xKey, yKeys[0].key);

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
      colors: colors,
      plotOptions: {
        column: reducePadding
          ? {
              pointPadding: 0.05,
              groupPadding: 0,
            }
          : {},
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        ...chartOptions?.yAxis,
        title: (chartOptions?.yAxis as Highcharts.YAxisOptions)?.title || { text: '' },
      },
      series: series,
      drilldown: {
        activeAxisLabelStyle: {
          textDecoration: 'none',
          color: '#00A1DF',
        },
        series: drilldown,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        ...generateTooltip(),
      },
      legend: {
        enabled: showLegend === undefined ? false : showLegend,
      },
    };
    return <HighchartsReact highcharts={Highcharts} options={options} style={{ width: '100%' }} />;
  }
}

export default compose<Props, StackedBarChartProps>()(StackedBarChart);
