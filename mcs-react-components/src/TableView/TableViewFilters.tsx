import * as React from 'react';
import TableView from './TableView';
import withFilters from './withFilters';
import { ViewComponentWithFiltersProps } from './withFilters';


export type TableViewFiltersProps<T> = ViewComponentWithFiltersProps<T>;

const TableViewFilters: React.ComponentClass = withFilters(TableView);

export default TableViewFilters;
