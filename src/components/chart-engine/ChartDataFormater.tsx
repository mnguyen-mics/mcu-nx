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
    xKey?: string
  ): Dataset | undefined {
    if (!buckets || buckets.length === 0) return undefined;
    else {
      const dataset: any = buckets.map((buck) => {
        return {
          [xKey || "key"]: buck.key as string,
          value: buck.count as number,
          buckets: this.formatDatasetAsKeyValue(
            buck.aggregations?.buckets[0]?.buckets || []
          ),
        };
      });
      return dataset;
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

      switch (chartConfig.type.toLowerCase()) {
        case "pie":
          const pieDataset = this.formatDatasetAsKeyValue(buckets);
          return (
            <PieChart
              dataset={pieDataset}
              {...(chartConfig.options as PieChartOptions)}
            />
          );
        case "radar":
          let radarDataset = this.formatDatasetAsKeyValue(
            buckets,
            (chartConfig.options as BarChartOptions).xKey
          );
          return (
            <RadarChart
              dataset={radarDataset as any}
              {...(chartConfig.options as RadarChartOptions)}
            />
          );
        case "bars":
          let barsDataset = this.formatDatasetAsKeyValue(
            buckets,
            (chartConfig.options as BarChartOptions).xKey
          );
          return (
            <BarChart
              dataset={barsDataset as any}
              {...(chartConfig.options as BarChartOptions)}
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
