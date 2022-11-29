import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Button, { ButtonProps } from '../Button';

it('renders the Button', () => {
  const props: ButtonProps = {};
  const component = TestRenderer.create(<Button {...props}>Add audience feature</Button>);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
