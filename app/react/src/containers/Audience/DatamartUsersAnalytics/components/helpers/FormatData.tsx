import * as React from 'react';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';
import _ from 'lodash';
import { CounterDashboard } from '../../../../../components/Counter';
import { CounterProps } from '../../../../../components/Counter/Counter';
import { normalizeReportView } from '../../../../../utils/MetricHelper';
import GenericWorldMap from '../charts/GenericWorldMap';
import GenericStackedBar from '../charts/GenericStackedBar';
import { Tabs, Statistic } from 'antd';
import { McsIconType } from '../../../../../components/McsIcon';
import * as Highcharts from 'highcharts';
import {
  TabItem,
  BarSeriesDataOptions,
  MapSeriesDataOptions,
  Dataset,
  Chart,
  AreaSeriesDataOptions,
  PieSeriesDataOption
} from '../../../../../models/datamartUsersAnalytics/datamartUsersAnalytics';
import { ReportView } from '../../../../../models/ReportView';
import { AREA_OPACITY } from '../../../../../components/Charts/domain';
import moment from 'moment';

export interface FormatDataProps {
  apiResponse: ReportView;
  chart: Chart;
}

class FormatData extends React.Component<FormatDataProps, {}> {

  formatSeriesForChart = (chart: Chart, dataset: Dataset[]) => {
    switch (chart.type) {
      case 'PIE':
        return [
          {
            type: 'pie',
            name: '',
            innerSize: '65%',
            data: dataset.reduce((acc: PieSeriesDataOption[], d: Dataset) => {
              const found = acc.find((a: PieSeriesDataOption) => a.name === d[chart.xKey]);
              const value = d[chart.metricName];
              if (!found) {
                acc.push({
                  name: d[chart.xKey] as string,
                  y: value as number,
                });
              }
              else {
                found.y += value as number;
              }
              return acc;
            }, [])
          }
        ];
      case 'AREA':
        return dataset.reduce((acc: AreaSeriesDataOptions[], d: Dataset) => {
          const found = acc.find((a: AreaSeriesDataOptions) => a.name === chart.metricName);

          const value = d[chart.metricName];
          const xValue = chart.xKey === 'date_yyyy_mm_dd' ? this.formatDateToTs(d[chart.xKey] as string) : d[chart.xKey];
          if (!found) {
            acc.push({
              name: chart.metricName as string,
              data: [[xValue, value]] as number[][],
              fillOpacity: 0.5,
              fillColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                },
                stops: [
                  [
                    0,
                    (Highcharts as any)
                      .Color(chart.options.colors ? chart.options.colors[0] : '#2fa1de')
                      .setOpacity(AREA_OPACITY)
                      .get('rgba'),
                  ],
                  [
                    1,
                    (Highcharts as any)
                      .Color(chart.options.colors ? chart.options.colors[0] : '#2fa1de')
                      .setOpacity(0)
                      .get('rgba'),
                  ],
                ],
              },
              type: 'area'
            });
          }
          else {
            found.data.push([xValue, value] as number[]);
          }
          return acc;
        }, []);
      case 'COUNT':
        return dataset.reduce((acc: any, d: any) => {
          const found = acc.find((a: any) => a.title === d[chart.yKey]);
          const value = d[chart.metricName];
          if (!found) {
            acc.push({
              title: d[chart.yKey],
              iconType: chart.icons && chart.icons.length > 0 ? chart.icons[0] : undefined,
              value, unit: "%",
              iconStyle: {
                color: chart.options.colors ? chart.options.colors[0] : undefined
              },
              loading: false
            });
            if (chart.options.colors && chart.options.colors.length > 0) chart.options.colors.splice(0, 1);
            if (chart.icons && chart.icons.length > 0) chart.icons.splice(0, 1);

          }
          else {
            found.value += value
          }
          return acc;
        }, []);
      case 'WORLDMAP':
        return dataset.reduce((acc: MapSeriesDataOptions[], d: Dataset) => {
          const found = acc.find((a: MapSeriesDataOptions) => a.code3 === d[chart.yKey]);
          const value = d[chart.metricName];
          if (!found) {
            acc.push({
              code3: d[chart.yKey] as string,
              value: d[chart.metricName] as number,
            })
          }
          else {
            found.value += value as number;
          }
          return acc;
        }, []);
      case 'STACKEDBAR':
        return dataset.reduce((acc: BarSeriesDataOptions[], d: Dataset) => {
          if (acc.length === 0) {
            acc.push({
              type: 'bar',
              data: [d[chart.metricName]] as number[]
            });
          } else {
            acc[0].data.push(d[chart.metricName] as number);
          }
          return acc;
        }, []);
      default:
        return [];
    }
  }

  formatSeriesForCounters = (chart: Chart, dataset: Dataset[]): CounterProps[] => {
    return dataset.reduce((acc: CounterProps[], d: Dataset) => {
      const found = acc.find((a: CounterProps) => a.title === d[chart.yKey]);
      const value = d[chart.metricName];
      if (!found) {
        acc.push({
          title: d[chart.yKey],
          iconType: chart.icons ? chart.icons[0] as McsIconType : 'data',
          value: value as number,
          unit: '%',
          iconStyle: {
            color: chart.options.colors ? chart.options.colors[0] : undefined
          }
        });
        if (chart.options.colors && chart.options.colors.length > 0) chart.options.colors.splice(0, 1);
        if (chart.icons && chart.icons.length > 0) chart.icons.splice(0, 1);
      }
      else {
        found.value = (found.value as number) + (value as number);
      }
      return acc;
    }, []);
  }

  formatDateToTs = (date: string) => {
    return moment(date)
      .seconds(0)
      .hours(0)
      .milliseconds(0)
      .minutes(0)
      .valueOf();
  };

  generateCharElements = (chart: Chart, data: Dataset[]): React.ReactNode => {
    switch (chart.type) {
      case 'AREA':
        if (!chart.xKey) return null
        chart.options.series = this.formatSeriesForChart(chart, data) as Highcharts.SeriesOptionsType[];
        return (
          <LineChart options={chart.options}
          />
        )
      case 'PIE':
        chart.options.series = this.formatSeriesForChart(chart, data) as Highcharts.SeriesOptionsType[];
        return (
          <PieChart options={chart.options} />
        )
      case 'COUNT':
        chart.counterFormatedProps = this.formatSeriesForCounters(chart, data);
        return (<CounterDashboard counters={chart.counterFormatedProps} />)
      case 'WORLDMAP':
        return (
          <GenericWorldMap options={chart.options} dataset={this.formatSeriesForChart(chart, data) as MapSeriesDataOptions[]} />
        )
      case 'STACKEDBAR':
        if (!chart.xKey) return null
        chart.options.series = this.formatSeriesForChart(chart, data) as Highcharts.SeriesMapOptions[];
        return (
          <GenericStackedBar options={chart.options} />
        )
      case 'TABS':
        return (
          <Tabs key={0}>
            {
              _.map(chart.tabs, (tab: TabItem, e: number) => {
                return (
                  <Tabs.TabPane tab={tab.title} key={e.toString()}>
                    {this.generateCharElements(tab, data)}
                  </Tabs.TabPane>
                )
              })
            }
          </Tabs>)
      case 'SINGLESTAT':
        const formatedTime = moment.duration(data[0][chart.metricName] as number, "second").format("h [hrs] m [min] s [sec]");
        return (
          <div className="dashboard-counter">
            <div className="count-title">
              {chart.options.title}
            </div>
            <div className="count-result">
                <Statistic className={'datamartUsersAnalytics_charts_singleStat'} value={formatedTime} />
            </div>
          </div>
        )
      default:
        return null;
    }
  };

  render() {
    const { chart, apiResponse } = this.props;
    const normalizedData = normalizeReportView(apiResponse);

    return (<div>{this.generateCharElements(chart, normalizedData)}</div>)
  }
}

export default FormatData;