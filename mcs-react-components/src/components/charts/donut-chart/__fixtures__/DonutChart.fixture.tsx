import * as React from 'react';
import DonutChart, { DonutChartProps } from '../DonutChart';

const props: DonutChartProps = {
  dataset: [
    {
      key: 'data_1',
      value: 50,
      color: '#095382',
    },
    {
      key: 'data_2',
      value: 40,
      color: '#095382',
    },
    {
      key: 'data_3',
      value: 30,
      color: '#095382',
    },
  ],
  options: {
    showTooltip: true,
    showLabels: true,
    showHover: true,
    innerRadius: true,
    isHalf: false,
    colors: ['#003056', '#04416c', '#095382', '#0c6599', '#0c78b0', '#098cc7', '#00a1df'],
  },
};

export default <DonutChart {...props} />;
