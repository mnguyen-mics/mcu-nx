import * as React from 'react';
import { StatusCode } from '../../../utils/ApiResponses';
import TableSelector, { TableSelectorProps } from '../TableSelector';

interface Data {
  id: string;
  name: string;
  description: string;
  metric: number;
  status: string;
}

const fetchList = () => {
  return Promise.resolve({
    status: 'ok' as StatusCode,
    count: 3,
    data: [
      {
        id: '1',
        name: 'Object 1',
        description: 'this is a description',
        metric: 42,
        status: 'PENDING',
      },
      {
        id: '2',
        name: 'Object 2',
        description: 'this is a description',
        metric: 48,
        status: 'ACTIVE',
      },
      {
        id: '3',
        name: 'Object 3',
        description: 'this is a description',
        metric: 409,
        status: 'PAUSED',
      },
      {
        id: '4',
        name: 'Object 4',
        description: 'this is a description',
        metric: 567,
        status: 'ACTIVE',
      },
      {
        id: '5',
        name: 'Object 5',
        description: 'this is a description',
        metric: 876,
        status: 'PENDING',
      },
      {
        id: '6',
        name: 'Object 6',
        description: 'this is a description',
        metric: 409,
        status: 'PAUSED',
      },
      {
        id: '7',
        name: 'Object 7',
        description: 'this is a description',
        metric: 345,
        status: 'ACTIVE',
      },
      {
        id: '8',
        name: 'Object 8',
        description: 'this is a description',
        metric: 48,
        status: 'PENDING',
      },
      {
        id: '9',
        name: 'Object 9',
        description: 'this is a description',
        metric: 56190,
        status: 'PAUSED',
      },
    ],
  });
};

const fetchObject = (id: string) => {
  return Promise.resolve({
    status: 'ok' as StatusCode,
    count: 1,
    data: {
      id: '100',
      name: 'Object 100',
      description: 'this is a description',
      metric: 10000,
      status: 'ACTIVE',
    },
  });
};

const props: TableSelectorProps<Data> = {
  actionBarTitle: 'This is the Table Selector Title',
  columnsDefinitions: [
    {
      key: 'name',
      title: 'Name',
      isVisibleByDefault: true,
      render: (text: string, record: Data) => {
        return text;
      },
    },

    {
      key: 'description',
      title: 'Description',
      isVisibleByDefault: true,
      render: (text: string, record: Data) => {
        return text;
      },
    },
    {
      key: 'metric',
      title: 'Metric',
      isVisibleByDefault: true,
      render: (text: string, record: Data) => {
        return text;
      },
    },
    {
      key: 'status',
      title: 'Status',
      isVisibleByDefault: true,
      render: (text: string, record: Data) => {
        return text;
      },
    },
  ],
  displayFiltering: true,
  searchPlaceholder: 'Search placeholder',
  save: () => {
    return;
  },
  fetchDataList: fetchList,
  fetchData: fetchObject,
  close: () => {
    return;
  },
  displayTypeFilter: true,
  datamarts: [],
  messages: {
    audienceSegment: 'Audience Segment',
    userAccountCompartment: 'User Account Compartment',
    serviceType: 'Service Type',
    addElementText: 'Add',
  },
};

export default <TableSelector {...props} />;
