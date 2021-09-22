import "reflect-metadata";
import * as React from "react";
import ChartDataFetcher, { ChartConfig } from "../ChartDataFetcher";
import { IocProvider } from "../../../inversify/inversify.react";
import { container } from "../../../inversify/inversify.config";
import config from "../../../react-configuration";

(global as any).window.MCS_CONSTANTS = config;
const chartConfigPie: ChartConfig = {
  title: "Chart 1",
  type: "pie",
  dataset: {
    type: "otql",
    query_id: "23",
  },
  options: {
    innerRadius: true,
  },
};

const chartConfigRadar: ChartConfig = {
  title: "Chart 2",
  type: "radar",
  dataset: {
    type: "otql",
    query_text: "SELECT { nature @map } FROM ActivityEvent",
  },
  options: {
    height: 300,
    xKey: "xKey",
    yKeys: [
      {
        key: "value",
        message: "segment",
      },
      {
        key: "datamart",
        message: "datamart",
      },
    ],
  },
};

const chartConfigBars: ChartConfig = {
  title: "Chart 3",
  type: "bars",
  dataset: {
    type: "otql",
    query_text: "SELECT { nature @map } FROM ActivityEvent",
  },
  options: {
    height: 300,
    xKey: "xKey",
    yKeys: [
      {
        key: "value",
        message: "segment",
      },
      {
        key: "datamart",
        message: "datamart",
      },
    ],
  },
};
console.log(container);
export default (
  <IocProvider container={container}>
    <ChartDataFetcher chartConfig={chartConfigPie} datamartId={"144"} />
    <ChartDataFetcher chartConfig={chartConfigRadar} datamartId={"144"} />
    <ChartDataFetcher chartConfig={chartConfigBars} datamartId={"144"} />
  </IocProvider>
);
