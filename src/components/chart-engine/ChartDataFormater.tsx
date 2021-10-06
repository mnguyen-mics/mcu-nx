import {
  BarChart,
  PieChart,
  RadarChart,
} from "@mediarithmics-private/mcs-components-library";
import * as React from "react";
import {
  isAggregateResult,
  isCountResult,
  OTQLBucket,
  OTQLResult,
} from "../../models/datamart/graphdb/OTQLResult";
import { Dataset } from "@mediarithmics-private/mcs-components-library/lib/components/charts/utils";
import {
  BarChartOptions,
  ChartConfig,
  ChartType,
  PieChartOptions,
  RadarChartOptions,
} from "./ChartDataFetcher";
import { Alert } from "antd";
interface ChartDataFormaterProps {
  dataResult: OTQLResult;
  chartConfig: ChartConfig;
}

interface ChartDataFormaterState {
  dataset: Dataset;
  hasError: boolean;
}

type Props = ChartDataFormaterProps;

const BASE_CHART_HEIGHT = 400;

class ChartDataFormater extends React.Component<Props, ChartDataFormaterState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dataset: null,
      hasError: false,
    };
  }

  formatDatasetAsKeyValue(
    buckets: OTQLBucket[],
    xKey: string,
    yKey: string
  ): Dataset | undefined {
    if (!buckets || buckets.length === 0) return undefined;
    else {
      const dataset: any = buckets.map((buck) => {
        return {
          [xKey]: buck.key as string,
          [yKey]: buck.count as number,
          buckets: this.formatDatasetAsKeyValue(
            buck.aggregations?.buckets[0]?.buckets || [],
            xKey,
            yKey
          ),
        };
      });
      return dataset;
    }
  }

  getXKeyForChart(
    type: ChartType,
    options: PieChartOptions | RadarChartOptions | BarChartOptions
  ) {
    switch (type.toLowerCase()) {
      case "pie":
        return "key";
      case "radar":
        return options && (options as RadarChartOptions).xKey
          ? (options as RadarChartOptions).xKey
          : "key";
      case "bars":
        return options && (options as BarChartOptions).xKey
          ? (options as BarChartOptions).xKey
          : "key";
      default:
        return "key";
    }
  }

  renderChart(): JSX.Element {
    const { dataResult, chartConfig } = this.props;

    if (
      dataResult &&
      isAggregateResult(dataResult.rows) &&
      !isCountResult(dataResult.rows)
    ) {
      const buckets =
        dataResult.rows[0]?.aggregations?.buckets[0]?.buckets || [];

      const options = chartConfig.options || {};
      const xKey = this.getXKeyForChart(chartConfig.type, chartConfig.options);
      const yKey = {
        key: "value",
        message: "count",
      };
      const withKeys = {
        ...options,
        yKeys: [yKey],
        xKey: xKey,
      };
      switch (chartConfig.type.toLowerCase()) {
        case "pie":
          const pieDataset = this.formatDatasetAsKeyValue(
            buckets,
            xKey,
            yKey.key
          );
          return (
            <PieChart
              innerRadius={false}
              dataset={pieDataset}
              {...withKeys}
            />
          );
        case "radar":
          let radarDataset = this.formatDatasetAsKeyValue(
            buckets,
            xKey,
            yKey.key
          );
          return (
            <RadarChart
              dataset={radarDataset as any}
              {...withKeys}
            />
          );
        case "bars":
          let barsDataset = this.formatDatasetAsKeyValue(
            buckets,
            xKey,
            yKey.key
          );
          return (
            <BarChart
              dataset={barsDataset as any}
              format={"count"}
              yKeys={{ key: "value", message: "count" }}
              {...withKeys}
            />
          );
        default:
          return (
            <Alert
              message="Error"
              description="Unknown chart type. Please check available charts types"
              type="error"
              showIcon
            />
          );
      }
    } else {
      return <div />;
    }
  }

  render() {
    return this.renderChart();
  }
}

export default ChartDataFormater;
