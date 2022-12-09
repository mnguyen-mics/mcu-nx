import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Button, { ButtonProps } from '../Button';

it('renders the Button', () => {
  const props: ButtonProps = {};
  const component = TestRenderer.create(<Button {...props}>Add audience feature</Button>);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
