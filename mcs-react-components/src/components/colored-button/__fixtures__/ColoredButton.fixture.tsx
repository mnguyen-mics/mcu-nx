import * as React from 'react';
import ColoredButton, { ColoredButtonProps } from '../ColoredButton';

const props: ColoredButtonProps = {
  backgroundColor: '#003056',
  color: '#fff',
  onClick: () => { /* tslint:disable */ console.log('clicked!') /* tslint:enable */ }
};


const component = (_props: ColoredButtonProps) => (
  <ColoredButton {..._props}>Save</ColoredButton>
);

component.displayName = "ColoredButton";

export default {
  component,
  props,
};
