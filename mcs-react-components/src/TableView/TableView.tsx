import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dropdown, Menu, Table} from 'antd';

import {PaginationProps} from 'antd/lib/pagination/Pagination';
import {ClickParam} from 'antd/lib/menu';

import McsIcons from '../McsIcons';
import generateGuid from '../utils/generateGuid';
import {ColumnProps} from "antd/lib/table/Column";
import {TableProps} from "antd/lib/table/Table";

const DEFAULT_PAGINATION_OPTION = {
  size: 'small',
  showSizeChanger: true,
};

export interface DataColumnDefinition<T> extends ColumnProps<T> {
  intlMessage: FormattedMessage.MessageDescriptor;
  key: string;
  render?: (text: string, record: T, index: number) => JSX.Element;
  sorter?: boolean | ((a: any, b: any) => number);
  isHideable?: boolean;
}

interface ActionDefinition<T> {
  translationKey?: string;
  intlMessage?: FormattedMessage.MessageDescriptor;
  callback: (record: T) => void;
}

interface ActionsColumnDefinition<T> extends ColumnProps<T> {
  key: string;
  actions: Array<ActionDefinition<T>>;
}

export interface TableViewProps<T> extends TableProps<T> {
  columns?: Array<DataColumnDefinition<T>>;
  visibilitySelectedColumns: Array<DataColumnDefinition<T>>;
  actionsColumnsDefinition?: Array<ActionsColumnDefinition<T>>;
}

class TableView<T> extends React.Component<TableViewProps<T>> {

  static defaultProps: Partial<TableViewProps<any>> = {
    pagination: false,
    visibilitySelectedColumns: [],
  };

  buildActionsColumns = (actionsColumnsDefinition: ActionsColumnDefinition<T>[]) =>
    actionsColumnsDefinition.map(column =>
      ({
        dataIndex: generateGuid(),
        key: generateGuid(),
        width: 30,
        render: (text: string, record: T) => {
          return (
            <Dropdown
              overlay={this.renderActionsMenu(column.actions, record)}
              trigger={['click']}
            >
              <a className="ant-dropdown-link">
                <McsIcons type="chevron"/>
              </a>
            </Dropdown>
          );
        },
        sorter: false,
      }));


  buildDataColumns = () : Array<ColumnProps<T>> => {
    const {
      columns,
      visibilitySelectedColumns,
    } = this.props;

    const visibilitySelectedColumnsValues: string[] = visibilitySelectedColumns.map((column) => {
      return column.key;
    });

    if (columns === undefined) throw new Error('Undefined columns in TableView');

    return columns.filter(column => {
      if (visibilitySelectedColumnsValues.length >= 1) {
        return !column.isHideable || visibilitySelectedColumnsValues.includes(column.key);
      }
      return column;
    }).map(dataColumn => {
      return {
        title: <FormattedMessage {...dataColumn.intlMessage} />,
        dataIndex: dataColumn.key,
        key: dataColumn.key,
        render: dataColumn.render ? dataColumn.render : (text: any) => text,
        sorter: dataColumn.sorter ? dataColumn.sorter : false,
      };
    });

  };

  renderActionsMenu(actions: ActionDefinition<T>[], record: T) {
    const onClick = (item: ClickParam) => {
      actions[parseInt(item.key, 0)].callback(record);
    };

    return (
      <Menu onClick={onClick} className="mcs-dropdown-actions">
        {actions.map((action, index) => {
          return (
            <Menu.Item key={index.toString()}>
              <a>
                {
                    action.intlMessage ?
                    <FormattedMessage {...action.intlMessage!} /> :
                    <FormattedMessage id={action.translationKey!}/>
                }
              </a>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }

  render() {
    const {
      dataSource,
      pagination,
      loading,
      onChange,
      actionsColumnsDefinition,
      ...rest,
    } = this.props;

    console.log('rendering table view');

    const actionsColumns: Array<ColumnProps<T>> = actionsColumnsDefinition ? this.buildActionsColumns(
      actionsColumnsDefinition
    ) : [];

    const columns: Array<ColumnProps<T>> = actionsColumnsDefinition ?
        this.buildDataColumns().concat(actionsColumns) :
        this.buildDataColumns();

    if (dataSource === undefined) throw new Error('Undefined dataSource in TableView');

    const dataSourceWithIds = dataSource.map((elem: T) => {
      return Object.assign({}, elem, {key: generateGuid()});
    });

    let newPagination = pagination;
    if (pagination) {
      newPagination = {
        ...DEFAULT_PAGINATION_OPTION,
        ...pagination as PaginationProps,
      };
    }
    return (
      <Table
        {...rest}
        columns={columns}
        dataSource={dataSourceWithIds}
        onChange={onChange}
        loading={loading}
        pagination={newPagination}
      />
    );
  }
}

export default TableView;
