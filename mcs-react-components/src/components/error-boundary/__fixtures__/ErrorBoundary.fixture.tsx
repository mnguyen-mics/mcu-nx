import * as React from 'react';
import ErrorBoundary, { ErrorBoundaryProps } from '..';
import BuggyButton from '../BuggyButton';

const onError = (error: any, info: any) => {
  return <div>{error}</div>;
};

const props: ErrorBoundaryProps = {
  errorMessage: 'Something went wrong',
  onError,
};

const component = (_props: ErrorBoundaryProps) => (
  <ErrorBoundary {..._props}>
    <BuggyButton/>
  </ErrorBoundary>
);

component.displayName = 'ErrorBoundary';

export default {
  component,
  props,
};
