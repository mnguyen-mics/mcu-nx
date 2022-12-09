import React from 'react';
import 'jest';
import TestRenderer from 'react-test-renderer';
import CopyToClipboard from '../CopyToClipboard';

it('render the CopyToClipboard', () => {
  const component = TestRenderer.create(<CopyToClipboard value='You copied this text!' />);
  expect(component.toJSON()).toMatchSnapshot();
});
