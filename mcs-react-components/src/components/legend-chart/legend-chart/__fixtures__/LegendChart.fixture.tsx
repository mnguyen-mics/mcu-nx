import * as React from 'react';
import LegendChart, { LegendChartProps } from '../LegendChart';

const props: LegendChartProps = {
  identifier: '123',
  options: [
    {
      color: '#AF4',
      domain: 'mics 1',
    },
    {
      color: '#AFF',
      domain: 'mics 2',
    },
  ],
};

export default <LegendChart {...props} />;
