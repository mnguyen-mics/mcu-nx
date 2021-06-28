import * as React from 'react';
import * as _cuid from 'cuid';
import { Menu, Table } from 'antd';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { TableRowSelection, TablePaginationConfig } from 'antd/lib/table/interface';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { MenuInfo } from '../../../../node_modules/rc-menu/lib/interface';
import { Dropdown } from '../../popupContainer/PopupContainer';
import McsIcon from '../../mcs-icon';
import SelectionNotifyer from '../selection-notifyer';

const DEFAULT_PAGINATION_OPTION = {
  size: 'small' as 'small',
  showSizeChanger: true,
};

export interface DataColumnDefinition<T> extends ColumnProps<T> {
  key: string;
  render?: (text: string, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: any, b: any) => number);
  isHideable?: boolean;
  isVisibleByDefault?: boolean;
}

export interface ActionDefinition<T> {
  className?: string;
  message?: string;
  disabled?: boolean;
  callback: (record: T) => void;
}

export type ActionsRenderer<T> = (record: T) => Array<ActionDefinition<T>>;

export interface ActionsColumnDefinition<T> extends ColumnProps<T> {
  key: string;
  actions: ActionsRenderer<T>;
}

export interface ExtendedTableRowSelection<T = any> extends TableRowSelection<T> {
  selectedRowKeys?: string[];
  allRowsAreSelected?: boolean;
  selectAllItemIds?: () => void;
  unselectAllItemIds?: () => void;
  onSelect?: () => void;
}

export interface TableViewProps<T> extends TableProps<T> {
  columns?: Array<DataColumnDefinition<T>>;
  visibilitySelectedColumns?: Array<DataColumnDefinition<T>>;
  actionsColumnsDefinition?: Array<ActionsColumnDefinition<T>>;
  rowSelection?: ExtendedTableRowSelection;
  selectionNotifyerMessages?: {
    allRowsSelected: string;
    unselectAll: string;
    allPageRowsSelected: string;
    selectAll: string;
    selectedRows: string;
  };
}

class TableView<
  T extends { key?: string; id?: string; [key: string]: any },
> extends React.Component<TableViewProps<T>> {
  static defaultProps: Partial<TableViewProps<any>> = {
    visibilitySelectedColumns: [],
    actionsColumnsDefinition: [],
  };

  buildActionsColumns = (
    actionsColumnsDefinition: Array<ActionsColumnDefinition<T>>,
  ): Array<ColumnProps<T>> => {
    return actionsColumnsDefinition.map(column => ({
      key: column.key,
      width: 30,
      render: (text: string, record: T) => {
        return (
          <Dropdown
            className={column.className}
            overlay={this.renderActionsMenu(column.actions, record)}
            trigger={['click']}
          >
            <a className='ant-dropdown-link'>
              <McsIcon type='chevron' />
            </a>
          </Dropdown>
        );
      },
      sorter: false,
    }));
  };

  buildDataColumns = (): Array<ColumnProps<T>> => {
    const { columns, visibilitySelectedColumns } = this.props;

    const visibilitySelectedColumnsValues: string[] = visibilitySelectedColumns!.map(column => {
      return column.key;
    });

    if (columns === undefined) throw new Error('Undefined columns in TableView');

    return columns
      .filter(column => {
        if (visibilitySelectedColumnsValues.length >= 1) {
          return !column.isHideable || visibilitySelectedColumnsValues.includes(column.key);
        }
        return column;
      })
      .map(dataColumn => {
        return {
          title: dataColumn.title || dataColumn.title,
          dataIndex: dataColumn.key,
          key: dataColumn.key,
          render: dataColumn.render ? dataColumn.render : (text: any) => text,
          sorter: dataColumn.sorter ? dataColumn.sorter : false,
        };
      });
  };

  renderActionsMenu = (actions: (record: T) => Array<ActionDefinition<T>>, record: T) => {
    const onClick = (item: MenuInfo) => {
      actions(record)[parseInt(item.key.toString(), 0)].callback(record);
    };

    return (
      <Menu onClick={onClick} className='mcs-dropdown-actions'>
        {actions(record).map((action, index) => {
          return (
            <Menu.Item
              className={action.className}
              key={index.toString()}
              disabled={action.disabled}
            >
              {action.message ? action.message : index}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  render() {
    const {
      dataSource,
      loading,
      onChange,
      pagination,
      actionsColumnsDefinition,
      visibilitySelectedColumns,
      selectionNotifyerMessages,
      children,
      ...rest
    } = this.props;

    const columns: Array<ColumnProps<T>> = this.buildDataColumns().concat(
      this.buildActionsColumns(actionsColumnsDefinition!),
    );

    if (dataSource === undefined) throw new Error('Undefined dataSource in TableView');

    const dataSourceWithIds = dataSource.map(elem => {
      const cuid = _cuid();
      return {
        key: elem.id ? elem.id : cuid,
        ...(elem as any),
      };
    });

    let newPagination: false | TablePaginationConfig | undefined = pagination;
    if (pagination) {
      newPagination = {
        ...DEFAULT_PAGINATION_OPTION,
        ...(pagination as PaginationProps),
      };
    } else {
      newPagination = {
        ...DEFAULT_PAGINATION_OPTION,
      };
    }

    const computedTableProps: TableProps<T> = {
      ...rest,
      columns,
      dataSource: dataSourceWithIds,
      loading,
      onChange,
      pagination: newPagination,
    };

    return (
      <div className='mcs-table-view'>
        <SelectionNotifyer
          rowSelection={rest.rowSelection}
          pagination={pagination}
          messages={selectionNotifyerMessages}
        />

        <Table {...computedTableProps} />
      </div>
    );
  }
}

export default TableView as React.ComponentClass<TableViewProps<any>>;
