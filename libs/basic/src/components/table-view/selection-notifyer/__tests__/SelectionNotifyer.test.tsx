import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { selectionNotifyerMessagesMock } from '../../../../utils/TableViewHelpers';
import SelectionNotifyer, { SelectionNotifyerProps } from '../SelectionNotifyer';

interface Data {
  key: string;
  name: string;
  age: string;
  address: string;
  description: string;
}

it('renders the SelectionNotifyer with all items selected', () => {
  const props: SelectionNotifyerProps<Data> = {
    rowSelection: {
      selectedRowKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      allRowsAreSelected: true,
    },
    pagination: {
      total: 10,
    },
    messages: selectionNotifyerMessagesMock,
  };

  const component = TestRenderer.create(<SelectionNotifyer {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the SelectionNotifyer with all the page items selected', () => {
  const props: SelectionNotifyerProps<Data> = {
    rowSelection: {
      selectedRowKeys: ['1', '2', '3', '4', '5'],
      allRowsAreSelected: true,
    },
    pagination: {
      total: 10,
      pageSize: 5,
    },
    messages: {
      allRowsSelected: 'You have selected all rows.',
      unselectAll: 'Unselect all rows',
      allPageRowsSelected: 'You have selected all rows in this page.',
      selectAll: 'Select all',
      selectedRows: 'You have selected N rows.',
    },
  };

  const component = TestRenderer.create(<SelectionNotifyer {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the SelectionNotifyer with 3 items selected', () => {
  const props: SelectionNotifyerProps<Data> = {
    rowSelection: {
      selectedRowKeys: ['1', '4', '7'],
      allRowsAreSelected: true,
    },
    pagination: {
      total: 10,
      pageSize: 5,
    },
    messages: {
      allRowsSelected: 'You have selected all rows.',
      unselectAll: 'Unselect all rows',
      allPageRowsSelected: 'You have selected all rows in this page.',
      selectAll: 'Select all',
      selectedRows: 'You have selected 3 rows.',
    },
  };

  const component = TestRenderer.create(<SelectionNotifyer {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
