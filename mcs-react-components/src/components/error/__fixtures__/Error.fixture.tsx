import * as React from 'react';
import Error, { ErrorProps } from '../Error';

const props: ErrorProps = {
  message: 'This is an error message',
  style: {color: 'red'}
};
export default (
  <Error {...props} />
);