import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import EmptyTableView, { EmptyTableViewProps } from '../EmptyTableView';

it('renders the EmptyTableView', () => {
  const props: EmptyTableViewProps = {
    message: 'No data found',
    iconType: 'warning',
  };
  const component = TestRenderer.create(<EmptyTableView {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
