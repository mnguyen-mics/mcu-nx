import 'jest';
import * as React from "react";
import { MemoryRouter } from 'react-router'
import { IntlProvider } from 'react-intl';
import * as TestRenderer from 'react-test-renderer';

import TableViewFilters, { ViewComponentWithFiltersProps } from '../../table-view-filters';

it("renders the table view filters", () => {

  const props: ViewComponentWithFiltersProps<any> = {
    columns: [
      { key: "key 1" },
      { key: "key 2" },
    ],
    dataSource: [
      {key: "key 1"},
      {key: "key 2"},
    ],
    selectionNotifyerMessages: {
      allRowsSelected: "string",
      unselectAll: "string",
      allPageRowsSelected: "string",
      selectAll: "string",
      selectedRows: "string",
    }
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <TableViewFilters {...props} />
      </MemoryRouter>
    </IntlProvider>
  );
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot();
});
