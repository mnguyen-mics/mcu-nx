import * as React from 'react';
import CounterDashboard, { CounterDashboardProps } from '../CounterDashboard';
import { IntlProvider } from 'react-intl';

const props: CounterDashboardProps = {
  counters: [
    {
      iconType: 'users',
      title: 'Users',
      value: 424242,
      loading: false,
      trend: {
        value: 20,
        type: 'up',
      },
      unit: 'Users',
    },
    {
      iconType: 'library',
      title: 'Library',
      value: 434343,
      loading: true,
    },
    {
      iconType: 'settings',
      title: 'Settings',
      value: 464646,
      loading: false,
    },
    {
      iconType: 'display',
      title: 'Display',
      value: 474747,
      loading: true,
    },
  ],
  invertedColor: false,
};

export default (
  <IntlProvider locale='en'>
    <CounterDashboard {...props} />
  </IntlProvider>
);
