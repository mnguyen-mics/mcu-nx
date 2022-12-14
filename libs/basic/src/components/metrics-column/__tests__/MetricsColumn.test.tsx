import React from 'react';
import { render } from 'enzyme';
import MetricsColumn, { MetricsColumnProps } from '../MetricsColumn';

it('renders the metrics column', () => {
  const props: MetricsColumnProps = {
    metrics: [
      { name: 'TestMetric1', value: '1' },
      { name: 'TestMetric2', value: '2' },
      { name: 'TestMetric3', value: '3' },
    ],
  };

  const component = render(<MetricsColumn {...props} />);
  expect(component).toMatchSnapshot();
});
