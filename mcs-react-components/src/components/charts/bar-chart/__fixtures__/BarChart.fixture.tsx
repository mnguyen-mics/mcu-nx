import * as React from 'react';
import { BarChart, BarChartProps } from '../../bar-chart/BarChart';

const props: BarChartProps = {
  dataset: [
    { day: '2020-02-27', data_1: 456, data_2: 65 },
    { day: '2020-02-28', data_1: 3451, data_2: 561 },
    { day: '2020-02-29', data_1: 3000, data_2: 651 },
    { day: '2020-03-01', data_1: 2132, data_2: 261 },
  ],
  options: {
    showLegend: true,
    colors: ['#8A008C', '#7677DB'],
    yKeys: [
      {
        key: 'data_1',
        message: 'Data 1',
      },
      {
        key: 'data_2',
        message: 'Data 2',
      },
    ],
    xKey: 'day',
  },
  reducePadding: true,
  stacking: false,
  height: 380,
};

export default <BarChart {...props} />;
