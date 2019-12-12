import * as React from 'react';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import _ from 'lodash';
import { CounterDashboard } from '../../../../components/Counter';
import { CounterProps } from '../../../../components/Counter/Counter';
import { normalizeReportView } from '../../../../utils/MetricHelper';
import { ReportView } from '../../../../models/ReportView';
import { ReportView } from '../../../../models/ReportView';;

export interface FormatDataProps {
  apiResponse: ReportView;
  charts: Chart[];
}

export interface Chart {
  type: string;
  options: Highcharts.Options;
  yKey: string;
  metricName: string;
  icons?: string[];
  counterFormatedProps?: CounterProps[];
}

// const normalizedData = [
//   {
//     "user_point_count": 10,
//     "day": "2019-12-02",
//     "sync_type": "laptop"
//   },
//   {
//     "user_point_count": 15,
//     "day": "2019-12-03",
//     "sync_type": "laptop"
//   },
//   {
//     "user_point_count": 20,
//     "day": "2019-12-04",
//     "sync_type": "laptop"
//   },
//   {
//     "user_point_count": 54,
//     "day": "2019-12-02",
//     "sync_type": "smartphone"
//   },
//   {
//     "user_point_count": 23,
//     "day": "2019-12-03",
//     "sync_type": "smartphone"
//   },
//   {
//     "user_point_count": 12,
//     "day": "2019-12-04",
//     "sync_type": "smartphone"
//   },
//   {
//     "user_point_count": 15,
//     "day": "2019-12-02",
//     "sync_type": "tablet"
//   },
//   {
//     "user_point_count": 12,
//     "day": "2019-12-03",
//     "sync_type": "tablet"
//   },
//   {
//     "user_point_count": 8,
//     "day": "2019-12-04",
//     "sync_type": "tablet"
//   }
// ];

type Dataset = Array<{ [key: string]: string | number | Date | undefined }>;

class FormatData extends React.Component<FormatDataProps, {}> {

  getXAxisValues = (dataset: Dataset, xKey: string) => {
    return dataset.map(d => {
      return d[xKey] as string;
    })
  }

  formatSeriesForChart = (chart: Chart, dataset: Dataset): Highcharts.SeriesOptionsType[] => {
    switch (chart.type) {
      case 'PIE':
        return [
          {
            type: 'pie',
            name: '',
            innerSize: '65%',
            data: dataset.reduce((acc: any, d) => {
              const found = acc.find((a: any) => a.name === d[chart.yKey]);
              const value = d[chart.metricName]; // the element in data property
              if (!found) {
                acc.push({ name: d[chart.yKey], y: value, color: chart.options.colors ? chart.options.colors[0] : undefined }) // not found, so need to add data property
                if (chart.options.colors && chart.options.colors.length > 0) chart.options.colors.splice(0, 1);
              }
              else {
                found.y += value // if found, that means data property exists, so just push new element to found.data.
              }
              return acc;
            }, [])
          }
        ];
      case 'LINE':
        return dataset.reduce((acc: any, d) => {
          const found = acc.find((a: any) => a.name === d[chart.yKey]);
          const value = d[chart.metricName]; // the element in data property
          if (!found) {
            acc.push({ 'name': d[chart.yKey], data: [value], type: 'line', color: chart.options.colors ? chart.options.colors[0] : undefined }) // not found, so need to add data property
            if (chart.options.colors && chart.options.colors.length > 0) chart.options.colors.splice(0, 1);
          }
          else {
            found.data.push(value) // if found, that means data property exists, so just push new element to found.data.
          }
          return acc;
        }, []);
      case 'COUNT':
        return dataset.reduce((acc: any, d: any) => {
          const found = acc.find((a: any) => a.title === d[chart.yKey]);
          //const value = { name: d.name, val: d.value };
          const value = d[chart.metricName]; // the element in data property
          if (!found) {
            acc.push({ 'title': d[chart.yKey], 'iconType': chart.icons[0], value, "unit": "%", "iconStyle": { color: chart.options.colors ? chart.options.colors[0] : undefined }, loading: false }) // not found, so need to add data property
            if (chart.options.colors && chart.options.colors.length > 0) chart.options.colors.splice(0, 1);
            chart.icons.splice(0, 1);
          }
          else {
            found.value += value // if found, that means data property exists, so just push new element to found.data.
          }
          return acc;
        }, []);
      default:
        return [];
    }
  }

  formatSeriesForCounters = (chart: Chart, dataset: Dataset): CounterProps[] => {
    return dataset.reduce((acc: any, d) => {
      const found = acc.find((a: any) => a.title === d[chart.yKey]);
      const value = d[chart.metricName]; // the element in data property
      if (!found) {
        acc.push({ 'title': d[chart.yKey], 'iconType': chart.icons ? chart.icons[0] : undefined, value, "unit": "%", "iconStyle": { color: chart.options.colors ? chart.options.colors[0] : undefined } }) // not found, so need to add data property
        if (chart.options.colors && chart.options.colors.length > 0) chart.options.colors.splice(0, 1);
        if (chart.icons && chart.icons.length > 0) chart.icons.splice(0, 1);
      }
      else {
        found.value += value // if found, that means data property exists, so just push new element to found.data.
      }
      return acc;
    }, []);
  }

  generateComponent = (charts: Chart[], data: any) => {
    return _.map(charts, chart => {

      chart.options.series = this.formatSeriesForChart(chart, data);
      switch (chart.type) {
        case 'LINE':
          return (
            <LineChart
              options={chart.options}
            />
          )
        case 'PIE':
          return (
            <PieChart options={chart.options} />
          )
        case 'COUNT':
          chart.counterFormatedProps = this.formatSeriesForCounters(chart, data);
          return (<CounterDashboard counters={chart.counterFormatedProps} />)
        default:
          return null;
      }
    });
  };

  render() {
    const { charts, apiResponse } = this.props;
    const normalizedData = normalizeReportView<{
      device_name: string;
      user_point_count: number;
    }>(apiResponse);

    return (<div>{this.generateComponent(charts, normalizedData)}</div>)
  }
}

export default FormatData;