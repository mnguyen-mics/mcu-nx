import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { compose } from 'recompose';
import { generateTooltip, BASE_CHART_HEIGHT } from '../../domain';

export interface StackedBarPlotProps {
  dataset: Dataset;
  options: StackedBarPlotOptions;
  height?: number;
}

type Dataset = Array<{ [key: string]: string | number | Date | undefined }>;

export interface StackedBarPlotOptions {
  colors: string[];
  yKeys: yKey[];
  xKey: string;
  showLegend?: boolean;
  type?: string 
}

type yKey = { key: string; message: string };

type Props = StackedBarPlotProps;

class StackedBarPlot extends React.Component<Props, {}> {

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  getXAxisValues = (dataset: Dataset, xKey: string) => {
    return dataset.map(d => {
      return d[xKey] as string;
    })
  }

  formatSerieData = (dataset: Dataset, y: yKey) => {
    return dataset.map(d => {
      return d[y.key] ? d[y.key] as number : 0;
    });
  }

  formatSeries = (dataset: Dataset, yKeys: yKey[]): Highcharts.SeriesOptionsType[] => {
    return yKeys.map(y => {
      return {
        name: y.message,
        data: this.formatSerieData(dataset, y),
        type: "column" as any
      }
    });
  }

  render() {
    const {
      dataset,
      options: { colors, xKey, yKeys, showLegend, type },
      height
    } = this.props;

    const options: Highcharts.Options = {
      chart: {
        type: type || 'column',
        height: height ? height : BASE_CHART_HEIGHT,
      },
      title: {
        text: ''
      },
      colors: colors,
      plotOptions: {
        column: {
          
        },
      },
      xAxis: {
        categories: this.getXAxisValues(dataset, xKey)
      },
      series: this.formatSeries(dataset, yKeys),
      credits: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        ...generateTooltip(),
      },
      legend: {
        enabled: showLegend === undefined ? false : showLegend
      }
    };

    return (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          style={{ width: "100%" }}
        />
    );
  }
}

export default compose<Props, StackedBarPlotProps>()(StackedBarPlot);
