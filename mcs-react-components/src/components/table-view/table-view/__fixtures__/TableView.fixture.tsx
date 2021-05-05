import * as React from 'react';
import TableView, { TableViewProps } from '../TableView';
import {
  TableViewMockData,
  tableViewMockColumns,
  tableViewMockData,
  selectionNotifyerMessagesMock,
} from '../../../../utils/TableViewHelpers';

const props: TableViewProps<TableViewMockData> = {
  columns: tableViewMockColumns,
  dataSource: tableViewMockData(),
  rowSelection: {
    selectedRowKeys: ['1', '2'],
  },
  pagination: {
    pageSize: 10,
  },
  selectionNotifyerMessages: selectionNotifyerMessagesMock,
};

export default <TableView {...props} />;
