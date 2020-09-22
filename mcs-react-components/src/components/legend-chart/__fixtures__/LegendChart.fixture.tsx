import * as React from 'react';
import { IntlProvider } from 'react-intl';
import LegendChart, { LegendChartProps } from '../LegendChart';

const props: LegendChartProps = {
  identifier: '123',
  options: [{
    color: '#FFF',
    domain: 'mics'
  }]
};

const component = (_props: LegendChartProps) => (
  <IntlProvider locale="en">
      <LegendChart {..._props} />
  </IntlProvider>
);

component.displayName = "LegendChart";

export default {
  component,
  props,
};
