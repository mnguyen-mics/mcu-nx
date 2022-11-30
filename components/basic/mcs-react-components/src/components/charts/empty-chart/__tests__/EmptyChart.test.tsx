import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import EmptyChart, { EmptyChartProps } from '../EmptyChart';

it('Should render the EmptyChart', () => {
  const props: EmptyChartProps = {
    title: 'There is no automation to display.',
    icon: 'automation',
  };
  const component = TestRenderer.create(<EmptyChart {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
