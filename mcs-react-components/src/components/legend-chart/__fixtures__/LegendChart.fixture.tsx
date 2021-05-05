import * as React from 'react';
import { IntlProvider } from 'react-intl';
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

export default (
  <IntlProvider locale='en'>
    <LegendChart {...props} />
  </IntlProvider>
);
