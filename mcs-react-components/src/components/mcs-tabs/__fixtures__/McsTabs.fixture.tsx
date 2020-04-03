import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import McsTabs, { McTabsProps } from '../McsTabs';

const props: McTabsProps = {
  items: [
    {
      title: 'Tabun',
      key: 'tab1',
      display: <div>Content tab 1</div>,
    },
    {
      title: 'Tabdeu',
      key: 'tab2',
      display: <div>Content tab 2</div>,
    },
    {
      title: 'Tabtroi',
      key: 'tab3',
      display: <div>Content tab 3</div>,
    },
  ],
};

const component = (_props: McTabsProps) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <McsTabs {..._props} />
    </MemoryRouter>
  </IntlProvider>
);

component.displayName = "McsTabs";

export default {
  component,
  props,
};
