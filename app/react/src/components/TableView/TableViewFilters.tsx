import * as React from 'react';
import { Icon, Row, Col, Input } from 'antd';
import cuid from 'cuid';
import { SearchProps } from 'antd/lib/input/Search';

import McsDateRangePicker, { McsDateRangePickerProps } from '../McsDateRangePicker';
import MultiSelect, { MultiSelectProps } from '../MultiSelect';
import TableView, { DataColumnDefinition, TableViewProps } from './TableView';
import LabelsSelector, { LabelsSelectorProps } from '../LabelsSelector';

const Search = Input.Search;

export interface ViewComponentWithFiltersProps<T> extends TableViewProps<T> {
  searchOptions?: SearchProps;
  dateRangePickerOptions?: McsDateRangePickerProps;
  filtersOptions?: Array<MultiSelectProps<any>>;
  columnsVisibilityOptions?: {
    isEnabled?: boolean;
  };
  labelsOptions?: LabelsSelectorProps;
}

export interface FiltersState<T> {
  visibilitySelectedColumns: Array<DataColumnDefinition<T>>;
}
const VisibilityMultiSelect: React.ComponentClass<MultiSelectProps<DataColumnDefinition<any>>> = MultiSelect;

class TableViewFilters<T> extends React.Component<ViewComponentWithFiltersProps<T>, FiltersState<T>> {

  static defaultProps: Partial<ViewComponentWithFiltersProps<any>> = {
    columnsVisibilityOptions: {
      isEnabled: false,
    },
  };

  constructor(props: ViewComponentWithFiltersProps<T>) {
    super(props);
    this.state = {
      visibilitySelectedColumns: this.props.columns!
        .filter(column => column.isHideable && column.isVisibleByDefault)
        .map(column => ({ key: column.key, value: column.key })),
    };
  }

  getHideableColumns = (): Array<DataColumnDefinition<T>> => {
    const {
      columns,
      } = this.props;

    return columns ? columns.filter(column => column.isHideable) : [];
  }

  changeColumnVisibility = (selectedColumns: Array<DataColumnDefinition<T>>) => {

    this.setState({
      visibilitySelectedColumns: selectedColumns,
    });

  }

  render() {

    const {
      searchOptions,
      dateRangePickerOptions,
      filtersOptions,
      columnsVisibilityOptions,
      labelsOptions,
      } = this.props;

    const searchInput = searchOptions
      ? (
        <Search
          className="mcs-search-input"
          {...searchOptions}
        />
      ) : null;

    const dateRangePicker = dateRangePickerOptions
      ? (
        <McsDateRangePicker
          values={dateRangePickerOptions.values}
          format={dateRangePickerOptions.format}
          onChange={dateRangePickerOptions.onChange}
        />
      )
      : null;

    const filtersMultiSelect = filtersOptions ? filtersOptions.map(filterOptions => {
      return (
        <MultiSelect
          {...filterOptions}
          key={cuid()}
          buttonClass="mcs-table-filters-item"
        />
      );
    }) : null;

    const getItemKey = (item: DataColumnDefinition<T>) => item.key;
    const visibilityMultiSelect = columnsVisibilityOptions!.isEnabled
      ? (
        <VisibilityMultiSelect
          displayElement={<Icon type="layout" />}
          items={this.getHideableColumns()}
          getKey={getItemKey}
          display={getItemKey}
          selectedItems={this.state.visibilitySelectedColumns}
          handleMenuClick={this.changeColumnVisibility}
          buttonClass={'mcs-table-filters-item'}
        />
      )
      : null;

    return (
      <Row>
        <Row className="mcs-table-header">
          <Col span={6}>
            {searchInput}
          </Col>
          <Col span={18} className="text-right">
            {dateRangePicker}
            {filtersMultiSelect}
            {visibilityMultiSelect}
          </Col>
        </Row>
        {(labelsOptions) ?
          <Row className="mcs-table-labels">
            <LabelsSelector {...labelsOptions} />
          </Row> : null}
        <Row className="mcs-table-body">
          <Col span={24}>
            <TableView
              {...this.props}
              visibilitySelectedColumns={this.state.visibilitySelectedColumns}
            />
          </Col>
        </Row>
      </Row>
    );
  }
}

export default TableViewFilters;
