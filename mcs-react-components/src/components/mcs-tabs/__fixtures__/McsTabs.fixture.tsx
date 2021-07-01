import * as React from 'react';
import { IntlProvider } from 'react-intl';
import McsTabs, { McTabsProps } from '../McsTabs';

const props: McTabsProps = {
  items: [
    {
      className: 'mcs-tabs_tab1',
      title: <div>tabun</div>,
      key: 'tab1',
      display: <div>Content tab 1</div>,
    },
    {
      className: 'mcs-tabs_tab2',
      title: <div>tabdeux</div>,
      key: 'tab2',
      display: <div>Content tab 2</div>,
    },
    {
      className: 'mcs-tabs_tab3',
      title: <div>tabtrois</div>,
      key: 'tab3',
      display: <div>Content tab 3</div>,
    },
  ],
};

export default (
  <IntlProvider locale='en'>
    <McsTabs {...props} />
  </IntlProvider>
);
