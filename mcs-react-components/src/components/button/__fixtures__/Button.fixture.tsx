import * as React from 'react';
import Button, { ButtonProps } from '../Button';

const props: ButtonProps = {};

const component = (_props: ButtonProps) => (
  <Button {...props}>Add audience feature</Button>
);

component.displayName = 'Button';

export default {
  component,
  props,
};
