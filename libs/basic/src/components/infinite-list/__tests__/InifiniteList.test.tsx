import 'jest';
import * as React from 'react';
import { List } from 'antd';
import * as TestRenderer from 'react-test-renderer';

import InfiniteList, { InfiniteListProps } from '../InfiniteList';

it('renders the list', () => {
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

  const component = TestRenderer.create(<InfiniteList {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
