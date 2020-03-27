import * as React from 'react';
import Error, { ErrorProps } from '../Error';

const props: ErrorProps = {
  message: 'This is an error message',
  style: {color: 'red'}
};
const component = (_props: ErrorProps) => (
  <Error {..._props} />
);

component.displayName = "Error";

export default {
  component,
  props,
};
