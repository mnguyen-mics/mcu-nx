import * as React from 'react';
import { List} from 'antd';
import { IntlProvider } from 'react-intl';
import InfiniteList, { InfiniteListProps } from "../InfiniteList";

const props: InfiniteListProps = {
  fetchData: () => Promise.resolve(["ouane","tou","tri"]),
  renderItem: (item) => <List.Item>{item}</List.Item>,
  storeItemData: () => undefined
};

const component = (_props: InfiniteListProps) => (
  <IntlProvider locale="en">
      <InfiniteList {..._props} />
  </IntlProvider>
)

component.displayName = "InfiniteList";

export default {
  component,
  props,
};