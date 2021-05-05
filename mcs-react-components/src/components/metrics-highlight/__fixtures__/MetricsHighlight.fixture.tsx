import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { MetricsColumnProps } from '../../metrics-column/MetricsColumn';
import MetricsHighlight from '../MetricsHighlight';

const props: MetricsColumnProps = {
  metrics: [
    { name: 'TestMetric1', value: '1' },
    { name: 'TestMetric2', value: '2' },
    { name: 'TestMetric3', value: '3' },
  ],
};

export default (
  <IntlProvider locale='en'>
    <MetricsHighlight {...props} />
  </IntlProvider>
);
