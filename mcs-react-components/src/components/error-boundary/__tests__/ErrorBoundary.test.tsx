import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import ErrorBoundary, { ErrorBoundaryProps } from '..';
import BuggyButton from '../BuggyButton';

it('renders the ErrorBoundary', () => {
  const onError = (error: any, info: any) => {
    return <div>{error}</div>;
  };

  const props: ErrorBoundaryProps = {
    errorMessage: 'Something went wrong',
    onError,
  };
  const component = TestRenderer.create(
    <ErrorBoundary {...props}>
      <div>Tset</div>
    </ErrorBoundary>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

it('uses the onError when an error occurs', () => {
  const onError = (error: any, info: any) => {
    return null;
  };

  const props: ErrorBoundaryProps = {
    errorMessage: 'Something went wrong',
    onError,
  };
  const component = TestRenderer.create(
    <ErrorBoundary {...props}>
      <BuggyButton />
    </ErrorBoundary>,
  );

  const fakeTarget = {
    preventDefault: () => {
      return null;
    },
  };

  component.root.findByType('button').props.onClick(fakeTarget);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
