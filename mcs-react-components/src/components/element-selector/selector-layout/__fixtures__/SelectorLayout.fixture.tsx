import * as React from 'react';
import SelectorLayout, { SelectorLayoutProps } from '../SelectorLayout';
import { defineMessages, IntlProvider } from 'react-intl';

const messages = defineMessages({
  noElementMessage: {
    id: 'id1',
    defaultMessage: 'No element',
  },
});

const props: SelectorLayoutProps = {
  actionBarTitle: 'Action Bar Title',
  handleAdd: () => {
    //
  },
  handleClose: () => {
    //
  },
  disabled: true,
  noElementMessage: messages.noElementMessage,
};

const component = (_props: SelectorLayoutProps) => (
  <IntlProvider>
    <SelectorLayout {..._props} />
  </IntlProvider>
);

component.displayName = 'SelectorLayout';

export default {
  component,
  props,
};
