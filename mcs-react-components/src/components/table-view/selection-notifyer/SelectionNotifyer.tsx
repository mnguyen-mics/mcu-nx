import * as React from 'react';
import Slide from '../../transition/slide';
import { Alert } from 'antd';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import Button from '../../button';
import { ExtendedTableRowSelection } from '../table-view/TableView';

export interface SelectionNotifyerProps<T> {
  messages?: {
    allRowsSelected: string;
    unselectAll: string;
    allPageRowsSelected: string;
    selectAll: string;
    selectedRows: string;
  };
  rowSelection?: ExtendedTableRowSelection<T>;
  pagination?: PaginationProps | false;
}

const defaultMessages = {
  allRowsSelected: 'All rows selected',
  unselectAll: 'Unselect all',
  allPageRowsSelected: 'All page rows selected',
  selectAll: 'Select All',
  selectedRows: 'Selected rows',
};

class SelectionNotifyer extends React.Component<SelectionNotifyerProps<any>> {
  render() {
    const { rowSelection, pagination, messages } = this.props;
    let content: JSX.Element = <span />;

    const msgs = messages || defaultMessages;

    const handleOnClick = () => {
      if (rowSelection && rowSelection.selectAllItemIds) {
        rowSelection.selectAllItemIds();
      }
    };

    if (rowSelection && rowSelection.selectedRowKeys && pagination) {
      if (
        rowSelection.allRowsAreSelected ||
        rowSelection.selectedRowKeys.length === pagination.total
      ) {
        content = (
          <div>
            {msgs.allRowsSelected}
            <Button onClick={rowSelection.unselectAllItemIds} className='selected-rows-btn'>
              {msgs.unselectAll}
            </Button>
          </div>
        );
      } else if (rowSelection.selectedRowKeys.length === pagination.pageSize) {
        content = (
          <div>
            {msgs.allPageRowsSelected}
            <Button onClick={handleOnClick} className='selected-rows-btn'>
              {msgs.selectAll}
            </Button>
          </div>
        );
      } else {
        content = <div>{msgs.selectedRows}</div>;
      }
    }

    const alert = <Alert message={content} type='warning' className='selected-rows-alert' />;

    const toShow = !!(
      rowSelection &&
      rowSelection.selectedRowKeys &&
      pagination &&
      rowSelection.selectedRowKeys.length !== 0
    );

    return rowSelection && rowSelection.selectedRowKeys ? (
      <Slide toShow={toShow} content={alert} />
    ) : null;
  }
}

export default SelectionNotifyer;
