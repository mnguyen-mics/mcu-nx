import 'jest';
import * as React from "react";
import { MemoryRouter } from 'react-router'
import { IntlProvider } from 'react-intl';
import * as TestRenderer from 'react-test-renderer';

import TreeSelectFilter, { TreeSelectFilterProps } from "../TreeSelectFilter";

it("renders the tree select filter", () => {
  const props: TreeSelectFilterProps = {
    placeholder: "Hello",
    tree: [
      {
        value: "value 1",
        title: "title 1"
      },
      {
        value: "value 2",
        title: "title 2"
      },
      {
        value: "value 3",
        title: "title 3"
      },
    ],
    parentFilterName: "filter name",
    handleItemClick: (filters: any) => {}
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <TreeSelectFilter {...props} />
      </MemoryRouter>
    </IntlProvider>
  );
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot();
});
