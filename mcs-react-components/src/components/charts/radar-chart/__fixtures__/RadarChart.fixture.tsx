import * as React from 'react';
import { BASE_CHART_HEIGHT } from '../../radar-spider-chart/domain';
import RadarChart, { RadarChartProps } from '../RadarChart';

const props: RadarChartProps = {
  options: {
    chart: {
      polar: true,
      type: 'area',
      height: BASE_CHART_HEIGHT,
    },
    colors: ['#00a1df'],
    title: {
      text: '',
    },
    xAxis: {
      categories: ['cat1', 'cat2', 'cat3', 'cat4', 'cat5'],
      tickmarkPlacement: 'on',
      lineWidth: 0,
      gridLineDashStyle: 'Dash',
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      gridLineDashStyle: 'Dash',
      lineWidth: 0,
      min: 0,
    },
    series: [{ name: 'count', type: 'area', data: [11, 22, 33, 44, 111] }],
    credits: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillOpacity: 0.2,
        lineWidth: 1,
      },
    },
    legend: {
      enabled: false,
    },
  },
};

export default <RadarChart {...props} />;
