import * as React from 'react';
import { Divider } from "antd"
import { DownOutlined } from '@ant-design/icons';

export interface TableViewMockData {
    key: string;
    name: string;
    age: string;
    address: string;
    description: string;
}

export const tableViewMockColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (text: string) => {
            return <a href="javascript:;" > {text} </a>;
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
                <a href="javascript:;" > Action 一 {record.name} </a>
                < Divider type="vertical" />
                <a href="javascript:;" > Delete </a>
                < Divider type="vertical" />
                <a href="javascript:;" className="ant-dropdown-link" >
                    More actions < DownOutlined />
                </a>
            </span>
        ),
    },
];

export const tableViewMockData = (): TableViewMockData[] => {
    const data: TableViewMockData[] = [];
    for (let i = 1; i <= 46; i++) {
        data.push({
            key: i.toString(),
            name: 'John Brown',
            age: `${i}2`,
            address: `New York No. ${i} Lake Park`,
            description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
        });
    }
    return data;
}

export const selectionNotifyerMessagesMock = {
    allRowsSelected: 'You have selected all rows.',
    unselectAll: 'Unselect all rows',
    allPageRowsSelected: 'You have selected all rows in this page.',
    selectAll: 'Select all',
    selectedRows: 'You have selected 2 rows.',
}