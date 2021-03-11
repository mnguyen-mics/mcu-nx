import * as React from 'react';
import { MemoryRouter } from 'react-router'
import { IntlProvider } from 'react-intl';
import TreeSelectFilter, { TreeSelectFilterProps } from '../TreeSelectFilter';

const props: TreeSelectFilterProps = {
  className: "mcs-tree-select-filter-test",
  placeholder: "Hello, you can select a value here:",
  tree: [
    {
      value: "value 1",
      title: "title 1"
    },
    {
      value: "value 2",
      title: "title 2"
    },
    {
      value: "value 3",
      title: "title 3"
    },
  ],
  parentFilterName: "filter name",
  handleItemClick: (filters: any) => console.log(filters),
};

const component = (_props: TreeSelectFilterProps) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <TreeSelectFilter {..._props} />
    </MemoryRouter>
  </IntlProvider>
)

component.displayName = "TreeSelectFilter";

export default {
  component,
  props,
};