import * as React from 'react';
import * as _cuid from 'cuid';
import { Menu, Table } from 'antd';
import { TableProps, ColumnProps, TableRowSelection } from 'antd/lib/table';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { ClickParam } from 'antd/lib/menu';
import McsIcon from '../../mcs-icon';
// import SelectionNotifyer from './SelectionNotifyer';

const DEFAULT_PAGINATION_OPTION = {
  size: 'small',
  showSizeChanger: true,
};
const cuid = _cuid;

export interface DataColumnDefinition<T> extends ColumnProps<T> {
  message?: string;
  key: string;
  render?: (text: string, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: any, b: any) => number);
  isHideable?: boolean;
  isVisibleByDefault?: boolean;
}

export interface ActionDefinition<T> {
  message?: string;
  disabled?: boolean;
  callback: (record: T) => void;
}

export interface ActionsColumnDefinition<T> extends ColumnProps<T> {
  key: string;
  actions: Array<ActionDefinition<T>>;
}

export interface ExtendedTableRowSelection<T = any>
  extends TableRowSelection<T> {
  selectedRowKeys?: string[];
  allRowsAreSelected?: boolean;
  selectAllItemIds?: () => void;
  unselectAllItemIds?: () => void;
  //   onSelect?: () => void;
}

export interface TableViewProps<T> extends TableProps<T> {
  columns?: Array<DataColumnDefinition<T>>;
  actionsColumnsDefinition?: Array<ActionsColumnDefinition<T>>;
  rowSelection?: ExtendedTableRowSelection;
}

class TableView<
  T extends { key?: string; id?: string; [key: string]: any }
> extends React.Component<TableViewProps<T>> {
  static defaultProps: Partial<TableViewProps<any>> = {
    actionsColumnsDefinition: [],
    columns: [],
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
            overlay={this.renderActionsMenu(column.actions, record)}
            trigger={['click']}
          >
            <a className="ant-dropdown-link">
              <McsIcon type="chevron" />
            </a>
          </Dropdown>
        );
      },
      sorter: false,
    }));
  };

  buildDataColumns = (): Array<ColumnProps<T>> => {
    const { columns, visibilitySelectedColumns } = this.props;

    const visibilitySelectedColumnsValues: string[] = visibilitySelectedColumns!.map(
      column => {
        return column.key;
      },
    );

    if (columns === undefined)
      throw new Error('Undefined columns in TableView');

    return columns
      .filter(column => {
        if (visibilitySelectedColumnsValues.length >= 1) {
          return (
            !column.isHideable ||
            visibilitySelectedColumnsValues.includes(column.key)
          );
        }
        return column;
      })
      .map(dataColumn => {
        return {
          title: dataColumn.message || dataColumn.title,
          dataIndex: dataColumn.key,
          key: dataColumn.key,
          render: dataColumn.render ? dataColumn.render : (text: any) => text,
          sorter: dataColumn.sorter ? dataColumn.sorter : false,
        };
      });
  };

  renderActionsMenu = (
    actions: (record: T) => Array<ActionDefinition<T>>,
    record: T,
  ) => {
    const onClick = (item: ClickParam) => {
      actions[parseInt(item.key, 0)].onClick(record);
    };

    return (
      <Menu onClick={onClick} className="mcs-dropdown-actions">
        {actions(record).map((action, index) => {
          return (
            <Menu.Item key={index.toString()} disabled={action.disabled}>
              {action.message ? (
                action.message
              ) : (
                index
              )}
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
      children,
      ...rest
    } = this.props;

    const columns: Array<ColumnProps<T>> = this.props.columns!.concat(
      this.buildActionsColumns(actionsColumnsDefinition!),
    );

    if (dataSource === undefined)
      throw new Error('Undefined dataSource in TableView');

    const dataSourceWithIds = dataSource.map(elem => ({
      key: elem.id ? elem.id : cuid(),
      ...(elem as any),
    }));

    let newPagination = pagination;
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
      <div className="mcs-table-view">
        <SelectionNotifyer
          rowSelection={rest.rowSelection}
          pagination={pagination}
        />

        <Table<T> {...computedTableProps} />
      </div>
    );
  }
}

export default (TableView) as React.ComponentClass<
  TableViewProps<any>
>;
