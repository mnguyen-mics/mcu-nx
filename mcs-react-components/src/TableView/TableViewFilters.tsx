import TableView from './TableView';
import withFilters from './withFilters';
import { ViewComponentWithFiltersProps } from './withFilters';


export type TableViewFiltersProps<T> = ViewComponentWithFiltersProps<T>;

const TableViewFilters = withFilters(TableView);

export default TableViewFilters;
