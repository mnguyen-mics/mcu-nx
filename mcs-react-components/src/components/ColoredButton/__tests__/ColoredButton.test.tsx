import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import ColoredButton, { ColoredButtonProps } from '../ColoredButton';

it('renders the ColoredButton', () => {
  const props: ColoredButtonProps = {
    backgroundColor: '#003056',
    color: '#fff',
    onClick: () => { console.log('clicked!') }
  };
  const component = TestRenderer.create(
    <ColoredButton {...props}>Save</ColoredButton>
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
