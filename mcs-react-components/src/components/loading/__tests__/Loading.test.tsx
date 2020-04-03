import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Loading, { LoadingProps } from '../Loading';

it('renders the ColoredButton', () => {
  const props: LoadingProps = {
    className: 'loading-full-screen',
  };

  const component = TestRenderer.create(
    <Loading {...props} />
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
