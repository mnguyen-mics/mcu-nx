import * as React from 'react';
import { IntlProvider } from 'react-intl';
import TableView from '../TableView';

// const props: TableViewProps = {
//   fetchData: () => Promise.resolve(["ouane","tou","tri"]),
//   renderItem: (item) => <List.Item>{item}</List.Item>,
//   storeItemData: () => undefined
// };

const component = (_props: any) => (
  <IntlProvider locale="en">
    <TableView dataSource={[]} />
  </IntlProvider>
);

export default {
  component,
  props: {},
};
