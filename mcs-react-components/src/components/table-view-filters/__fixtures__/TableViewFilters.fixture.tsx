import * as React from 'react';
import { MemoryRouter } from 'react-router';
import TableViewFilters, {
  ViewComponentWithFiltersProps,
} from '../TableViewFilters';
import { DownOutlined } from '@ant-design/icons';
import { MultiSelectProps } from '../../multi-select';
import {
  tableViewMockColumns,
  tableViewMockData,
  selectionNotifyerMessagesMock,
} from '../../../utils/TableViewHelpers';

const searchOptions = {
  placeholder: 'Search...',
  onSearch: (value: string) => {
    //
  },
};

const filter = ['FILTER 1', 'FILTER 2', 'FILTER 3'];

const statusItems = filter.map((status) => ({
  key: status,
  value: status,
}));

const filtersOptions: Array<MultiSelectProps<any>> = [
  {
    displayElement: (
      <div>
        {'Random filter '}
        <DownOutlined />
      </div>
    ),
    selectedItems: filter.map((status: string) => ({
      key: status,
      value: status,
    })),
    items: statusItems,
    getKey: (t: any) => t.key,
    display: (t: any) => t.value,
    handleMenuClick: () => {
      //
    },
  },
];

const props: ViewComponentWithFiltersProps<any> = {
  columns: tableViewMockColumns,
  dataSource: tableViewMockData(),
  filtersOptions: filtersOptions,
  searchOptions: searchOptions,
  selectionNotifyerMessages: selectionNotifyerMessagesMock,
};

const component = (_props: ViewComponentWithFiltersProps<any>) => (
  <MemoryRouter>
    <TableViewFilters {..._props} />
  </MemoryRouter>
);

component.displayName = 'TableViewFilters';

export default {
  component,
  props,
};
