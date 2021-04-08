import 'jest';
import * as React from "react";
import { List } from 'antd';
import { IntlProvider } from 'react-intl';
import * as TestRenderer from 'react-test-renderer';

import InfiniteList, { InfiniteListProps } from "../InfiniteList";

it("renders the list", () => {
  const props: InfiniteListProps = {
    fetchData: () => Promise.resolve(["ouane", "tou", "tri"]),
    renderItem: (item) => <List.Item>{item}</List.Item>,
    storeItemData: () => undefined
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <InfiniteList {...props} />
    </IntlProvider>
  );
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot();
});
