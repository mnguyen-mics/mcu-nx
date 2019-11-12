import * as React from 'react';
import ColoredButton, { ColoredButtonProps } from '../ColoredButton';

const props: ColoredButtonProps = {
  backgroundColor: '#003056',
  color: '#fff',
  onClick: () => { console.log('clicked!') }
};


const component = (_props: ColoredButtonProps) => (
  <ColoredButton {..._props}>Save</ColoredButton>
);

export default {
  component,
  props,
};
