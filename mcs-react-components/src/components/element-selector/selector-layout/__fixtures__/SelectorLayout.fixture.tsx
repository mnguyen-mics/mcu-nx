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

export default (
  <SelectorLayout {...props} />
);
