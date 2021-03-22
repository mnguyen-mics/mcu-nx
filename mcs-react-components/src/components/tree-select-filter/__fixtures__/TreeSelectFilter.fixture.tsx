import * as React from 'react';
import { MemoryRouter } from 'react-router';
import TreeSelectFilter, { TreeSelectFilterProps } from '../TreeSelectFilter';

const props: TreeSelectFilterProps = {
  className: 'mcs-tree-select-filter-test',
  placeholder: 'Hello, you can select a value here:',
  tree: [
    {
      value: 'value 1',
      title: 'title 1',
    },
    {
      value: 'value 2',
      title: 'title 2',
    },
    {
      value: 'value 3',
      title: 'title 3',
    },
  ],
  parentFilterName: 'filter name',
  handleItemClick: (filters: any) => {
    //
  },
};

const component = (_props: TreeSelectFilterProps) => (
  <MemoryRouter>
    <TreeSelectFilter {..._props} />
  </MemoryRouter>
);

component.displayName = 'TreeSelectFilter';

export default {
  component,
  props,
};
