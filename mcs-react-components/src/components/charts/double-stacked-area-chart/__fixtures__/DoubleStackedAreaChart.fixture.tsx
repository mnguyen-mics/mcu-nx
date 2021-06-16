import * as React from 'react';
import DoubleStackedAreaChart, { DoubleStackedAreaChartProps } from '../DoubleStackedAreaChart';

const props: DoubleStackedAreaChartProps = {
  dataset: [
    { day: '2020-02-27', data_1: 120, data_2: 20 },
    { day: '2020-02-28', data_1: 3451, data_2: 561 },
    { day: '2020-02-29', data_1: 3000, data_2: 651 },
    { day: '2020-03-01', data_1: 2132, data_2: 261 },
    { day: '2020-03-02', data_1: 889, data_2: 53 },
  ],
  options: {
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
};

export default <DoubleStackedAreaChart {...props} />;
