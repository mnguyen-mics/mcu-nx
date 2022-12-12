import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Error, { ErrorProps } from '../Error';

it('renders the Error component', () => {
  const props: ErrorProps = {
    message: 'This is an error message',
    style: { color: 'red' },
  };
  const component = TestRenderer.create(<Error {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
