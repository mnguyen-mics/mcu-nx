import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';

import TableViewFilters, { ViewComponentWithFiltersProps } from '../../table-view-filters';
import { selectionNotifyerMessagesMock } from '../../../utils/TableViewHelpers';

it('renders the table view filters', () => {
  const props: ViewComponentWithFiltersProps<any> = {
    columns: [{ key: 'key 1' }, { key: 'key 2' }],
    dataSource: [{ key: 'key 1' }, { key: 'key 2' }],
    selectionNotifyerMessages: selectionNotifyerMessagesMock,
  };

  const component = TestRenderer.create(<TableViewFilters {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
