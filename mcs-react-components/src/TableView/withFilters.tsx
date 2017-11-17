import * as React from 'react';
import {Icon, Row, Col, Input} from 'antd';

import {SearchProps} from 'antd/lib/input/Search';
import { ReactCtor } from '../utils';

import McsDateRangePicker, {McsDateRangePickerProps} from '../McsDateRangePicker';
import MultiSelect, {MultiSelectProps} from '../MultiSelect';
import {DataColumnDefinition, TableViewProps} from './TableView';

const Search = Input.Search;

export interface ViewComponentWithFiltersProps<T> extends TableViewProps<T> {
  searchOptions?: SearchProps;
  dateRangePickerOptions?: McsDateRangePickerProps;
  filtersOptions?: MultiSelectProps<any>[];
  columnsVisibilityOptions?: {
    isEnabled?: boolean;
  };
}

export interface FiltersState<T> {
  visibilitySelectedColumns: DataColumnDefinition<T>[]
}



function withFilters<T>(ViewComponent: ReactCtor<TableViewProps<T>>) : ReactCtor<ViewComponentWithFiltersProps<T>> {

  type VisibilityMultiSelectProps = MultiSelectProps<DataColumnDefinition<T>>;
  const VisibilityMultiSelect: ReactCtor<VisibilityMultiSelectProps> = MultiSelect;

  class ViewComponentWithFilters extends React.Component<ViewComponentWithFiltersProps<T>, FiltersState<T>> {

    static defaultProps: Partial<ViewComponentWithFiltersProps<T>> = {
      columnsVisibilityOptions: {
        isEnabled: false,
      },
    };

    state = {
      visibilitySelectedColumns: this.props.columns ?
        (this.props.columns.filter(column => column.isHideable)
        ) : [],
    };

    getHideableColumns = () : DataColumnDefinition<T>[] => {
      const {
        columns,
      } = this.props;

      return columns ? columns.filter(column => column.isHideable) : [];
    };

    changeColumnVisibility = (selectedColumns: DataColumnDefinition<T>[]) => {

      this.setState({
        visibilitySelectedColumns: selectedColumns,
      });

    };

    render() {

      const {
        searchOptions,
        dateRangePickerOptions,
        filtersOptions,
        columnsVisibilityOptions,
      } = this.props;

      const searchInput = searchOptions
        ? (
          <Col span={6}>
            <Search
              className="mcs-search-input"
              {...searchOptions}
            />
          </Col>
        )
        : null;

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
            buttonClass='mcs-table-filters-item'
          />
        );
      }) : null;

      const visibilityMultiSelect = columnsVisibilityOptions!.isEnabled
        ? (
          <VisibilityMultiSelect
            displayElement={<Icon type="layout"/>}
            items={this.getHideableColumns()}
            getKey={c => c.key}
            display={c => c.key}
            selectedItems={this.state.visibilitySelectedColumns}
            handleMenuClick={this.changeColumnVisibility}
            buttonClass={'mcs-table-filters-item'}
          />
        )
        : null;

      return (
        <Row>
          <Row className="mcs-table-header">
            {searchInput}
            <Col span={18} className="text-right">
              {dateRangePicker}
              {filtersMultiSelect}
              {visibilityMultiSelect}
            </Col>
          </Row>
          <Row className="mcs-table-body">
            <Col span={24}>
              <ViewComponent {...this.props} visibilitySelectedColumns={this.state.visibilitySelectedColumns}/>
            </Col>
          </Row>
        </Row>
      );
    }

  }

  return ViewComponentWithFilters;
}

export default withFilters;
