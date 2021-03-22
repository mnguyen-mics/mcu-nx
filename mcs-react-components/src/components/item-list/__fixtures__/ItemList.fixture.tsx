import * as React from 'react';
import { MemoryRouter } from 'react-router';
import ItemList, { Filters, ItemListProps } from '../ItemList';
import { selectionNotifyerMessagesMock } from '../../../utils/TableViewHelpers';

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

const component = (_props: ItemListProps) => (
  <MemoryRouter>
    <ItemList {..._props} />
  </MemoryRouter>
);

component.displayName = 'ItemList';

export default {
  component,
  props,
};
