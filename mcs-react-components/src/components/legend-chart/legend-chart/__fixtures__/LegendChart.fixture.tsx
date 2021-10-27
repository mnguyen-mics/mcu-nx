import * as React from 'react';
import LegendChart, { LegendChartProps } from '../LegendChart';

const props: LegendChartProps = {
  identifier: '123',
  options: [
    {
      color: '#FFF',
      domain: 'mics',
    },
  ],
};

export default <LegendChart {...props} />;
