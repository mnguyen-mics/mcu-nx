import * as React from 'react';
import EmptyTableView, { EmptyTableViewProps } from '../EmptyTableView';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  noData: {
    id: 'id1',
    defaultMessage: 'No data found',
  },
});

const props: EmptyTableViewProps = {
  intlMessage: messages.noData,
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
