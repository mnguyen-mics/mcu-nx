import 'jest';
import * as React from 'react';
import { MemoryRouter } from 'react-router';
import * as TestRenderer from 'react-test-renderer';
import ItemList, { ItemListProps, Filters } from '../ItemList';
import { selectionNotifyerMessagesMock } from '../../../utils/TableViewHelpers';

it('renders the item list', () => {
  const fetchList = (
    organisationId: string,
    filters: Filters,
    isInitialFetch?: boolean,
  ) => {
    //
  };
  const props: ItemListProps<any> = {
    selectionNotifyerMessages: selectionNotifyerMessagesMock,
    fetchList: fetchList,
    dataSource: [],
    total: 10,
    pageSettings: [],
    emptyTable: {
      iconType: 'email',
      message: 'Empty Table',
    },
  };

  const component = TestRenderer.create(
    <MemoryRouter>
      <ItemList {...props} />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
