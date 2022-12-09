import 'jest';
import React from 'react';
import LegendChart, { LegendChartProps } from '../LegendChart';
import TestRenderer from 'react-test-renderer';

it('renders the legendchart', () => {
  const props: LegendChartProps = {
    identifier: '123',
    options: [
      {
        color: '#FFF',
        domain: 'mics',
      },
    ],
  };

  const component = TestRenderer.create(<LegendChart {...props} />);

  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
