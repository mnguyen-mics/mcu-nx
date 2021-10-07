import * as React from "react";
import { OTQLResult } from "../../models/datamart/graphdb/OTQLResult";
import ChartDataFormater from "./ChartDataFormater";
import { IQueryService, QueryService } from "../../services/QueryService";
import { Loading } from "@mediarithmics-private/mcs-components-library";
import { PieChartProps } from "@mediarithmics-private/mcs-components-library/lib/components/charts/pie-chart/PieChart";
import { RadarChartProps } from "@mediarithmics-private/mcs-components-library/lib/components/charts/radar-chart";
import { BarChartProps } from "@mediarithmics-private/mcs-components-library/lib/components/charts/bar-chart/BarChart";
import { Alert } from "antd";
import { lazyInject } from "../../inversify/inversify.config";
import { TYPES } from "../../constants/types";

export type ChartType = "pie" | "bars" | "radar" | "metric";

type ChartDatasetType = "otql";
interface ChartDataset {
  type: ChartDatasetType;
  query_text?: string;
  query_id?: string;
}

export type PieChartOptions = Omit<PieChartProps, "dataset" | "colors">;
export type RadarChartOptions = Omit<RadarChartProps, "dataset" | "colors">;
export type BarChartOptions = Omit<BarChartProps, "dataset" | "colors">;

export interface ChartConfig {
  title: string;
  type: ChartType;
  colors?: string[];
  dataset: ChartDataset;
  options?: PieChartOptions | RadarChartOptions | BarChartOptions;
}

interface ChartDataFetcherProps {
  datamartId: string;
  chartConfig: ChartConfig;
  chartContainerStyle?: React.CSSProperties;
}

interface ChartDataFetcherState {
  fetchedData: OTQLResult;
  loading: boolean;
  hasError: boolean;
}

type Props = ChartDataFetcherProps;
class ChartDataFetcher extends React.Component<Props, ChartDataFetcherState> {
  @lazyInject(TYPES.IQueryService)
  private _queryService: IQueryService;
  
  constructor(props: Props) {
    super(props);

    this.state = {
      fetchedData: null,
      loading: true,
      hasError: false,
    };
  }

  componentDidMount() {
    const { datamartId, chartConfig } = this.props;

    if (chartConfig.dataset.type.toLowerCase() === "otql") {
      if (chartConfig.dataset.query_text) {
        this.fetchOtqlDataByQueryText(
          datamartId,
          chartConfig.dataset.query_text
        );
      }

      if (chartConfig.dataset.query_id) {
        this.fetchOtqlDataByQueryId(datamartId, chartConfig.dataset.query_id);
      }
    }
  }

  fetchOtqlDataByQueryId(datamartId: string, query_id: string) {
    return this._queryService
      .getQuery(datamartId, query_id)
      .then((queryResp) => queryResp.data)
      .then((q) => {
        return this.fetchOtqlDataByQueryText(datamartId, q.query_text);
      })
      .catch((r) => {
        this.setState({
          hasError: true,
          loading: false,
        });
      });
  }

  fetchOtqlDataByQueryText(datamartId: string, query_text: string) {
    return this._queryService
      .runOTQLQuery(datamartId, query_text, {
        use_cache: true,
      })
      .then((otqlResultResp) => otqlResultResp.data)
      .then((otqlResult) => {
        this.setState({
          fetchedData: otqlResult,
          loading: false,
        });
      })
      .catch((r) => {
        this.setState({
          hasError: true,
          loading: false,
        });
      });
  }

  render() {
    const { fetchedData, loading, hasError } = this.state;
    const { chartConfig, chartContainerStyle } = this.props;
    if (hasError) {
      return (
        <Alert
          message="Error"
          description="Cannot fetch data for chart"
          type="error"
          showIcon
        />
      );
    }

    return (
      <div style={chartContainerStyle}>
        <div className={"mcs-chartDataFetcher_header"}>
          <h2 className={"mcs-chartDataFetcher_header_title"}>
            {chartConfig.title}
          </h2>
          {loading && (
            <Loading
              className={"mcs-chartDataFetcher_header_loader"}
              isFullScreen={false}
            />
          )}
        </div>
        <div className="mcs-chartDataFetcher_content_container">
          {fetchedData && fetchedData.rows.length > 0 && (
            <ChartDataFormater
              dataResult={fetchedData}
              chartConfig={chartConfig}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ChartDataFetcher;
