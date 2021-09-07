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
    format: 'count',
  },
};

export default <DonutChart {...props} />;
