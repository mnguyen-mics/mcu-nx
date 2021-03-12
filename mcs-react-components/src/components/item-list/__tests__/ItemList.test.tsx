import 'jest';
import * as React from "react";
import { MemoryRouter } from 'react-router'
import { IntlProvider } from 'react-intl';
import * as TestRenderer from 'react-test-renderer';
import ItemList, { ItemListProps, Filters } from "../ItemList";
import { selectionNotifyerMessagesMock } from '../../../utils/TableViewHelpers';

it("renders the item list", () => {
  const p = (organisationId: string, filters: Filters, isInitialFetch?: boolean) => { };
  const props: ItemListProps<any> = {
    selectionNotifyerMessages: selectionNotifyerMessagesMock,
    fetchList: p,
    dataSource: [],
    total: 10,
    pageSettings: [],
    emptyTable: {
      iconType: 'email',
      message: "Empty Table"
    },
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <ItemList {...props} />
      </MemoryRouter>
    </IntlProvider>
  );
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot();
});
