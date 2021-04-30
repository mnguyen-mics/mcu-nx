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

export default (
  <ErrorBoundary {...props}>
    <BuggyButton/>
  </ErrorBoundary>
);
