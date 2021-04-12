import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { MetricsColumnProps } from '../../metrics-column/MetricsColumn';
import MetricsHighlight from '../MetricsHighlight'

const props: MetricsColumnProps = {
  metrics: [
    { name: 'TestMetric1', value: '1' },
    { name: 'TestMetric2', value: '2' },
    { name: 'TestMetric3', value: '3' },
  ],
};

const component = (_props: MetricsColumnProps) => (
  <IntlProvider locale="en">
    <MetricsHighlight {..._props} />
  </IntlProvider>
);

component.displayName = 'MetricsHighlight';

export default {
  component,
  props,
};
