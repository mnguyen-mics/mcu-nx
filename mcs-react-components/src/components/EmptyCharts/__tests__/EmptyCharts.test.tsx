import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import EmptyCharts, { EmptyChartsProps } from '../EmptyCharts';

it('Should render the EmptyChart', () => {
  const props: EmptyChartsProps = {
    title: 'There is no automation to display.',
    icon: 'automation',
  };
  const component = TestRenderer.create(<EmptyCharts {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
