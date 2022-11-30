import * as React from 'react';
import SelectionNotifyer, { SelectionNotifyerProps } from '../SelectionNotifyer';

interface Data {
  key: string;
  name: string;
  age: string;
  address: string;
  description: string;
}

const props: SelectionNotifyerProps<Data> = {
  rowSelection: {
    selectedRowKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    allRowsAreSelected: true,
  },
  pagination: {
    total: 10,
  },
  messages: {
    allRowsSelected: 'You have selected all rows.',
    unselectAll: 'Unselect all rows',
    allPageRowsSelected: 'You have selected all rows in this page.',
    selectAll: 'Select all',
    selectedRows: 'You have selected N rows.',
  },
};

export default <SelectionNotifyer {...props} />;
