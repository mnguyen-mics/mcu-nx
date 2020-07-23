import * as React from 'react';
import EmptyTableView, { EmptyTableViewProps } from '../EmptyTableView';

const props: EmptyTableViewProps = {
  message: 'No data found',
  iconType: 'warning',
};
const component = (_props: EmptyTableViewProps) => (
  <EmptyTableView {..._props} />
);

component.displayName = 'EmptyTableView';

export default {
  component,
  props,
};
