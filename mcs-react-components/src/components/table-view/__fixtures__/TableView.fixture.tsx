import * as React from 'react';
import { IntlProvider } from 'react-intl';
import TableView, { TableViewProps } from '../TableView';
import { Divider, Icon } from 'antd';
import { TableProps } from 'antd/lib/table';

export type CombinedTableViewProps = TableViewProps<any> & TableProps<any>;

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

const data = [];
for (let i = 1; i <= 46; i++) {
  data.push({
    key: i.toString(),
    name: 'John Brown',
    age: `${i}2`,
    address: `New York No. ${i} Lake Park`,
    description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
  });
}

const props: CombinedTableViewProps = {
  columns: columns,
  dataSource: data,
};

const component = (_props: CombinedTableViewProps) => (
  <IntlProvider locale="en">
    <TableView {...props} />
  </IntlProvider>
);

component.displayName = "TableView";

export default {
  component,
  props,
};
