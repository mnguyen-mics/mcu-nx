import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from 'enzyme';
import { MetricsColumnProps } from '../../metrics-column/MetricsColumn';
import MetricsHighlight from '../MetricsHighlight';

it('renders the metrics highlight', () => {
  const props: MetricsColumnProps = {
    metrics: [
      { name: 'TestMetric1', value: '1' },
      { name: 'TestMetric2', value: '2' },
      { name: 'TestMetric3', value: '3' },
    ],
  };

  const component = render(
    <IntlProvider locale='en'>
      <MetricsHighlight {...props} />
    </IntlProvider>,
  );
  expect(component).toMatchSnapshot();
});
