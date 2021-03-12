import * as React from 'react';
import { MemoryRouter } from 'react-router'
import { IntlProvider } from 'react-intl';
import ItemList, { Filters, ItemListProps } from "../ItemList";
import { selectionNotifyerMessagesMock } from '../../../utils/TableViewHelpers';

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
    }
  };

const component = (_props: ItemListProps) => (
  <IntlProvider locale="en">
    <MemoryRouter>      
      <ItemList {..._props} />
    </MemoryRouter>
  </IntlProvider>
)

component.displayName = "ItemList";

export default {
  component,
  props,
};