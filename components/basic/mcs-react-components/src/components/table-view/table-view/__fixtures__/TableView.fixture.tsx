import * as React from 'react';
import TableView, { TableViewProps } from '../TableView';
import {
  TableViewMockData,
  tableViewMockColumns,
  tableViewMockActionColumns,
  tableViewMockData,
  selectionNotifyerMessagesMock,
} from '../../../../utils/TableViewHelpers';

const props: TableViewProps<TableViewMockData> = {
  actionsColumnsDefinition: tableViewMockActionColumns,
  columns: tableViewMockColumns,
  dataSource: tableViewMockData(),
  rowSelection: {
    selectedRowKeys: [1, 2],
  },
  pagination: {
    pageSize: 10,
  },
  selectionNotifyerMessages: selectionNotifyerMessagesMock,
};

export default <TableView {...props} />;
