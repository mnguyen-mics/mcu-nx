import * as React from 'react';
import TableView, { TableViewProps } from '../TableView';
import { Divider, Icon } from 'antd';

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
      return <a href="javascript:;">{text}</a>;
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
        <a href="javascript:;">Action 一 {record.name}</a>
        <Divider type="vertical" />
        <a href="javascript:;">Delete</a>
        <Divider type="vertical" />
        <a href="javascript:;" className="ant-dropdown-link">
          More actions <Icon type="down" />
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

const props: TableViewProps<Data> = {
  columns: columns,
  dataSource: data,
  rowSelection: {
    selectedRowKeys: ['1', '2'],
  },
  pagination: {
    pageSize: 10,
  },
  selectionNotifyerMessages: {
    allRowsSelected: 'You have selected all rows.',
      unselectAll: 'Unselect all rows',
      allPageRowsSelected: 'You have selected all rows in this page.',
      selectAll: 'Select all',
      selectedRows: 'You have selected N rows.',
  }
};

const component = (_props: TableViewProps<Data>) => (
  <TableView {...props} /> 
);

component.displayName = 'TableView';

export default {
  component,
  props,
};
