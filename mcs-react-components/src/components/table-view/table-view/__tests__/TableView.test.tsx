import 'jest';
import * as React from 'react';
import TableView, { TableViewProps } from '../TableView';
import { DownOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import * as TestRenderer from 'react-test-renderer';

interface Data {
  key: string;
  name: string;
  age: string;
  address: string;
  description: string;
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    render: (text: string) => {
      return <a href='javascript:;'>{text}</a>;
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 70,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    width: 360,
    render: (text: string, record: any) => (
      <span>
        <a href='javascript:;'>Action 一 {record.name}</a>
        <Divider type='vertical' />
        <a href='javascript:;'>Delete</a>
        <Divider type='vertical' />
        <a href='javascript:;' className='ant-dropdown-link'>
          More actions <DownOutlined />
        </a>
      </span>
    ),
  },
];

const data: Data[] = [];
for (let i = 1; i <= 46; i++) {
  data.push({
    key: i.toString(),
    name: 'John Brown',
    age: `${i}2`,
    address: `New York No. ${i} Lake Park`,
    description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
  });
}

const pagination = {
  pageSize: 10,
  total: data.length,
};

const selectedRows = ['1', '2', '3'];

const props = {
  columns: columns,
  dataSource: data,
  selectionNotifyerMessages: {
    allRowsSelected: 'You have selected all rows.',
    unselectAll: 'Unselect all rows',
    allPageRowsSelected: 'You have selected all rows in this page.',
    selectAll: 'Select all',
    selectedRows: 'You have selected N rows.',
  },
};

it('renders a basic tableView', () => {
  const tableViewProps: TableViewProps<any> = {
    ...props,
  };

  const component = TestRenderer.create(<TableView {...tableViewProps} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders a tableView with pagination', () => {
  const tableViewProps: TableViewProps<Data> = {
    ...props,
    pagination: pagination,
  };

  const component = TestRenderer.create(<TableView {...tableViewProps} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders a tableView with 3 selected rows', () => {
  const tableViewProps: TableViewProps<Data> = {
    ...props,
    rowSelection: {
      selectedRowKeys: selectedRows,
    },
    selectionNotifyerMessages: {
      ...props.selectionNotifyerMessages,
      selectedRows: 'You have selected 3 rows.',
    },
  };

  const component = TestRenderer.create(<TableView {...tableViewProps} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
