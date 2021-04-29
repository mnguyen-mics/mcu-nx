import * as React from 'react';
import { List} from 'antd';
import { IntlProvider } from 'react-intl';
import InfiniteList, { InfiniteListProps } from "../InfiniteList";

const props: InfiniteListProps = {
  fetchData: () => Promise.resolve(["ouane","tou","tri"]),
  renderItem: (item) => <List.Item>{item}</List.Item>,
  storeItemData: () => undefined
};

export default (
  <IntlProvider locale="en">
      <InfiniteList {...props} />
  </IntlProvider>
)