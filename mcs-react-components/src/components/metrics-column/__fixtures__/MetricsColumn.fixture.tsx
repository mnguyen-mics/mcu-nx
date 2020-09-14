import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import MetricsColumn, { MetricsColumnProps } from '../MetricsColumn';

const props: MetricsColumnProps = {
  metrics: [
    { name: 'TestMetric1', value: '1' },
    { name: 'TestMetric2', value: '2' },
    { name: 'TestMetric3', value: '3' },
  ],
};

const component = (_props: MetricsColumnProps) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <MetricsColumn {..._props} />
    </MemoryRouter>
  </IntlProvider>
);

component.displayName = 'MetricsColumn';

export default {
  component,
  props,
};
