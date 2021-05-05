import * as React from 'react';
import { IntlProvider } from 'react-intl';
import MultiSelect, { MultiSelectProps } from '../MultiSelect';

const props: MultiSelectProps<string> = {
  displayElement: <div>Click To Test</div>,
  items: ['Willy Denzey', 'Matt Huston'],
  subItems: ['Billy Crawford', 'Tragédie'],
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

export default (
  <IntlProvider locale='en'>
    <MultiSelect {...props} />
  </IntlProvider>
);
