import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import MultiSelect, { MultiSelectProps } from '../MultiSelect';

const props: MultiSelectProps<string> = {
  displayElement: <div>Click To Test</div>,
  items: ["Willy Denzey", "Matt Huston"],
  subItems: ["Billy Crawford", "Tragédie"],
  subItemsTitle: '... mais aussi',
  selectedItems: [],
  getKey: (a: string) => a,
  handleItemClick: (a: string) => {
      // do nothing
  },
  handleMenuClick: (selectedItems: string[]) => {
      // do nothing
  },
  onCloseMenu: (selectedItems: string[]) => {
      // do nothing
  },
  singleSelectOnly: false,
  buttonClass: 'test-class',
};

const component = (_props: MultiSelectProps<string>) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <MultiSelect {..._props} />
    </MemoryRouter>
  </IntlProvider>
);

component.displayName = 'MultiSelect';

export default {
  component,
  props,
};
