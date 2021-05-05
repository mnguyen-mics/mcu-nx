import * as React from 'react';
import EmptyTableView, { EmptyTableViewProps } from '../EmptyTableView';

const props: EmptyTableViewProps = {
  message: 'No data found',
  iconType: 'warning',
};

export default <EmptyTableView {...props} />;
