import * as React from 'react';
import { List } from 'antd';
import InfiniteList, { InfiniteListProps } from '../InfiniteList';

const messages = {
  searchBarPlaceholder: 'Enter your search here',
  loadingSearchBarPlaceholder: 'Loading, please wait....',
};

const props: InfiniteListProps = {
  fetchData: () => Promise.resolve(['ouane', 'tou', 'tri']),
  renderItem: item => <List.Item>{item}</List.Item>,
  storeItemData: () => undefined,
  messages,
};

export default <InfiniteList {...props} />;
