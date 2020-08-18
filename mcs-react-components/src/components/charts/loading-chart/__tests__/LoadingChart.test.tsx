import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import LoadingChart, { LoadingChartProps } from '../LoadingChart';

it('Should render the LoadingChart', () => {
  const props: LoadingChartProps = {
    className: 'test',
  };
  const component = TestRenderer.create(<LoadingChart {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
