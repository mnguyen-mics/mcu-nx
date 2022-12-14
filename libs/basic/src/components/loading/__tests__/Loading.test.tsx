import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Loading, { LoadingProps } from '../Loading';

it('renders the Loading', () => {
  const props: LoadingProps = {
    isFullScreen: true,
  };

  const component = TestRenderer.create(<Loading {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
