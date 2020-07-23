import * as React from 'react';
import SelectorLayout, { SelectorLayoutProps } from '../SelectorLayout';

const props: SelectorLayoutProps = {
  actionBarTitle: 'Action Bar Title',
  handleAdd: () => {
    //
  },
  handleClose: () => {
    //
  },
  disabled: true,
  noElementText: 'No data found',
  addButtonText: 'Add',
};

const component = (_props: SelectorLayoutProps) => (
  <SelectorLayout {..._props} />
);

component.displayName = 'SelectorLayout';

export default {
  component,
  props,
};
